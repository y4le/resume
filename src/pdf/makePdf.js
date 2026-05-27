/*
 * Generate the static résumé PDF from the built site.
 *
 * Run after the webpack build (the production build emits dist/):
 *   node ./src/pdf/makePdf.js
 *
 * It serves dist/ over a throwaway local server, loads the real page in headless
 * Chrome, then does two things in one pass:
 *   1. writes the fully-rendered DOM back to dist/index.html, so the shipped static
 *      page carries the full résumé text for non-JS bots / crawlers; and
 *   2. prints the page (print media → light paper theme) to a tagged PDF at
 *      dist/resume.pdf, which the site links.
 */

const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const puppeteer = require('puppeteer');

const DIST = path.join(__dirname, '..', '..', 'dist');

// Find a Chrome/Chromium to drive. Puppeteer's bundled "Chrome for Testing" has
// no linux-arm64 build, so on arm64 we must point at a system / Playwright-managed
// Chromium instead. Order: explicit env override → Playwright cache → system paths.
// Returns undefined to let Puppeteer use its own browser (works on linux-x64, mac).
function resolveExecutablePath () {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;

  const candidates = [];
  try {
    const base = path.join(os.homedir(), '.cache', 'ms-playwright');
    fs.readdirSync(base)
      .filter(d => d.startsWith('chromium-'))
      .sort((a, b) => (parseInt(b.split('-')[1], 10) || 0) - (parseInt(a.split('-')[1], 10) || 0))
      .forEach(d => candidates.push(path.join(base, d, 'chrome-linux', 'chrome')));
  } catch (e) { /* no Playwright cache */ }

  candidates.push(
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium', '/usr/bin/chromium-browser', '/snap/bin/chromium'
  );

  return candidates.find(p => { try { return fs.existsSync(p); } catch (e) { return false; } });
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.map': 'application/json',
  '.pdf': 'application/pdf'
};

function serveDist (root) {
  return http.createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    if (urlPath === '/') urlPath = '/index.html';
    const filePath = path.normalize(path.join(root, urlPath));
    if (!filePath.startsWith(root)) {
      res.statusCode = 403;
      return res.end('forbidden');
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        return res.end('not found');
      }
      res.setHeader('Content-Type', MIME[path.extname(filePath)] || 'application/octet-stream');
      res.end(data);
    });
  });
}

async function main () {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    console.error('dist/index.html not found — run the webpack build first (`yarn build`).');
    process.exit(1);
  }

  const server = serveDist(DIST);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const url = `http://127.0.0.1:${port}/`;

  const executablePath = resolveExecutablePath();
  if (executablePath) console.log('using browser:', executablePath);
  const browser = await puppeteer.launch({
    headless: true,
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');

    // 1) Prerender: bake the rendered DOM into the static HTML for bots.
    const html = await page.content();
    fs.writeFileSync(path.join(DIST, 'index.html'), html);
    console.log('wrote prerendered dist/index.html');

    // 2) Print to a tagged, letter-size PDF using the @media print paper theme.
    await page.emulateMediaType('print');
    await page.pdf({
      path: path.join(DIST, 'resume.pdf'),
      format: 'Letter',
      printBackground: true,
      tagged: true,
      margin: { top: '14mm', right: '14mm', bottom: '14mm', left: '14mm' }
    });
    console.log('wrote dist/resume.pdf');
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
