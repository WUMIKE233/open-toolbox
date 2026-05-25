# package-scripts-list

List `package.json` scripts across a repository. The output is handy when documenting monorepos or auditing which packages expose build, test, or release commands.

## Usage

```bash
node packages/package-scripts-list/bin/package-scripts-list.js --root .
node packages/package-scripts-list/bin/package-scripts-list.js --root . --json
```

## API

```js
import { listPackageScripts } from "package-scripts-list";

const packages = await listPackageScripts({ root: "." });
```
