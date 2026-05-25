#!/usr/bin/env node
import { listPackageScripts } from "../src/index.js";

function parseArgs(argv) {
  const options = { root: process.cwd(), json: false };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--root") {
      options.root = argv[index + 1];
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
  console.log(`package-scripts-list

Usage:
  package-scripts-list --root <directory> [--json]

Options:
  --root <directory> Directory to scan. Defaults to the current directory.
  --json             Print machine-readable JSON.
  -h, --help         Show help.`);
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    process.exit(0);
  }

  const packages = await listPackageScripts({ root: options.root });
  if (options.json) {
    console.log(JSON.stringify(packages, null, 2));
  } else {
    for (const item of packages) {
      console.log(`${item.name} (${item.path})`);
      const entries = Object.entries(item.scripts);
      if (entries.length === 0) {
        console.log("  no scripts");
      } else {
        for (const [name, command] of entries) {
          console.log(`  ${name}: ${command}`);
        }
      }
    }
  }
} catch (error) {
  console.error(error.message);
  process.exit(2);
}
