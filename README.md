<a id="english"></a>
# Foundations of Artificial Intelligence — interactive demos

🇬🇧 **English** &nbsp;·&nbsp; 🇨🇿 **[Česky ↓](#česky)**

A set of interactive demonstrations in plain HTML/JavaScript that **reveal the principles behind AI step by step** — from bare combinatorics and the limits of brute force to how today's language models represent meaning and context.

The demos are plain HTML/CSS/JS, assembled into self-contained static pages with **[Astro](https://astro.build)**. Visit the **[live site](https://www.saiko.cz/ai/)**, or build from source (see below).

> 🌐 **Bilingual:** the site is in **Czech by default**; switch to **English** with the flags in the top-right corner of any page (your choice is remembered, and `?lang=en` deep-links it).

### 🌐 Live version: **[www.saiko.cz/ai](https://www.saiko.cz/ai/)**

![Overview](images/00-index.png)

---

## How to run it

- **Online:** open **[www.saiko.cz/ai](https://www.saiko.cz/ai/)**.
- **From source:**
  1. Clone this repo.
  2. `make setup` (installs Astro), then `make preview` — serves a local copy at http://localhost:8080.
  3. Click the examples in the overview. Each has a **← BACK** button in the top-left and a 🇨🇿/🇬🇧 language toggle in the top-right.

> Everything runs locally in the browser. For visitor stats the site uses **[GoatCounter](https://www.goatcounter.com)** — anonymous, cookieless page views only: no cookies, no personal data, no cross-site tracking (so no consent banner is needed).

---

## How the series progresses

The examples build on each other — each one solves the limitation of the previous:

| Stage | Examples | What it's about |
|------|----------|-------------|
| 🎲 The space of possibilities and taming it | 01, 02 | Going through every combination is impossible — rules and statistics tame the vast space |
| 🧭 Smart search | 03 | Instead of brute force we search deliberately (BFS, A\*) |
| 📚 Learning from data | 04 | We no longer write rules by hand; the model reads them from text |
| 🧠 Learning to classify | 05, 06 | From a separating line (perceptron) to a curve (neural network) |
| 🖼️ How a computer sees | 07 | An image is a grid of numbers; convolution pulls features (edges) out — the basis of computer vision |
| 🧬 Evolutionary optimization | 08 | We let the solution "evolve" through selection, crossover and mutation |
| ✨ The road to today's LLMs | 09, 10 | How models represent meaning (embeddings) and context (attention) |
| ✍️ How an LLM writes | 11 | Generating text token by token: probabilities, sampling, temperature/top-k/top-p, hallucination |
| 📎 Giving the model sources (RAG) | 12 | Retrieve relevant documents (similarity), then answer from them — fewer hallucinations |
| 🤖 Agents — a model that acts | 13 | Model + memory + tools + planning = agent; a reason→act→observe loop over real tools |
| ⚖️ Data and bias | 14 | Biased training data → a biased model; per-group fairness (builds on 05–06) |
| 🚚 Bonus — optimization in practice | 15 | The travelling salesman problem solved by evolution (joins 01 and 08) |

---

## The examples

### 01 · Binary counter 8×8
[→ open `01-binary-counter.html`](https://www.saiko.cz/ai/01-binary-counter.html)

![Binary counter](images/01.png)

A grid of 64 cells as a single 64-bit number. Click to set bits and press RUN to count up. The remaining-time graph shows why "trying every combination" by brute force **never finishes** — even at thousands of steps per second it's tens of billions of years (longer than the age of the universe). The perfect motivation for why we don't use brute force in AI.

---

### 02 · From randomness to language
[→ open `02-jazyk.html`](https://www.saiko.cz/ai/02-jazyk.html)

![From randomness to language](images/02.png)

Four steps **A–D** as a mini-history of language models: from combinatorially iterated random letters, through statistics (a pseudo-language with syllables) and a dictionary (real words with no meaning) to grammatically correct, meaningful sentences. By gradually adding rules, noise turns into language.

---

### 03 · Pathfinding instead of brute force
[→ open `03-hledani.html`](https://www.saiko.cz/ai/03-hledani.html)

![Pathfinding](images/03.png)

A grid maze (draw walls with the mouse) and a contest of methods: **random walk, greedy, BFS and A\***. You see for yourself how many cells each one explores — and a comparison table shows why brute force gives way to smart search (A\* finds a path as short as BFS but explores orders of magnitude fewer cells).

---

### 04 · Learning from text — a Markov chain
[→ open `04-markov.html`](https://www.saiko.cz/ai/04-markov.html)

![Markov chain](images/04.png)

The first demo of **real learning from data**: the model computes from your text what most often follows what, and generates new text from those probabilities. With the context-order slider you watch gibberish turn into almost-real language — the principle of a "small language model".

---

### 05 · Learning from examples — a perceptron
[→ open `05-perceptron.html`](https://www.saiko.cz/ai/05-perceptron.html)

![Perceptron](images/05.png)

You click two colors of points and the perceptron finds a **separating line** on its own. The neuron diagram above the canvas shows the weights changing live during learning. It demonstrates the difference between "programming a rule" and "letting it be found from data" — and the limit of a linear model (a cross/XOR is too much for it).

---

### 06 · A neural network draws the boundary
[→ open `06-neuronka.html`](https://www.saiko.cz/ai/06-neuronka.html)

![Neural network](images/06.png)

A sequel to #5: a network of neurons (2 → 12 → 12 → 1) handles a **curved** boundary too — a circle, a cross, a spiral. The network diagram colors the connections by their current weights (blue +, red −), so you see the network "rewire" during training. You click in your own data.

---

### 07 · How a computer sees
[→ open `07-vision.html`](https://www.saiko.cz/ai/07-vision.html)

![How a computer sees](images/07.png)

AI isn't only about text — it also handles images, sound and video. How? To a computer an **image is just a grid of numbers** (pixel brightness 0–255). Draw something into the grid (or pick a template) and watch a small **3×3 filter (a convolution)** sweep across it: for each pixel it computes a weighted sum of the neighborhood, pulling out a **feature** — edges, blur, sharpening. Stack thousands of such filters whose values are **learned from data** and you get a **convolutional neural network**, the neural net from example 6 extended to images. And modern **multimodal** models turn an image into the same vectors as words (example 9), so a language model can "see" it.

---

### 08 · Genetic algorithm
[→ open `08-genetika.html`](https://www.saiko.cz/ai/08-genetika.html)

![Genetic algorithm](images/08.png)

A population of random sentences **evolves toward a target** generation by generation through crossover and mutation. It shows how to search for a solution without knowing it — you only need to be able to score how good it is. It links the randomness of examples 1 and 2 with evolution toward meaning.

---

### 09 · Tokenization and embeddings
[→ open `09-embeddingy.html`](https://www.saiko.cz/ai/09-embeddingy.html)

![Tokenization and embeddings](images/09.png)

How an LLM "sees" text: chopping it into **tokens** (with IDs from a vocabulary) and a 2D **map of meaning** where similar words lie close. Including computing with meaning — analogies like **king − man + woman = queen** or **two − one + three = four**, drawn as vectors on the map.

---

### 10 · Attention — what the model looks at
[→ open `10-attention.html`](https://www.saiko.cz/ai/10-attention.html)

![Attention](images/10.png)

Click a word in a sentence and see how much **attention** it pays to the others — as a percentage and color saturation, plus the whole attention map (a matrix). A simplified but vivid visualization of the mechanism behind today's transformers (the architecture behind ChatGPT).

---

### 11 · How an LLM writes — next-token prediction
[→ open `11-token.html`](https://www.saiko.cz/ai/11-token.html)

![How an LLM writes](images/11.png)

Real language models don't blurt out a finished answer — they write it **token by token**. At each step the model computes a probability for every possible next word and **samples** one. This demo shows that step live: a probability bar chart, an editable prompt, and **temperature / top-k / top-p** controls that change how boldly it samples — with a small built-in word model (like the Markov chain in 04) under the hood. It also shows **why models hallucinate**: even when unsure (a flat distribution or an unknown context) the model still confidently picks something. The synthesis of the LLM arc — meaning (09) + context (10) → generation.

---

### 12 · RAG — a model with sources
[→ open `12-rag.html`](https://www.saiko.cz/ai/12-rag.html)

![RAG — a model with sources](images/12.png)

A language model only knows what it learned during training — and sounds confident even when it doesn't. **RAG** (retrieval-augmented generation) fixes this: faced with a question, the model first **retrieves** the most relevant document from a knowledge base (by similarity — the embeddings idea from 09) and then answers **from it**. The demo puts the two answers side by side: the model **alone** (it guesses and hallucinates the made-up facts) vs **model + RAG** (it ranks the documents by similarity, attaches the best one, and gives a grounded, source-backed answer). RAG is by far the most common real-world way to deploy an LLM over your own data.

---

### 13 · Agents — a model that acts
[→ open `13-agents.html`](https://www.saiko.cz/ai/13-agents.html)

![Agents — a model that acts](images/13.png)

So far the model only **wrote text**. An **agent** is the equation **model + memory + tools + planning**: given a task, it runs a **reason → act → observe** loop — it decides which tool to call (a calculator, search over a knowledge base, a calendar, send-email), calls it, remembers the result, and plans the next step, repeating until the task is done. The demo shows the full trace and includes a **multi-step** task ("find the Wi-Fi password and email it") where the agent chains *search → email*, carrying the result in memory. The tools really run and the loop is real; the "reasoning" is an illustrative keyword planner. It ties the whole series together — and it's the direction AI took in 2026 (tool use / MCP). With autonomy comes the need for limits and human oversight.

---

### 14 · Biased data, biased model
[→ open `14-bias.html`](https://www.saiko.cz/ai/14-bias.html)

![Biased data, biased model](images/14.png)

The classifiers in 05–06 learn from data — so **what happens when the data is biased?** The same perceptron is trained on either fair or biased historical decisions. With fair data the decision boundary is vertical (only qualification matters); with biased data — where one group was historically held to a higher bar — the boundary **tilts**, and equally qualified people from that group get rejected. A per-group acceptance-rate readout makes the unfairness explicit. The model never "meant" to discriminate; it just faithfully copied the pattern in the data — which is exactly why bias in AI is so easy to miss. Applies to LLMs too.

---

### 15 · The travelling salesman problem (TSP) — bonus
[→ open `15-tsp.html`](https://www.saiko.cz/ai/15-tsp.html) · [app ↗](https://saiko.cz/tsp/) · [source code ↗](https://github.com/dsaiko/tsp)

![Travelling salesman problem](images/15.png)

A bonus card with an embedded older project: a **TSP visualizer that solves the shortest route through all the cities with a genetic algorithm** right in the browser. It joins two principles of this series — **combinatorial explosion** (there are `(n−1)!/2` routes, going through them all is impossible) and **evolution** (a population of routes crosses over and mutates toward better ones), plus the **2-opt** heuristic (uncrossing edges). Built in TypeScript + Canvas + Web Workers, 12 maps including real Czech cities. It's a modernized rewrite of the original Java app from 2006.

---

## Implementation notes

- **Self-contained output** — built with [Astro](https://astro.build) from `.astro` sources in `src/pages/`; each generated page is a single `.html` with **inline CSS and JS and no external assets**, so it works under any sub-path and even via `file://`. Shared chrome (language toggle, back button, base styles) lives once in `src/layouts/Layout.astro`, and the overview is generated from a single data list — adding an example is one entry plus one `.astro` file.
- **Bilingual in one file** — Czech and English content live side by side; a flag toggle (top-right) switches them instantly with no reload, and the choice is saved to `localStorage`. You can deep-link a language with `?lang=en` / `?lang=cs`.
- **Exact arithmetic** — the counter in example 1 uses `BigInt`, because a normal JS number is only exact up to 53 bits.
- **From-scratch implementations** — the neural network (incl. backpropagation), the Markov chain, A\*/BFS, the genetic algorithm, convolution and attention are all written from the ground up, without ML libraries, so the principle is visible in the code.
- Examples 09 and 10 are **simplified illustrations** of the mechanisms (embeddings projected into 2D, illustrative attention), not trained models — they're meant to convey the principle.

---

## Deployment

The site is static; it's deployed to S3 + CloudFront via the `Makefile` (configuration in `Makefile.local`, outside git):

```bash
make setup              # install dependencies (Astro), one-off
make build              # astro build: src/pages/*.astro → dist/
make preview            # local preview at http://localhost:8080
make deploy             # build → sync to S3 → CloudFront invalidation
make deploy-s3-dryrun   # deploy dry run
```

---

*SSST 2026 · ICT / AI · [www.saiko.cz/ai](https://www.saiko.cz/ai/)*

---

<a id="česky"></a>
# Základy umělé inteligence — interaktivní ukázky

🇨🇿 **Česky** &nbsp;·&nbsp; 🇬🇧 **[English ↑](#english)**

Sada interaktivních demonstrací v čistém HTML/JavaScriptu, které **krok po kroku odhalují principy za AI** — od holé kombinatoriky a hranic hrubé síly až po to, jak dnešní jazykové modely reprezentují význam a kontext.

Dema jsou čisté HTML/CSS/JS, poskládaná do soběstačných statických stránek pomocí **[Astro](https://astro.build)**. Otevři **[živou verzi](https://www.saiko.cz/ai/)**, nebo si web sestav ze zdrojů (níže).

> 🌐 **Dvojjazyčné:** web je **výchozí v češtině**; na **angličtinu** přepneš vlajkami v pravém horním rohu každé stránky (volba se pamatuje, případně ji nastaví `?lang=en`).

### 🌐 Živá verze: **[www.saiko.cz/ai](https://www.saiko.cz/ai/)**

![Rozcestník](images/00-index.png)

---

## Jak to spustit

- **Online:** otevři **[www.saiko.cz/ai](https://www.saiko.cz/ai/)**.
- **Ze zdrojů:**
  1. Naklonuj repozitář.
  2. `make setup` (nainstaluje Astro), pak `make preview` — spustí lokální kopii na http://localhost:8080.
  3. Klikej v rozcestníku na jednotlivé příklady. Každý má vlevo nahoře tlačítko **← ZPĚT** a vpravo nahoře přepínač jazyka 🇨🇿/🇬🇧.

> Vše běží lokálně v prohlížeči. Pro statistiku návštěvnosti web používá **[GoatCounter](https://www.goatcounter.com)** — jen anonymní, bezcookie zobrazení stránek: žádné cookies, žádná osobní data, žádné sledování napříč weby (proto bez lišty na souhlas).

---

## Jak série postupuje

Příklady na sebe navazují — každý vyřeší hranici toho předchozího:

| Etapa | Příklady | O čem to je |
|------|----------|-------------|
| 🎲 Prostor možností a jeho zkrocení | 01, 02 | Projít všechny kombinace nejde — pravidla a statistika obří prostor krotí |
| 🧭 Chytré hledání | 03 | Místo hrubé síly prohledáváme cíleně (BFS, A\*) |
| 📚 Učení z dat | 04 | Pravidla už nepíšeme ručně, model si je vyčte z textu |
| 🧠 Učení klasifikace | 05, 06 | Od dělicí přímky (perceptron) ke křivce (neuronová síť) |
| 🖼️ Jak počítač vidí | 07 | Obrázek je mřížka čísel; konvoluce z nich vytáhne rysy (hrany) — základ počítačového vidění |
| 🧬 Evoluční optimalizace | 08 | Řešení necháme „vyvinout" výběrem, křížením a mutací |
| ✨ Cesta k dnešním LLM | 09, 10 | Jak modely reprezentují význam (embeddingy) a kontext (attention) |
| ✍️ Jak LLM píše | 11 | Generování textu token po tokenu: pravděpodobnosti, vzorkování, teplota/top-k/top-p, halucinace |
| 📎 Dát modelu zdroje (RAG) | 12 | Vyhledá relevantní dokumenty (podobnost) a odpoví z nich — méně halucinací |
| 🤖 Agenti — model, který jedná | 13 | Model + paměť + nástroje + plánování = agent; smyčka úvaha→akce→pozorování nad nástroji |
| ⚖️ Data a zaujatost | 14 | Zaujatá trénovací data → zaujatý model; spravedlnost po skupinách (navazuje na 05–06) |
| 🚚 Bonus — optimalizace v praxi | 15 | Problém obchodního cestujícího řešený evolucí (spojuje 01 a 08) |

---

## Příklady

### 01 · Binární počítadlo 8×8
[→ otevřít `01-binary-counter.html`](https://www.saiko.cz/ai/01-binary-counter.html)

![Binární počítadlo](images/01.png)

Mřížka 64 polí jako jedno 64bitové číslo. Klikáním nastavíš bity a tlačítkem RUN je necháš přičítat. Graf zbývajícího času ukazuje, proč „projít všechny kombinace" hrubou silou **nikdy nedoběhne** — i při tisících kroků za sekundu jde o desítky miliard let (víc než stáří vesmíru). Ideální motivace, proč v AI hrubou silu nepoužíváme.

---

### 02 · Od náhody k jazyku
[→ otevřít `02-jazyk.html`](https://www.saiko.cz/ai/02-jazyk.html)

![Od náhody k jazyku](images/02.png)

Čtyři kroky **A–D** jako mini-historie jazykových modelů: od kombinatoricky iterovaných náhodných písmen, přes statistiku (pseudojazyk se slabikami) a slovník (skutečná slova bez smyslu) až po gramaticky správné, smysluplné věty. Postupným přidáváním pravidel se z šumu stává jazyk.

---

### 03 · Hledání cesty místo hrubé síly
[→ otevřít `03-hledani.html`](https://www.saiko.cz/ai/03-hledani.html)

![Hledání cesty](images/03.png)

Bludiště na mřížce (zdi kreslíš myší) a souboj postupů: **náhodné tápání, hladový, BFS a A\***. Vidíš na vlastní oči, kolik políček každý prozkoumá — a srovnávací tabulka ukáže, proč se hrubá síla nahrazuje chytrým prohledáváním (A\* najde stejně krátkou cestu jako BFS, ale prozkoumá řádově méně).

---

### 04 · Učení z textu — Markovův řetězec
[→ otevřít `04-markov.html`](https://www.saiko.cz/ai/04-markov.html)

![Markovův řetězec](images/04.png)

První ukázka **skutečného učení z dat**: model si z vloženého textu spočítá, co po čem nejčastěji následuje, a podle těch pravděpodobností generuje nový text. Posuvníkem řádu kontextu uvidíš, jak z blábolu vzniká skoro čeština — princip „malého jazykového modelu".

---

### 05 · Učení z příkladů — perceptron
[→ otevřít `05-perceptron.html`](https://www.saiko.cz/ai/05-perceptron.html)

![Perceptron](images/05.png)

Naklikáš dvě barvy bodů a perceptron sám hledá **dělicí přímku**. Schéma neuronu nad plochou ukazuje živě se měnící váhy během učení. Demonstruje rozdíl mezi „naprogramovat pravidlo" a „nechat ho najít z dat" — i hranici lineárního modelu (na kříž/XOR nestačí).

---

### 06 · Neuronová síť kreslí hranici
[→ otevřít `06-neuronka.html`](https://www.saiko.cz/ai/06-neuronka.html)

![Neuronová síť](images/06.png)

Pokračování pětky: síť neuronů (2 → 12 → 12 → 1) zvládne i **zakřivenou** hranici — kruh, kříž, spirálu. Schéma sítě barví spoje podle aktuálních vah (modrá +, červená −), takže vidíš, jak se síť během tréninku „přepojuje". Vlastní data si naklikáš sám.

---

### 07 · Jak počítač vidí
[→ otevřít `07-vision.html`](https://www.saiko.cz/ai/07-vision.html)

![Jak počítač vidí](images/07.png)

AI není jen o textu — zvládá i obrázky, zvuk a video. Jak? Pro počítač je **obrázek jen mřížka čísel** (jas pixelu 0–255). Nakresli něco do mřížky (nebo zvol předlohu) a sleduj, jak po ní přejíždí malý **filtr 3×3 (konvoluce)**: pro každý pixel spočítá vážený součet okolí a vytáhne tak určitý **rys** — hrany, rozmazání, zaostření. Navrstvením tisíců takových filtrů, jejichž hodnoty se síť **naučí z dat**, vznikne **konvoluční neuronová síť** — neuronka z příkladu 6 rozšířená na obrázky. A moderní **multimodální** modely převedou obrázek na stejné vektory jako slova (příklad 9), takže ho jazykový model „vidí".

---

### 08 · Genetický algoritmus
[→ otevřít `08-genetika.html`](https://www.saiko.cz/ai/08-genetika.html)

![Genetický algoritmus](images/08.png)

Populace náhodných vět se křížením a mutací generaci po generaci **vyvíjí k cíli**. Ukazuje, jak hledat řešení, aniž bychom ho znali — stačí umět ohodnotit, jak je dobré. Propojuje náhodu z příkladů 1 a 2 s evolucí směrem ke smyslu.

---

### 09 · Tokenizace a embeddingy
[→ otevřít `09-embeddingy.html`](https://www.saiko.cz/ai/09-embeddingy.html)

![Tokenizace a embeddingy](images/09.png)

Jak LLM „vidí" text: rozsekání na **tokeny** (s ID ze slovníku) a 2D **mapa významů**, kde podobná slova leží blízko. Včetně počítání s významy — analogie jako **král − muž + žena = královna** nebo **dva − jedna + tři = čtyři**, vykreslené jako vektory na mapě.

---

### 10 · Attention — na co se model dívá
[→ otevřít `10-attention.html`](https://www.saiko.cz/ai/10-attention.html)

![Attention](images/10.png)

Klikni na slovo ve větě a uvidíš, kolik **pozornosti** věnuje ostatním — jako procenta a sytost barvy, plus celá mapa pozornosti (matice). Zjednodušená, ale názorná vizualizace mechanismu, na kterém stojí dnešní transformery (architektura za ChatGPT).

---

### 11 · Jak LLM píše — predikce dalšího tokenu
[→ otevřít `11-token.html`](https://www.saiko.cz/ai/11-token.html)

![Jak LLM píše](images/11.png)

Skutečné jazykové modely nevyhrknou hotovou odpověď — píšou ji **token po tokenu**. V každém kroku spočítají pravděpodobnost pro každé možné další slovo a jedno **losují**. Ukázka to zobrazí naživo: sloupcový graf pravděpodobností, editovatelný začátek věty a ovládání **teploty / top-k / top-p**, které mění, jak odvážně model losuje — pod kapotou běží malý slovní model (jako Markov ve 4). Zároveň ukazuje, **proč modely halucinují**: i když si není jistý (ploché rozdělení nebo neznámý kontext), model stejně sebevědomě něco vybere. Vyvrcholení linie o LLM — význam (09) + kontext (10) → generování.

---

### 12 · RAG — model se zdroji
[→ otevřít `12-rag.html`](https://www.saiko.cz/ai/12-rag.html)

![RAG — model se zdroji](images/12.png)

Jazykový model umí jen to, co se naučil při tréninku — a tváří se sebejistě, i když něco neví. **RAG** (vyhledáním rozšířená generace) to řeší: na otázku model nejdřív **vyhledá** nejrelevantnější dokument ze znalostní báze (podle podobnosti — princip embeddingů z 09) a teprve pak odpoví **z něj**. Ukázka staví obě odpovědi vedle sebe: **jen model** (tipne si a vymyšlené údaje halucinuje) vs **model + RAG** (seřadí dokumenty podle podobnosti, ten nejlepší přiloží a dá odpověď podloženou zdrojem). RAG je dnes zdaleka nejčastější způsob, jak nasadit LLM nad vlastní data.

---

### 13 · Agenti — model, který jedná
[→ otevřít `13-agents.html`](https://www.saiko.cz/ai/13-agents.html)

![Agenti — model, který jedná](images/13.png)

Dosud model jen **psal text**. **Agent** je rovnice **model + paměť + nástroje + plánování**: dostane úkol a běží ve smyčce **úvaha → akce → pozorování** — sám se rozhodne, který nástroj zavolat (kalkulačka, vyhledávání ve znalostní bázi, kalendář, odeslání e-mailu), zavolá ho, výsledek si zapamatuje a naplánuje další krok, dokud úkol nesplní. Ukázka zobrazí celou trasu a obsahuje i **vícekrokový** úkol („zjisti heslo na Wi-Fi a pošli ho e-mailem"), kde agent zřetězí *vyhledání → e-mail* a mezivýsledek si nese v paměti. Nástroje opravdu běží a smyčka je reálná; „uvažování" je ukázkový plánovač podle klíčových slov. Spojuje celou sérii dohromady — a je to směr, kterým se AI vydala v roce 2026 (tool use / MCP). S autonomií roste i potřeba limitů a lidského dohledu.

---

### 14 · Zaujatá data, zaujatý model
[→ otevřít `14-bias.html`](https://www.saiko.cz/ai/14-bias.html)

![Zaujatá data, zaujatý model](images/14.png)

Klasifikátory z 05–06 se učí z dat — a **co když jsou data zaujatá?** Stejný perceptron se natrénuje buď na férových, nebo na zaujatých historických rozhodnutích. U férových dat je dělicí hranice svislá (rozhoduje jen kvalifikace); u zaujatých — kde jedna skupina musela historicky splnit víc — se hranice **nakloní** a stejně kvalifikovaní lidé z té skupiny neprojdou. Míra přijetí po skupinách dělá nespravedlnost viditelnou. Model nikdy „nechtěl" diskriminovat; jen věrně zopakoval vzor z dat — a právě proto se zaujatost v AI tak snadno přehlédne. Týká se i LLM.

---

### 15 · Problém obchodního cestujícího (TSP) — bonus
[→ otevřít `15-tsp.html`](https://www.saiko.cz/ai/15-tsp.html) · [aplikace ↗](https://saiko.cz/tsp/) · [zdrojový kód ↗](https://github.com/dsaiko/tsp)

![Problém obchodního cestujícího](images/15.png)

Bonusová karta s vloženým starším projektem: **vizualizér TSP řešící nejkratší trasu přes všechna města genetickým algoritmem** přímo v prohlížeči. Spojuje dva principy z této série — **kombinatorickou explozi** (tras je `(n−1)!/2`, projít všechny nejde) a **evoluci** (populace tras se kříží a mutuje k lepšímu), doplněnou o heuristiku **2-opt** (odkřížení hran). Postaveno v TypeScriptu + Canvas + Web Workers, 12 map včetně reálných českých měst. Je to modernizovaný přepis původní Java aplikace z roku 2006.

---

## Poznámky k implementaci

- **Soběstačný výstup** — generováno [Astrem](https://astro.build) ze zdrojů `.astro` v `src/pages/`; každá vygenerovaná stránka je jeden `.html` s **inline CSS i JS a bez externích assetů**, takže funguje pod libovolnou pod-cestou i přes `file://`. Sdílený chrome (přepínač jazyka, tlačítko zpět, základní styly) je jednou v `src/layouts/Layout.astro` a rozcestník se generuje z jediného datového seznamu — přidání příkladu je jeden záznam plus jeden `.astro` soubor.
- **Dvojjazyčné v jednom souboru** — česká i anglická verze jsou vedle sebe; přepínač s vlajkami (vpravo nahoře) je přepne okamžitě bez načítání stránky a volba se uloží do `localStorage`. Jazyk lze předvolit i přes `?lang=en` / `?lang=cs`.
- **Přesná aritmetika** — počítadlo v příkladu 1 používá `BigInt`, protože běžné JS číslo je přesné jen do 53 bitů.
- **Vlastní implementace** — neuronová síť (vč. backpropagation), Markovův řetězec, A\*/BFS, genetický algoritmus, konvoluce i attention jsou napsané od základu, bez ML knihoven, aby šel princip vidět v kódu.
- Ukázky 09 a 10 jsou **zjednodušené ilustrace** mechanismů (embeddingy promítnuté do 2D, ilustrativní attention), ne natrénované modely — slouží k pochopení principu.

---

## Nasazení

Web je statický, nasazuje se na S3 + CloudFront pomocí `Makefile` (konfigurace v `Makefile.local`, mimo git):

```bash
make setup              # instalace závislostí (Astro), jednorázově
make build              # astro build: src/pages/*.astro → dist/
make preview            # lokální náhled na http://localhost:8080
make deploy             # build → sync na S3 → invalidace CloudFront
make deploy-s3-dryrun   # zkouška deploye nanečisto
```

---

*SSST 2026 · ICT / AI · [www.saiko.cz/ai](https://www.saiko.cz/ai/)*
