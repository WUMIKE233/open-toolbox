import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { checkPackageNameScope, matchesExpectedName } from "../src/index.js";

test("matches scope or prefix expectations", () => {
  assert.equal(matchesExpectedName("@acme/tool", { scope: "@acme" }), true);
  assert.equal(matchesExpectedName("@other/acme-tool", { prefix: "acme-" }), true);
  assert.equal(matchesExpectedName("plain-tool", { scope: "@acme", prefix: "acme-" }), false);
});

test("checks package name scope and missing names", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "scope-check-"));
  await mkdir(path.join(root, "packages", "good"), { recursive: true });
  await mkdir(path.join(root, "packages", "bad"), { recursive: true });
  await mkdir(path.join(root, "packages", "missing"), { recursive: true });
  await writeFile(path.join(root, "packages", "good", "package.json"), JSON.stringify({ name: "@acme/good" }));
  await writeFile(path.join(root, "packages", "bad", "package.json"), JSON.stringify({ name: "bad" }));
  await writeFile(path.join(root, "packages", "missing", "package.json"), JSON.stringify({ version: "1.0.0" }));

  const result = await checkPackageNameScope({ root, scope: "@acme" });

  assert.deepEqual(result.problems.map((problem) => problem.type), [
    "name-mismatch",
    "missing-name"
  ]);
});
