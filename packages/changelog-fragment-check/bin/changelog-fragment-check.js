#!/usr/bin/env node
import { checkChangelogFragments } from "../src/index.js";

function parseArgs(argv) {
  const options = {
    directory: ".changes",
    categories: undefined,
    extensions: undefined,
    json: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--dir") {
      options.directory = argv[index + 1];
      index += 1;
    } else if (arg === "--categories") {
      options.categories = argv[index + 1].split(",");
      index += 1;
    } else if (arg === "--ext") {
      options.extensions = argv[index + 1].split(",");
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
  console.log(`changelog-fragment-check

Usage:
  changelog-fragment-check --dir <directory> [--categories added,fixed] [--json]

Options:
  --dir <directory>   Fragment directory. Defaults to .changes.
  --categories <list> Comma-separated allowed categories.
  --ext <list>        Comma-separated file extensions. Defaults to md,markdown.
  --json              Print machine-readable JSON.
  -h, --help          Show help.`);
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    process.exit(0);
  }

  const result = await checkChangelogFragments(options);
  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else if (result.filesScanned === 0) {
    console.log("No changelog fragments found.");
  } else if (result.invalid.length === 0) {
    console.log(`OK: ${result.filesScanned} changelog fragment(s) use allowed categories.`);
  } else {
    console.log(`Invalid changelog fragment category in ${result.invalid.length} file(s):`);
    for (const item of result.invalid) {
      const category = item.category ?? "<empty>";
      console.log(`${item.file}: ${category}`);
    }
  }

  process.exit(result.filesScanned > 0 && result.invalid.length === 0 ? 0 : 1);
} catch (error) {
  console.error(error.message);
  process.exit(2);
}
