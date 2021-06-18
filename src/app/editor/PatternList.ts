export interface Pattern {
  width: number;
  height: number;
  mask: Uint8Array;
};

export const PatternList: Pattern[] = [
  {
    // 4x4 polka dots
    width: 4,
    height: 4,
    mask: new Uint8Array([
      1, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 0,
    ]),
  },
  {
    // 3x3 spaced dots
    width: 3,
    height: 3,
    mask: new Uint8Array([
      1, 0, 0,
      0, 0, 0,
      0, 0, 0,
    ]),
  },
  {
    // 2x2 spaced dots
    width: 2,
    height: 2,
    mask: new Uint8Array([
      1, 0,
      0, 0,
    ]),
  },
  {
    // diamond
    width: 4,
    height: 4,
    mask: new Uint8Array([
      1, 0, 1, 0,
      0, 1, 0, 0,
      1, 0, 1, 0,
      0, 0, 0, 1,
    ]),
  },
  {
    // horizontal lines
    width: 1,
    height: 2,
    mask: new Uint8Array([
      1,
      0,
    ]),
  },
  {
    // vertical lines
    width: 2,
    height: 1,
    mask: new Uint8Array([
      1, 0,
    ]),
  },
  {
    // checkerboard
    width: 2,
    height: 2,
    mask: new Uint8Array([
      0, 1,
      1, 0,
    ]),
  },
  {
    // inverted diamonds
    width: 4,
    height: 4,
    mask: new Uint8Array([
      0, 1, 0, 1,
      1, 0, 1, 1,
      0, 1, 0, 1,
      1, 1, 1, 0,
    ]),
  },
  {
    // inverted 2x2 spaced dots
    width: 2,
    height: 2,
    mask: new Uint8Array([
      0, 1,
      1, 1,
    ]),
  },
  {
    // inverted 3x3 spaced dots
    width: 3,
    height: 3,
    mask: new Uint8Array([
      0, 1, 1,
      1, 1, 1,
      1, 1, 1,
    ]),
  },
  {
    // inverted 4x4 polka dots
    width: 4,
    height: 4,
    mask: new Uint8Array([
      0, 1, 1, 1,
      1, 1, 1, 1,
      1, 1, 0, 1,
      1, 1, 1, 1,
    ]),
  },
];
