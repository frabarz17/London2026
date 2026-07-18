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
- **`.app-header` (fixed top):** barra blu con titolo "Londra 2026" centrato e selettore giorni scrollabile `.day-tabs`
- **`<main>`:** contenuto delle sezioni (vedi sotto)
- **`.bottom-nav` (fixed bottom):** 4 tab di navigazione con icone SVG monocromatiche

### Header
- Solo titolo centrato — niente date range, niente info volo/hotel
- `.day-tabs` con tab rettangolari (border-radius 5px), bordo bianco traslucido, numeri grandi, active = oro pieno
- `.day-tabs` viene nascosto via JS quando si naviga su sezioni non-itinerario

### Sezioni principali (gestite da JS)
Ogni sezione è un `div` con `id="<nome>-section"`, visibile/nascosta via `style.display`:

| ID sezione | Tab | Stato |
|---|---|---|
| `itinerario-section` | Giorni | ✅ 9 day card con bottoni Guidami |
| `mappa-section` | Mappa | ✅ Google My Maps embed fullscreen |
| `metro-section` | Metro | ✅ SVG tube map Wikipedia scrollabile |
| `info-section` | Info | ✅ Voli, prenotazioni, Oyster, info pratiche |

Le sezioni `#mappa-section` e `#metro-section` usano `position: fixed; top: 46px; bottom: 70px` per riempire correttamente l'area senza i day-tabs.

### Day cards
9 `.day-card` nell'ordine: giorni 1–9 (29 Lug → 6 Ago).
- Di default nascosti (`display: none`)
- Solo quello con classe `.active` è visibile
- La selezione è gestita da JS con `selectDay(index)` (0-based)
- Auto-selezione: se la data odierna è nel range del viaggio, seleziona il giorno corretto

### Bottone "Guidami"
Auto-iniettato via JS su tutti i `.tl-name` che matchano il dizionario `PLACE_GUIDE` (circa 35 luoghi fisici). Apre Google Maps con `destination=<place>&travelmode=transit`. Skip automatico di voli, transfer, hotel.

### Dati giorni (in JS)
```js
const DAYS = [
  { n: 1, date: '29/7' }, // Arrivo a Londra
  { n: 2, date: '30/7' }, // Science Museum, Hyde Park, Notting Hill
  { n: 3, date: '31/7' }, // Harry Potter Warner Studios (prenotato 10:30)
  { n: 4, date: '1/8'  }, // Westminster, Big Ben, London Eye, National Gallery
  { n: 5, date: '2/8'  }, // British Museum, Carnaby, Covent Garden, Hard Rock
  { n: 6, date: '3/8'  }, // Tower of London, Tower Bridge, HMS Belfast
  { n: 7, date: '4/8'  }, // Madame Tussauds (prenotato 10:00), Oxford Street
  { n: 8, date: '5/8'  }, // Greenwich o Camden + SEA LIFE Aquarium (prenotato 15:30)
  { n: 9, date: '6/8'  }, // Mattina libera → Partenza LGW→MXP 15:45
];
```

## Voli

- **Andata:** EZY8304 · MXP T2 10:30 → LGW Terminal Nord 11:30 · 29 Lug
- **Ritorno:** EJU8149 · LGW Terminal Nord 15:45 → MXP T2 18:45 · 6 Ago
- Compagnia: easyJet
- Tracking: FlightRadar24 (`/data/flights/ezy8304` e `/data/flights/eju8149`)
- Avviso importante: Gatwick Express arriva a Terminal Sud → prendere navetta People Mover per Terminal Nord

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

**Icone bottom nav:** SVG inline monocromatici (grigio a riposo, blu attivo). Non usare emoji.

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
git add index.html
git commit -m "descrizione"
git push   # → Vercel auto-deploya
```

`base-artifact/londra-itinerario.html` è solo un archivio — non va committato o toccato.
