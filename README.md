# Londra 2026 — Il Nostro Viaggio

App PWA per l'itinerario del viaggio di famiglia a Londra.

**29 Luglio – 6 Agosto 2026 · 9 giorni · 8 notti**  
K Hotel Kensington · 2 adulti + 2 bambini (7 e 9 anni)

## Live

**[london2026-ten.vercel.app](https://london2026-ten.vercel.app)**

## Installazione su iPhone

1. Apri il link su **Safari**
2. Tocca **Condividi** (icona quadrato con freccia)
3. Scorri → **"Aggiungi alla schermata Home"**
4. L'app appare sull'home con l'icona Union Jack

Funziona anche **offline** dopo la prima visita.

## Funzionalità

- **Giorni** — selettore orizzontale dei 9 giorni, programma giornaliero completo con bottone "Guidami" su ogni luogo (apre Google Maps in modalità transit)
- **Mappa** — Google My Maps personale con i luoghi del viaggio (embed fullscreen)
- **Metro** — mappa London Underground SVG (Wikipedia), scrollabile e zoomabile
- **Info** — card voli con tracking FlightRadar24, checklist logistica andata/ritorno, informazioni pratiche, prenotazioni, Oyster Card

## Stack

HTML + CSS + JS puro · Nessuna dipendenza · Nessun build step · PWA

## Deploy

Push su `main` → Vercel deploya automaticamente in ~30 secondi.

```bash
git add index.html
git commit -m "messaggio"
git push
```
