#!/usr/bin/env node
import { checkPackageEntrypoints } from "../src/index.js";

const args = process.argv.slice(2);
const options = {
  root: process.cwd(),
  json: false
};

for (let index = 0; index < args.length; index += 1) {
  const argument = args[index];
  if (argument === "--root") {
    options.root = args[index + 1] ?? options.root;
    index += 1;
  } else if (argument === "--json") {
    options.json = true;
  } else if (argument === "--help" || argument === "-h") {
    printHelp();
    process.exit(0);
  }
}

const result = await checkPackageEntrypoints({ root: options.root });

if (options.json) {
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.issueCount > 0 ? 1 : 0);
}

if (result.issueCount === 0) {
  console.log(`All package entrypoints exist across ${result.packageCount} package.json files.`);
  process.exit(0);
}

for (const pkg of result.packages) {
  for (const check of pkg.checks) {
    if (!check.exists) {
      console.log(`${pkg.path}: missing ${check.label} -> ${check.target}`);
    }
  }
}

process.exit(1);

function printHelp() {
  console.log("Usage: package-entrypoint-check [--root <path>] [--json]");
}
