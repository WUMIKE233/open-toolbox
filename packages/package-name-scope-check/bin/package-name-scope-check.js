#!/usr/bin/env node
import { checkPackageNameScope } from "../src/index.js";

function parseArgs(argv) {
  const options = { root: process.cwd(), json: false };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--root") {
      options.root = argv[index + 1];
      index += 1;
    } else if (arg === "--scope") {
      options.scope = argv[index + 1];
      index += 1;
    } else if (arg === "--prefix") {
      options.prefix = argv[index + 1];
      index += 1;
    } else if (arg === "--json") {
      options.json = true;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`package-name-scope-check

Usage:
  package-name-scope-check --root <directory> [--scope @scope] [--prefix prefix] [--json]

Options:
  --root <directory> Directory to scan. Defaults to the current directory.
  --scope @scope     Accept package names under this npm scope.
  --prefix prefix    Accept package name segments with this prefix.
  --json             Print machine-readable JSON.
  -h, --help         Show help.`);
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    process.exit(0);
  }

  const result = await checkPackageNameScope(options);
  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Checked ${result.packages.length} package manifest(s).`);
    if (result.problems.length === 0) {
      console.log("No package name problems found.");
    } else {
      for (const problem of result.problems) {
        console.log(`${problem.path}: ${problem.message}`);
      }
    }
  }

  process.exit(result.problems.length === 0 ? 0 : 1);
} catch (error) {
  console.error(error.message);
  process.exit(2);
}
