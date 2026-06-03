#!/usr/bin/env node
import { collectRepoLanguageStats } from "../src/index.js";

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
  console.log(`repo-language-stats

Usage:
  repo-language-stats --root <directory> [--json]

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

  const result = await collectRepoLanguageStats({ root: options.root });
  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Scanned ${result.filesScanned} file(s).`);
    console.log("Language stats:");
    for (const item of result.languages) {
      console.log(`  ${item.language}: ${item.files} file(s), ${item.lines} line(s), ${item.bytes} byte(s)`);
    }
  }
} catch (error) {
  console.error(error.message);
  process.exit(2);
}
