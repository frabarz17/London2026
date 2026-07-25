# AGENTS.md — London2026

Istruzioni specifiche per agenti AI che lavorano su questo progetto.

## Regola principale

Questo è un file statico unico (`index.html`). **Non introdurre framework, bundler, npm, o dipendenze esterne.** Tutto il CSS e JS è inline nel file. Se aggiungi librerie esterne, usare solo CDN.

## Prima di iniziare qualsiasi sessione

1. Leggere `CLAUDE.md` per il contesto completo
2. Leggere le sezioni rilevanti di `index.html` prima di modificare
3. Verificare lo stato del deploy: `git log --oneline -5`

## Come fare modifiche

**Flusso standard:**
1. Leggere la sezione rilevante di `index.html` prima di modificarla
2. Fare le modifiche con Edit (preferito) o Write
3. Verificare che la struttura HTML sia valida (nessun tag non chiuso, div bilanciati)
4. `git add index.html sw.js && git commit -m "..." && git push`
5. Vercel deploya in ~30 secondi automaticamente

**Non serve:**
- `npm install` o qualsiasi gestore di pacchetti
- Configurare build step
- Installare CLI (gh e vercel sono già installati e autenticati)

## Struttura index.html

Il file è diviso in blocchi logici nell'ordine:
1. `<head>` — meta tag (`viewport-fit=cover` incluso), link font, link manifest
2. `<style>` — tutto il CSS (variabili, componenti, app shell, flight cards, market cards, ticket cards, pill nav, guidami)
3. `<body>` → `.app-header` — header fisso con titolo centrato + `.day-tabs` (popolato da JS)
4. `<body>` → `<main>` — sezioni: `#itinerario-section`, `#info-section`, `#mappa-section`, `#metro-section`, `#biglietti-section`
5. `<body>` → `.bottom-nav` — 5 nav item con icone SVG inline
6. `<script>` — logica app: day tabs, section switching, info pill sub-nav, PLACE_GUIDE + Guidami injection, SW registration

## Bottom nav (5 tab)

| `data-section` | Label | Icona |
|---|---|---|
| `itinerario` | Giorni | calendario |
| `mappa` | Mappa | pin |
| `metro` | Metro | treno |
| `info` | Info | cerchio-i |
| `biglietti` | Biglietti | tag/etichetta |

## Aggiungere una nuova sezione al bottom nav

1. Aggiungere il `div#<nome>-section` dentro `<main>` (con `style="display:none"`)
2. Aggiungere il tab `.nav-item` nel `.bottom-nav` con `data-section="<nome>"` e icona SVG inline
3. Aggiungere `'<nome>'` all'array `sections` nel JS
4. Nessun'altra modifica necessaria — il sistema di switching è generico

## Info section — pill sub-nav

La sezione Info contiene una pill-nav interna con 4 sotto-sezioni. Ogni pill ha `data-sub="<nome>"`, ogni blocco ha `id="info-sub-<nome>"`.

**Struttura HTML:**
```html
<div class="info-pill-nav">
  <button class="info-pill active" data-sub="voli">Voli</button>
  <button class="info-pill" data-sub="supermercati">Supermercati</button>
  <button class="info-pill" data-sub="pratiche">Info Pratiche</button>
  <button class="info-pill" data-sub="altro">Altro</button>
</div>
<div id="info-sub-voli">...</div>
<div id="info-sub-supermercati" style="display:none">...</div>
<div id="info-sub-pratiche" style="display:none">...</div>
<div id="info-sub-altro" style="display:none">...</div>
```

Il JS array `infoSubs` governa il toggle. Per aggiungere una quinta voce: aggiungere la pill + il div + la voce in `infoSubs`.

## Biglietti section

9 `.ticket-card` con link ai PDF in `/Biglietti/<nome>.pdf`. Le card con classe `.vip` hanno bordo rosso (prenotazioni fisse). Per aggiungere un biglietto:
1. Aggiungere il PDF rinominato (senza spazi) nella cartella `Biglietti/`
2. Aggiungere una `.ticket-card` in `#biglietti-section` con il link corretto
3. Aggiungere il path del PDF all'array `ASSETS` in `sw.js`
4. Incrementare la versione cache in `sw.js` (`londra2026-v3`, ecc.)

## Aggiungere luoghi con bottone "Guidami"

Il dizionario `PLACE_GUIDE` nel JS mappa stringhe parziali del `.tl-name` a destinazioni Google Maps.
Per aggiungere un luogo: aggiungere una entry `'Testo nel tl-name': 'Destinazione Google Maps'`.
Mettere le chiavi più specifiche prima di quelle generiche (il `find` si ferma al primo match).

## Sezioni mappa e metro

- Usano `position: fixed; top: calc(46px + env(safe-area-inset-top)); bottom: 0; left: 0; right: 0; z-index: 100` — arrivano fino in fondo, dietro il nav bianco (z-index 200) che le copre
- Se si cambia l'altezza dell'`.app-bar`, aggiornare il valore `top` di queste sezioni
- La sezione metro mostra un `<img>` SVG (1400px width) in un container `overflow: auto`
- La sezione mappa usa un `<iframe>` con la Google My Maps

**⚠️ Bug iOS PWA — non rimuovere il `minHeight` toggle:** in PWA standalone, un `<body>` non scrollabile fa "salire" il nav `position: fixed; bottom: 0`, lasciando una striscia crema sotto. Mappa/metro sono `position: fixed` (niente contenuto in flusso → body non scrollabile), quindi il JS di section-switching imposta `document.body.style.minHeight = '200vh'` quando sono attive, per rendere il body scrollabile e ancorare il nav al fondo reale. Le altre sezioni resettano `minHeight` a `''`.

## PWA — aggiornare il service worker

Versione corrente: `londra2026-v2`. Se si aggiungono nuovi file da cachare:
1. Aggiungere il path all'array `ASSETS` in `sw.js`
2. Incrementare la versione cache: `const CACHE = 'londra2026-v3'`

## iPhone safe area

Il meta viewport include `viewport-fit=cover`. Il `.bottom-nav` usa già `padding-bottom: env(safe-area-inset-bottom, 0px)`. Non rimuovere `viewport-fit=cover` dal meta — senza di esso il padding safe area vale 0.

## Design: cosa usare

- Colori → usare sempre le variabili CSS (`var(--blue)`, `var(--gold)`, ecc.)
- Testi label → `font-family: 'DM Mono', monospace` con `letter-spacing`
- Titoli → `font-family: 'Playfair Display', serif`
- Corpo → `font-family: 'DM Sans', sans-serif`
- Icone → SVG inline monocromatici, mai emoji nella nav
- Per nuovi componenti: seguire il pattern dei `.info-card`, `.tl-item`, `.flight-card`, `.ticket-card`, `.market-card`

## Cosa NON fare

- Non toccare `base-artifact/londra-itinerario.html` (archivio originale)
- Non aggiungere `onclick` inline sui `.day-card` (la navigazione è via `.day-tab`)
- Non modificare il progetto GymBro in `/Users/francescobarzano/claude/GymBro/`
- Non creare file separati per CSS o JS (tutto inline in `index.html`)
- Non usare emoji come icone nella bottom nav (usare SVG)
- Non duplicare bottoni per la stessa funzione
