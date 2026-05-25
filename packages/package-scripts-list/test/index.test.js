import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { listPackageScripts } from "../src/index.js";

test("lists package scripts across a repository", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "scripts-list-"));
  await mkdir(path.join(root, "packages", "a"), { recursive: true });
  await mkdir(path.join(root, "node_modules", "ignored"), { recursive: true });
  await writeFile(path.join(root, "package.json"), JSON.stringify({
    name: "root",
    scripts: { test: "node --test", build: "node build.js" }
  }));
  await writeFile(path.join(root, "packages", "a", "package.json"), JSON.stringify({
    name: "pkg-a",
    scripts: { lint: "eslint ." }
  }));
  await writeFile(path.join(root, "node_modules", "ignored", "package.json"), JSON.stringify({
    name: "ignored",
    scripts: { test: "nope" }
  }));

  const result = await listPackageScripts({ root });

  assert.deepEqual(result, [
    {
      name: "root",
      path: "package.json",
      scripts: {
        build: "node build.js",
        test: "node --test"
      }
    },
    {
      name: "pkg-a",
      path: "packages/a/package.json",
      scripts: {
        lint: "eslint ."
      }
    }
  ]);
});
