import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ko", "en"],
  defaultLocale: "ko",
  localePrefix: "as-needed",
  // Existing unprefixed links always remain Korean, regardless of cookies.
  localeDetection: false,
});
