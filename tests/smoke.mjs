// Smoke test před přednáškou: `make test` (= build + tenhle skript).
//
// Nad hotovým dist/ spustí statický server, v Chromu načte každou stránku
// (desktop i mobil, cs i en), proklikne všechna tlačítka a hlídá:
//   - chyby JavaScriptu (pageerror / console.error),
//   - vodorovné přetečení stránky na mobilu,
//   - regrese chyb, které se už jednou opravily (viz „Regrese" dole).
//
// Používá nainstalovaný Google Chrome (playwright-core nic nestahuje);
// jiný prohlížeč: CHROME_PATH=/cesta/k/chrome npm test
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));   // pathname by nechal %20, %C5%A1…
const PAGES = ['index', '01-binary-counter', '02-jazyk', '03-hledani', '04-markov', '05-perceptron',
  '06-neuronka', '07-vision', '08-genetika', '09-embeddingy', '10-attention', '11-token',
  '12-rag', '13-agents', '14-bias', '15-tsp'];
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };

// ── statický server nad dist/ ────────────────────────────────────
const server = createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^[/\\]+/, '') || 'index.html';
  // nejdřív načíst, pak hlavičky — jinak by 404 volala writeHead podruhé a shodila test
  let body;
  try { body = await readFile(join(DIST, path)); } catch { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'content-type': TYPES[extname(path)] || 'application/octet-stream' }); res.end(body);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}/`;

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' });
const failures = [];
const fail = (where, what) => { failures.push(`${where}: ${what}`); console.log(`  ✗ ${what}`); };

async function open(page, { mobile = false, lang = 'cs' } = {}) {
  const ctx = await browser.newContext(mobile ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : { viewport: { width: 1280, height: 900 } });
  await ctx.route(/gc\.zgo\.at|saiko\.cz\/tsp/, r => r.abort());      // měření a vložené TSP netestujeme
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !/ERR_FAILED|ERR_BLOCKED/.test(m.text())) errs.push(m.text()); });
  await p.goto(`${BASE}${page}.html?lang=${lang}`, { waitUntil: 'load' });
  return { p, ctx, errs };
}

// ── 1) každá stránka: chyby JS a přetečení ───────────────────────
for (const mobile of [false, true]) {
  console.log(mobile ? '\nMobil (390 px)' : 'Desktop (1280 px)');
  for (const name of PAGES) {
    const { p, ctx, errs } = await open(name, { mobile });
    const where = `${name} ${mobile ? 'mobil' : 'desktop'}`;
    console.log(`• ${name}`);
    await p.waitForTimeout(300);
    if (mobile) {
      const { sw, vw } = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth }));
      if (sw > vw) fail(where, `stránka přetéká do strany (${sw} px > ${vw} px)`);
    }
    for (const lang of ['cs', 'en']) {
      await p.evaluate(l => window.setLang(l), lang);
      for (const b of await p.$$('button:not(.langpill button)')) {
        if (!(await b.isVisible()) || !(await b.isEnabled())) continue;
        await b.click({ timeout: 800 }).catch(() => {});
        await p.waitForTimeout(80);
      }
    }
    await p.waitForTimeout(300);
    for (const e of errs) fail(where, `chyba JS: ${e}`);
    await ctx.close();
  }
}

// ── 2) Regrese opravených chyb ───────────────────────────────────
console.log('\nRegrese');
async function check(name, what, fn) {
  console.log(`• ${name}: ${what}`);
  const o = await open(name);
  try { const msg = await fn(o.p); if (msg) fail(name, msg); } catch (e) { fail(name, e.message); }
  for (const e of o.errs) fail(name, `chyba JS: ${e}`);
  await o.ctx.close();
}

await check('13-agents', 'předvolba spustí agenta na SVŮJ úkol', async p => {
  await p.click('#presets button[data-i="0"]');                       // „Kolik je 17 % z 240?"
  await p.waitForSelector('.tanswer', { timeout: 6000 });
  const t = await p.textContent('.tanswer');
  if (!t.includes('40,8')) return `čekáno „40,8", odpověď: ${t.trim()}`;
});
await check('13-agents', '„Kolik je hodin?" nejde na kalkulačku', async p => {
  await p.fill('#task', 'Kolik je hodin?'); await p.click('#btnRun');
  await p.waitForSelector('.tanswer', { timeout: 6000 });
  const t = await p.textContent('.tanswer');
  if (t.includes('?')) return `odpověď obsahuje „?": ${t.trim()}`;
});
await check('12-rag', 'všechny předvolby najdou dokument se 100 % a ✓', async p => {
  const n = await p.$$eval('#presets button', b => b.length);
  for (let i = 0; i < n; i++) {
    await p.click(`#presets button[data-i="${i}"]`);
    const pct = await p.textContent('.rk .rkpct'), note = await p.textContent('#noteRag');
    if (pct.trim() !== '100 %' || !note.startsWith('✓')) return `předvolba ${i}: ${pct.trim()} / ${note.slice(0, 40)}`;
  }
});
await check('14-bias', 'zaujatá data → verdikt „Nespravedlivé" (5 běhů)', async p => {
  await p.click('#mode button[data-mode="biased"]');
  for (let i = 0; i < 5; i++) {
    await p.click('#btnNew'); await p.waitForTimeout(3200);
    if (!(await p.getAttribute('#verdict', 'class')).includes('bad')) return `běh ${i + 1}: verdikt „Férové"`;
  }
});

await browser.close();
server.close();
console.log(failures.length ? `\n✗ ${failures.length} problémů:\n  ${failures.join('\n  ')}` : '\n✓ vše v pořádku');
process.exit(failures.length ? 1 : 0);
