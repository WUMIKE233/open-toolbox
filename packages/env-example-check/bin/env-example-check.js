#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { compareEnvObjects, compareEnvText } from "../src/index.js";

function parseArgs(argv) {
  const options = { example: ".env.example", env: ".env", processEnv: false, json: false };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--example") {
      options.example = argv[index + 1];
      index += 1;
    } else if (arg === "--env") {
      options.env = argv[index + 1];
      index += 1;
    } else if (arg === "--process") {
      options.processEnv = true;
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
  console.log(`env-example-check

Usage:
  env-example-check [--example .env.example] [--env .env]
  env-example-check --example .env.example --process

Options:
  --example <file>  Example environment file. Defaults to .env.example.
  --env <file>      Local environment file. Defaults to .env.
  --process         Compare the example file with process.env.
  --json            Print machine-readable JSON.
  -h, --help        Show help.`);
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    process.exit(0);
  }

  const exampleText = await readFile(options.example, "utf8");
  const result = options.processEnv
    ? compareEnvObjects(exampleText, process.env)
    : compareEnvText(exampleText, await readFile(options.env, "utf8"));

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else if (result.missing.length === 0 && result.extra.length === 0) {
    console.log("OK: environment matches the example.");
  } else {
    if (result.missing.length > 0) {
      console.log(`Missing: ${result.missing.join(", ")}`);
    }
    if (result.extra.length > 0) {
      console.log(`Extra: ${result.extra.join(", ")}`);
    }
  }

  process.exit(result.missing.length === 0 ? 0 : 1);
} catch (error) {
  console.error(error.message);
  process.exit(2);
}
