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
  minWait:   0.5,
  maxWait:   1,
  shrink:    1,
  footSpeed: 5,
  footColor: '#3269a8',
  movements: ['Drive Forward', 'Drive Backward', 'Unit Turn'],  // enabled reaction movement names
};

const POSITIONS = [
  {
    name:  'neutral',
    left:  { cx: -0.500, cy: 0.000, rotation: -8.0 },
    right: { cx: 0.500, cy: 0.000, rotation: 8.0 },
  },
  {
    name:  'split',
    left:  { cx: -0.750, cy: 0.000, rotation: -8.0 },
    right: { cx: 0.750, cy: 0.000, rotation: 8.0 },
  },
  {
    name:  'Drive Forward',
    mirrored: false,
    left:  { cx: -0.753, cy: -0.020, rotation: -29.1 },
    right: { cx: 0.521, cy: 0.755, rotation: -21.3 },
  },
  {
    name:  'Drive Backward',
    mirrored: false,
    left:  { cx: -0.695, cy: 0.010, rotation: 14.1 },
    right: { cx: 0.373, cy: -0.745, rotation: 37.8 },
  },
  {
    name:  'Unit Turn',
    mirrored: false,
    left:  { cx: -0.815, cy: -0.146, rotation: -61.7 },
    right: { cx: -0.461, cy: 0.787, rotation: -48.9 },
  }
];