const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");

function isAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try { process.kill(pid, 0); return true; }
  catch (error) { return error.code === "EPERM"; }
}

// The lock lives outside .next-dev: Next owns and can replace that directory.
function acquireDevLock(filename) {
  let descriptor;
  for (let attempt = 0; attempt < 2; attempt++) {
    try { descriptor = fs.openSync(filename, "wx"); break; }
    catch (error) {
      if (error.code !== "EEXIST") throw error;
      let previous;
      try { previous = JSON.parse(fs.readFileSync(filename, "utf8")); }
      catch { throw new Error("Development server lock is busy or incomplete. Check the existing terminal."); }
      if (isAlive(previous.pid) || isAlive(previous.childPid)) {
        const busy = new Error("Restay dev server is already running. Use the existing server; stop it before starting another one.");
        busy.code = "DEV_ALREADY_RUNNING";
        throw busy;
      }
      // Only a lock whose recorded processes have exited is stale.
      fs.unlinkSync(filename);
    }
  }
  if (descriptor === undefined) throw new Error("Could not acquire the development server lock.");
  const owner = { pid: process.pid };
  fs.writeFileSync(descriptor, JSON.stringify(owner));
  fs.closeSync(descriptor);
  return {
    setChild(pid) { owner.childPid = pid; fs.writeFileSync(filename, JSON.stringify(owner)); },
    release() {
      try {
        const current = JSON.parse(fs.readFileSync(filename, "utf8"));
        if (current.pid === process.pid) fs.unlinkSync(filename);
      } catch (error) { if (error.code !== "ENOENT") throw error; }
    },
  };
}

function main() {
  const root = path.resolve(__dirname, "..");
  let lock;
  try { lock = acquireDevLock(path.join(root, ".next-dev.lock")); }
  catch (error) { console.error(error.message); process.exitCode = 1; return; }
  const child = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "dev", "--port", "3000", ...process.argv.slice(2)], {
    cwd: root, stdio: "inherit",
  });
  if (child.pid) lock.setChild(child.pid);
  child.on("error", error => { console.error(error.message); lock.release(); process.exitCode = 1; });
  child.on("exit", (code, signal) => { lock.release(); process.exitCode = code ?? (signal ? 1 : 0); });
  process.on("SIGINT", () => { child.kill("SIGINT"); });
  process.on("SIGTERM", () => { child.kill("SIGTERM"); });
}

module.exports = { acquireDevLock };
if (require.main === module) main();
