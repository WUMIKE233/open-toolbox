import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { scanTodos } from "../src/index.js";

test("scans TODO and FIXME entries", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "repo-todo-scan-"));
  await writeFile(path.join(root, "index.js"), [
    "// TODO: add tests",
    "const value = 1;",
    "// FIXME handle edge case",
    "// NOTE ignored by default"
  ].join("\n"));

  const result = await scanTodos({ root });

  assert.equal(result.filesScanned, 1);
  assert.deepEqual(result.items.map((item) => item.tag), ["TODO", "FIXME"]);
  assert.deepEqual(result.items.map((item) => item.line), [1, 3]);
});

test("can include NOTE entries and restrict extensions", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "repo-todo-scan-"));
  await writeFile(path.join(root, "notes.md"), "NOTE: document this\n");
  await writeFile(path.join(root, "skip.txt"), "TODO: ignored\n");

  const result = await scanTodos({ root, extensions: ["md"], includeNote: true });

  assert.equal(result.itemCount, 1);
  assert.equal(result.items[0].file, "notes.md");
  assert.equal(result.items[0].tag, "NOTE");
});

test("ignores prose mentions that are not maintenance notes", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "repo-todo-scan-"));
  await writeFile(path.join(root, "README.md"), "This tool scans TODO and FIXME notes.\n");

  const result = await scanTodos({ root, extensions: ["md"] });

  assert.equal(result.itemCount, 0);
});
