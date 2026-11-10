const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["avatars.githubusercontent.com", "lh3.googleusercontent.com", "phinf.pstatic.net", "k.kakaocdn.net", "res.cloudinary.com"],
  },
  // transpilePackages: ["jotai-devtools"],
  webpack(config, { dev, isServer }) {
    if (!dev && !isServer) {
      const BundleReportPlugin = require("./scripts/bundle-report-plugin.cjs");
      config.plugins.push(new BundleReportPlugin());
    }
    return config;
  },
};

const withNextIntl = require("next-intl/plugin")("./i18n/request.ts");
// A production build must never overwrite chunks served by an active dev server.
module.exports = (phase) => withNextIntl({
  ...nextConfig,
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
});
