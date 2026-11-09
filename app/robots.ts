import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/reservation/", "/wishList", "/trips", "/messages", "/en/reservation/", "/en/wishList", "/en/trips", "/en/messages"] }],
  };
}
