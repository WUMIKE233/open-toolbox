# package-license-summary

Summarize `license` fields from `package.json` files in a repository. It helps monorepo maintainers spot packages with missing or inconsistent license metadata.

## Usage

```bash
node packages/package-license-summary/bin/package-license-summary.js --root .
node packages/package-license-summary/bin/package-license-summary.js --root . --json
```

## API

```js
import { summarizePackageLicenses } from "package-license-summary";

const result = await summarizePackageLicenses({ root: "." });
```
