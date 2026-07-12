# JARVIS HUD

Interfaccia animata stile Iron Man per un assistente IA personale: anelli HUD rotanti, core pulsante e un anello reattivo che risponde al microfono (o "respira" in modalit&agrave; simulata se il microfono non &egrave; attivo).

## Uso

Apri `index.html` in un browser (o serviilo con un server statico qualsiasi, es. `python3 -m http.server`).

- **ATTIVA MICROFONO**: chiede il permesso al microfono e l'anello reagisce in tempo reale al volume/frequenze rilevate.
- Senza microfono l'animazione resta comunque viva con un movimento simulato.

## Struttura

- `index.html` — markup e overlay HUD (header, telemetria, pulsante microfono)
- `style.css` — tema scuro/cyan, scanlines, effetti glow
- `script.js` — rendering su `<canvas>`: anelli, tacche, radar sweep, core pulsante, anello audio-reattivo (Web Audio API), telemetria simulata

Nessuna dipendenza esterna: HTML/CSS/JS puro.
