import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { summarizePackageLicenses } from "../src/index.js";

test("summarizes package license fields", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "license-summary-"));
  await mkdir(path.join(root, "packages", "a"), { recursive: true });
  await mkdir(path.join(root, "packages", "b"), { recursive: true });
  await writeFile(path.join(root, "package.json"), JSON.stringify({ name: "root", license: "MIT" }));
  await writeFile(path.join(root, "packages", "a", "package.json"), JSON.stringify({ name: "a", license: "MIT" }));
  await writeFile(path.join(root, "packages", "b", "package.json"), JSON.stringify({ name: "b" }));

  const result = await summarizePackageLicenses({ root });

  assert.deepEqual(result.counts, { MIT: 2 });
  assert.deepEqual(result.missing, ["packages/b/package.json"]);
  assert.equal(result.packages.length, 3);
});
