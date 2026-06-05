---
name: pdf-parse server-side quirks
description: How to safely use pdf-parse in a Node.js/Express server on Replit
---

## Rule
Pin pdf-parse to `1.1.1` and import via its internal path `pdf-parse/lib/pdf-parse` (not the root package), and add a hand-written `.d.ts` declaration for it.

**Why:**
- `pdf-parse@^2.x` bundles pdfjs-dist which requires `DOMMatrix`, `ImageData`, and `@napi-rs/canvas` — none of which exist in Node.js without polyfills. The server crashes immediately on import.
- `pdf-parse@1.1.1` root entry (`index.js`) executes a test that reads `./test/data/05-versions-space.pdf` at module load time, crashing when the CWD doesn't contain that file (i.e. after bundling/deployment).
- Importing `pdf-parse/lib/pdf-parse` directly skips the test harness and only loads the actual parser.

**How to apply:**
1. In `package.json`: `"pdf-parse": "1.1.1"` (exact pin, not `^`).
2. In the route file: `import pdfParse from "pdf-parse/lib/pdf-parse";`
3. Add `src/types/pdf-parse.d.ts` declaring `declare module "pdf-parse/lib/pdf-parse"` with the return type so TypeScript doesn't error on the untyped internal path.
4. Usage is unchanged: `const data = await pdfParse(buffer); const text = data.text;`
