// Foot positions for the Split-Step Trainer.
//
// Coords (cx, cy) are relative to the circle center; 1 unit = 0.5 * min(stageW, stageH).
// Positive cx = right, positive cy = upward on screen.
// Rotation is in degrees; positive = clockwise.
//
// To convert to pixels: px = coord * minDim / 2

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
    name:  'Volley',
    left:  { cx: -0.46, cy: -0.11, rotation:  -8 },
    right: { cx:  0.46, cy: -0.11, rotation:   8 },
  },
  {
    name:  'Deep Drive Right',
    left:  { cx: -0.34, cy: -0.34, rotation:   0 },
    right: { cx:  0.71, cy: -0.09, rotation:  18 },
  },
  {
    name:  'Deep Drive Left',
    left:  { cx: -0.71, cy: -0.09, rotation: -18 },
    right: { cx:  0.34, cy: -0.34, rotation:   0 },
  },
  {
    name:  'Unit Turn Left',
    left:  { cx: -0.51, cy: -0.46, rotation: -55 },
    right: { cx:  0.28, cy: -0.46, rotation: -35 },
  },
  {
    name:  'Unit Turn Right',
    left:  { cx: -0.28, cy: -0.46, rotation:  35 },
    right: { cx:  0.51, cy: -0.46, rotation:  55 },
  },
];
