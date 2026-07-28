/**
 * Procedural terrain generation — pure TypeScript, no deps.
 *
 * Three stages:
 *   1. generateHeightmap(seed, size)  → 2D height field [0,1] via fBm value-noise
 *   2. marchingSquares(heightmap, levels) → SVG path strings for contour lines
 *   3. findValleyPath(heightmap) → polyline of points following the lowest terrain
 *
 * Used by ContourField (and its integrated footsteps). All deterministic per seed.
 */

// ─── PRNG ─────────────────────────────────────────────────────────────────

/** mulberry32 — small, fast, good-enough PRNG seeded from a string. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// ─── Value noise (smooth, interpolated) ────────────────────────────────────

/**
 * Value noise: deterministic pseudo-random gradient at lattice points,
 * smoothly interpolated between them. Smoother than raw PRNG output.
 */
function makeValueNoise(seed: number, period: number) {
  const rng = mulberry32(seed);
  // Lattice of random values, tiled by `period`.
  const lattice = new Float32Array(period * period);
  for (let i = 0; i < lattice.length; i++) lattice[i] = rng();

  /** Smoothstep falloff (Ken Perlin's 6t^5-15t^4+10t^3). */
  function fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  return function noise(x: number, y: number): number {
    // Wrap lattice coordinates by period.
    const xi = Math.floor(x) % period;
    const yi = Math.floor(y) % period;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const x0 = (xi + period) % period;
    const y0 = (yi + period) % period;
    const x1 = (x0 + 1) % period;
    const y1 = (y0 + 1) % period;

    const v00 = lattice[y0 * period + x0];
    const v10 = lattice[y0 * period + x1];
    const v01 = lattice[y1 * period + x0];
    const v11 = lattice[y1 * period + x1];

    const u = fade(xf);
    const v = fade(yf);
    return lerp(lerp(v00, v10, u), lerp(v01, v11, u), v);
  };
}

// ─── Heightmap via fBm ─────────────────────────────────────────────────────

/**
 * Generate a 2D heightmap using fractal Brownian motion (summed value-noise
 * octaves). Produces organic, natural-looking terrain.
 *
 * @param seed  any string; same seed → same terrain
 * @param size  grid resolution (size × size cells). ~96 is good.
 * @returns     Float32Array of length size*size, values normalized to [0,1]
 */
export function generateHeightmap(seed: string, size = 96): Float32Array {
  const hashed = hashSeed(seed);
  // 4 octaves: each adds finer detail at half amplitude / double frequency.
  const octaves = [
    { noise: makeValueNoise(hashed, 8), freq: 2, amp: 1.0 },
    { noise: makeValueNoise(hashed + 1, 16), freq: 4, amp: 0.5 },
    { noise: makeValueNoise(hashed + 2, 32), freq: 8, amp: 0.25 },
    { noise: makeValueNoise(hashed + 3, 64), freq: 16, amp: 0.125 },
  ];

  const map = new Float32Array(size * size);
  let min = Infinity;
  let max = -Infinity;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Map grid coords to noise space.
      const nx = (x / size) * octaves[0].freq;
      const ny = (y / size) * octaves[0].freq;
      let sum = 0;
      let ampSum = 0;
      for (const o of octaves) {
        sum += o.noise(nx * (o.freq / octaves[0].freq), ny * (o.freq / octaves[0].freq)) * o.amp;
        ampSum += o.amp;
      }
      const v = sum / ampSum;
      map[y * size + x] = v;
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }

  // Normalize to [0,1].
  const range = max - min || 1;
  for (let i = 0; i < map.length; i++) {
    map[i] = (map[i] - min) / range;
  }
  return map;
}

// ─── Marching squares → contour line SVG paths ──────────────────────────────

type Point = { x: number; y: number };

/**
 * Build SVG path data for contour lines at the given threshold, using the
 * marching squares algorithm. Returns array of path strings (one per
 * connected line group within this level).
 *
 * Handles every edge case:
 *   - Saddle points (cases 5 & 10): resolved by sampling the cell center,
 *     so the two possible connections are always geometrically correct
 *     (never produces a stray disconnected segment).
 *   - Exact-threshold corners: a tiny bias prevents degenerate codes and
 *     zero-length segments at flat plateaus.
 *   - Degenerate segments: filtered out before chaining.
 *
 * Segment endpoints are linearly interpolated where the contour crosses
 * each cell edge.
 */
export function marchingSquares(
  heightmap: Float32Array,
  size: number,
  threshold: number,
  width: number,
  height: number,
): string[] {
  const scaleX = width / (size - 1);
  const scaleY = height / (size - 1);

  const tOf = (a: number, b: number): number => {
    const d = b - a;
    if (Math.abs(d) < 1e-9) return 0.5;
    return Math.max(0, Math.min(1, (threshold - a) / d));
  };

  /**
   * Compute a contour point on a cell edge AND a canonical edge ID.
   * The edge ID is the same string regardless of which cell references it,
   * because shared edges use the same grid-corner coordinates. This makes
   * chaining exact (no float-drift mismatch).
   *
   * Edge directions within a cell (cx, cy):
   *   0 = top    (corner cx,cy → cx+1,cy)     canonical: H x,y
   *   1 = right  (corner cx+1,cy → cx+1,cy+1) canonical: V x,y
   *   2 = bottom (corner cx,cy+1 → cx+1,cy+1) canonical: H x,y+1
   *   3 = left   (corner cx,cy → cx,cy+1)     canonical: V x,y
   */
  function edgePoint(
    edge: number,
    cx: number,
    cy: number,
  ): { pt: Point; id: string } {
    const h00 = heightmap[cy * size + cx];
    const h10 = heightmap[cy * size + (cx + 1)];
    const h11 = heightmap[(cy + 1) * size + (cx + 1)];
    const h01 = heightmap[(cy + 1) * size + cx];
    switch (edge) {
      case 0: { // top: H at (cx, cy)
        const t = tOf(h00, h10);
        return {
          pt: { x: (cx + t) * scaleX, y: cy * scaleY },
          id: `H${cx},${cy}`,
        };
      }
      case 1: { // right: V at (cx+1, cy)
        const t = tOf(h10, h11);
        return {
          pt: { x: (cx + 1) * scaleX, y: (cy + t) * scaleY },
          id: `V${cx + 1},${cy}`,
        };
      }
      case 2: { // bottom: H at (cx, cy+1)
        const t = tOf(h01, h11);
        return {
          pt: { x: (cx + t) * scaleX, y: (cy + 1) * scaleY },
          id: `H${cx},${cy + 1}`,
        };
      }
      case 3: { // left: V at (cx, cy)
        const t = tOf(h00, h01);
        return {
          pt: { x: cx * scaleX, y: (cy + t) * scaleY },
          id: `V${cx},${cy}`,
        };
      }
      default:
        return { pt: { x: 0, y: 0 }, id: "" };
    }
  }

  // Biased comparison avoids the ambiguous "exactly on the line" code.
  const EPS = 1e-6;
  const above = (h: number) => h - threshold > EPS;

  // Segments tagged with canonical edge IDs at each endpoint.
  type TaggedSeg = { a: Point; b: Point; idA: string; idB: string };
  const segments: TaggedSeg[] = [];

  for (let cy = 0; cy < size - 1; cy++) {
    for (let cx = 0; cx < size - 1; cx++) {
      const h00 = heightmap[cy * size + cx];
      const h10 = heightmap[cy * size + (cx + 1)];
      const h11 = heightmap[(cy + 1) * size + (cx + 1)];
      const h01 = heightmap[(cy + 1) * size + cx];

      let code = 0;
      if (above(h00)) code |= 1;
      if (above(h10)) code |= 2;
      if (above(h11)) code |= 4;
      if (above(h01)) code |= 8;

      type EdgePair = [number, number];
      let pairs: EdgePair[];
      if (code === 5 || code === 10) {
        // Saddle: resolve by the cell-center value.
        const center = (h00 + h10 + h11 + h01) / 4;
        if (code === 5) {
          pairs = above(center) ? [[3, 0], [2, 1]] : [[0, 1], [3, 2]];
        } else {
          pairs = above(center) ? [[0, 1], [3, 2]] : [[3, 0], [2, 1]];
        }
      } else {
        const table: EdgePair[][] = [
          [],        [[3, 0]],  [[0, 1]],  [[3, 1]],
          [[1, 2]],  [],        [[0, 2]],  [[3, 2]],
          [[2, 3]],  [[0, 2]],  [],        [[1, 3]],
          [[2, 1]],  [[0, 3]],  [[2, 0]],  [],
        ];
        pairs = table[code];
      }

      for (const [ea, eb] of pairs) {
        const A = edgePoint(ea, cx, cy);
        const B = edgePoint(eb, cx, cy);
        // Drop degenerate zero-length segments.
        if (Math.hypot(A.pt.x - B.pt.x, A.pt.y - B.pt.y) < 0.01) continue;
        segments.push({ a: A.pt, b: B.pt, idA: A.id, idB: B.id });
      }
    }
  }

  return chainByEdgeId(segments, scaleX, scaleY);
}

/**
 * Chain tagged segments into polylines using canonical edge IDs.
 * Because each shared cell-edge has the same ID from both neighbouring
 * cells, this chains perfectly with no float-drift gaps. Stray fragments
 * shorter than ~1.5 cells are dropped so no random dashes remain.
 */
function chainByEdgeId(
  segments: { a: Point; b: Point; idA: string; idB: string }[],
  scaleX: number,
  scaleY: number,
): string[] {
  if (segments.length === 0) return [];

  // Map: edgeID → list of segment indices that touch it.
  const byEdge = new Map<string, number[]>();
  segments.forEach((seg, i) => {
    for (const id of [seg.idA, seg.idB]) {
      const list = byEdge.get(id);
      if (list) list.push(i);
      else byEdge.set(id, [i]);
    }
  });

  const used = new Array<boolean>(segments.length).fill(false);
  const paths: string[] = [];
  const minLen = Math.min(scaleX, scaleY) * 1.5;

  for (let i = 0; i < segments.length; i++) {
    if (used[i]) continue;
    used[i] = true;
    const seg = segments[i];
    let startId = seg.idA;
    let endId = seg.idB;
    let startPt = seg.a;
    let endPt = seg.b;
    const pts: Point[] = [startPt, endPt];

    // Grow forward.
    let grew = true;
    while (grew) {
      grew = false;
      const candidates = byEdge.get(endId);
      if (!candidates) break;
      for (const j of candidates) {
        if (used[j]) continue;
        const s = segments[j];
        used[j] = true;
        if (s.idA === endId) {
          pts.push(s.b);
          endPt = s.b;
          endId = s.idB;
        } else {
          pts.push(s.a);
          endPt = s.a;
          endId = s.idA;
        }
        grew = true;
        break;
      }
    }
    // Grow backward.
    grew = true;
    while (grew) {
      grew = false;
      const candidates = byEdge.get(startId);
      if (!candidates) break;
      for (const j of candidates) {
        if (used[j]) continue;
        const s = segments[j];
        used[j] = true;
        if (s.idA === startId) {
          pts.unshift(s.b);
          startPt = s.b;
          startId = s.idB;
        } else {
          pts.unshift(s.a);
          startPt = s.a;
          startId = s.idA;
        }
        grew = true;
        break;
      }
    }

    // Total length; drop micro-fragments.
    let len = 0;
    for (let k = 1; k < pts.length; k++) {
      len += Math.hypot(pts[k].x - pts[k - 1].x, pts[k].y - pts[k - 1].y);
    }
    if (pts.length < 2 || len < minLen) continue;

    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let k = 1; k < pts.length; k++) {
      d += ` L ${pts[k].x.toFixed(1)} ${pts[k].y.toFixed(1)}`;
    }
    paths.push(d);
  }
  return paths;
}

// ─── Valley path (Dijkstra over heightmap) ──────────────────────────────────

/**
 * Find a path from the left edge to the right edge that follows the lowest
 * terrain (valleys). Uses Dijkstra where edge cost = height of the cell
 * being entered. The path naturally avoids high ground.
 *
 * @returns array of {x, y} points in SVG coordinates, or null if no path.
 */
export function findValleyPath(
  heightmap: Float32Array,
  size: number,
  width: number,
  height: number,
): Point[] | null {
  const idx = (x: number, y: number) => y * size + x;

  // Start: lowest cell in the leftmost column. End: lowest in rightmost.
  let start = 0;
  let end = 0;
  let startH = Infinity;
  let endH = Infinity;
  for (let y = 0; y < size; y++) {
    const lh = heightmap[idx(0, y)];
    if (lh < startH) {
      startH = lh;
      start = idx(0, y);
    }
    const rh = heightmap[idx(size - 1, y)];
    if (rh < endH) {
      endH = rh;
      end = idx(size - 1, y);
    }
  }

  // Dijkstra.
  const dist = new Float32Array(size * size).fill(Infinity);
  const prev = new Int32Array(size * size).fill(-1);
  const visited = new Uint8Array(size * size);
  dist[start] = 0;

  // Simple priority queue via repeated linear scan (size is small enough).
  const total = size * size;
  for (let iter = 0; iter < total; iter++) {
    // Find unvisited node with min dist.
    let u = -1;
    let best = Infinity;
    for (let n = 0; n < total; n++) {
      if (!visited[n] && dist[n] < best) {
        best = dist[n];
        u = n;
      }
    }
    if (u === -1 || u === end) break;
    visited[u] = 1;

    const ux = u % size;
    const uy = Math.floor(u / size);
    // 8-neighbourhood, plus a distance penalty so the path doesn't zigzag
    // excessively across flat regions.
    const neighbours = [
      [ux + 1, uy, 1],
      [ux - 1, uy, 1],
      [ux, uy + 1, 1],
      [ux, uy - 1, 1],
      [ux + 1, uy + 1, 1.41],
      [ux - 1, uy + 1, 1.41],
      [ux + 1, uy - 1, 1.41],
      [ux - 1, uy - 1, 1.41],
    ];
    for (const [nx, ny, stepDist] of neighbours) {
      if (nx < 0 || nx >= size || ny < 0 || ny >= size) continue;
      const ni = idx(nx, ny);
      if (visited[ni]) continue;
      // Cost = height (so low terrain is cheap) + small step distance.
      const cost = heightmap[ni] * 4 + stepDist * 0.3;
      const alt = dist[u] + cost;
      if (alt < dist[ni]) {
        dist[ni] = alt;
        prev[ni] = u;
      }
    }
  }

  // Reconstruct path.
  if (prev[end] === -1 && start !== end) return null;
  const pathIdx: number[] = [];
  let cur = end;
  while (cur !== -1) {
    pathIdx.push(cur);
    cur = prev[cur];
  }
  pathIdx.reverse();

  // Convert to SVG coordinates (cell centers).
  const scaleX = width / size;
  const scaleY = height / size;
  return pathIdx.map((i) => ({
    x: (i % size + 0.5) * scaleX,
    y: (Math.floor(i / size) + 0.5) * scaleY,
  }));
}

// ─── Helpers ──────────────────────────────────────────────────────────────

/** Find the highest points in the heightmap — used for summit markers. */
export function findPeaks(
  heightmap: Float32Array,
  size: number,
  count: number,
  width: number,
  height: number,
): Point[] {
  const idx = (x: number, y: number) => y * size + x;
  const candidates: { x: number; y: number; h: number }[] = [];
  // Local maxima (higher than all 8 neighbours) with minimum separation.
  const minSep = Math.floor(size * 0.18);
  for (let y = 2; y < size - 2; y++) {
    for (let x = 2; x < size - 2; x++) {
      const h = heightmap[idx(x, y)];
      let isMax = true;
      for (let dy = -1; dy <= 1 && isMax; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          if (heightmap[idx(x + dx, y + dy)] > h) {
            isMax = false;
            break;
          }
        }
      }
      if (isMax) candidates.push({ x, y, h });
    }
  }
  candidates.sort((a, b) => b.h - a.h);

  const peaks: Point[] = [];
  const scaleX = width / size;
  const scaleY = height / size;
  for (const c of candidates) {
    if (peaks.length >= count) break;
    // Enforce minimum separation from already-picked peaks.
    const tooClose = peaks.some(
      (p) => Math.abs(p.x - c.x * scaleX) < minSep * scaleX && Math.abs(p.y - c.y * scaleY) < minSep * scaleY,
    );
    if (!tooClose) {
      peaks.push({ x: c.x * scaleX, y: c.y * scaleY });
    }
  }
  return peaks;
}

export type { Point };
