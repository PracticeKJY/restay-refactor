const { test } = require("node:test");
const assert = require("node:assert/strict");
const { NextRequest } = require("next/server");
// Next's bundler resolves these extensionless ESM imports; plain Node needs .js.
require("node:module").registerHooks({
  resolve(specifier, context, nextResolve) {
    if (/^next\/(server|navigation|link|headers)$/.test(specifier)) {
      return nextResolve(`${specifier}.js`, context);
    }
    return nextResolve(specifier, context);
  },
});

const routing = { locales: ["ko", "en"], defaultLocale: "ko", localePrefix: "as-needed", localeDetection: false };

test("unprefixed deep links stay Korean despite English preference and keep query", async () => {
  const { default: createMiddleware } = await import("next-intl/middleware");
  const handle = createMiddleware(routing);
  for (const path of ["/", "/listings/abc123", "/reservation/abc123", "/wishList", "/trips", "/messages/room-123"]) {
    const response = handle(new NextRequest(`http://localhost:3000${path}?category=빌라&guest=2`, {
      headers: { cookie: "NEXT_LOCALE=en", "accept-language": "en" },
    }));
    assert.equal(response.status, 200);
    const rewrite = new URL(response.headers.get("x-middleware-rewrite"));
    assert.equal(rewrite.pathname, `/ko${path === "/" ? "" : path}`);
    assert.equal(rewrite.searchParams.get("category"), "빌라");
    assert.equal(rewrite.searchParams.get("guest"), "2");
  }
});

test("English deep links resolve to the same IDs and query", async () => {
  const { default: createMiddleware } = await import("next-intl/middleware");
  const handle = createMiddleware(routing);
  for (const path of ["", "/listings/abc123", "/reservation/abc123", "/wishList", "/trips", "/messages/room-123"]) {
    const response = handle(new NextRequest(`http://localhost:3000/en${path}?category=빌라`));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("location"), null);
    const rewrite = new URL(response.headers.get("x-middleware-rewrite") ?? `http://localhost:3000/en${path}?category=빌라`);
    assert.equal(rewrite.pathname, `/en${path}`);
    assert.equal(rewrite.searchParams.get("category"), "빌라");
  }
});

test("locale path generation preserves query and hash without introducing /ko", async () => {
  const { createNavigation } = await import("next-intl/navigation");
  const { getPathname } = createNavigation(routing);
  const href = "/listings/abc123?category=%EB%B9%8C%EB%9D%BC&guest=2#photos";
  assert.equal(getPathname({ locale: "en", href }), `/en${href}`);
  assert.equal(getPathname({ locale: "ko", href }), href);
});

test("middleware matcher excludes API, OAuth callbacks and static assets", () => {
  const fs = require("node:fs");
  const ts = require("typescript");
  const vm = require("node:vm");
  const code = ts.transpileModule(fs.readFileSync("middleware.ts", "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: (id) => id === "next-intl/middleware" ? { default: () => null } : { routing } });
  const matcher = new RegExp(`^${exports.config.matcher[0]}$`);
  for (const path of ["/api/getListings", "/api/auth/callback/google", "/api/auth/callback/naver", "/api/auth/callback/kakao", "/api/reservation", "/api/chat/get-or-create", "/_next/static/app.js", "/restay.png"]) assert.equal(matcher.test(path), false, path);
  for (const path of ["/", "/en", "/listings/abc123", "/en/reservation/abc123"]) assert.equal(matcher.test(path), true, path);
});

test("explicit Korean prefixes canonicalize without losing repeated query values", async () => {
  const { default: createMiddleware } = await import("next-intl/middleware");
  const response = createMiddleware(routing)(new NextRequest("http://localhost:3000/ko/listings/abc123?tag=a&tag=b&category=빌라"));
  assert.equal(response.status, 307);
  const location = new URL(response.headers.get("location"));
  assert.equal(location.pathname, "/listings/abc123");
  assert.deepEqual(location.searchParams.getAll("tag"), ["a", "b"]);
  assert.equal(location.searchParams.get("category"), "빌라");
});
