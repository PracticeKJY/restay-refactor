const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { IntlMessageFormat } = require("intl-messageformat");
const { ObjectId } = require("mongodb");

function load(file, mocks = {}, globals = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const result = { exports: {} };
  vm.runInNewContext(code, {
    module: result, exports: result.exports, console: { error() {}, log() {}, warn() {} },
    require: (id) => {
      if (Object.hasOwn(mocks, id)) return mocks[id];
      if (id.endsWith(".css")) return { default: new Proxy({}, { get: (_, key) => String(key) }) };
      return require(id);
    }, ...globals,
  }, { filename: file });
  return result.exports;
}

function intl(locale) {
  const messages = require(`../messages/${locale}.json`);
  return {
    useLocale: () => locale,
    useTranslations: (namespace) => (key, values) => new IntlMessageFormat(key.split(".").reduce((value, part) => value[part], messages[namespace]), locale).format(values),
  };
}

test("reservation price rendering preserves KRW amounts in both locales", () => {
  for (const locale of ["ko", "en"]) {
    const { default: PriceInfo } = load("app/reservation/[id]/PriceInfo.tsx", {
      "next-intl": intl(locale),
      moment: { default: require("moment") },
      "jotai": { useAtomValue: () => 3000 },
      "../../../jotai/@store/state": { restayChargeAtom: {} },
    });
    const html = renderToStaticMarkup(React.createElement(PriceInfo, {
      price: 100000, startDate: new Date(2026, 10, 9), endDate: new Date(2026, 10, 11),
    }));
    for (const amount of ["₩100,000", "₩200,000", "₩6,000", "₩206,000"]) assert.ok(html.includes(amount), `${locale}: ${amount}`);
    assert.ok(html.includes(locale === "en" ? "2 nights" : "2박"));
  }
});

test("home server data has the same JSON shape and search filter as the listing API", async () => {
  const id = new ObjectId();
  const documents = [{ _id: id, createdAt: new Date("2026-11-09T00:00:00Z"), imageSrc: ["/photo.jpg"], title: "원문 숙소", category: "빌라" }];
  const filter = { category: "빌라" };
  let queried;
  const client = { db: (name) => { assert.equal(name, "Restay"); return { collection: (collection) => { assert.equal(collection, "listings"); return { find: (query) => { queried = query; return { toArray: async () => documents }; } }; } }; } };
  const service = load("lib/listings.ts", { "server-only": {}, "@/app/api/mongoDB": { default: Promise.resolve(client) } });
  const handlers = load("app/api/getListings/route.ts", { "@/lib/listings": service });
  const response = await handlers.POST(new Request("http://localhost/api/getListings", { method: "POST", body: JSON.stringify(filter) }));
  assert.equal(response.status, 200);
  assert.equal(JSON.stringify(queried), JSON.stringify(filter));
  const apiData = await response.json();
  const { default: Home } = load("app/[locale]/page.tsx", {
    "@/lib/listings": service,
    "@/auth": { auth: async () => null },
    "@/i18n/metadata": {},
    "@/app/client/home-client": { default: () => null },
    "@/app/component/Container": { default: () => null },
  });
  const element = await Home({ searchParams: Promise.resolve(filter) });
  assert.equal(queried, filter);
  assert.equal(JSON.stringify(element.props.children.props.initialListings), JSON.stringify(apiData));
  assert.equal(apiData[0]._id, id.toHexString());
  assert.equal(apiData[0].title, "원문 숙소");
});

test("listing API keeps its error status and response contract", async () => {
  const handlers = load("app/api/getListings/route.ts", { "@/lib/listings": { findListings: async () => { throw new Error("offline"); } } });
  const response = await handlers.POST(new Request("http://localhost/api/getListings", { method: "POST", body: "{}" }));
  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), { error: "Internal Server Error" });
});

test("dialog focus traps Tab, handles Escape, and restores the opener", () => {
  const document = { activeElement: null };
  class Element {
    isConnected = true;
    focus() { document.activeElement = this; }
    getClientRects() { return [1]; }
  }
  const opener = new Element(), first = new Element(), last = new Element();
  document.activeElement = opener;
  let listener, cleanup, closed = 0;
  const dialog = new Element();
  dialog.querySelectorAll = () => [first, last];
  dialog.contains = (element) => [dialog, first, last].includes(element);
  dialog.addEventListener = (_, handler) => { listener = handler; };
  dialog.removeEventListener = (_, handler) => { assert.equal(handler, listener); };
  const { useDialogFocus } = load("app/hooks/useDialogFocus.ts", {
    react: { useRef: (value) => ({ current: value }), useEffect: (effect) => { cleanup = effect(); } },
  }, { document, HTMLElement: Element });
  useDialogFocus(true, { current: dialog }, () => { closed++; });
  assert.equal(document.activeElement, first);
  listener({ key: "Tab", shiftKey: true, preventDefault() {} });
  assert.equal(document.activeElement, last);
  listener({ key: "Tab", shiftKey: false, preventDefault() {} });
  assert.equal(document.activeElement, first);
  listener({ key: "Escape", preventDefault() {}, stopPropagation() {} });
  assert.equal(closed, 1);
  cleanup();
  assert.equal(document.activeElement, opener);
});

test("payment option translates only its display label and preserves the click action", () => {
  for (const locale of ["ko", "en"]) {
    const { default: PaymentOption } = load("app/reservation/components/PaymentOption.tsx", {
      "next-intl": intl(locale),
      "next/image": { default: ({ alt }) => React.createElement("img", { alt }) },
    });
    const onClick = () => {};
    const element = PaymentOption({ label: "카카오페이", icon: {}, onClick });
    assert.equal(element.props.children.props.onClick, onClick);
    const html = renderToStaticMarkup(element);
    assert.ok(html.includes(locale === "en" ? "Kakao Pay" : "카카오페이"));
  }
});

function favoriteHarness() {
  const submissions = [], requests = [], updates = [], notifications = [];
  let resets = 0;
  const wishlist = [{ id: "listing-fixture", wishListTitle: "Saved" }];
  const favorites = [{ id: "listing-fixture", email: "guest@example.test" }];
  const { default: FavoriteButton } = load("app/component/listings/FavoriteButton.tsx", {
    react: { ...React, useState: (value) => [value, () => {}] },
    "next-intl": intl("ko"),
    jotai: { useAtom: (atom) => [[], (value) => updates.push([atom, value])] },
    "../../../jotai/@store/state": { favoriteAtom: "favorites", wishListAtom: "wishlist" },
    "../Modal/Modal": { default: () => null }, "../Heading": { default: () => null }, "../Input/Input": { default: () => null },
    "react-hook-form": { useForm: () => ({ reset: () => { resets++; }, register() {}, formState: { errors: {} }, handleSubmit: (callback) => { submissions.push(callback); return callback; } }) },
    "react-hot-toast": { default: { success: (text) => notifications.push(text), error: (text) => notifications.push(text) } },
    "@/app/http/request": {
      POST: async (url, body) => { requests.push(["POST", url, body]); },
      GET: async (url) => { requests.push(["GET", url]); return { data: url.endsWith("findFavorite") ? wishlist : favorites }; },
    },
  });
  FavoriteButton({ data: { _id: "listing-fixture" }, sessionEmail: "guest@example.test" });
  return { submissions, requests, updates, notifications, wishlist, favorites, resets: () => resets };
}

test("favorite creation keeps its payload, refresh order and form reset", async () => {
  const h = favoriteHarness();
  await h.submissions[0]({ wishListTitle: "Saved" });
  assert.deepEqual(h.requests.map(request => request.slice(0, 2)), [
    ["POST", "/api/favorite/favorite"], ["GET", "/api/favorite/findFavorite"], ["GET", "/api/favorite/findHasFavorite"],
  ]);
  assert.equal(JSON.stringify(h.requests[0][2]), JSON.stringify({ wishListTitle: "Saved", id: "listing-fixture", email: "guest@example.test" }));
  assert.deepEqual(h.updates, [["wishlist", h.wishlist], ["favorites", h.favorites]]);
  assert.equal(h.resets(), 1);
});

test("favorite removal keeps its payload and refresh order", async () => {
  const h = favoriteHarness();
  await h.submissions[1]({});
  assert.deepEqual(h.requests.map(request => request.slice(0, 2)), [
    ["POST", "/api/favorite/deleteFavorite"], ["GET", "/api/favorite/findHasFavorite"], ["GET", "/api/favorite/findFavorite"],
  ]);
  assert.equal(JSON.stringify(h.requests[0][2]), JSON.stringify({ email: "guest@example.test", id: "listing-fixture" }));
  assert.equal(h.resets(), 1);
});

function loginHarness(fail) {
  const submissions = [], calls = [], notices = [];
  const toast = { success: (text) => notices.push(["success", text]), error: (text) => notices.push(["error", text]) };
  const { default: LoginModal } = load("app/component/Modal/LoginModal.tsx", {
    react: { ...React, useState: (value) => [value, () => {}] },
    "next-intl": intl("ko"),
    jotai: { useAtomValue: () => false, useSetAtom: () => () => {} },
    "../../../jotai/@store/state": {},
    "./Modal": { default: () => null }, "../Heading": { default: () => null }, "../Input/Input": { default: () => null }, "../Button": { default: () => null },
    "react-hook-form": { useForm: () => ({ register() {}, formState: { errors: {} }, handleSubmit: (callback) => { submissions.push(callback); return callback; } }) },
    "react-hot-toast": { toast },
    "@/i18n/navigation": { useRouter: () => ({ refresh: () => calls.push(["refresh"]) }) },
    "./auth-actions": { signInWithCredentials: async (...args) => { calls.push(args); if (fail) throw new Error("fixture failure"); }, signInWithProvider() {} },
  });
  LoginModal();
  return { submissions, calls, notices };
}

test("credentials UI preserves success refresh and failure feedback without real sign-in", async () => {
  for (const fail of [false, true]) {
    const h = loginHarness(fail);
    await h.submissions[0]({ email: "guest@example.test", password: "fixture-only" });
    assert.deepEqual(h.calls[0], ["guest@example.test", "fixture-only"]);
    assert.equal(h.calls.some(call => call[0] === "refresh"), !fail);
    assert.equal(h.notices[0][0], fail ? "error" : "success");
  }
});

function reservationHarness() {
  const requests = [], navigations = [];
  const listing = { _id: "listing-fixture", price: 100000 };
  const values = { listing, start: new Date(2026, 10, 9), end: new Date(2026, 10, 11), next: new Date(2026, 10, 10), payment: "mobilians_card" };
  let callback, payment;
  const Button = () => null;
  const noopModule = { default: () => null };
  const { default: Reservation } = load("app/reservation/[id]/Reservation.tsx", {
    "next-intl": intl("ko"), moment: { default: require("moment") },
    "@/app/component/Container": noopModule, "@/app/component/Button": { default: Button },
    "./Info": noopModule, "./Payment": noopModule, "./Refund": noopModule, "./Rule": noopModule, "./ProductCard": noopModule, "./PriceInfo": noopModule,
    jotai: { useAtomValue: (atom) => values[atom] },
    "../../../jotai/@store/state": { DetailListingAtom: "listing", startDateAtom: "start", endDateAtom: "end", nextDateAtom: "next", paymentTypeAtom: "payment" },
    "@/i18n/navigation": { useRouter: () => ({ push: (path) => navigations.push(path) }) },
    "react-hot-toast": { default: { success() {}, error() {} } },
    "@/lib/portone-v1": { PAYMENT_CONFIG: { mobilians_card: { channelKey: "fixture-channel" } } },
    "@/app/http/request": { POST: async (url, body) => { requests.push([url, body]); return { data: { insertedId: "reservation-fixture" } }; } },
  }, {
    process: { env: { NEXT_PUBLIC_PORTONE_IMP_CODE: "fixture-code" } },
    window: { IMP: { init() {}, request_pay: (payload, result) => { payment = payload; callback = result; } } },
    fetch: async (url, options) => { requests.push([url, JSON.parse(options.body)]); return { ok: true, json: async () => ({ conversationId: "room-fixture" }) }; },
  });
  function findButton(node) {
    if (!node || typeof node !== "object") return undefined;
    if (node.type === Button) return node;
    const children = node.props?.children;
    return (Array.isArray(children) ? children : [children]).map(findButton).find(Boolean);
  }
  const button = findButton(Reservation({ sessionEmail: "guest@example.test" }));
  return { button, requests, navigations, listing, payment: () => payment, complete: (result) => callback(result) };
}

test("simulated payment success preserves payment amount and reservation/chat payloads", async () => {
  const h = reservationHarness();
  await h.button.props.onClick();
  assert.equal(h.payment().amount, 1); // Existing payment behavior; no real SDK call.
  assert.equal(h.payment().channelKey, "fixture-channel");
  assert.equal(h.payment().pay_method, "card");
  await h.complete({ success: true });
  assert.equal(h.requests[0][0], "/api/reservation");
  assert.equal(h.requests[0][1].product, h.listing);
  assert.equal(h.requests[0][1].startDay, "11.9");
  assert.equal(h.requests[0][1].endDay, "11.11");
  assert.equal(h.requests[0][1].email, "guest@example.test");
  assert.equal(h.requests[1][0], "/api/chat/get-or-create");
  assert.equal(h.requests[1][1].reservationId, "reservation-fixture");
  assert.deepEqual(h.navigations, ["/"]);
});

test("simulated canceled payment does not create a reservation or chat", async () => {
  const h = reservationHarness();
  await h.button.props.onClick();
  await h.complete({ success: false, error_msg: "fixture cancellation" });
  assert.equal(h.requests.length, 0);
  assert.equal(h.navigations.length, 0);
});
