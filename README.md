2015:
  - initial version of resume site, built in react for practice.

2019:
  - added tophatter content
  - added PDF version rendered from the same content.

2022:
 - added google content
 - PDF now rendered at build time rather than client side
 - order of magnitude bundle size reduction from above and switching react->preact
 - browserify->webpack to brush up on my webpack knowledge and move to a more widely used tool

2024:
 - added amazon content
 - store content in yaml, built to single json file with schema validation
 - moved content to a git submodule
 - make responsive styles apply to high pixel density devices (phones)

2025:
 - add meta content

2026:
 - full design refactor inspired by Edward Tufte
 - rewrote the component tree; dropped the interactive sort menus
 - PDF is now headless-rendered from the built site (Puppeteer + `@media print`) instead
   of a separate `@react-pdf` tree, so the PDF matches the page exactly
 - made the output trivially bot/ATS-parseable: the build prerenders the DOM into static
   `dist/index.html`, emits schema.org/Person JSON-LD, and produces a tagged, single-column
   (correct reading order) PDF with real selectable text

Build: `yarn buildProd` (webpack build → `dist/`, then `node src/pdf/makePdf.js` prerenders
the HTML and writes `dist/resume.pdf`). On linux-arm64, Chrome-for-Testing has no build, so
makePdf falls back to a system / Playwright Chromium (or set `PUPPETEER_EXECUTABLE_PATH`).

Design notes live in `docs/design-system.md`.

Check it out at [yalethom.as/resume](https://yalethom.as/resume).
