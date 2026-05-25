#!/usr/bin/env node
import { profileJsonlFile } from "../src/index.js";

function parseArgs(argv) {
  const options = { json: false };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--json") {
      options.json = true;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (!options.file) {
      options.file = arg;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`jsonl-profile

Usage:
  jsonl-profile <file.jsonl> [--json]

Options:
  --json      Print machine-readable JSON.
  -h, --help  Show help.`);
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    process.exit(0);
  }
  if (!options.file) {
    throw new Error("Missing input file.");
  }

  const profile = await profileJsonlFile(options.file);
  if (options.json) {
    console.log(JSON.stringify(profile, null, 2));
  } else {
    console.log(`Lines: ${profile.lines}`);
    console.log(`Valid JSON objects: ${profile.valid}`);
    console.log(`Invalid lines: ${profile.invalid.length}`);
    console.log("Fields:");
    for (const field of profile.fields) {
      console.log(`  ${field.name}: ${field.count}/${profile.valid} (${field.coverage}%) ${field.types.join(", ")}`);
    }
  }

  process.exit(profile.invalid.length === 0 ? 0 : 1);
} catch (error) {
  console.error(error.message);
  process.exit(2);
}
