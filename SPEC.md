# Pickleball Split-Step Trainer (MVP) — Agent-Ready Implementation Spec

## 1. Purpose

Build a mobile-responsive single-page web app that trains a pickleball player’s split-step timing and first movement reaction using synchronized visual and audio cues.

The app is intended to be used on-court with a phone or tablet placed roughly 4–6 feet in front of the user.

## 2. Scope

### In scope

* One-screen web app
* Dark high-contrast visual design
* Animated countdown circle
* Two animated foot silhouettes
* Randomized drill repetitions
* User-configurable timing settings
* User-selectable movement set
* Preloaded audio cue triggered by user gesture
* Mobile-friendly controls
* Screen Wake Lock when supported
* No backend, no accounts, no analytics

### Out of scope

* Video capture
* Motion sensing
* Performance scoring
* Multiplayer features
* User profiles or saved history
* Cloud storage

## 3. Technical Requirements

* Use **vanilla JavaScript**, **HTML**, and **CSS**.
* Deliver as a **single self-contained HTML file**.
* No build step.
* Do not require npm or bundling.
* Tailwind may be used **only via CDN** if desired, but plain CSS is preferred for reliability in a single-file deployment.
* All SVG graphics must be embedded inline in the HTML.
* Audio may be embedded as a base64 data URL or loaded from a nearby file, but the app must still work after the user taps a dedicated audio unlock/load control.
* Must run in current mobile Safari and Chrome-class browsers with graceful degradation for unsupported APIs.

## 4. User Experience Summary

The user selects one or more reaction movements, adjusts timing settings, enables audio, and presses **Start Drill**.

Each repetition proceeds as follows:

1. Wait a random amount of time.
2. Show a shrinking center circle.
3. Shortly before impact, animate the feet from neutral stance to wide split-step stance.
4. At impact, play the paddle-strike audio cue and make the circle disappear.
5. 100 ms later, animate one randomly selected enabled reaction movement.
6. After the reaction display, reset to neutral and begin the next repetition automatically.

The drill continues until the user presses **Stop**.

## 5. Layout

## 5.1 Main regions

The page has 3 vertical regions:

1. **Header**: app title and compact status text
2. **Drill Stage**: the main animated training area
3. **Controls Panel**: start/stop/settings

On narrow screens, regions stack vertically.
On wider screens, the controls panel may appear below or beside the drill stage, but the drill stage must remain visually dominant.

## 5.2 Drill Stage

The drill stage contains:

* A centered countdown circle
* A left foot SVG
* A right foot SVG
* Optional small status label showing current phase

The stage should occupy most of the viewport height when the controls panel is collapsed or compact.

## 6. Visual Design

* Background: near-black
* Foreground text: off-white
* Accent color: neon green or yellow-green
* Warning/error color: red-orange
* Strong contrast for outdoor visibility
* Large tap targets for mobile use

### Motion styling

* Animations should be smooth, simple, and visually readable outdoors.
* Prefer CSS transforms and opacity changes.
* Avoid heavy effects such as blur, shadows, or canvas rendering unless clearly needed.

## 7. State Model

The app must use an explicit state machine.

### Top-level states

* `setup`: initial state before audio is unlocked and before drill starts
* `ready`: idle and ready to start
* `running`: repetitions are executing
* `paused`: optional; may be omitted for MVP
* `stopped`: same visual behavior as ready; included only if useful in code structure

### Per-repetition phases within `running`

* `idleWait`
* `anticipation`
* `preSplit`
* `impact`
* `reaction`
* `reset`

Only one repetition phase may be active at a time.

## 8. Timing Parameters

All timing values are in seconds.

### User-configurable parameters

* `minWait`: default `5.0`
* `maxWait`: default `10.0`
* `shrinkDuration`: default `2.0`
* `preSplitBuffer`: default `0.15`

### Fixed MVP timing constants

* `reactionDelay`: `0.10`
* `resetDelay`: `1.50`

### Validation rules

* `minWait >= 0.5`
* `maxWait <= 60`
* `maxWait >= minWait`
* `shrinkDuration >= 0.2`
* `preSplitBuffer >= 0`
* `preSplitBuffer <= shrinkDuration`

If an entered value is invalid, the UI must either:

1. auto-correct it immediately, or
2. block starting the drill and show a clear validation message.

Prefer immediate auto-correction for MVP.

## 9. Randomization Rules

For each repetition:

* Draw `waitDuration` uniformly from the closed interval `[minWait, maxWait]`.
* Select exactly one enabled movement uniformly at random from the set of checked movements.

If no movements are enabled:

* Disable `Start Drill`, and
* Show a validation message: "Select at least one movement."

## 10. Movement Definitions

Each foot has a neutral transform and an animated transform for split-step and reactions.

The implementation does not need anatomically perfect movement, but it must be visually distinct and consistent.

## 10.1 Coordinate convention

Define stage coordinates relative to the center of the drill stage.

* Positive x = right
* Positive y = downward on screen

## 10.2 Neutral stance

Initial foot centers:

* Left foot: `(-70, 80)` px relative to center
* Right foot: `(70, 80)` px relative to center

Each foot is angled slightly outward:

* Left foot rotation: `-8deg`
* Right foot rotation: `8deg`

## 10.3 Wide split-step stance

At pre-split:

* Left foot x shifts by `-35px`
* Right foot x shifts by `+35px`
* Both feet y shift by `+8px`
* Rotations remain unchanged

Transition duration: `120ms`

## 10.4 Reaction movements

These begin `100ms` after impact.

### A. Volley

* Both feet shift forward by `-60px` in y
* Both feet move slightly outward by `10px`
* Duration: `220ms`

### B. Deep Drive Right

* Right foot shifts `( +55, -65 )`
* Left foot shifts `( +10, -20 )`
* Right foot rotation becomes `18deg`
* Left foot rotation becomes `0deg`
* Duration: `240ms`

### C. Deep Drive Left

* Left foot shifts `( -55, -65 )`
* Right foot shifts `( -10, -20 )`
* Left foot rotation becomes `-18deg`
* Right foot rotation becomes `0deg`
* Duration: `240ms`

### D. Unit Turn Left

* Both feet rotate to face left
* Left foot rotation: `-55deg`
* Right foot rotation: `-35deg`
* Both feet shift `-20px` in x
* Minimal y motion
* Duration: `220ms`

### E. Unit Turn Right

* Both feet rotate to face right
* Left foot rotation: `35deg`
* Right foot rotation: `55deg`
* Both feet shift `+20px` in x
* Minimal y motion
* Duration: `220ms`

These values are starting defaults and should be implemented as named constants near the top of the script for easy tuning.

## 11. Countdown Circle

The countdown circle is centered in the stage.

### Behavior

* At start of `anticipation`, the circle appears at maximum size.
* Over `shrinkDuration`, it scales smoothly to zero.
* At `impact`, it disappears completely.

### Default geometry

* Diameter: `140px` on typical phone screens
* Scale proportionally on larger screens, clamped between `100px` and `220px`
* Border thickness: `4px`

### Animation

* Use a linear timing function for the shrinking motion.
* The circle’s center position must remain fixed.

## 12. Audio Behavior

* Provide a visible **Load Audio** or **Enable Audio** button.
* Audio playback must not be attempted until the user performs a qualifying gesture.
* Preload and decode audio as early as possible after the gesture.
* Use Web Audio API when practical; an HTMLAudioElement fallback is acceptable.
* At `impact`, trigger a short paddle-strike sound.

### Fallback behavior

If audio cannot be unlocked or loaded:

* Show a visible status message
* Allow the visual drill to continue without audio

Do not promise “no latency.” Instead, minimize perceived latency by preloading and unlocking audio in advance.

## 13. Control Panel

The control panel must include:

* Start Drill button
* Stop button
* Load Audio / Enable Audio button
* Min wait input
* Max wait input
* Shrink duration input
* Pre-split timing input
* Movement checklist for A–E
* Optional mute toggle if audio is enabled

### Button behavior

#### Start Drill

* Enabled only when at least one movement is checked
* Starts the repetition loop immediately from the current settings
* If already running, button is disabled or hidden

#### Stop

* Stops future scheduled phases
* Clears timers
* Resets visuals to neutral state
* Leaves current settings unchanged

#### Load Audio / Enable Audio

* Attempts to initialize audio context and preload cue
* After success, label may change to `Audio Ready`

## 14. Scheduling Requirements

Use explicit scheduling logic; do not rely on chained CSS events alone.

Recommended approach:

* Use JavaScript timers for phase transitions
* Store timer IDs so they can all be canceled on stop
* Apply CSS classes or inline transforms for visual state changes

The app must ensure that stopping the drill prevents stale timers from firing later.

A repetition should schedule these events relative to the chosen repetition start time:

* `idleWait` begins immediately
* `anticipation` begins after `waitDuration`
* `preSplit` begins after `waitDuration + shrinkDuration - preSplitBuffer`
* `impact` occurs after `waitDuration + shrinkDuration`
* `reaction` occurs after `waitDuration + shrinkDuration + reactionDelay`
* `reset` occurs after `waitDuration + shrinkDuration + resetDelay`
* next repetition begins immediately after reset

## 15. Persistence

For MVP, persist settings in `localStorage`.

Persist:

* timing inputs
* enabled movement checkboxes
* audio enabled preference if useful

Do not persist whether a drill was actively running.

## 16. Accessibility and Resilience

* Respect `prefers-reduced-motion` by providing a reduced-motion mode:

  * foot transforms still change, but with near-instant transitions
  * countdown circle may step between sizes or use very short motion
* Ensure tap targets are at least about 44 px high
* Ensure text remains legible in bright outdoor conditions
* All controls must have labels
* Use semantic buttons and inputs

## 17. Wake Lock

* Attempt to request a screen wake lock when the drill starts
* Release wake lock when the drill stops or page is hidden
* If unsupported or denied, continue without failure
* Show no intrusive error; a small status note is sufficient

## 18. Error Handling

Handle these cases gracefully:

* invalid numeric input
* no movements selected
* audio initialization failure
* wake lock unsupported
* repeated rapid presses on Start/Stop
* page visibility changes while running

The app must never require a full page reload to recover from user mistakes.

## 19. Implementation Structure

Keep code simple and flat.

Recommended sections inside the single HTML file:

1. `<head>` metadata and styles
2. main app markup
3. inline SVG definitions
4. script constants
5. state object
6. DOM query/setup
7. settings load/save helpers
8. audio helpers
9. rendering helpers
10. repetition scheduler
11. event listeners

## 20. Acceptance Criteria

The implementation is acceptable for MVP if all of the following are true:

1. The app runs from a single HTML file in a modern mobile browser.
2. The user can start and stop the drill without page reload.
3. The circle visibly shrinks to center and disappears at impact.
4. Feet begin in neutral stance, widen before impact, then perform one enabled reaction movement.
5. Exactly one enabled movement is chosen per repetition.
6. Wait time varies randomly between configured min and max.
7. Reaction starts about 100 ms after impact.
8. Reset returns the feet to neutral before the next repetition.
9. Stop cancels all pending timers and prevents ghost animations.
10. Audio can be enabled with a user gesture and plays at impact when available.
11. The app still functions visually if audio fails.
12. The app handles unsupported Wake Lock gracefully.
13. Settings persist across reloads.
14. Starting is blocked when no movement options are selected.
15. The UI remains usable on a phone-sized screen in portrait mode.

## 21. Nice-to-Have Enhancements (Not Required for MVP)

* Pause/resume
* Countdown before first repetition
* Visual flash at impact
* Per-movement weighting instead of uniform selection
* Full-screen mode button
* Alternate cue sounds
* Landscape layout tuning
* Manual tempo mode instead of randomized waiting

## 22. Notes for the Coding Agent

* Prefer clarity over abstraction.
* Avoid frameworks.
* Avoid over-engineering.
* Keep all tunable geometry and timing values in named constants.
* Do not invent additional features unless required for robustness.
* Implement the exact MVP first, then optionally add small usability improvements only if they do not increase complexity much.
