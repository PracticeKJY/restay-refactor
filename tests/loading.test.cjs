const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

function load(file, mocks) {
  const result = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(code, { module: result, exports: result.exports, require: id => {
    if (Object.hasOwn(mocks, id)) return mocks[id];
    if (id.endsWith(".css")) return { default: new Proxy({}, { get: (_, key) => String(key) }) };
    return require(id);
  } });
  return result.exports.default;
}

test("home loading is scoped away from sibling routes and preserves category filters", () => {
  assert.equal(fs.existsSync("app/[locale]/loading.tsx"), false, "a shared home fallback would flash during sibling navigation");
  const HomeClient = () => null;
  const Loading = load("app/[locale]/(home)/loading.tsx", {
    "next/navigation": { useSearchParams: () => new URLSearchParams("category=villa") },
    "@/app/client/home-client": { default: HomeClient },
  });
  const element = Loading();
  assert.equal(element.type, HomeClient);
  assert.equal(element.props.loading, true);
  assert.equal(element.props.searchParams.category, "villa");
  for (const route of ["wishList", "trips", "messages", "messages/[id]", "listings/[id]", "reservation/[id]"]) {
    assert.ok(fs.existsSync(`app/[locale]/${route}/loading.tsx`), `missing dedicated fallback: ${route}`);
  }
});

test("loading regions announce translated status and hide decorative skeletons", () => {
  for (const locale of ["ko", "en"]) {
    const loading = require(`../messages/${locale}.json`).Common.loading;
    const Region = load("app/component/Skeleton/LoadingRegion.tsx", {
      "next-intl": { useTranslations: () => () => loading },
    });
    const html = renderToStaticMarkup(React.createElement(Region, null, React.createElement("div", null, "placeholder")));
    assert.match(html, /aria-busy="true"/);
    assert.ok(html.includes(`<span class="srOnly" role="status">${loading}</span>`));
    assert.match(html, /aria-hidden="true"[^>]*><div>placeholder/);
  }
});

test("image placeholders survive source changes, forward handlers, and stop animating on errors", () => {
  let states = [], cursor = 0;
  const Image = load("app/component/Skeleton/ProgressiveImage.tsx", {
    react: { useState: value => {
      const index = cursor++;
      if (!(index in states)) states[index] = value;
      return [states[index], next => { states[index] = next; }];
    } },
    "next/image": { default: "img" },
  });
  const render = props => { cursor = 0; return Image({ src: "/a.jpg", alt: "Stay", fill: true, ...props }); };
  let tree = render();
  assert.equal(tree.props.children[1].props.style.opacity, 0);
  const event = { currentTarget: {} };
  let forwarded;
  tree = render({ onLoad: value => { forwarded = value; } });
  tree.props.children[1].props.onLoad(event);
  tree = render();
  assert.equal(forwarded, event);
  assert.equal(tree.props.children[0], false);
  assert.equal(tree.props.children[1].props.style.opacity, 1);

  tree = render({ src: "/b.jpg", onError: value => { forwarded = value; } });
  assert.equal(tree.props.children[1].props.style.opacity, 0);
  assert.ok(tree.props.children[0]);
  tree.props.children[1].props.onError(event);
  tree = render({ src: "/b.jpg" });
  assert.match(tree.props.children[0].props.className, /failed/);
  assert.equal(forwarded, event);
});
