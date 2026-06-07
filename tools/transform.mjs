// Mechanický převod původního samostatného demo-HTML na Astro stránku.
// Zachová UNIKÁTNÍ část dema doslovně (CSS, tělo, demo <script>) a nahradí
// jen sdílený chrome <Layout>em. Spouštět: node tools/transform.mjs <src.html> <out.astro>
//
// Robustní díky tomu, že chrome má v každém souboru pevný tvar:
//   - hlavičkový jazykový skript  → obsahuje window.__lang  (je v <head>, nepřenášíme)
//   - přepínač vlajek             → <div class="langpill"> … </div>  (bez vnořeného <div>)
//   - tlačítko zpět               → <a … class="back"> … </a>        (bez vnořeného <a>)
//   - spodní lang-switch skript   → <script> … window.setLang … </script>
//   - TITLES = { cs:"…", en:"…" } → odsud bereme oba titulky
import { readFileSync, writeFileSync } from 'node:fs';

const [src, out] = process.argv.slice(2);
if (!src || !out) { console.error('Použití: node tools/transform.mjs <src.html> <out.astro>'); process.exit(1); }

const html = readFileSync(src, 'utf8');

// Titulky z TITLES mapy spodního skriptu (má obě jazykové verze).
const titleCs = (html.match(/cs:\s*"([^"]*)"/) || [])[1] ?? '';
const titleEn = (html.match(/en:\s*"([^"]*)"/) || [])[1] ?? '';

// Všechny <style> bloky (CSS = raw, braces uvnitř Astru nevadí) → jeden is:global.
const styles = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1].trim()).join('\n\n');

// Tělo.
let body = (html.match(/<body[^>]*>([\s\S]*?)<\/body>/) || [])[1] ?? '';
// Pryč chrome, který dodává Layout:
body = body.replace(/\s*<div class="langpill"[\s\S]*?<\/div>\s*/, '\n');          // přepínač vlajek
body = body.replace(/\s*<a[^>]*class="back"[\s\S]*?<\/a>\s*/, '\n');               // tlačítko zpět
body = body.replace(/<script>(?:(?!<\/script>)[\s\S])*?window\.setLang[\s\S]*?<\/script>/, ''); // spodní skript
body = body.replace(/<style>[\s\S]*?<\/style>/g, '');                              // CSS dáme do hlavičky zvlášť
// Zbylý demo <script> → is:inline (verbatim, žádný bundling → "view source" zůstává).
body = body.replace(/<script>/g, '<script is:inline>');
body = body.trim();

// Kontrola: literální { } v MARKUPU (mimo script/style) by Astro vyložilo jako
// výraz. CSS a JS jsou bezpečné (raw). Nahlásíme, ať víme, jestli je čistý native.
const markupOnly = body.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
const braceCount = (markupOnly.match(/[{}]/g) || []).length;

const astro = `---
import Layout from '../layouts/Layout.astro';
---
<Layout titleCs="${titleCs}" titleEn="${titleEn}" back={true}>
<style is:global>
${styles}
</style>

${body}
</Layout>
`;

writeFileSync(out, astro);
console.log(`→ ${out}`);
console.log(`   titleCs="${titleCs}"  titleEn="${titleEn}"`);
console.log(`   { } v markupu mimo script/style: ${braceCount}${braceCount ? '  ⚠️  (nutné escapovat nebo set:html)' : '  ✓ čistý native'}`);
