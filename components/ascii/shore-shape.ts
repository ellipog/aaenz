/*
 * Where the shore puts things, as fractions of the picture: the horizon and the
 * waterline (of its height), the streak, and where one of us lies. The plate
 * draws the characters from these; the footer lays the light under them — the
 * crimson haze, the sea's glow, the streak's bloom, the white of the sand — and
 * sets the figure and its words on the beach from the same numbers.
 */
export const HORIZON = 0.52;
export const SHORE = 0.62;
/** Where one of us lies on the sand: across the picture, and down the beach from the waterline. */
export const LIES = { wide: [0.52, 0.2], tall: [0.8, 0.2] } as const;
/** The red streak down the sky, top to tip, as fractions of the picture. */
export const STREAK = { wide: [0.6, -0.05, 0.745, 0.22], tall: [0.7, -0.05, 0.9, 0.19] } as const;

/** A colossus on the picture: where its crown is (in cells), how tall, its lean (radians), and whether an arm is lost. */
export type Colossus = { x: number; y: number; h: number; lean: number; broken: boolean };

// the trunk's half-width down the body, crown (0) to feet (1): shoulders, ribs, a narrow waist, hips, the legs together
const TRUNK: [v: number, w: number][] = [
  [0.1, 0.1], [0.12, 0.125], [0.26, 0.105], [0.43, 0.058], [0.52, 0.09], [0.6, 0.08],
  [0.76, 0.055], [0.86, 0.03], [0.95, 0.014], [1, 0.004],
];

/**
 * Whether a point is inside a colossus, crucified on nothing, in its own frame: x across
 * (the arms reach ±0.5), y down from the crown (0) to the feet (1). The head hangs forward
 * and to one side; on the broken one the right arm stops short at the elbow.
 */
export function inColossus(x: number, y: number, broken: boolean): boolean {
  // the head
  const hx = x - 0.04;
  const hy = y - 0.065;
  const ex = (hx * Math.cos(0.5) + hy * Math.sin(0.5)) / 0.055;
  const ey = (-hx * Math.sin(0.5) + hy * Math.cos(0.5)) / 0.072;
  if (ex * ex + ey * ey < 1) return true;
  // the trunk
  if (y >= TRUNK[0][0] && y <= 1) {
    let k = 0;
    while (TRUNK[k + 1][0] < y) k++;
    const [v0, w0] = TRUNK[k];
    const [v1, w1] = TRUNK[k + 1];
    if (Math.abs(x) < w0 + ((w1 - w0) * (y - v0)) / (v1 - v0)) return true;
  }
  // the arms, out straight and a little raised, the hands open
  const ax = Math.abs(x);
  const reach = broken && x > 0 ? 0.28 : 0.5;
  if (ax >= 0.06 && ax <= reach) {
    const s = (ax - 0.08) / (reach - 0.08);
    const top = 0.1 - 0.032 * Math.pow(Math.max(0, s), 0.8);
    const bottom = 0.104 + 0.146 * Math.pow(1 - Math.min(1, Math.max(0, s)), 2.2);
    return y > top && y < bottom;
  }
  return ax > reach && ax < reach + 0.04 && y > 0.062 && y < 0.104 - (ax - reach) * 0.35;
}

/** A colossus's coverage of each cell of a cols × rows grid, supersampled n × n. */
export function colossusField(cols: number, rows: number, c: Colossus, n = 4): Float32Array {
  const cov = new Float32Array(cols * rows);
  const cos = Math.cos(-c.lean);
  const sin = Math.sin(-c.lean);
  const x0 = Math.max(0, Math.floor(c.x - c.h * 0.7));
  const x1 = Math.min(cols - 1, Math.ceil(c.x + c.h * 0.7));
  const y0 = Math.max(0, Math.floor(c.y - c.h * 0.4));
  const y1 = Math.min(rows - 1, Math.ceil(c.y + c.h * 1.1));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      let hit = 0;
      for (let j = 0; j < n; j++) {
        for (let i = 0; i < n; i++) {
          const px = x + (i + 0.5) / n - c.x;
          const py = y + (j + 0.5) / n - c.y;
          if (inColossus((px * cos - py * sin) / c.h, (px * sin + py * cos) / c.h, c.broken)) hit++;
        }
      }
      cov[y * cols + x] = hit / (n * n);
    }
  }
  return cov;
}
