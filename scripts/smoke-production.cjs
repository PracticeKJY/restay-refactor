// Read-only HTML smoke checks. Start `next start --hostname 127.0.0.1 --port 3101` first.
const assert = require("node:assert/strict");
const port = Number(process.argv.find(value => value.startsWith("--port="))?.split("=")[1] ?? 3101);
assert.ok([3000, 3101].includes(port), "Only the local verification ports are supported");
const origin = `http://localhost:${port}`;

async function main() {
  let failures = 0;
  const pages = [
    ["/", "ko", false], ["/en", "en", false],
    ["/trips", "ko", true], ["/en/trips", "en", true],
    ["/wishList", "ko", true], ["/en/wishList", "en", true],
    ["/messages", "ko", true], ["/en/messages", "en", true],
    ["/messages/verification-only", "ko", true], ["/en/messages/verification-only", "en", true],
    ["/reservation/verification-only", "ko", true], ["/en/reservation/verification-only", "en", true],
  ];
  // This POST endpoint performs a read-only listing query. Do not log DB content.
  try {
    const response = await fetch(`${origin}/api/getListings`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}", signal: AbortSignal.timeout(35000) });
    assert.equal(response.status, 200);
    const listings = await response.json();
    const sample = listings.find(item => /^[a-f\d]{24}$/i.test(item._id));
    assert.ok(sample, "No listing fixture is available");
    pages.push([`/listings/${sample._id}`, "ko", false, "/listings/[sample]"], [`/en/listings/${sample._id}`, "en", false, "/en/listings/[sample]"]);
    console.log("PASS /api/getListings: read-only sample lookup");
  } catch (error) {
    failures++;
    console.error(`BLOCKED listing data setup: ${error.message}`);
  }
  for (const [path, locale, privatePage, label = path] of pages) {
    try {
      const response = await fetch(`${origin}${path}`, {
        headers: { cookie: "NEXT_LOCALE=en", "accept-language": "en" },
        signal: AbortSignal.timeout(35000), redirect: "manual",
      });
      assert.equal(response.status, 200, "HTTP status");
      const html = await response.text();
      assert.ok(!html.includes('data-dgst='), "server rendering error marker");
      assert.ok(html.includes(`<html lang="${locale}"`), "HTML locale");
      const canonical = `https://restay.vercel.app${path}`;
      const actualCanonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
      assert.ok(actualCanonical, "canonical is present");
      assert.equal(new URL(actualCanonical).href, new URL(canonical).href, "canonical");
      assert.ok(html.includes('hrefLang="ko"') || html.includes('hreflang="ko"'), "Korean alternate");
      assert.ok(html.includes('hrefLang="en"') || html.includes('hreflang="en"'), "English alternate");
      if (privatePage) assert.ok(/name="robots" content="noindex, nofollow"/.test(html), "private noindex");
      console.log(`PASS ${label}: HTML locale, canonical, alternates${privatePage ? ', noindex' : ''}`);
    } catch (error) {
      failures++;
      console.error(`FAIL ${label}: ${error.message}`);
    }
  }
  const providers = await fetch(`${origin}/api/auth/providers`, { signal: AbortSignal.timeout(10000) });
  assert.equal(providers.headers.get("x-middleware-rewrite"), null);
  if (providers.status === 200) {
    const body = await providers.json();
    for (const provider of ["google", "naver", "kakao", "credentials"]) assert.ok(body[provider]);
    console.log("PASS /api/auth/providers: API bypass and existing provider IDs");
  } else {
    console.log(`BLOCKED /api/auth/providers: HTTP ${providers.status}; review server logs without changing auth policy`);
    process.exitCode = 2;
  }
  if (failures) process.exitCode = 1;
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
