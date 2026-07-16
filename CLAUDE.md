# CLAUDE.md — London2026

Contesto per Claude Code. Leggere prima di qualsiasi modifica.

## Cos'è questo progetto

PWA statica (HTML/CSS/JS puro, zero framework, zero build step) che funge da app di viaggio per una vacanza familiare a Londra, 29 Luglio – 6 Agosto 2026. 2 adulti + 2 bambini (7 e 9 anni). Hotel: K Hotel Kensington.

Pubblicata su GitHub e deployata su Vercel con auto-deploy su ogni push a `main`.

## Deployment

- **GitHub:** https://github.com/frabarz17/London2026
- **Vercel (prod):** https://london2026-ten.vercel.app
- **Vercel project:** `fra-barz/london2026` (ID: `prj_b4rljYrOAIVB6VhtGGCBN05Kc0nG`)
- **Workflow deploy:** `git add` → `git commit` → `git push` → Vercel deploya in automatico (~30s)
- **Non serve nessun build step.** Vercel serve i file statici così com'è.

## Struttura file

```
London2026/
├── index.html          ← tutta l'app (HTML + CSS + JS inline)
├── manifest.json       ← PWA manifest
├── sw.js               ← service worker (cache offline)
├── vercel.json         ← config Vercel (cleanUrls, no trailing slash)
├── icons/
│   ├── icon-180x180.png   ← apple-touch-icon (iPhone)
│   ├── icon-192x192.png   ← PWA icon standard
│   └── icon-512x512.png   ← splash screen
└── base-artifact/
    └── londra-itinerario.html  ← originale da cui tutto è partito (non toccare)
```

## Struttura dell'app (index.html)

### Layout fisso
- **`.app-header` (fixed top):** barra blu con titolo "Londra 2026", info volo compatte, e il selettore giorni scrollabile `.day-tabs`
- **`<main>`:** contenuto delle sezioni (vedi sotto)
- **`.bottom-nav` (fixed bottom):** 4 tab di navigazione

### Sezioni principali (gestite da JS)
Ogni sezione è un `div` con `id="<nome>-section"`, visibile/nascosta via `style.display`:

| ID sezione | Tab | Stato |
|---|---|---|
| `itinerario-section` | 📅 Giorni | ✅ Implementata |
| `info-section` | ℹ️ Info | ✅ Contenuto presente (Oyster, prenotazioni) |
| `mappa-section` | 🗺️ Mappa | 🔲 Placeholder "coming soon" |
| `budget-section` | 💰 Budget | 🔲 Placeholder "coming soon" |

### Day cards
9 `.day-card` nell'ordine: giorni 1–9 (29 Lug → 6 Ago).
- Di default nascosti (`display: none`)
- Solo quello con classe `.active` è visibile (e il `.day-body` è sempre aperto)
- La selezione è gestita da JS con `selectDay(index)` (0-based)
- Auto-selezione: se la data odierna è nel range del viaggio, seleziona il giorno corretto

### Dati giorni (in JS)
```js
const DAYS = [
  { n: 1, date: '29/7' }, // Arrivo a Londra
  { n: 2, date: '30/7' }, // South Kensington (Science Museum, Hyde Park)
  { n: 3, date: '31/7' }, // Harry Potter Warner Studios (prenotato 10:30)
  { n: 4, date: '1/8'  }, // Westminster, Big Ben, London Eye, National Gallery
  { n: 5, date: '2/8'  }, // British Museum, Carnaby, Covent Garden, Hard Rock
  { n: 6, date: '3/8'  }, // Tower of London, Tower Bridge, HMS Belfast
  { n: 7, date: '4/8'  }, // Madame Tussauds (prenotato 10:00), Oxford Street
  { n: 8, date: '5/8'  }, // Greenwich o Camden + SEA LIFE Aquarium (prenotato 15:30)
  { n: 9, date: '6/8'  }, // Mattina libera → Partenza LGW→MXP 15:45
];
```

## Design system

```css
--red:   #C8102E   /* British red */
--blue:  #012169   /* Royal blue */
--gold:  #C5A028   /* Gold accent */
--cream: #FAF7F2   /* Background */
--ink:   #1A1A1A   /* Text principale */
--muted: #6B6B6B   /* Text secondario */
--light: #F0EDE8   /* Superfici chiare */
```

**Font (Google Fonts CDN):**
- `Playfair Display` — titoli (serif, elegante)
- `DM Sans` — corpo testo
- `DM Mono` — etichette, codici, monospace UI

**Icone nei timeline dot:**
- `.tl-dot` default → attrazione/visita (blue)
- `.tl-dot.red` → evento prenotato/fisso
- `.tl-dot.gold` → pasto consigliato
- `.tl-dot.star` → logistica/transfer

## PWA

Installabile su iPhone via Safari → Condividi → "Aggiungi alla schermata Home".
Il service worker (`sw.js`) fa cache di tutti gli asset per funzionamento offline.
Cache key: `londra2026-v1` — aggiornare la versione in `sw.js` se si modificano asset critici.

## Git

```bash
# Workflow standard
git add <file>
git commit -m "descrizione"
git push   # → Vercel auto-deploya
```

`base-artifact/londra-itinerario.html` è solo un archivio — non va committato o toccato.

## Funzionalità future pianificate (bottom nav)

- **🗺️ Mappa:** mappa interattiva con i luoghi del viaggio (Google Maps embed o Leaflet)
- **💰 Budget:** tracker spese giornaliero (localStorage per persistenza)
- Entrambe attualmente mostrano un placeholder "coming soon"
