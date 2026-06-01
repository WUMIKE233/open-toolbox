import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { checkPackageEntrypoints } from "../src/index.js";

test("reports existing entrypoints across package manifests", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "package-entrypoint-check-"));
  await mkdir(path.join(root, "pkg", "dist"), { recursive: true });
  await mkdir(path.join(root, "pkg", "bin"), { recursive: true });
  await writeFile(path.join(root, "pkg", "dist", "index.js"), "export const value = 1;\n");
  await writeFile(path.join(root, "pkg", "dist", "index.d.ts"), "export declare const value: number;\n");
  await writeFile(path.join(root, "pkg", "dist", "cli.js"), "console.log('cli');\n");
  await writeFile(path.join(root, "pkg", "bin", "tool.js"), "#!/usr/bin/env node\n");
  await writeFile(path.join(root, "pkg", "package.json"), JSON.stringify({
    name: "pkg",
    main: "./dist/index.js",
    types: "./dist/index.d.ts",
    bin: {
      "pkg-tool": "./bin/tool.js"
    },
    exports: {
      ".": {
        default: "./dist/index.js",
        types: "./dist/index.d.ts"
      },
      "./cli": "./dist/cli.js"
    }
  }));

  const result = await checkPackageEntrypoints({ root });

  assert.equal(result.packageCount, 1);
  assert.equal(result.issueCount, 0);
  assert.equal(result.packages[0].checks.length, 6);
  assert.equal(result.packages[0].checks.every((check) => check.exists), true);
});

test("reports missing main, bin, and exports targets", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "package-entrypoint-check-"));
  await mkdir(path.join(root, "pkg"), { recursive: true });
  await writeFile(path.join(root, "pkg", "package.json"), JSON.stringify({
    name: "pkg",
    main: "./dist/index.js",
    bin: "./bin/run.js",
    exports: {
      ".": {
        import: "./dist/index.mjs",
        require: "./dist/index.cjs"
      }
    }
  }));

  const result = await checkPackageEntrypoints({ root });
  const missingLabels = result.packages[0].checks
    .filter((check) => !check.exists)
    .map((check) => check.label);

  assert.equal(result.issueCount, 4);
  assert.deepEqual(missingLabels, [
    "bin",
    "exports[\".\"].import",
    "exports[\".\"].require",
    "main"
  ]);
});

test("ignores non-relative export strings and packages without entrypoints", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "package-entrypoint-check-"));
  await mkdir(path.join(root, "pkg"), { recursive: true });
  await writeFile(path.join(root, "pkg", "package.json"), JSON.stringify({
    name: "pkg",
    exports: {
      "./feature": {
        default: "feature-runtime"
      }
    }
  }));

  const result = await checkPackageEntrypoints({ root });

  assert.equal(result.issueCount, 0);
  assert.deepEqual(result.packages[0].checks, []);
});
