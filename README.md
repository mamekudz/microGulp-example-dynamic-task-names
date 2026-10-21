# Dynamische Tasknamen mit µGulp™

Das Beispiel zeigt aktuelle Release-Metadaten und einen gespeicherten Zähler im Tasknamen. Die Gulp-CLI-Namen SHOW_STATUS und ADVANCE_COUNTER bleiben stabil.

## Start

Node.js ab 22; Dashboard: µGulp™ 1.1.0 und API 0.7.0. Die API ist als lokales Paketarchiv unter vendor/ beigefügt. Das Beispiel ist unabhängig vom übergeordneten Projekt installierbar.

```sh
npm ci --ignore-scripts
npm test
npm run check
npm run demo
```

Im Hauptprojekt öffnet START_EXAMPLE_DYNAMIC_TASK_NAMES das eigene Dashboard. Stop beendet dessen Host. Alternativ dieses Verzeichnis als IDE-Projekt öffnen. microgulp.config.json liefert Projekttitel und das gebündelte Logo.

## Dynamische Werte

`µI18xContext.GetValues()` liest synchron bei jedem Scan aus RELEASES.json und .example-state/status.json. Kein Versionswert wird beim Import eingefroren. Ein Klick auf ADVANCE_COUNTER erhöht den lokalen Zähler und ruft NotifyTasksChanged() auf. SHOW_STATUS schreibt dieselben aktuellen Werte ins Log. Die JSON-Datei example.json steuert Version und Zähler unabhängig:

```json
{"schemaVersion":1,"display":{"version":true,"counter":true}}
```

RELEASES.json bleibt die Versionsquelle. Nach einer bewussten Versionsänderung synchronisiert npm run release:sync Paket und Lockdatei. microgulp.config.json beobachtet Release, Konfiguration und Zähler. Für eine reine CLI-Ausführung ist kein Host nötig. Der Zähler ist eine lokale Demo, keine Mehrprozess-Datenbank; parallele externe CLI-Schreibzugriffe sind nicht vorgesehen. Ungültige Konfiguration oder beschädigter Zustand werden als Fehler gemeldet.

## Version und Prüfungen

Recipe 1.1.0: RELEASES.json ist die einzige Versionsquelle; npm run release:check prüft Paket und Lockdatei. Sechs Tests prüfen Release-Vertrag sowie frische Metadaten, Zähler, ungültige Konfiguration und stabile Exporte. Windows/Node 22 wurde geprüft; eine manuelle IDE-Abnahme und weitere Plattformen stehen aus.

Die bestehenden deutschen/englischen UI-Wörterbücher bleiben erhalten. Weitere Artikel- und Promptübersetzungen erst am Ende. Prompts werden beim Artikel als .src.md mit Quellenhash gepflegt.

## Kurztasten im Dashboard

- `SHOW_STATUS`: Windows/Linux `Ctrl+Shift+F7`, macOS `Cmd+Shift+F7`.
- `ADVANCE_COUNTER`: Windows/Linux `Ctrl+Shift+F11`, macOS `Cmd+Shift+F11`.

Zuerst das µGulp-Dashboard fokussieren. Die Kurztaste startet denselben Task wie ein Klick, einschließlich eines vorhandenen Taskformulars; sie wählt keine Formularwerte vor und sendet das Formular nicht ab. In Texteingabefeldern werden keine Task-Kurztasten ausgelöst. Die Belegungen gelten im Dashboard, nicht IDE-weit. Falls IDE oder Betriebssystem eine Kombination abfangen, lässt sich `µKeyBinding` im Gulpfile ändern. Manche Tastaturen benötigen zusätzlich Fn für Funktionstasten.

```javascript
SHOW_STATUS.µKeyBinding = { key: 'ctrl+shift+F7', mac: 'cmd+shift+F7' };
```

<!-- blog-publication:start -->
Artikel: [Deutsch](https://microgulp.dev/de/blog/dynamic-task-names/)

Weitere Beispiele: [microGulp-Examples](https://github.com/mamekudz/microGulp-Examples).
<!-- blog-publication:end -->
