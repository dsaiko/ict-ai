// Původní adresy před přečíslováním série (v2) → nové adresy.
// Jediný zdroj: čte ho src/pages/[stara].astro (generuje přesměrovací stránky)
// i tests/smoke.mjs (ověří každé přesměrování).
export const MOVED = {
  '04-markov': '05-markov', '05-perceptron': '06-perceptron', '06-neuronka': '08-neuronka',
  '07-vision': '10-vision', '08-genetika': '04-genetika', '09-embeddingy': '13-embeddingy',
  '10-attention': '14-attention', '11-token': '15-token', '12-rag': '17-rag',
  '13-agents': '18-agents', '14-bias': '19-bias', '15-tsp': '20-tsp',
};
