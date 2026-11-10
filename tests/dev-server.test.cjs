const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { acquireDevLock } = require("../scripts/dev-server.cjs");

function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "restay-dev-lock-"));
  const file = path.join(directory, ".next-dev.lock");
  t.after(() => { if (fs.existsSync(file)) fs.unlinkSync(file); fs.rmdirSync(directory); });
  return file;
}

test("a second dev launcher cannot overwrite the active server output", t => {
  const file = fixture(t);
  const first = acquireDevLock(file);
  assert.throws(() => acquireDevLock(file), { code: "DEV_ALREADY_RUNNING" });
  assert.equal(JSON.parse(fs.readFileSync(file, "utf8")).pid, process.pid);
  first.release();
  const next = acquireDevLock(file);
  next.release();
  assert.equal(fs.existsSync(file), false);
});

test("a recorded child keeps the lock even if the launcher has exited", t => {
  const file = fixture(t);
  fs.writeFileSync(file, JSON.stringify({ pid: 2147483647, childPid: process.pid }));
  assert.throws(() => acquireDevLock(file), { code: "DEV_ALREADY_RUNNING" });
});

test("an exited launcher and child do not leave the project locked", t => {
  const file = fixture(t);
  fs.writeFileSync(file, JSON.stringify({ pid: 2147483647, childPid: 2147483646 }));
  const lock = acquireDevLock(file);
  assert.equal(JSON.parse(fs.readFileSync(file, "utf8")).pid, process.pid);
  lock.release();
});
