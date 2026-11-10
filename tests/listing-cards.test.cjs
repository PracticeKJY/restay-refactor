const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const { test } = require("node:test");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const ts = require("typescript");

// Keep Swiper, routing and APIs out of these presentation regression tests.
function load(file, mocks = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
  }).outputText;
  const loadedModule = { exports: {} };
  vm.runInNewContext(code, {
    module: loadedModule,
    exports: loadedModule.exports,
    require: (id) => {
      if (Object.hasOwn(mocks, id)) return mocks[id];
      if (id === "next-intl") return {
        useTranslations: (namespace) => (key) => require("../messages/ko.json")[namespace][key],
      };
      if (id.endsWith(".module.css")) {
        return { default: new Proxy({}, { get: (_, key) => String(key) }) };
      }
      return require(id);
    },
  }, { filename: file });
  return loadedModule.exports.default;
}

const listing = { _id: "listing-123", imageSrc: ["/photo.jpg"], title: "숙소" };
const SwiperMock = ({ data, isHover, disable = false, sessionEmail }) =>
  React.createElement("div", {
    "data-listing": data._id,
    "data-hover": String(isHover),
    "data-disabled": String(disable),
    "data-session": sessionEmail,
  });
const mediaFile = "app/component/listings/ListingCardMedia.tsx";
const Media = load(mediaFile, { "./SwiperComponent": { default: SwiperMock } });
const ListingsCard = load("app/component/listings/ListingsCard.tsx", {
  "./ListingCardMedia": { default: Media },
  "./CardInfo": { default: ({ data }) => React.createElement("span", null, data.title) },
});
const Card = load("app/wishList/Card.tsx", {
  "../component/listings/ListingCardMedia": { default: Media },
});

test("home keeps its wrapper, card information and favorite session", () => {
  assert.equal(renderToStaticMarkup(React.createElement(ListingsCard, {
    data: listing, userId: listing._id, sessionEmail: "test@example.com",
  })), '<div data-listing-card="true" class="listingsWrapper"><div data-listing="listing-123" data-hover="false" data-disabled="false" data-session="test@example.com"></div><span>숙소</span></div>');
});

test("wishlist keeps its title, DOM wrappers and disabled favorites", () => {
  assert.equal(renderToStaticMarkup(React.createElement(Card, {
    data: listing, title: "다음 여행", disable: true,
  })), '<div class="cardContainer"><div class="cardWrapper"><div data-listing-card="true" class="listingsWrapper"><div data-listing="listing-123" data-hover="false" data-disabled="true"></div></div><div class="cardTitle">다음 여행</div></div></div>');
});

test("trips keeps the reservation dates instead of a wishlist title", () => {
  const markup = renderToStaticMarkup(React.createElement(Card, {
    data: listing, startDay: "11.9", endDay: "11.11", disable: true,
  }));
  assert.ok(markup.includes('<div class="cardTitle">예약일: 11.9 ~ 11.11</div>'));
  assert.ok(markup.includes('data-disabled="true"'));
});

test("the shared media changes hover only and forwards the original listing", () => {
  let hover = false;
  const HoverMedia = load(mediaFile, {
    react: { ...React, useState: () => [hover, (value) => { hover = value; }] },
    "./SwiperComponent": { default: SwiperMock },
  });
  const props = { data: listing, className: "original-class" };
  let element = HoverMedia(props);
  assert.equal(element.props.children[0].props.data, listing);
  assert.equal(element.props.children[0].props.isHover, false);
  element.props.onMouseEnter();
  element = HoverMedia(props);
  assert.equal(element.props.children[0].props.isHover, true);
  element.props.onMouseLeave();
  assert.equal(HoverMedia(props).props.children[0].props.isHover, false);
});
