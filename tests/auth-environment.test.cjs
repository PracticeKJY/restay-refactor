const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

// Execute the installed library against fixture env objects, never process.env.
function load(file, mocks, env = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  vm.runInNewContext(code, { exports, process: { env }, URL, require: (id) => {
    if (!Object.hasOwn(mocks, id)) throw new Error(`Unexpected dependency: ${id}`);
    return mocks[id];
  } });
  return exports;
}

const coreFile = path.join(path.dirname(require.resolve("@auth/core")), "lib/utils/env.js");
const core = load(coreFile, { "./logger.js": { setLogger: () => ({ warn() {} }) } });
const nextFile = path.join(path.dirname(require.resolve("next-auth")), "lib/env.js");
function resolvedTrust(env, config = { providers: [] }) {
  const integration = load(nextFile, { "next/server": {}, "@auth/core": core }, env);
  integration.setEnvDefaults(config);
  return config.trustHost;
}

test("local production with only legacy NEXTAUTH_URL does not infer host trust", () => {
  assert.equal(resolvedTrust({ NODE_ENV: "production", NEXTAUTH_URL: "http://localhost:3000" }), false);
});

test("development and recognized deployment flags infer host trust in the installed version", () => {
  for (const env of [
    { NODE_ENV: "development" },
    { NODE_ENV: "production", VERCEL: "1" },
    { NODE_ENV: "production", CF_PAGES: "1" },
    { NODE_ENV: "production", AUTH_URL: "https://example.test" },
    { NODE_ENV: "production", AUTH_TRUST_HOST: "true" },
  ]) assert.equal(resolvedTrust(env), true);
});

test("an explicit trustHost policy is not overridden by inferred environment flags", () => {
  assert.equal(resolvedTrust({ NODE_ENV: "production", VERCEL: "1" }, { providers: [], trustHost: false }), false);
});
