import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { checkLicenseHeaders } from "../src/index.js";

test("reports files missing a required header", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "license-header-"));
  await mkdir(path.join(root, "src"));
  await writeFile(path.join(root, "src", "good.js"), [
    "// SPDX-License-Identifier: MIT",
    "export const ok = true;"
  ].join("\n"));
  await writeFile(path.join(root, "src", "missing.js"), "export const ok = false;\n");
  await writeFile(path.join(root, "src", "ignored.txt"), "export const ok = false;\n");

  const result = await checkLicenseHeaders({
    root,
    header: "SPDX-License-Identifier: MIT",
    extensions: ["js"]
  });

  assert.equal(result.filesScanned, 2);
  assert.deepEqual(result.missing, ["src/missing.js"]);
});
