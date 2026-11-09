const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const postcss = require("postcss");

// Static cascade checks, not browser layout or overflow measurements.
function rulesAt(file, selector, width) {
  const result = {};
  postcss.parse(fs.readFileSync(file, "utf8")).walkRules(rule => {
    if (!rule.selector.split(",").some(value => value.trim() === selector)) return;
    for (let parent = rule.parent; parent; parent = parent.parent) {
      if (parent.type !== "atrule" || parent.name !== "media") continue;
      for (const [, bound, value] of parent.params.matchAll(/(min|max)-width:\s*(\d+)px/g)) {
        if (bound === "min" ? width < Number(value) : width > Number(value)) return;
      }
    }
    rule.walkDecls(declaration => { result[declaration.prop] = declaration.value; });
  });
  return result;
}

for (const width of [320, 375, 768]) {
  test(`${width}px: navigation, modal, detail, reservation and wishlist mobile rules win`, () => {
    assert.equal(rulesAt("app/component/Header/Navbar.module.css", ".logoSearchWrapper", width).width, "auto");
    assert.equal(rulesAt("app/component/Header/Search.module.css", ".container", width).width, "100%");
    assert.equal(rulesAt("app/component/Modal/Modal.module.css", ".modalContainer", width)["max-height"], "85dvh");
    assert.equal(rulesAt("app/listings/[id]/DetailListingPage.module.css", ".contentContainer", width).width, "100%");
    assert.equal(rulesAt("app/listings/[id]/DetailListingPage.module.css", ".bodyContainer", width)["flex-direction"], "column");
    assert.equal(rulesAt("app/reservation/[id]/Reservation.module.css", ".reservationContainer", width)["flex-direction"], "column");
    assert.equal(rulesAt("app/wishList/WishListCard.module.css", ".wishListContainer", width).margin, "0");
    assert.equal(rulesAt("app/trips/Trips.module.css", ".listingsContainer", width)["grid-template-columns"], width < 641 ? "minmax(0, 1fr)" : "repeat(2, minmax(0, 1fr))");
  });
}

for (const width of [1024, 1440]) {
  test(`${width}px: detail/reservation desktop rows and modal width are preserved`, () => {
    assert.equal(rulesAt("app/listings/[id]/DetailListingPage.module.css", ".bodyContainer", width)["flex-direction"], "row");
    assert.equal(rulesAt("app/reservation/[id]/Reservation.module.css", ".reservationContainer", width)["flex-direction"], "row");
    assert.equal(rulesAt("app/component/Modal/Modal.module.css", ".modalContainer", width).width, "600px");
  });
}
