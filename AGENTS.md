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
4. `git add index.html && git commit -m "..." && git push`
5. Vercel deploya in ~30 secondi automaticamente

**Non serve:**
- `npm install` o qualsiasi gestore di pacchetti
- Configurare build step
- Installare CLI (gh e vercel sono già installati e autenticati)

## Struttura index.html

Il file è diviso in blocchi logici nell'ordine:
1. `<head>` — meta tag, link font, link manifest
2. `<style>` — tutto il CSS (variabili, componenti, app shell, flight cards, guidami)
3. `<body>` → `.app-header` — header fisso con titolo centrato + `.day-tabs` (popolato da JS)
4. `<body>` → `<main>` — sezioni: `#itinerario-section`, `#mappa-section`, `#metro-section`, `#info-section`
5. `<body>` → `.bottom-nav` — 4 nav item con icone SVG inline
6. `<script>` — logica app: day tabs, section switching, PLACE_GUIDE + Guidami injection, SW registration

## Aggiungere una nuova sezione al bottom nav

1. Aggiungere il `div#<nome>-section` dentro `<main>` (con `style="display:none"`)
2. Aggiungere il tab `.nav-item` nel `.bottom-nav` con `data-section="<nome>"` e icona SVG inline
3. Aggiungere `'<nome>'` all'array `sections` nel JS
4. Nessun'altra modifica necessaria — il sistema di switching è generico

## Aggiungere luoghi con bottone "Guidami"

Il dizionario `PLACE_GUIDE` nel JS mappa stringhe parziali del `.tl-name` a destinazioni Google Maps.
Per aggiungere un luogo: aggiungere una entry `'Testo nel tl-name': 'Destinazione Google Maps'`.
Mettere le chiavi più specifiche prima di quelle generiche (il `find` si ferma al primo match).

## Sezioni mappa e metro

- Usano `position: fixed; top: 46px; bottom: 70px; left: 0; right: 0; z-index: 100`
- Se si cambia l'altezza dell'`.app-bar`, aggiornare il valore `top` di queste sezioni
- La sezione metro mostra un `<img>` SVG (1400px width) in un container `overflow: auto`
- La sezione mappa usa un `<iframe>` con la Google My Maps

## PWA — aggiornare il service worker

Se si aggiungono nuovi file da cachare:
1. Aggiungere il path all'array `ASSETS` in `sw.js`
2. Aggiornare la versione cache: `const CACHE = 'londra2026-v2'` (incrementare)

## Design: cosa usare

- Colori → usare sempre le variabili CSS (`var(--blue)`, `var(--gold)`, ecc.)
- Testi label → `font-family: 'DM Mono', monospace` con `letter-spacing`
- Titoli → `font-family: 'Playfair Display', serif`
- Corpo → `font-family: 'DM Sans', sans-serif`
- Icone → SVG inline monocromatici, mai emoji nella nav
- Per nuovi componenti: seguire il pattern dei `.info-card`, `.tl-item`, `.flight-card`

## Cosa NON fare

- Non toccare `base-artifact/londra-itinerario.html` (archivio originale)
- Non aggiungere `onclick` inline sui `.day-card` (la navigazione è via `.day-tab`)
- Non modificare il progetto GymBro in `/Users/francescobarzano/claude/GymBro/`
- Non creare file separati per CSS o JS (tutto inline in `index.html`)
- Non usare emoji come icone nella bottom nav (usare SVG)
- Non duplicare bottoni per la stessa funzione (es. due servizi di tracking → tenerne uno)
