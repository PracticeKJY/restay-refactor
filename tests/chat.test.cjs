const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");

function load(file, mocks = {}, globals = {}) {
  const loadedModule = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(code, { module: loadedModule, exports: loadedModule.exports,
    require: id => Object.hasOwn(mocks, id) ? mocks[id] : require(id), ...globals }, { filename: file });
  return loadedModule.exports;
}
const model = load("app/messages/chat-model.ts");
const row = (id, time = "2026-11-09T01:00:00Z") => ({ id, conversation_id: "room", sender_email: "guest@test.dev", text: "hello", created_at: time });

test("incoming messages scroll the history pane even when it was scrolled upward", () => {
  const pane = { scrollTop: 0, scrollHeight: 1200 };
  let effects = [];
  let messages = [row("first")];
  const View = load("app/messages/components/ConversationView.tsx", {
    react: { useState: value => [value, () => {}], useRef: () => ({ current: pane }), useEffect: (effect, deps) => effects.push({ effect, deps }) },
    "next-intl": { useLocale: () => "ko", useTranslations: () => key => key },
    "@/i18n/navigation": { Link: () => null },
    "../hooks/useConversation": { useConversation: () => ({ messages, loading: false, failed: false }) },
    "./ChatWorkspace": { default: () => null }, "./ChatAvatar": { default: () => null },
    "../Messages.module.css": { default: {} },
    "@/app/component/Skeleton/PageSkeleton": { ThreadSkeleton: () => null },
  }).default;
  View({ params: { id: "room" }, currentUserEmail: "guest@test.dev" });
  effects[1].effect();
  assert.equal(pane.scrollTop, 1200);
  pane.scrollTop = 50;
  pane.scrollHeight = 1400;
  messages = [...messages, row("incoming")];
  const previous = effects[1].deps;
  effects = [];
  View({ params: { id: "room" }, currentUserEmail: "guest@test.dev" });
  assert.notDeepEqual(effects[1].deps, previous);
  effects[1].effect();
  assert.equal(pane.scrollTop, 1400);
});

test("realtime arriving before HTTP confirmation produces one server message", () => {
  const pending = { ...row("pending:1"), delivery: "sending" };
  const server = row("server", "2026-11-09T01:00:01Z");
  const result = model.confirmMessage(model.mergeMessages([pending], [server]), pending.id, row("server"));
  assert.equal(result.length, 1);
  assert.equal(result[0].id, "server");
  assert.equal(result[0].created_at, server.created_at);
  assert.equal(result[0].delivery, undefined);
});
test("HTTP confirmation then realtime stays deduplicated and snapshots preserve pending sends", () => {
  const pending = { ...row("pending:1"), delivery: "sending" };
  const snapshot = model.mergeMessages([pending], [row("older", "2026-11-08T01:00:00Z")]);
  assert.equal(snapshot.length, 2);
  const result = model.mergeMessages(model.confirmMessage(snapshot, pending.id, row("server")), [row("server")]);
  assert.equal(result.length, 2);
  assert.equal(result[0].id, "older");
  assert.equal(result[1].id, "server");
});
test("older messages cannot replace newer inbox previews", () => {
  const rooms = [{ id: "room", created_at: "2026-11-01", last_message_at: "2026-11-10", last_message_text: "newest" }];
  assert.equal(model.updatePreview(rooms, row("old"))[0].last_message_text, "newest");
  assert.equal(model.isMessage({ id: "broken" }), false);
});
test("chat session initialization uses the existing bridge and deduplicates concurrent requests", async () => {
  let calls = 0;
  let release;
  const wait = new Promise(resolve => { release = resolve; });
  const session = { user: { email: "guest@test.dev" } };
  const helper = load("lib/ensureSupabaseSession.ts", {
    "@/lib/supabase-browser": { supabaseBrowser: { auth: {
      getSession: async () => ({ data: { session: null } }),
      setSession: async () => ({ data: { session }, error: null }),
    } } },
  }, { fetch: async (url, options) => {
    calls++;
    assert.equal(url, "/api/session/supabase");
    assert.equal(options.cache, "no-store");
    await wait;
    return { ok: true, json: async () => ({ access_token: "test", refresh_token: "test" }) };
  } }).default;
  const first = helper(session.user.email);
  const second = helper(session.user.email);
  await Promise.resolve();
  release();
  assert.equal(await first, session);
  assert.equal(await second, session);
  assert.equal(calls, 1);
});
test("message sending preserves the API contract and requires a server id", async () => {
  let valid = true;
  const client = load("app/messages/chat-client.ts", {
    "@/lib/supabase-browser": {}, "@/lib/ensureSupabaseSession": {}, "./chat-model": model,
  }, { fetch: async (url, options) => {
    assert.equal(url, "/api/messages/send");
    assert.equal(options.method, "POST");
    assert.deepEqual(JSON.parse(options.body), { conversationId: "room", text: "hello" });
    return { ok: true, json: async () => valid ? { ok: true, id: "server" } : { ok: true } };
  } });
  assert.equal(await client.postMessage("room", "hello"), "server");
  valid = false;
  await assert.rejects(client.postMessage("room", "hello"), /Missing message confirmation/);
});
test("opening an existing reservation conversation avoids a mutation", async () => {
  const client = load("app/messages/chat-client.ts", {
    "@/lib/supabase-browser": { supabaseBrowser: { from: () => ({ select: () => ({ eq: (key, value) => {
      assert.equal(key, "reservation_id"); assert.equal(value, "reservation-id");
      return { maybeSingle: async () => ({ data: { id: "existing" }, error: null }) };
    } }) }) } },
    "@/lib/ensureSupabaseSession": { default: async () => {} }, "./chat-model": model,
  }, { fetch: () => { throw new Error("Unexpected write"); } });
  assert.equal(await client.openReservationConversation("reservation-id", "guest@test.dev"), "existing");
});

test("send renders immediately without realtime and reconciles the API response", async () => {
  const states = [], refs = [], effects = [];
  let cursor = 0, refCursor = 0, mounted = false, resolveSend, eventHandler, cleanup;
  const email = "guest@test.dev";
  const channel = { on: (_type, _filter, handler) => { eventHandler = handler; return channel; }, subscribe: handler => { handler("SUBSCRIBED"); return channel; } };
  const hook = load("app/messages/hooks/useConversation.ts", {
    react: {
      useState: initial => { const index = cursor++; if (!mounted) states[index] = initial; return [states[index], value => { states[index] = typeof value === "function" ? value(states[index]) : value; }]; },
      useRef: initial => { const index = refCursor++; if (!mounted) refs[index] = { current: initial }; return refs[index]; },
      useEffect: effect => { if (!mounted) effects.push(effect); },
    },
    "@/lib/supabase-browser": { supabaseBrowser: {
      from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { id: "room", guest_email: email, host_email: "host@test.dev" } }) }) }) }),
      channel: () => channel, removeChannel: () => {},
    } },
    "@/lib/ensureSupabaseSession": { default: async () => {} },
    "../chat-model": model,
    "../chat-client": { conversationColumns: "id", fetchMessages: async () => [], postMessage: () => new Promise(resolve => { resolveSend = resolve; }) },
  }, { crypto: { randomUUID: () => "temporary" }, setInterval: () => 1, clearInterval: () => {},
    document: { visibilityState: "visible", addEventListener() {}, removeEventListener() {} }, window: { addEventListener() {}, removeEventListener() {} } }).useConversation;
  const render = () => { cursor = 0; refCursor = 0; const result = hook("room", email); mounted = true; return result; };
  render(); cleanup = effects[0]();
  await new Promise(resolve => setImmediate(resolve));
  const room = render();
  assert.equal(room.loading, false);
  const pending = room.send(" hello ");
  assert.equal(render().messages[0].text, "hello");
  assert.equal(render().messages[0].delivery, "sending");
  // A realtime event may race ahead of the POST response.
  eventHandler({ new: row("server") });
  resolveSend("server");
  await pending;
  assert.equal(render().messages.length, 1);
  assert.equal(render().messages[0].id, "server");
  assert.equal(render().messages[0].delivery, undefined);
  cleanup();
});
