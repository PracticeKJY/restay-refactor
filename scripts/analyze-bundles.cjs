const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const stats = JSON.parse(fs.readFileSync(".next/client-bundle-stats.json", "utf8"));
const pages = JSON.parse(fs.readFileSync(".next/app-build-manifest.json", "utf8")).pages;
const packageGroup = (name) => {
  const match = name.match(/node_modules[\\/](?:(@[^\\/]+)[\\/])?([^\\/]+)/);
  return match ? match[1] ? `${match[1]}/${match[2]}` : match[2] : "application";
};

const report = { measurement: "Manifest JS union of locale layout and page; gzip level 9 per asset, not Next CLI First Load JS or browser transfer. Module group sizes are compiler input before tree-shaking/minification and NOT emitted package sizes.", routes: {} };
for (const [name, entry] of Object.entries({ home: "/[locale]/page", listing: "/[locale]/listings/[id]/page", reservation: "/[locale]/reservation/[id]/page" })) {
  const files = [...new Set([...(pages["/[locale]/layout"] ?? []), ...(pages[entry] ?? [])])].filter(file => file.endsWith(".js"));
  const chunkIds = new Set((stats.chunks ?? []).filter(chunk => chunk.files.some(file => files.includes(file))).map(chunk => chunk.id));
  const groups = {};
  function visit(module, inherited = []) {
    const chunks = module.chunks?.length ? module.chunks : inherited;
    if (module.modules?.length) { module.modules.forEach(child => visit(child, chunks)); return; }
    if (!chunks.some(chunk => chunkIds.has(chunk))) return;
    const group = packageGroup(module.name ?? "");
    groups[group] = (groups[group] ?? 0) + (module.size ?? 0);
  }
  (stats.modules ?? []).forEach(module => visit(module));
  const rawBytes = files.reduce((sum, file) => sum + fs.statSync(path.join(".next", file)).size, 0);
  const gzipBytes = files.reduce((sum, file) => sum + zlib.gzipSync(fs.readFileSync(path.join(".next", file)), { level: 9 }).length, 0);
  report.routes[name] = { rawBytes, gzipBytes, files, largestModuleGroups: Object.entries(groups).sort((a, b) => b[1] - a[1]).slice(0, 18) };
}
fs.writeFileSync(".next/client-bundle-summary.json", JSON.stringify(report, null, 2) + "\n");
if (process.argv.includes("--save-baseline")) fs.writeFileSync("docs/bundle-before-optimization.json", JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
