// Split-Step Trainer settings.
//
// Coords (cx, cy) are relative to the circle center; 1 unit = 0.5 * min(stageW, stageH).
// Positive cx = right, positive cy = upward on screen.
// Rotation is in degrees; positive = clockwise.
//
// To convert to pixels: px = coord * minDim / 2
//
// Increment POSITIONS_REV when editing this file so the app reloads
// fresh from disk, discarding any overrides stored in localStorage.

const POSITIONS_REV = 1;

const SETTINGS = {
  minWait:   5,
  maxWait:   10,
  shrink:    2,
  footSpeed: 2.5,
  footColor: '#3269a8',
  movements: ['Volley'],  // enabled reaction movement names
};

const POSITIONS = [
  {
    name:  'neutral',
    left:  { cx: -0.5, cy: 0, rotation:  -8 },
    right: { cx:  0.5, cy: 0, rotation:   8 },
  },
  {
    name:  'split',
    left:  { cx: -0.90, cy: 0.0, rotation:  -8 },
    right: { cx:  0.90, cy: 0.0, rotation:   8 },
  },
  {
    name:  'Volley', mirrored: true,
    left:  { cx: -0.46, cy: -0.11, rotation:  -8 },
    right: { cx:  0.46, cy: -0.11, rotation:   8 },
  },
];
