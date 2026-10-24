/*
 * The Tree of Life, as the footer draws it: ten spheres on three pillars and
 * the twenty-two paths between them. Shared by the `tree` plate and the footer,
 * which sets its links on the spheres, so the words sit where the characters
 * are. A sphere's `u` runs across the tree (0 the left pillar, 1 the right) and
 * `v` down it; the tree stands TREE_H of the picture's height tall from
 * TREE_TOP, TREE_W of that wide, centred TREE_X across.
 */

export const TREE_TOP = 0.08;
export const TREE_H = 0.74;
export const TREE_W = 0.56;
export const TREE_X = 0.6;
/** A sphere's radius, as a fraction of the tree's height. */
export const SPHERE_R = 0.046;

export const SPHERES = [
  { glyph: "冠", means: "CROWN", u: 0.5, v: 0 },
  { glyph: "知", means: "WISDOM", u: 1, v: 0.13 },
  { glyph: "理", means: "UNDERSTANDING", u: 0, v: 0.13 },
  { glyph: "慈", means: "MERCY", u: 1, v: 0.41 },
  { glyph: "厳", means: "SEVERITY", u: 0, v: 0.41 },
  { glyph: "美", means: "BEAUTY", u: 0.5, v: 0.55 },
  { glyph: "勝", means: "VICTORY", u: 1, v: 0.7 },
  { glyph: "栄", means: "SPLENDOUR", u: 0, v: 0.7 },
  { glyph: "基", means: "FOUNDATION", u: 0.5, v: 0.84 },
  { glyph: "国", means: "KINGDOM", u: 0.5, v: 1 },
] as const;

/** The hidden sphere between the crown and beauty, drawn only as a ring of dust. */
export const HIDDEN = { u: 0.5, v: 0.27 };

export const PATHS: [number, number][] = [
  [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [1, 3], [2, 5], [2, 4], [3, 4], [3, 5], [3, 6],
  [4, 5], [4, 7], [5, 6], [5, 7], [5, 8], [6, 7], [6, 8], [6, 9], [7, 8], [7, 9], [8, 9],
];

/** The lightning's way down: crown to kingdom, zigzagging across the pillars. */
export const DESCENT = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
