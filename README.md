# Open Toolbox

Open Toolbox is a small collection of dependency-free command line tools for maintainers, data tinkerers, and people who like their repositories tidy.

## Projects

| Project | Purpose |
| --- | --- |
| [`md-local-link-auditor`](packages/md-local-link-auditor) | Scan Markdown files and report broken local links. |
| [`jsonl-profile`](packages/jsonl-profile) | Profile JSON Lines files and summarize field coverage and types. |
| [`env-example-check`](packages/env-example-check) | Compare `.env.example` with a local `.env` file or process environment. |

## Quick Start

```bash
npm test
```

Each package can also be used directly with Node:

```bash
node packages/md-local-link-auditor/bin/md-local-link-auditor.js --root .
node packages/jsonl-profile/bin/jsonl-profile.js ./data.jsonl
node packages/env-example-check/bin/env-example-check.js --example .env.example --env .env
```

## Why These Tools

The projects are intentionally small, boring, and easy to maintain. They avoid runtime dependencies, have focused tests, and solve common open-source chores that otherwise become custom scripts in every repository.

## Development

```bash
npm test
```

The repository uses Node's built-in test runner. No install step is required for runtime dependencies.

## License

MIT
