# license-header-check

Check source files for a required license header snippet. It is useful for repositories that need every source file to include a copyright or SPDX header.

## Usage

```bash
node packages/license-header-check/bin/license-header-check.js --root . --header-file LICENSE_HEADER
node packages/license-header-check/bin/license-header-check.js --root packages --text "SPDX-License-Identifier: MIT" --ext js,ts
```

## API

```js
import { checkLicenseHeaders } from "license-header-check";

const result = await checkLicenseHeaders({
  root: ".",
  header: "SPDX-License-Identifier: MIT",
  extensions: ["js", "ts"]
});
```
