const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const { IntlMessageFormat } = require("intl-messageformat");
const ko = require("../messages/ko.json");
const en = require("../messages/en.json");

function flatten(value, prefix = "", output = {}) {
  for (const [key, item] of Object.entries(value)) {
    const name = prefix ? `${prefix}.${key}` : key;
    if (typeof item === "string") output[name] = item;
    else flatten(item, name, output);
  }
  return output;
}

test("Korean and English translation keys match and all ICU messages format", () => {
  const korean = flatten(ko), english = flatten(en);
  assert.deepEqual(Object.keys(korean).sort(), Object.keys(english).sort());
  for (const [locale, messages] of [["ko", korean], ["en", english]]) {
    for (const [key, value] of Object.entries(messages)) {
      const formatted = new IntlMessageFormat(value, locale).format({ p0: 2, p1: 3, p2: 4, p3: 5, count: 2, category: "빌라", query: (parts) => parts.join("") });
      assert.equal(typeof formatted, "string", `${locale}:${key}`);
    }
  }
});

test("English nights pluralize while Korean retains the existing suffix", () => {
  assert.equal(new IntlMessageFormat(en.Common.stayNights, "en").format({ count: 1 }), "1 night");
  assert.equal(new IntlMessageFormat(en.Common.stayNights, "en").format({ count: 3 }), "3 nights");
  assert.equal(new IntlMessageFormat(ko.Common.stayNights, "ko").format({ count: 3 }), "3박");
});

test("every statically referenced translation key exists", () => {
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
  for (const file of walk("app").filter(file => file.endsWith(".tsx"))) {
    const source = fs.readFileSync(file, "utf8");
    const namespaces = [...source.matchAll(/(?:useTranslations|getTranslations)\("([^"]+)"\)/g)].map(match => match[1]);
    if (!namespaces.length) continue;
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function visit(node) {
      if (ts.isCallExpression(node) && node.expression.getText(ast) === "t" && ts.isStringLiteral(node.arguments[0])) {
        const key = node.arguments[0].text;
        assert.ok(namespaces.some(namespace => ko[namespace]?.[key] && en[namespace]?.[key]), `${file}: ${key}`);
      }
      ts.forEachChild(node, visit);
    }
    visit(ast);
  }
});
