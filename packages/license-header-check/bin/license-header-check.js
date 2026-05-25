#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { checkLicenseHeaders } from "../src/index.js";

function parseArgs(argv) {
  const options = {
    root: process.cwd(),
    extensions: undefined,
    maxLines: 8,
    json: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--root") {
      options.root = argv[index + 1];
      index += 1;
    } else if (arg === "--header-file") {
      options.headerFile = argv[index + 1];
      index += 1;
    } else if (arg === "--text") {
      options.header = argv[index + 1];
      index += 1;
    } else if (arg === "--ext") {
      options.extensions = argv[index + 1].split(",");
      index += 1;
    } else if (arg === "--max-lines") {
      options.maxLines = Number(argv[index + 1]);
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
  console.log(`license-header-check

Usage:
  license-header-check --root <directory> --header-file <file> [--ext js,ts]
  license-header-check --root <directory> --text <snippet> [--ext js,ts]

Options:
  --root <directory>   Directory to scan. Defaults to the current directory.
  --header-file <file> File containing the required header snippet.
  --text <snippet>     Required header snippet.
  --ext <list>         Comma-separated extensions. Defaults to JS/TS files.
  --max-lines <number> Number of leading lines to inspect. Defaults to 8.
  --json               Print machine-readable JSON.
  -h, --help           Show help.`);
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    process.exit(0);
  }

  const header = options.header ?? await readHeaderFile(options.headerFile);
  const result = await checkLicenseHeaders({
    root: options.root,
    header,
    extensions: options.extensions,
    maxLines: options.maxLines
  });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else if (result.missing.length === 0) {
    console.log(`OK: scanned ${result.filesScanned} file(s), all required headers are present.`);
  } else {
    console.log(`Missing required header in ${result.missing.length} file(s):`);
    for (const file of result.missing) {
      console.log(file);
    }
  }

  process.exit(result.missing.length === 0 ? 0 : 1);
} catch (error) {
  console.error(error.message);
  process.exit(2);
}

async function readHeaderFile(headerFile) {
  if (!headerFile) {
    throw new Error("Missing --header-file or --text.");
  }
  return readFile(headerFile, "utf8");
}
