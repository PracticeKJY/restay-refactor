const fs = require("node:fs");
const path = require("node:path");

// Build-time metadata only; module sources and environment values are omitted.
class BundleReportPlugin {
  apply(compiler) {
    compiler.hooks.done.tap("RestayBundleReport", (stats) => {
      const report = stats.toJson({
        all: false, ids: true, assets: true, chunks: true, modules: true, nestedModules: true,
        cachedModules: true, orphanModules: true,
        groupModulesByAttributes: false, groupModulesByCacheStatus: false,
        groupModulesByPath: false, groupModulesByExtension: false, groupModulesByType: false,
      });
      fs.writeFileSync(path.join(process.cwd(), ".next/client-bundle-stats.json"), JSON.stringify(report));
    });
  }
}

module.exports = BundleReportPlugin;
