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
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { CHAPTERS } from '../src/data/chapters.js';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));   // pathname by nechal %20, %C5%A1…
// všechny kapitoly z dat série, které mají hotovou stránku
const PAGES = ['index', ...CHAPTERS.map(c => c.slug).filter(slug => existsSync(new URL(`../dist/${slug}.html`, import.meta.url)))];
// původní adresy před přečíslováním → musí přesměrovat
const MOVED = { '04-markov': '05-markov', '08-genetika': '04-genetika', '12-rag': '17-rag', '15-tsp': '20-tsp' };
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

// ── 0) odkazy mezi stránkami vedou na existující soubory ─────────
console.log('Odkazy');
for (const f of (await readdir(DIST)).filter(f => f.endsWith('.html'))) {
  const html = await readFile(join(DIST, f), 'utf8');
  for (const [, href] of html.matchAll(/href="([^":#?]+\.html)[^"]*"/g))
    if (!existsSync(join(DIST, href))) fail(f, `odkaz na neexistující ${href}`);
}
for (const c of CHAPTERS.filter(c => PAGES.includes(c.slug))) {
  const html = await readFile(join(DIST, `${c.slug}.html`), 'utf8');
  if (!html.includes('class="chapfoot"')) fail(c.slug, 'chybí patička kapitoly');
  if (!html.includes(`<span class="badge">${c.n}</span>`)) fail(c.slug, `odznak neodpovídá číslu ${c.n}`);
}

// ── 1) každá stránka: chyby JS a přetečení ───────────────────────
// přetečení na mobilu hlídáme po načtení, po přepnutí jazyka i po proklikání
const overflow = async (p, where, when) => {
  const { sw, vw } = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth }));
  if (sw > vw) fail(where, `stránka přetéká do strany ${when} (${sw} px > ${vw} px)`);
};
for (const mobile of [false, true]) {
  console.log(mobile ? '\nMobil (390 px)' : 'Desktop (1280 px)');
  for (const name of PAGES) {
    const { p, ctx, errs } = await open(name, { mobile });
    const where = `${name} ${mobile ? 'mobil' : 'desktop'}`;
    console.log(`• ${name}`);
    await p.waitForTimeout(300);
    if (mobile) await overflow(p, where, 'po načtení');
    for (const lang of ['cs', 'en']) {
      await p.evaluate(l => window.setLang(l), lang);
      if (mobile) await overflow(p, where, `po přepnutí na ${lang}`);
      for (const b of await p.$$('button:not(.langpill button)')) {
        if (!(await b.isVisible()) || !(await b.isEnabled())) continue;
        await b.click({ timeout: 800 }).catch(() => {});
        await p.waitForTimeout(80);
      }
      await p.waitForTimeout(300);
      if (mobile) await overflow(p, where, `po proklikání (${lang})`);
    }
    for (const e of errs) fail(where, `chyba JS: ${e}`);
    await ctx.close();
  }
}

// ── 2) Regrese opravených chyb (v obou jazycích) ─────────────────
console.log('\nRegrese');
async function check(name, what, fn, lang = 'cs') {
  console.log(`• ${name} [${lang}]: ${what}`);
  const o = await open(name, { lang });
  try { const msg = await fn(o.p); if (msg) fail(`${name} [${lang}]`, msg); } catch (e) { fail(`${name} [${lang}]`, e.message); }
  for (const e of o.errs) fail(name, `chyba JS: ${e}`);
  await o.ctx.close();
}
// agent: spusť úkol a vrať text odpovědi + názvy použitých nástrojů
async function agent(p, task) {
  if (task !== null) { await p.fill('#task', task); await p.click('#btnRun'); }
  await p.waitForSelector('.tanswer', { timeout: 8000 });
  return { answer: (await p.textContent('.tanswer')).trim(), tools: (await p.$$eval('.tstep .tool', e => e.map(x => x.textContent))).join(' ') };
}
const XSS = '<img src=x onerror="window.__pwned=1"> 2+2';
const pwned = p => p.evaluate(() => window.__pwned === 1);

const AG = {
  cs: { preset: '40,8', time: ['Kolik je hodin?'], now: 'Teď je', cal: 'kalendář', noCalc: ['Sleva je 20 %', 'nepodařilo přečíst'] },
  en: { preset: '40.8', time: ['What time is it?', 'What is the date today?'], now: 'It is now', cal: 'calendar', noCalc: ['The discount is 20%', "couldn't read"] },
};
for (const lang of ['cs', 'en']) {
  const L = AG[lang];
  await check('18-agents', 'předvolba spustí agenta na SVŮJ úkol', async p => {
    await p.click('#presets button[data-i="0"]');                   // „Kolik je 17 % z 240?"
    const { answer } = await agent(p, null);
    if (!answer.includes(L.preset)) return `čekáno „${L.preset}", odpověď: ${answer}`;
  }, lang);
  for (const q of L.time) await check('18-agents', `„${q}" → kalendář s datem a časem`, async p => {
    const { answer, tools } = await agent(p, q);
    if (!tools.includes(L.cal)) return `nepoužil kalendář (nástroje: ${tools || '—'})`;
    if (!answer.includes(L.now) || !/\d{1,2}:\d{2}/.test(answer)) return `odpověď bez času: ${answer}`;
  }, lang);
  await check('18-agents', 'nepřečtený výpočet → přiznání, ne „Výsledek je ?"', async p => {
    const { answer } = await agent(p, L.noCalc[0]);
    if (!answer.includes(L.noCalc[1])) return `odpověď: ${answer}`;
  }, lang);
}
await check('18-agents', 'HTML v úkolu se escapuje (žádný vložený prvek, žádný handler)', async p => {
  await agent(p, XSS);
  if (await p.$('#trace img')) return 'v trase se vykreslil vložený <img>';
  if (await pwned(p)) return 'spustil se vložený onerror';
  if (!(await p.textContent('#trace')).includes('<img')) return 'text úkolu se v trase neukázal jako text';
});
await check('13-embeddingy', 'HTML v textu se escapuje (žádný vložený prvek, žádný handler)', async p => {
  await p.fill('#text', XSS); await p.waitForTimeout(200);
  if (await p.$('#tokens img')) return 'v tokenech se vykreslil vložený <img>';
  if (await pwned(p)) return 'spustil se vložený onerror';
});

const RAG = {
  cs: { morph: ['Kde najdu ředitele?', '#4'], tie: 'V kolik otevírá jídelna?', none: 'Jaké je počasí?' },
  en: { morph: ['When does the canteen open?', '#3'], tie: 'Is there vegetarian food?', none: 'What are principalities?' },
};
const ask = async (p, q) => { await p.fill('#q', q); await p.click('#btnAsk');
  return { top: (await p.textContent('.rk .rkdoc')).trim(), pct: (await p.textContent('.rk .rkpct')).trim(), note: (await p.textContent('#noteRag')).trim(),
           color: await p.$eval('#noteRag', e => e.style.color) }; };
for (const lang of ['cs', 'en']) {
  const R = RAG[lang];
  await check('17-rag', 'všechny předvolby najdou dokument se 100 % a ✓', async p => {
    const n = await p.$$eval('#presets button', b => b.length);
    for (let i = 0; i < n; i++) {
      await p.click(`#presets button[data-i="${i}"]`);
      const pct = await p.textContent('.rk .rkpct'), note = await p.textContent('#noteRag');
      if (pct.trim() !== '100 %' || !note.startsWith('✓')) return `předvolba ${i}: ${pct.trim()} / ${note.slice(0, 40)}`;
    }
  }, lang);
  await check('17-rag', `tvar slova: „${R.morph[0]}" → dokument ${R.morph[1]}`, async p => {
    const r = await ask(p, R.morph[0]);
    if (r.top !== R.morph[1] || r.pct === '0 %') return `nejlepší ${r.top} (${r.pct})`;
  }, lang);
  await check('17-rag', 'remíza / slabá shoda → ⚠️, ne ✓', async p => {
    const r = await ask(p, R.tie);
    if (!r.note.startsWith('⚠️')) return `poznámka: ${r.note.slice(0, 50)}`;
  }, lang);
  await check('17-rag', 'nic nenalezeno → žádné ✓; barva poznámky se resetuje', async p => {
    await ask(p, R.tie);
    const r = await ask(p, R.none);
    if (r.note.startsWith('✓')) return `„${R.none}" dostalo ✓ (${r.top} ${r.pct})`;
    await p.fill('#q', ''); await p.click('#btnAsk');
    if (await p.$eval('#noteRag', e => e.style.color)) return 'prázdný dotaz zdědil barvu varování';
  }, lang);
}

// zaujatost: čekáme na konec tréninku (timer === null), ne pevnou pauzu
const trained = p => p.waitForFunction(() => timer === null, null, { timeout: 15000, polling: 100 });
for (const [mode, want, label] of [['biased', 'bad', 'Nespravedlivé'], ['fair', 'ok', 'Férové']])
  await check('19-bias', `${mode === 'biased' ? 'zaujatá' : 'férová'} data → verdikt „${label}" (5 běhů)`, async p => {
    await p.click(`#mode button[data-mode="${mode}"]`); await trained(p);
    for (let i = 0; i < 5; i++) {
      await p.click('#btnNew'); await p.waitForTimeout(50); await trained(p);
      if (!(await p.getAttribute('#verdict', 'class')).includes(want)) return `běh ${i + 1}: jiný verdikt než „${label}"`;
    }
  });

// testovací server: chybějící soubor = 404, server běží dál
{ const r = await fetch(`${BASE}neexistuje.html`); if (r.status !== 404) fail('server', `chybějící soubor vrátil ${r.status}`);
  const ok = await fetch(`${BASE}index.html`); if (ok.status !== 200) fail('server', 'po 404 server neodpovídá'); }

for (const [old, now] of Object.entries(MOVED)) {
  console.log(`• přesměrování ${old} → ${now}`);
  const o = await open(old, { lang: 'en' });
  await o.p.waitForURL(u => u.pathname.endsWith(`/${now}.html`), { timeout: 5000 }).catch(() => {});
  const u = new URL(o.p.url());
  if (!u.pathname.endsWith(`/${now}.html`) || u.searchParams.get('lang') !== 'en') fail(old, `nepřesměrovalo na ${now}.html?lang=en (je ${u.pathname}${u.search})`);
  await o.ctx.close();
}

await browser.close();
server.close();
console.log(failures.length ? `\n✗ ${failures.length} problémů:\n  ${failures.join('\n  ')}` : '\n✓ vše v pořádku');
process.exit(failures.length ? 1 : 0);
