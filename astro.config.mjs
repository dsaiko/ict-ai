import { defineConfig } from 'astro/config';

// POC migrace statických AI-ukázek na Astro.
// build.format: 'file' zachová ploché .html URL (08-genetika.html, ne
// 08-genetika/index.html) — stávající relativní odkazy mezi stránkami
// i deploy na S3 (make deploy) tak fungují beze změny.
export default defineConfig({
  build: {
    format: 'file',
    // Vlož CSS zpátky inline do každé stránky → soběstačný .html jako dřív
    // (žádné /_astro/*.css s absolutní cestou, která by se pod /ai/ rozbila;
    // funguje i přes file:// a "view source" ukáže všechno).
    inlineStylesheets: 'always',
  },
  // Žádný runtime JS navíc: dema mají vlastní inline <script is:inline>,
  // Astro samo neposílá nic, dokud nepoužiješ client:* direktivu.
});
