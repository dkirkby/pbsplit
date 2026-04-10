# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Pickleball Split-Step Trainer** — a mobile-responsive single-page web app that trains split-step timing and reaction movements using synchronized visual and audio cues. Intended for on-court use on a phone or tablet.

## Delivery Constraints

- **Single self-contained HTML file** — no build step, no npm, no bundler
- Vanilla JavaScript, HTML, CSS only; no frameworks
- All SVGs must be embedded inline (inline `VectorBoot.svg`)
- Tailwind only via CDN if needed; plain CSS preferred
- Must run in current mobile Safari and Chrome without a server

There are no build, lint, or test commands — open the HTML file directly in a browser to develop and test.

## Specification

`SPEC.md` is the authoritative implementation spec. Read it before making any changes. Key sections:

- **§7 State Model**: explicit state machine — states `setup → ready → running → stopped`; per-rep phases `idleWait → anticipation → preSplit → impact → reaction → reset`
- **§8 Timing Parameters**: `minWait`, `maxWait`, `shrinkDuration`, `preSplitBuffer` are user-configurable; `reactionDelay=0.10s`, `resetDelay=1.50s` are fixed
- **§10 Movement Definitions**: neutral stance coordinates, split-step offsets, and 5 named reaction movements (A–E) are all specified as pixel values — implement these as named constants
- **§14 Scheduling**: use explicit JS timers for all phase transitions; store all timer IDs so Stop can cancel them; never rely on chained CSS animation events for phase control
- **§12 Audio**: Web Audio API preferred, HTMLAudioElement fallback; must gate all playback on a user gesture; drill must function visually if audio fails

## Code Structure

Follow the section order from §19 of SPEC.md inside the single HTML file:

1. `<head>` metadata and styles
2. Main app markup
3. Inline SVG definitions (embedded from `VectorBoot.svg`)
4. Script constants (all tunable geometry and timing)
5. State object
6. DOM query/setup
7. Settings load/save helpers (`localStorage`)
8. Audio helpers
9. Rendering helpers
10. Repetition scheduler
11. Event listeners

Keep all tunable values (foot positions, rotation angles, animation durations) as named constants in section 4. Do not scatter magic numbers through the logic.

## Implementation Notes (from M1)

`index.html` is the delivered file. Key non-obvious decisions made during implementation:

**Layout** — bottom of the page is split into two stacked elements: `#toolbar` (always visible, contains Start/Stop/Audio/⚙ buttons) and `#config-panel` (collapsible, contains timing inputs and movement checkboxes). The stage (`flex:1`) fills remaining height. Config panel uses `max-height` transition to slide open/close.

**SVG feet** — `VectorBoot.svg` (viewBox `0 0 317 470`) is a right foot. It is defined once as `<symbol id="boot">` in a hidden `<svg>`. Each foot is a separate `<svg class="foot">` using `<use href="#boot">`. CSS selectors do not pierce `<use>` shadow trees, so foot color is set via `fill="currentColor"` on the `<use>` element with `color: var(--fg)` on `.foot`. Left foot is mirrored with `transform="translate(317,0) scale(-1,1)"` on its `<use>`.

**Foot sizing** — height is `20dvh`; width derives from `aspect-ratio: 317 / 470`.

## Key Implementation Rules

- Stop must cancel all pending timers and prevent stale callbacks from firing
- Persisted settings: timing inputs, enabled movement checkboxes (via `localStorage`)
- `prefers-reduced-motion`: transitions still occur but near-instant
- Wake Lock: request on drill start, release on stop/page-hidden; fail silently
- No movements selected → disable Start, show "Select at least one movement."
- Invalid timing inputs → auto-correct immediately rather than showing an error on Start
