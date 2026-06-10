#!/usr/bin/env node
import { checkReadmeLocale } from "../src/index.js";

function parseArgs(argv) {
  const options = {
    root: process.cwd(),
    requireChinese: true,
    requireEnglish: true,
    json: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--root") {
      options.root = argv[index + 1];
      index += 1;
    } else if (arg === "--file") {
      options.file = argv[index + 1];
      index += 1;
    } else if (arg === "--no-chinese") {
      options.requireChinese = false;
    } else if (arg === "--no-english") {
      options.requireEnglish = false;
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
  console.log(`readme-locale-check

Usage:
  readme-locale-check --root <directory> [--file README.md] [--json]

Options:
  --root <directory> Directory that contains the README. Defaults to current directory.
  --file <path>      README path relative to --root.
  --no-chinese       Do not require Chinese text.
  --no-english       Do not require English text.
  --json             Print machine-readable JSON.
  -h, --help         Show help.`);
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    process.exit(0);
  }

  const result = await checkReadmeLocale(options);
  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else if (result.ok) {
    console.log(`OK: ${result.file} contains the required language signals.`);
  } else {
    console.log(`Found ${result.problems.length} README locale problem(s):`);
    for (const problem of result.problems) {
      console.log(`- ${problem}`);
    }
  }

  process.exit(result.ok ? 0 : 1);
} catch (error) {
  console.error(error.message);
  process.exit(2);
}
