# changelog-fragment-check

Check that a changelog fragment exists and uses an allowed category. This is useful for projects that collect small release-note files before generating a full changelog.

## Usage

```bash
node packages/changelog-fragment-check/bin/changelog-fragment-check.js --dir .changes
node packages/changelog-fragment-check/bin/changelog-fragment-check.js --dir .changes --categories added,fixed,changed
```

## API

```js
import { checkChangelogFragments } from "changelog-fragment-check";

const result = await checkChangelogFragments({
  directory: ".changes",
  categories: ["added", "fixed"]
});
```
