import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { checkChangelogFragments } from "../src/index.js";

test("checks changelog fragment categories", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "changelog-fragments-"));
  const directory = path.join(root, ".changes");
  await mkdir(directory);
  await writeFile(path.join(directory, "one.md"), "category: added\n\nNew CLI.\n");
  await writeFile(path.join(directory, "two.md"), "Fixed: handle Windows paths.\n");
  await writeFile(path.join(directory, "bad.md"), "# misc\n\nNotes.\n");

  const result = await checkChangelogFragments({
    directory,
    categories: ["added", "fixed"]
  });

  assert.equal(result.filesScanned, 3);
  assert.equal(result.valid, 2);
  assert.deepEqual(result.invalid, [
    {
      file: "bad.md",
      category: "misc"
    }
  ]);
});

test("returns an empty result when the fragment directory is missing", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "changelog-fragments-"));

  const result = await checkChangelogFragments({
    directory: path.join(root, ".changes")
  });

  assert.equal(result.filesScanned, 0);
  assert.equal(result.valid, 0);
  assert.deepEqual(result.invalid, []);
});
