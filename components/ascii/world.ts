/*
 * 地層 world. A block world in cross-section, every cell the kanji for its
 * block: 草 grass on 土 dirt on 石 stone, seams of 炭 鉄 金 玉 and red 紅, snow
 * 雪 on the peaks, lakes of 水, trees of 木 and 葉, and a floor of 盤 — base,
 * bedrock, the layer everything stands on. A new world grows on every page
 * load, and lives there.
 *
 * One red 人 lives in it, and thinks. It weighs what it needs — wood, stone,
 * food, a roof before dark — and plans its way there through the blocks: it
 * walks, climbs, swims, cuts tunnels, bridges drops and sets ladders up the
 * shafts it digs. It fells trees and plants them back, builds itself a house
 * of 板 and 瓦 with a door, a window and a lamp, tills a field beside it,
 * fishes the lake, follows ore down into the stone lighting the way with 灯,
 * and goes home to sleep when night comes. What it has in mind shows over its
 * head. It stops to wave when the pointer comes close.
 *
 * Round it the world goes on. Sheep 羊 graze the grass down and it grows back,
 * fish 魚 jump in the lake, a flock turns over the hills by day. By night 鬼
 * come out of the dark, and 爆, which goes off; the sun burns them away. Rain
 * comes and goes, storms throw lightning, trees catch and fire runs through
 * the canopy, lava meets water and turns to 黒, sand falls. Day turns to night
 * and the lamps come on. A click mines, and a click on the sky calls down
 * lightning.
 */
import { INK, LINE, clamp, fbm, hash, lineChar, smooth, FLOW, type Program } from "./engine";

/* ---------------------------------------------------------------- blocks --- */

const [AIR, GRASS, DIRT, STONE, COAL, IRON, GOLD, GEM, RUBY, BED, WATER, SAND, LOG, LEAF, SNOW, FLOWER, SAPLING, LAVA] =
  Array.from({ length: 18 }, (_, n) => n);
const [PLANK, LADDER, COBBLE, TORCH, DOOR, CHEST, ROOF, GLASS, FIRE, OBSIDIAN, FARM, CROP] = Array.from({ length: 12 }, (_, n) => n + 18);
const BLOCK = [
  "", "草", "土", "石", "炭", "鉄", "金", "玉", "紅", "盤", "水", "砂", "木", "葉", "雪", "花", "苗", "炎",
  "板", "梯", "礫", "灯", "戸", "箱", "瓦", "窓", "火", "黒", "田", "麦",
];
const SHADE = [
  0, 0.95, 0.55, 0.3, 0.75, 0.82, 0.9, 1, 0.95, 0.62, 0.4, 0.7, 0.7, 0.6, 0.9, 0.8, 0.8, 0.85,
  0.8, 0.65, 0.5, 0.95, 0.85, 0.85, 0.8, 0.6, 1, 0.5, 0.55, 0.85,
];
// strikes it takes to break, bare-handed
const HARD = [0, 2, 2, 4, 4, 5, 5, 6, 6, 99, 0, 2, 3, 1, 1, 1, 1, 99, 2, 1, 3, 1, 2, 2, 3, 1, 99, 9, 2, 1];
const table = (...bs: number[]) => {
  const t = new Uint8Array(BLOCK.length);
  for (const b of bs) t[b] = 1;
  return t;
};
// what can be stood in rather than on
const SOFT = table(AIR, WATER, LEAF, FLOWER, SAPLING, LAVA, LADDER, TORCH, DOOR, FIRE, CROP);
const FLAMMABLE = table(LOG, LEAF, PLANK, FLOWER, SAPLING, DOOR, LADDER, CROP);
const ORE = table(COAL, IRON, GOLD, GEM, RUBY);
const WORTH = [0, 0, 0, 0, 2, 3, 5, 8, 7];
const solid = (b: number) => SOFT[b] === 0;
const breakable = (b: number) => b !== AIR && b !== WATER && HARD[b] < 99;
// the 人 can be in it; beasts can't pass a door
const pass = (b: number) => SOFT[b] === 1 && b !== LAVA && b !== FIRE;
const roam = (b: number) => pass(b) && b !== DOOR;

type Item = "wood" | "rock" | "coal" | "iron" | "gold" | "gem" | "ruby" | "fish" | "wheat" | "seed";
const yieldOf = (b: number): Item | null => {
  if (b === LOG || b === PLANK || b === DOOR || b === LADDER || b === CHEST) return "wood";
  if (b === COAL) return "coal";
  if (b === IRON) return "iron";
  if (b === GOLD) return "gold";
  if (b === GEM) return "gem";
  if (b === RUBY) return "ruby";
  if (b === SAPLING) return "seed";
  if (solid(b)) return "rock";
  return null;
};

/* ----------------------------------------------------------------- state --- */

// how the 人 gets from one cell to the next on a planned route
const WALK = 0;
const BRIDGE = 1; // set a block down to walk over
const TUNNEL = 2; // cut through
const DIG = 3; // down through the floor
const UP = 4; // up through the ceiling, then a ladder
const CLIMB = 5; // a ladder up a wall
const PILLAR = 6; // jump and set a block underfoot

type Step = { x: number; y: number; act: number };
// a block to set (AIR to clear, FLOOR for anything solid)
type Op = { x: number; y: number; b: number };
const FLOOR = 255;
type Site = { x0: number; fy: number; left: boolean };

interface Mob {
  kind: "oni" | "bomb";
  x: number;
  y: number;
  dir: number;
  hp: number;
  hitAt: number;
  hurt: number;
  fuse: number;
  burn: number;
}
interface Beast {
  x: number;
  y: number;
  dir: number;
  hop: number;
}
interface Fish {
  x: number;
  y: number;
  vx: number;
  vy: number;
  air: boolean;
  lure: boolean;
}
interface Bird {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
}
interface Drop {
  x: number;
  y: number;
  b: number;
  at: number;
}
// a passing mark: chips, debris, smoke, steam, splashes, sleep, a leaf coming down
interface Bit {
  x: number;
  y: number;
  vx: number;
  vy: number;
  at: number;
  life: number;
  g: string;
  ink: number;
  a: number;
  fall: number;
  leaf?: number;
}

type Goal =
  | { kind: "wander"; tx: number }
  | { kind: "rest"; ticks: number; gaze?: boolean }
  | { kind: "chop"; x: number; y: number }
  | { kind: "build"; ops: Op[]; misses: number }
  | { kind: "mine"; x: number; y: number; b: number; back: boolean; since: number }
  | { kind: "sleep"; asleep: boolean }
  | { kind: "shelter"; stage: number; y: number }
  | { kind: "surface" }
  | { kind: "fish"; x: number; y: number; dir: number; bx: number; by: number; cast: number; bite: number }
  | { kind: "harvest"; i: number }
  | { kind: "store" }
  | { kind: "eat" }
  | { kind: "collect"; drop: Drop }
  | { kind: "plant"; x: number; y: number }
  | { kind: "fight"; mob: Mob }
  | { kind: "flee"; tx: number };

interface Walker {
  x: number;
  y: number;
  dir: number;
  inv: Record<Item, number>;
  tool: number;
  food: number;
  hp: number;
  goal: Goal | null;
  path: Step[];
  replans: number;
  hits: number;
  hitCell: number;
  thought: { g: string; at: number; red: boolean } | null;
  wave: number;
  greeted: number;
  hurt: number;
  jump: number;
  dead: number;
  lastZ: number;
  /** Beats spent on a route without getting anywhere. */
  idle: number;
  at: number;
}

interface World {
  blk: Uint8Array;
  /** The surface as it grew, so the dark behind a cave or a shaft can be told from sky. */
  ground: Int16Array;
  /** The first thing down each column from the sky, as it is now. */
  top: Int16Array;
  sea: number;
  /** Light: from the sky, and from lamps, fire and lava. */
  open: Float32Array;
  lamp: Float32Array;
  lit: boolean;
  litAt: number;
  struck: Float32Array;
  placed: Float32Array;
  /** Cells of the house, which the 人 won't dig through. */
  guard: Uint8Array;
  growing: Map<number, number>; // sapling → when it becomes a tree
  crops: Map<number, number>; // crop → when it ripens
  decay: Map<number, number>; // leaf → when it may fall
  burning: Map<number, number>; // fire → when it caught
  shun: Map<number, number>; // a target it couldn't reach → until when to leave it be
  me: Walker;
  site: Site | null;
  siteAt: number;
  buildAt: number;
  home: boolean;
  stash: number;
  bobber: { x: number; y: number } | null;
  /** Logs still to come down from a trunk that was cut, one a beat. */
  timber: number[];
  mobs: Mob[];
  sheep: Beast[];
  fish: Fish[];
  birds: Bird[];
  drops: Drop[];
  bits: Bit[];
  bolts: { cells: [number, number, string][]; at: number; x: number; y: number }[];
  blasts: { x: number; y: number; at: number }[];
  weather: { kind: "clear" | "rain" | "storm"; until: number; wet: number; wind: number; nextBolt: number; flash: number };
  fishCap: number;
  sheepCap: number;
  clock: number;
  next: Record<"think" | "fall" | "tend" | "mobs" | "sheep" | "spawn" | "heal" | "hunger", number>;
}

const DAY = 150; // seconds, dawn to dawn
const REACH = 3;

// One world per page load: the seed is drawn once, and the world grown from it
// — everything dug, built and planted in it, and everything living there —
// survives re-layouts and remounts. Only a full reload grows another.
let worldSeed = -1;
const worlds = new Map<string, World>();

function setTree(blk: Uint8Array, cols: number, x: number, base: number, height: number, pine: boolean) {
  const set = (xx: number, yy: number, b: number) => {
    if (xx < 0 || xx >= cols || yy < 0) return;
    const i = yy * cols + xx;
    if (blk[i] === AIR || blk[i] === SAPLING || (b === LOG && blk[i] === LEAF)) blk[i] = b;
  };
  for (let k = 0; k < height; k++) set(x, base - k, LOG);
  const top = base - height + 1;
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const inPine = Math.abs(dx) <= [0, 1, 1, 2, 2][dy + 2];
      const inOak = dy <= 1 && Math.abs(dx) + Math.abs(dy) <= 3 && !(Math.abs(dx) === 2 && dy === -2);
      if ((pine ? inPine : inOak) && !(dx === 0 && dy >= 0)) set(x + dx, top + dy, LEAF);
    }
  }
}

function growWorld(cols: number, rows: number, seed: number): World {
  const N = cols * rows;
  const o = (seed % 997) * 1.37;
  const blk = new Uint8Array(N);
  const ground = new Int16Array(cols);
  const sea = Math.round(rows * 0.62);
  const floor = rows - 1;
  for (let x = 0; x < cols; x++) {
    // the left of the world sinks to a lake, so the title has calm water under it
    const w = clamp((0.45 - x / cols) / 0.35);
    const calm = w * w * (3 - 2 * w);
    const hills = (fbm(x * 0.03 + o, 1.7, 3) - 0.5) * rows * 0.6;
    const ridge = 1 - Math.abs(fbm(x * 0.07 + o * 1.7, 4.2, 2) * 2 - 1);
    const range = smooth(0.48, 0.72, fbm(x * 0.011 + o * 0.3, 9.1, 2));
    const h = rows * 0.5 + hills - range * ridge * rows * 0.34 * (1 - calm) + rows * 0.18 * calm;
    ground[x] = Math.max(Math.round(rows * 0.2), Math.min(rows - 7, Math.round(h)));
  }
  for (let x = 0; x < cols; x++) {
    const s = ground[x];
    for (let y = 0; y < rows; y++) {
      let b = AIR;
      if (y >= floor) b = BED;
      else if (y > s) {
        const depth = y - s;
        const cave = depth > 3 && fbm(x * 0.09 + o, y * 0.16 + 40, 2) > 0.63;
        if (cave) b = y >= floor - 2 ? LAVA : AIR;
        else if (depth <= 3) b = s >= sea - 1 && depth <= 2 ? SAND : s < rows * 0.34 ? STONE : DIRT;
        else {
          const h = hash(x + seed, y, 3);
          const deep = y / rows;
          if (deep > 0.86 && h > 0.996) b = GEM;
          else if (deep > 0.76 && hash(x + seed, y, 9) > 0.991) b = RUBY;
          else if (deep > 0.8 && h > 0.988) b = GOLD;
          else if (depth > 8 && h > 0.972) b = IRON;
          else if (depth > 4 && h > 0.94) b = COAL;
          else b = STONE;
        }
      } else if (y === s) b = s >= sea ? SAND : s < rows * 0.3 ? SNOW : GRASS;
      else if (y >= sea) b = WATER;
      blk[y * cols + x] = b;
    }
  }
  // trees, pines on the high ground, and flowers between them
  let lastTree = -9;
  for (let x = 2; x < cols - 2; x++) {
    const s = ground[x];
    if (blk[s * cols + x] !== GRASS) continue;
    if (hash(x + seed, 77) > 0.83 && x - lastTree > 3) {
      setTree(blk, cols, x, s - 1, 3 + Math.floor(hash(x + seed, 78) * 2), s < rows * 0.42);
      lastTree = x;
    } else if (hash(x + seed, 79) > 0.86 && blk[(s - 1) * cols + x] === AIR) blk[(s - 1) * cols + x] = FLOWER;
  }

  // the living: a few sheep on the grass, fish in the water, a flock in the sky
  const grassy: number[] = [];
  for (let x = 3; x < cols - 3; x++) if (blk[ground[x] * cols + x] === GRASS && blk[(ground[x] - 1) * cols + x] === AIR) grassy.push(x);
  const sheepCap = clamp(Math.round(grassy.length / 10), 3, 7);
  const sheep: Beast[] = [];
  for (let k = 0; k < Math.min(sheepCap - 1, grassy.length); k++) {
    const x = grassy[Math.floor(hash(seed, k, 31) * grassy.length)];
    sheep.push({ x, y: ground[x] - 1, dir: hash(seed, k, 32) < 0.5 ? -1 : 1, hop: 0 });
  }
  const wet: number[] = [];
  for (let i = 0; i < N; i++) if (blk[i] === WATER && blk[i - cols] === WATER) wet.push(i);
  const fishCap = clamp(Math.round(wet.length / 60), wet.length ? 2 : 0, 7);
  const fish: Fish[] = [];
  for (let k = 0; k < fishCap; k++) {
    const i = wet[Math.floor(hash(seed, k, 33) * wet.length)];
    fish.push({ x: i % cols, y: Math.floor(i / cols), vx: hash(seed, k, 34) < 0.5 ? -1 : 1, vy: 0, air: false, lure: false });
  }
  const flock = clamp(Math.round(cols / 10), 5, 13);
  const birds: Bird[] = [];
  for (let k = 0; k < flock; k++) {
    birds.push({
      x: cols * 0.55 + (hash(seed, k, 35) - 0.5) * 12,
      y: rows * 0.12 + hash(seed, k, 36) * rows * 0.08,
      vx: 5 + hash(seed, k, 37) * 2,
      vy: (hash(seed, k, 38) - 0.5) * 2,
      phase: hash(seed, k, 39) * 6,
    });
  }

  // the 人 starts on its feet, somewhere right of centre
  const x = Math.round(cols * 0.62);
  let y = 0;
  while (y < rows - 1 && SOFT[blk[(y + 1) * cols + x]] && blk[(y + 1) * cols + x] !== WATER) y++;
  const never = () => new Float32Array(N).fill(-1e9);
  return {
    blk,
    ground,
    top: new Int16Array(cols),
    sea,
    open: new Float32Array(N),
    lamp: new Float32Array(N),
    lit: false,
    litAt: -1,
    struck: never(),
    placed: never(),
    guard: new Uint8Array(N),
    growing: new Map(),
    crops: new Map(),
    decay: new Map(),
    burning: new Map(),
    shun: new Map(),
    me: {
      x,
      y,
      dir: 1,
      inv: { wood: 4, rock: 10, coal: 3, iron: 0, gold: 0, gem: 0, ruby: 0, fish: 0, wheat: 0, seed: 1 },
      tool: 1,
      food: 8,
      hp: 5,
      goal: null,
      path: [],
      replans: 0,
      hits: 0,
      hitCell: -1,
      thought: null,
      wave: 0,
      greeted: -99,
      hurt: -99,
      jump: -99,
      dead: -1,
      lastZ: 0,
      idle: 0,
      at: -1,
    },
    site: null,
    siteAt: 0,
    buildAt: 0,
    home: false,
    stash: 0,
    bobber: null,
    timber: [],
    mobs: [],
    sheep,
    fish,
    birds,
    drops: [],
    bits: [],
    bolts: [],
    blasts: [],
    weather: { kind: "clear", until: 70 + hash(seed, 40) * 50, wet: 0, wind: 0, nextBolt: 0, flash: -99 },
    fishCap,
    sheepCap,
    clock: 0,
    next: { think: 0.6, fall: 0, tend: 0, mobs: 0, sheep: 0, spawn: 0, heal: 0, hunger: 25 },
  };
}

/* --------------------------------------------------------------- program --- */

export const world: Program = {
  glyphs: () => [
    ...BLOCK.slice(1),
    "芽",
    "900:人",
    "900:人@90",
    "900:大",
    "羊",
    "魚",
    "鬼",
    "爆",
    "ヘ",
    "煙",
    "ｚ",
    "！",
    "？",
    "家",
    "食",
    "眠",
    "星",
    "日",
    "月",
    "雲",
    "破",
    "・",
    "〜",
  ],
  create(api) {
    const { cols, rows } = api;
    if (worldSeed < 0) worldSeed = Math.floor(Math.random() * 1e6);
    const key = `${cols}x${rows}`;
    const w = worlds.get(key) ?? growWorld(cols, rows, worldSeed);
    worlds.set(key, w);
    const { blk, ground, top, sea, me, open, lamp, struck, placed, guard } = w;
    const N = cols * rows;
    const rand = Math.random;

    const glyphs = new Map<string, number>();
    const gl = (s: string) => {
      let g = glyphs.get(s);
      if (g === undefined) glyphs.set(s, (g = api.g(s)));
      return g;
    };
    const glyph = BLOCK.map((c) => (c ? gl(c) : -1));
    const G = {
      me: gl("900:人"), lie: gl("900:人@90"), arms: gl("900:大"),
      wave: gl("〜"), hit: gl("破"), dot: gl("・"), sun: gl("日"), moon: gl("月"), cloud: gl("雲"),
      sprout: gl("芽"), sheep: gl("羊"), fish: gl("魚"), oni: gl("鬼"), bomb: gl("爆"), bird: gl("ヘ"),
      fire: gl("火"), v: gl(LINE.v), h: gl(LINE.h), up: gl(LINE.up), down: gl(LINE.down),
    };

    const idx = (x: number, y: number) => y * cols + x;
    const get = (x: number, y: number) => (x < 0 || x >= cols || y >= rows ? BED : y < 0 ? AIR : blk[idx(x, y)]);
    // something to stand on: solid ground underfoot, a ladder, or water to float in
    const holds = (x: number, y: number) => {
      const h = get(x, y);
      const u = get(x, y + 1);
      return h === LADDER || h === WATER || !SOFT[u] || u === LADDER;
    };
    const beastHolds = (x: number, y: number) => get(x, y) === WATER || !SOFT[get(x, y + 1)];

    const phase = () => (w.clock / DAY + 0.12) % 1;
    const nightOf = (p: number) => smooth(0.62, 0.7, p) * (1 - smooth(0.94, 1, p));
    const bedtime = (p: number) => p > 0.74 && p < 0.975;

    /* -- changing the world --------------------------------------------------- */

    const dirty = () => {
      w.lit = false;
    };
    const bit = (x: number, y: number, g: string, o: Partial<Bit> = {}) => {
      w.bits.push({ x, y, vx: 0, vy: 0, at: w.clock, life: 0.5, g, ink: INK.BONE, a: 0.7, fall: 0, ...o });
      if (w.bits.length > 260) w.bits.shift();
    };
    const place = (x: number, y: number, b: number) => {
      if (x < 0 || x >= cols || y < 0 || y >= rows - 1) return;
      const i = idx(x, y);
      blk[i] = b;
      placed[i] = w.clock;
      w.growing.delete(i);
      w.crops.delete(i);
      w.burning.delete(i);
      if (b === SAPLING) w.growing.set(i, w.clock + 25 + rand() * 35);
      if (b === CROP) w.crops.set(i, w.clock + 35 + rand() * 30);
      dirty();
    };
    const ignite = (i: number) => {
      if (!FLAMMABLE[blk[i]]) return;
      blk[i] = FIRE;
      w.burning.set(i, w.clock);
      w.growing.delete(i);
      w.crops.delete(i);
      dirty();
    };
    const smash = (i: number, by: "me" | "hand" | "blast") => {
      const b = blk[i];
      if (!breakable(b)) return;
      const x = i % cols;
      const y = (i - x) / cols;
      const ripe = b === CROP && (w.crops.get(i) ?? Infinity) <= w.clock;
      blk[i] = AIR;
      struck[i] = w.clock;
      w.growing.delete(i);
      w.crops.delete(i);
      const item = b === CROP ? (ripe ? "wheat" : null) : yieldOf(b);
      if (by === "me" && item) {
        // a trunk cut anywhere brings the rest of it down after
        if (b === LOG) for (let yy = y - 1; yy >= 0 && blk[idx(x, yy)] === LOG; yy--) if (!w.timber.includes(idx(x, yy))) w.timber.push(idx(x, yy));
        me.inv[item] = Math.min(40, me.inv[item] + 1);
        if (b === LOG && rand() < 0.5) me.inv.seed = Math.min(8, me.inv.seed + 1);
        if (b === IRON) me.tool = Math.max(me.tool, 2);
        if (b === GEM) me.tool = 3;
      } else if (by === "hand" && item && item !== "seed") w.drops.push({ x, y, b, at: w.clock });
      bit(x + (rand() < 0.5 ? -0.4 : 0.4), y, "・", { vy: 5, life: 0.45 });
      // whatever stood on it goes with it
      if (y > 0) {
        const up = blk[i - cols];
        if (up === FLOWER || up === SAPLING || up === CROP || up === TORCH) smash(i - cols, by === "hand" ? "blast" : by);
      }
      // a log gone: the leaves round it may lose their hold
      if (b === LOG) {
        for (let dy = -5; dy <= 2; dy++) {
          for (let dx = -3; dx <= 3; dx++) {
            const xx = x + dx;
            const yy = y + dy;
            if (xx >= 0 && yy >= 0 && xx < cols && yy < rows && blk[idx(xx, yy)] === LEAF) w.decay.set(idx(xx, yy), w.clock + 0.4 + rand() * 3.5);
          }
        }
      }
      dirty();
    };
    const held = (i: number) => {
      const x = i % cols;
      const y = (i - x) / cols;
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) if (Math.abs(dx) + Math.abs(dy) <= 3 && get(x + dx, y + dy) === LOG) return true;
      }
      return false;
    };

    /* -- light ---------------------------------------------------------------- */

    const relight = () => {
      w.lit = true;
      w.litAt = w.clock;
      // the sky, straight down each column until something stops it
      for (let x = 0; x < cols; x++) {
        let v = 1;
        let t = -1;
        for (let y = 0; y < rows; y++) {
          const i = y * cols + x;
          const b = blk[i];
          if (b !== AIR && t < 0) t = y;
          open[i] = v;
          if (b === AIR || b === TORCH) continue;
          v = b === LEAF ? v * 0.6 : b === WATER ? v * 0.82 : b === GLASS || SOFT[b] ? v * 0.9 : 0;
        }
        top[x] = t < 0 ? rows : t;
      }
      // and a little way in sideways, into the mouths of caves and shafts
      for (let pass = 0; pass < 2; pass++) {
        for (let y = 1; y < rows; y++) {
          for (let x = 1; x < cols - 1; x++) {
            const i = y * cols + x;
            const m = Math.max(open[i - 1], open[i + 1], open[i - cols]) - (SOFT[blk[i]] ? 0.16 : 0.3);
            if (m > open[i]) open[i] = m;
          }
        }
      }
      // lamps, fire and lava, spreading through anything open
      lamp.fill(0);
      const q: number[] = [];
      for (let i = 0; i < N; i++) {
        const b = blk[i];
        const s = b === TORCH ? 1 : b === FIRE ? 0.95 : b === LAVA ? 0.6 : 0;
        if (s) {
          lamp[i] = s;
          q.push(i);
        }
      }
      const reach = (n: number, v: number) => {
        if (lamp[n] >= v) return;
        lamp[n] = v;
        if (SOFT[blk[n]] || blk[n] === GLASS) q.push(n);
      };
      for (let h = 0; h < q.length; h++) {
        const i = q[h];
        const v = lamp[i] - 0.12;
        if (v <= 0.03) continue;
        const x = i % cols;
        if (x > 0) reach(i - 1, v);
        if (x < cols - 1) reach(i + 1, v);
        if (i >= cols) reach(i - cols, v);
        if (i + cols < N) reach(i + cols, v);
      }
    };
    if (!w.lit) relight();

    /* -- the way there ------------------------------------------------------- */

    // A* over the cells the 人 can be in, where some steps change the world: a
    // tunnel costs the strikes to cut it, a bridge costs a block.
    const sc = { g: new Float32Array(N), from: new Int32Array(N), how: new Uint8Array(N), seen: new Uint32Array(N), shut: new Uint32Array(N), stamp: 0 };
    const diggable = (x: number, y: number) => {
      if (x < 0 || x >= cols || y < 0 || y >= rows - 1) return false;
      const i = idx(x, y);
      const b = blk[i];
      if (!breakable(b) || SOFT[b] || guard[i]) return false;
      // never open a way for water or lava
      const n = [get(x, y - 1), get(x - 1, y), get(x + 1, y)];
      return !n.includes(WATER) && !n.includes(LAVA);
    };
    const search = (done: (x: number, y: number) => boolean, hx: number, hy: number, o: { dig?: boolean; build?: boolean; budget?: number }) => {
      const { g, from, how, seen, shut } = sc;
      const st = ++sc.stamp;
      const blocks = !!o.build && me.inv.wood + me.inv.rock > (w.home || me.goal?.kind === "build" ? 0 : 18);
      const hf: number[] = [];
      const hn: number[] = [];
      const push = (n: number, f: number) => {
        let k = hf.length;
        hf.push(f);
        hn.push(n);
        while (k > 0) {
          const p = (k - 1) >> 1;
          if (hf[p] <= f) break;
          hf[k] = hf[p];
          hn[k] = hn[p];
          k = p;
        }
        hf[k] = f;
        hn[k] = n;
      };
      const pop = () => {
        const top = hn[0];
        const lf = hf.pop()!;
        const ln = hn.pop()!;
        if (hf.length) {
          let k = 0;
          for (;;) {
            const l = 2 * k + 1;
            if (l >= hf.length) break;
            const r = l + 1;
            const m = r < hf.length && hf[r] < hf[l] ? r : l;
            if (hf[m] >= lf) break;
            hf[k] = hf[m];
            hn[k] = hn[m];
            k = m;
          }
          hf[k] = lf;
          hn[k] = ln;
        }
        return top;
      };
      const s0 = idx(me.x, me.y);
      g[s0] = 0;
      seen[s0] = st;
      push(s0, 0);
      const relax = (n: number, cost: number, act: number, cur: number) => {
        const ng = g[cur] + cost;
        if (seen[n] === st && ng >= g[n]) return;
        seen[n] = st;
        g[n] = ng;
        from[n] = cur;
        how[n] = act;
        const x = n % cols;
        push(n, ng + Math.abs(x - hx) + Math.abs((n - x) / cols - hy) * 1.1);
      };
      let found = -1;
      let budget = o.budget ?? 7000;
      while (hn.length && budget-- > 0) {
        const cur = pop();
        if (shut[cur] === st) continue;
        shut[cur] = st;
        const x = cur % cols;
        const y = (cur - x) / cols;
        if (done(x, y) && holds(x, y)) {
          found = cur;
          break;
        }
        const here = blk[cur];
        const swim = here === WATER;
        for (let d = -1; d <= 1; d += 2) {
          const nx = x + d;
          if (nx < 0 || nx >= cols) continue;
          const nb = blk[cur + d];
          if (pass(nb)) {
            // step across, and drop as far as the ground is
            let ly = y;
            while (ly < rows - 2 && ly - y < 8 && !holds(nx, ly) && pass(get(nx, ly + 1))) ly++;
            const lands = holds(nx, ly) && get(nx, ly + 1) !== LAVA;
            if (lands && (ly - y <= 4 || get(nx, ly) === WATER)) {
              relax(idx(nx, ly), 1 + (ly - y) * 0.25 + (get(nx, ly) === WATER ? 1.5 : 0), WALK, cur);
            } else if (blocks && !swim) relax(cur + d, 5, BRIDGE, cur);
          } else if (y > 0 && pass(get(nx, y - 1)) && pass(get(x, y - 1))) relax(idx(nx, y - 1), 1.4, WALK, cur);
          else if ((o.dig || nb === LOG) && diggable(nx, y) && solid(get(nx, y + 1))) relax(cur + d, 2 + HARD[nb] * (nb === LOG ? 0.4 : 0.7), TUNNEL, cur);
        }
        if (y > 0) {
          const ab = blk[cur - cols];
          if (pass(ab)) {
            if (here === LADDER || swim) relax(cur - cols, swim ? 2 : 1, WALK, cur);
            else if (here === AIR && (solid(get(x - 1, y)) || solid(get(x + 1, y)))) relax(cur - cols, 2.5, CLIMB, cur);
            else if (here === AIR && blocks) relax(cur - cols, 7, PILLAR, cur);
          } else if (o.dig && here === AIR && diggable(x, y - 1)) relax(cur - cols, 3 + HARD[ab] * 0.7, UP, cur);
        }
        const bl = get(x, y + 1);
        if (bl === LADDER || (swim && bl === WATER)) relax(cur + cols, swim ? 2 : 1, WALK, cur);
        else if (o.dig && diggable(x, y + 1) && (solid(get(x, y + 2)) || get(x, y + 2) === WATER)) relax(cur + cols, 2 + HARD[bl] * 0.7, DIG, cur);
      }
      if (found < 0) return null;
      const path: Step[] = [];
      for (let n = found; n !== s0; n = from[n]) {
        const x = n % cols;
        path.push({ x, y: (n - x) / cols, act: how[n] });
      }
      return path.reverse();
    };

    /* -- the 人's hands ------------------------------------------------------ */

    const think = (g: string, red = false) => {
      me.thought = { g, at: w.clock, red };
    };
    const strike = (x: number, y: number) => {
      const i = idx(x, y);
      const b = blk[i];
      if (!breakable(b)) return false;
      if (me.hitCell !== i) {
        me.hitCell = i;
        me.hits = 0;
      }
      if (x !== me.x) me.dir = x > me.x ? 1 : -1;
      struck[i] = w.clock;
      if (++me.hits >= Math.ceil(HARD[b] / me.tool)) {
        smash(i, "me");
        me.hits = 0;
        me.hitCell = -1;
      }
      return true;
    };
    const spend = (prefer: "wood" | "rock") => {
      const k = me.inv[prefer] > 0 ? prefer : me.inv.wood > 0 ? "wood" : me.inv.rock > 0 ? "rock" : null;
      if (!k) return -1;
      me.inv[k]--;
      return k === "wood" ? PLANK : COBBLE;
    };
    const hurt = (n: number, push: number) => {
      if (me.dead >= 0) return;
      me.hp -= n;
      me.hurt = w.clock;
      if (push && pass(get(me.x + push, me.y))) me.x += push;
      think("！", true);
      if (me.hp <= 0) {
        me.dead = w.clock;
        me.goal = null;
        me.path.length = 0;
        w.bobber = null;
      }
    };
    const respawn = () => {
      let x = Math.round(cols * 0.62);
      let y = 0;
      if (w.home && w.site) {
        x = w.site.x0 + 2;
        y = w.site.fy - 1;
      } else while (y < rows - 2 && !holds(x, y)) y++;
      Object.assign(me, { x, y, hp: 5, dead: -1, goal: null, path: [], hurt: -99 });
      think("！");
    };

    // Take the next step of the route; some steps take a few beats of work first.
    const follow = (): "go" | "done" | "fail" => {
      while (me.path.length && me.path[0].x === me.x && me.path[0].y === me.y) me.path.shift();
      const st = me.path[0];
      if (!st) return "done";
      const dx = st.x - me.x;
      const dy = st.y - me.y;
      if (Math.abs(dx) > 1) return "fail";
      if (dx) me.dir = dx;
      const here = get(me.x, me.y);
      switch (st.act) {
        case WALK: {
          if (!dx) {
            if (dy > 0) {
              // down a ladder or through water; otherwise a fall that hasn't landed yet
              const b = get(me.x, me.y + 1);
              if (b === LADDER || b === WATER || here === WATER) {
                if (!pass(b)) return "fail";
                me.y++;
                return "go";
              }
              return holds(me.x, me.y) ? "fail" : "go";
            }
            // straight up only on a ladder or through water
            if (!pass(get(me.x, me.y - 1)) || (here !== LADDER && here !== WATER)) return "fail";
            me.y--;
            return "go";
          }
          if (pass(get(st.x, me.y))) {
            me.x = st.x;
            return "go";
          }
          if (dy < 0 && pass(get(st.x, me.y - 1)) && pass(get(me.x, me.y - 1))) {
            me.x = st.x;
            me.y--;
            me.jump = w.clock;
            return "go";
          }
          return "fail";
        }
        case BRIDGE: {
          const u = get(st.x, me.y + 1);
          if (!solid(u)) {
            if (!pass(u) && u !== WATER) return "fail";
            const b = spend("rock");
            if (b < 0) return "fail";
            place(st.x, me.y + 1, b);
            return "go";
          }
          if (!pass(get(st.x, me.y))) return "fail";
          me.x = st.x;
          return "go";
        }
        case TUNNEL: {
          if (!pass(get(st.x, st.y))) return strike(st.x, st.y) ? "go" : "fail";
          me.x = st.x;
          return "go";
        }
        case DIG: {
          if (!pass(get(me.x, me.y + 1))) return strike(me.x, me.y + 1) ? "go" : "fail";
          me.y++; // and down into it
          return "go";
        }
        case UP:
        case CLIMB: {
          if (!pass(get(me.x, me.y - 1))) return st.act === UP && strike(me.x, me.y - 1) ? "go" : "fail";
          if (here !== LADDER && here !== WATER) {
            if (here !== AIR) return "fail";
            place(me.x, me.y, LADDER);
          }
          me.y--;
          return "go";
        }
        case PILLAR: {
          if (!pass(get(me.x, me.y - 1)) || here !== AIR) return "fail";
          const b = spend("rock");
          if (b < 0) return "fail";
          me.y--;
          me.jump = w.clock;
          place(me.x, me.y + 1, b);
          return "go";
        }
      }
      return "fail";
    };

    const travel = (done: (x: number, y: number) => boolean, hx: number, hy: number, o: { dig?: boolean; build?: boolean; budget?: number } = {}) => {
      if (!holds(me.x, me.y)) return "going"; // still falling
      if (done(me.x, me.y)) {
        me.path.length = 0;
        me.replans = 0;
        return "here";
      }
      // going nowhere (and not cutting through anything): think again
      const at = idx(me.x, me.y);
      me.idle = at === me.at && w.clock - struck[me.hitCell] > 0.4 ? me.idle + 1 : 0;
      me.at = at;
      if (me.idle > 10) {
        me.idle = 0;
        me.path.length = 0;
      }
      if (!me.path.length) {
        if (me.replans++ > 5) return "fail";
        const p = search(done, hx, hy, o) ?? (o.dig ? null : search(done, hx, hy, { ...o, dig: true }));
        if (!p) return "fail";
        me.path = p;
      }
      if (follow() === "fail") me.path.length = 0;
      return "going";
    };

    /* -- what there is to do --------------------------------------------------- */

    const shunned = (i: number) => (w.shun.get(i) ?? -1) > w.clock;
    const shun = (i: number) => w.shun.set(i, w.clock + 60);

    const findTree = () => {
      let best: [number, number] | null = null;
      let bd = 1e9;
      for (let x = Math.max(1, me.x - 40); x < Math.min(cols - 1, me.x + 40); x++) {
        for (let y = 1; y < rows - 1; y++) {
          const i = idx(x, y);
          if (blk[i] !== LOG || blk[i + cols] === LOG || guard[i] || shunned(i)) continue;
          const d = Math.abs(x - me.x) + Math.abs(y - me.y) * 1.5;
          if (d < bd) {
            bd = d;
            best = [x, y];
          }
        }
      }
      return best;
    };
    const findOre = (cx: number, cy: number, r: number) => {
      let best: { x: number; y: number; b: number } | null = null;
      let bs = 0;
      for (let x = Math.max(1, cx - r); x < Math.min(cols - 1, cx + r); x++) {
        for (let y = Math.max(1, ground[x] + 2); y < rows - 1; y++) {
          const i = idx(x, y);
          const b = blk[i];
          if (!ORE[b] || shunned(i)) continue;
          const s = (WORTH[b] * 10) / (12 + Math.abs(x - cx) + Math.abs(y - cy) * 1.6);
          if (s > bs) {
            bs = s;
            best = { x, y, b };
          }
        }
      }
      return best;
    };
    const findShore = () => {
      let best: Extract<Goal, { kind: "fish" }> | null = null;
      let bd = 1e9;
      for (let x = Math.max(2, me.x - 45); x < Math.min(cols - 2, me.x + 45); x++) {
        for (let y = 2; y < rows - 2; y++) {
          if (blk[idx(x, y)] !== AIR || !solid(get(x, y + 1)) || open[idx(x, y)] < 0.7) continue;
          for (const d of [-1, 1]) {
            if (get(x + d, y + 1) !== WATER || get(x + d, y) !== AIR) continue;
            let k = 3;
            while (k > 1 && get(x + d * k, y + 1) !== WATER) k--;
            const dist = Math.abs(x - me.x) + Math.abs(y - me.y);
            if (dist < bd && !shunned(idx(x, y))) {
              bd = dist;
              best = { kind: "fish", x, y, dir: d, bx: x + d * k, by: y + 1, cast: -1, bite: -1 };
            }
          }
          break;
        }
      }
      return best;
    };
    // where the ground is, under any trees
    const surfaceAt = (x: number) => {
      for (let y = 0; y < rows - 1; y++) {
        const b = blk[idx(x, y)];
        if (b === AIR || b === LEAF || b === LOG || b === FLOWER || b === SAPLING || b === CROP) continue;
        return { y, b };
      }
      return { y: rows - 1, b: BED };
    };
    // somewhere flat and dry to build, near where it stands
    const chooseSite = (): Site | null => {
      let best: Site | null = null;
      let bs = -1e9;
      for (let x0 = 4; x0 < cols - 10; x0++) {
        let lo = -1;
        let hi = rows;
        let ok = true;
        let trees = 0;
        for (let x = x0; x <= x0 + 4 && ok; x++) {
          const s = surfaceAt(x);
          if (s.b === WATER || s.b === LAVA || s.b === BED || s.y >= sea - 1) ok = false;
          lo = Math.max(lo, s.y);
          hi = Math.min(hi, s.y);
          for (let y = s.y - 6; y < s.y; y++) if (get(x, y) === LOG) trees++;
        }
        if (!ok || lo - hi > 1 || lo < 7) continue;
        let rock = 0;
        for (let x = x0 - 1; x <= x0 + 5; x++) for (let y = lo - 6; y < lo; y++) if (solid(get(x, y)) && get(x, y) !== LOG) rock++;
        // in the open middle of the world: the lake and the titles keep the left, cards float on the right
        const f = (x0 + 2) / cols;
        const score = -Math.abs(x0 + 2 - me.x) * 0.4 - (lo - hi) * 3 - trees * 2 - rock * 4 + (f > 0.45 && f < 0.7 ? 8 : 0);
        if (score > bs) {
          bs = score;
          best = { x0, fy: lo, left: x0 + 2 > cols / 2 };
        }
      }
      return best;
    };
    const doorOf = (s: Site) => (s.left ? s.x0 : s.x0 + 4);
    const bedOf = (s: Site): [number, number] => [s.x0 + 2, s.fy - 1];
    const chestOf = (s: Site): [number, number] => [s.left ? s.x0 + 3 : s.x0 + 1, s.fy - 1];
    // the house: a floor, two walls with a door and a window, a gabled roof of tiles, a lamp and a chest inside
    const blueprint = (s: Site): Op[] => {
      const { x0, fy } = s;
      const door = doorOf(s);
      const wall = s.left ? x0 + 4 : x0;
      const [cx] = chestOf(s);
      const ops: Op[] = [];
      for (let y = fy - 2; y <= fy - 1; y++) for (let x = x0 + 1; x <= x0 + 3; x++) if (!(x === cx && y === fy - 1) && !(x === x0 + 2 && y === fy - 2)) ops.push({ x, y, b: AIR });
      for (let x = x0; x <= x0 + 4; x++) ops.push({ x, y: fy, b: FLOOR });
      ops.push({ x: wall, y: fy - 1, b: PLANK }, { x: wall, y: fy - 2, b: GLASS }, { x: door, y: fy - 2, b: PLANK });
      for (let x = x0 - 1; x <= x0 + 5; x++) ops.push({ x, y: fy - 3, b: ROOF });
      for (let x = x0 + 1; x <= x0 + 3; x++) ops.push({ x, y: fy - 4, b: ROOF });
      ops.push({ x: x0 + 2, y: fy - 5, b: ROOF }, { x: x0 + 2, y: fy - 2, b: TORCH }, { x: cx, y: fy - 1, b: CHEST }, { x: door, y: fy - 1, b: DOOR });
      return ops;
    };
    // a strip of field off the house's blind side
    const fieldOps = (s: Site): Op[] => {
      const ops: Op[] = [];
      for (let k = 1; k <= 3; k++) {
        const x = s.left ? s.x0 + 4 + k : s.x0 - k;
        const b = get(x, s.fy);
        if ((b !== GRASS && b !== DIRT && b !== FARM) || !pass(get(x, s.fy - 1)) || get(x, s.fy - 1) === DOOR) break;
        ops.push({ x, y: s.fy, b: FARM }, { x, y: s.fy - 1, b: CROP });
      }
      return ops;
    };
    const satisfied = (op: Op) => {
      const b = get(op.x, op.y);
      return op.b === FLOOR ? solid(b) : op.b === AIR ? b === AIR || b === TORCH : b === op.b;
    };
    const cost = (ops: Op[]) => ops.filter((op) => op.b !== AIR && op.b !== TORCH && op.b !== FARM && op.b !== CROP && !satisfied(op)).length;

    /* -- deciding ------------------------------------------------------------ */

    const set = (goal: Goal, g?: string) => {
      me.goal = goal;
      me.path.length = 0;
      me.replans = 0;
      me.hitCell = -1;
      if (g) think(g);
    };
    const finish = (g?: string, red = false) => {
      me.goal = null;
      me.path.length = 0;
      w.bobber = null;
      for (const f of w.fish) f.lure = false;
      if (g) think(g, red);
    };

    const decide = () => {
      const p = phase();
      const inv = me.inv;
      if (bedtime(p)) {
        if (w.home) set({ kind: "sleep", asleep: false }, "眠");
        else set({ kind: "shelter", stage: 0, y: me.y }, "眠");
        return;
      }
      if (me.food <= 3 && inv.fish + inv.wheat > 0) return set({ kind: "eat" });
      const drop = w.drops.find((d) => Math.abs(d.x - me.x) < 24 && Math.abs(d.y - me.y) < 14);
      if (drop) return set({ kind: "collect", drop }, "！");
      const dusk = p > 0.6;
      const ideas: [number, Goal, string?][] = [];
      const tree = findTree();
      if (tree) ideas.push([1.5 + Math.max(0, 12 - inv.wood) * 0.45, { kind: "chop", x: tree[0], y: tree[1] }, "木"]);
      if (!w.site && w.clock > w.siteAt) {
        w.site = chooseSite();
        w.siteAt = w.clock + 30;
      }
      const site = w.site;
      if (site) {
        const ops = blueprint(site).filter((op) => !satisfied(op));
        const need = cost(ops);
        const joinery = ops.filter((op) => op.b === DOOR || op.b === CHEST).length;
        if (ops.length && w.clock > w.buildAt && inv.wood >= joinery && inv.wood + inv.rock >= need) ideas.push([w.home ? 8.5 : 9, { kind: "build", ops, misses: 0 }, "家"]);
        if (w.home) {
          const field = fieldOps(site).filter((op) => !satisfied(op));
          if (field.length) ideas.push([4.5, { kind: "build", ops: field, misses: 0 }, "田"]);
          for (const [i, when] of w.crops) if (when <= w.clock) ideas.push([7, { kind: "harvest", i }, "麦"]);
          if (inv.coal + inv.iron + inv.gold + inv.gem + inv.ruby >= 4) ideas.push([5, { kind: "store" }, "箱"]);
        }
      }
      if (!dusk) {
        // before there's a roof, it keeps nearer the surface
        const ore = findOre(me.x, me.y, w.home ? 34 : 22);
        if (ore && (w.home || ore.y - me.y < 16)) {
          const want = 2.4 + (inv.rock < 14 ? 2 : 0) + (inv.coal < 2 ? 1.5 : 0) + WORTH[ore.b] * 0.35;
          ideas.push([w.home ? want : want * 0.6, { kind: "mine", ...ore, back: false, since: w.clock }, BLOCK[ore.b]]);
        }
      }
      const shore = w.fish.length ? findShore() : null;
      if (shore) ideas.push([1.4 + Math.max(0, 8 - me.food) * 0.6, shore, "魚"]);
      if (inv.seed > 0) {
        let trees = 0;
        for (let i = 0; i < N; i++) if (blk[i] === LOG && blk[i + cols] !== LOG) trees++;
        if (trees < cols / 14) {
          const x = clamp(me.x + Math.round((rand() - 0.5) * 30), 3, cols - 4);
          const s = surfaceAt(x);
          if (s.b === GRASS && get(x, s.y - 1) === AIR) ideas.push([3, { kind: "plant", x, y: s.y - 1 }, "苗"]);
        }
      }
      ideas.push([2.4, { kind: "wander", tx: clamp(me.x + (rand() < 0.5 ? -1 : 1) * (8 + Math.round(rand() * 26)), 2, cols - 3) }]);
      ideas.push([1.2, { kind: "rest", ticks: 8 + Math.round(rand() * 14) }]);
      // evening: home, and the stars coming out
      if (dusk) {
        if (w.home && site && Math.abs(me.x - doorOf(site)) > 4) ideas.push([6, { kind: "wander", tx: doorOf(site) + (site.left ? -2 : 2) }]);
        else ideas.push([6, { kind: "rest", ticks: 18, gaze: true }, "星"]);
      }
      let best = ideas[0];
      let bs = -1;
      for (const idea of ideas) {
        const s = idea[0] * (0.7 + rand() * 0.6);
        if (s > bs) {
          bs = s;
          best = idea;
        }
      }
      set(best[1], best[2]);
    };

    /* -- doing --------------------------------------------------------------- */

    const torchUp = () => {
      // in the dark underground, it lights the way behind it
      const i = idx(me.x, me.y);
      if (me.inv.coal <= 0 || me.y <= ground[me.x] + 1 || lamp[i] > 0.3 || blk[i] !== AIR) return;
      const next = me.path[0];
      if (!next || next.x === me.x) return;
      me.inv.coal--;
      place(me.x, me.y, TORCH);
    };

    const pursue = (g: Goal) => {
      switch (g.kind) {
        case "wander": {
          const r = travel((x) => Math.abs(x - g.tx) <= 1, g.tx, me.y, { build: me.inv.wood + me.inv.rock > 6 });
          if (r === "here") finish();
          else if (r === "fail") finish("？");
          return;
        }
        case "rest": {
          if (rand() < 0.12) me.dir = -me.dir; // looking round
          if (g.gaze && nightOf(phase()) > 0.4 && rand() < 0.04) think("星");
          if (--g.ticks <= 0) finish();
          return;
        }
        case "chop": {
          if (get(g.x, g.y) !== LOG) {
            if (w.timber.length) return; // watching it come down
            if (get(g.x, g.y) === AIR && (get(g.x, g.y + 1) === GRASS || get(g.x, g.y + 1) === DIRT)) {
              place(g.x, g.y, SAPLING);
              me.inv.seed = Math.max(0, me.inv.seed - 1);
              think("苗");
            }
            return finish();
          }
          const r = travel((x, y) => Math.abs(x - g.x) <= 1 && y >= g.y && y - g.y <= 1 && x !== g.x, g.x, g.y, { build: true });
          if (r === "fail") {
            shun(idx(g.x, g.y));
            return finish("？");
          }
          if (r !== "here") return;
          strike(g.x, g.y);
          return;
        }
        case "build": {
          while (g.ops.length && satisfied(g.ops[0])) g.ops.shift();
          if (!g.ops.length) {
            if (w.site) for (const op of blueprint(w.site)) if (op.b !== AIR) guard[idx(op.x, op.y)] = 1;
            if (!w.home && w.site) {
              w.home = true;
              think("家");
            }
            return finish();
          }
          const op = g.ops[0];
          // the way there is by ladder and tunnel: what it carries is for the building
          const near = Math.abs(me.x - op.x) + Math.abs(me.y - op.y) < 8;
          const r = travel(
            (x, y) => !(x === op.x && y === op.y) && Math.abs(x - op.x) <= REACH && y - op.y <= 4 && op.y - y <= 2,
            op.x,
            op.y,
            { build: near, dig: !near },
          );
          if (r === "fail") {
            // try the rest first; come back to this one
            g.ops.push(g.ops.shift()!);
            me.replans = 0;
            if (++g.misses > Math.min(6, g.ops.length + 1)) {
              w.buildAt = w.clock + 25;
              finish("？");
            }
            return;
          }
          if (r !== "here") return;
          const cur = get(op.x, op.y);
          const till = op.b === FARM && (cur === GRASS || cur === DIRT || cur === SNOW);
          if (cur !== AIR && !till && !(op.b === FLOOR && cur === WATER)) {
            if (!breakable(cur) || cur === WATER) g.ops.shift();
            else if (SOFT[cur]) smash(idx(op.x, op.y), "me");
            else strike(op.x, op.y);
            return;
          }
          if (op.b === AIR) return;
          if (op.x === me.x && op.y === me.y) {
            me.path.length = 0;
            return;
          }
          // what it's made of: wood for the joinery, stone for the floor and the roof, wood if the stone runs out
          let b = op.b;
          if (b === CROP && get(op.x, op.y + 1) !== FARM) return void g.ops.shift();
          if (b === FLOOR) b = spend("rock");
          else if (b === PLANK) b = spend("wood");
          else if (b === DOOR || b === CHEST) {
            if (me.inv.wood > 0) me.inv.wood--;
            else if (g.ops.some((o) => o.b !== DOOR && o.b !== CHEST && !satisfied(o))) {
              // no wood for this yet: the rest first
              g.ops.push(g.ops.shift()!);
              return;
            } else b = -1;
          } else if (b === ROOF || b === GLASS) {
            if (me.inv.rock > 0) me.inv.rock--;
            else if (me.inv.wood > 0) {
              me.inv.wood--;
              if (b === ROOF) b = PLANK;
            } else b = -1;
          }
          if (b < 0) {
            w.buildAt = w.clock + 10;
            return finish("？"); // out of things to build with: off to find more
          }
          if (op.x !== me.x) me.dir = op.x > me.x ? 1 : -1;
          place(op.x, op.y, b);
          if (b !== CROP && b !== FARM && b !== TORCH) guard[idx(op.x, op.y)] = 1;
          g.ops.shift();
          return;
        }
        case "mine": {
          if (g.back) {
            const r = travel((x, y) => open[idx(x, y)] > 0.6 && y <= ground[x] + 1, me.x, 0, { dig: true, build: true });
            if (r !== "going") finish();
            return;
          }
          if (w.clock - g.since > 38) {
            g.back = true; // long enough down there
            return;
          }
          if (get(g.x, g.y) !== g.b) {
            // got it, or something took it: another nearby, or back up
            const more = findOre(g.x, g.y, 6);
            if (more && Math.abs(more.y - g.y) < 6) {
              Object.assign(g, more);
              me.path.length = 0;
              me.replans = 0;
              think(BLOCK[more.b]);
            } else g.back = true;
            return;
          }
          const r = travel((x, y) => Math.abs(x - g.x) + Math.abs(y - g.y) === 1, g.x, g.y, { dig: true });
          if (r === "fail") {
            shun(idx(g.x, g.y));
            return finish("？");
          }
          if (r === "going") return torchUp();
          strike(g.x, g.y);
          if (get(g.x, g.y) !== g.b) {
            think(BLOCK[g.b], g.b === RUBY);
            for (let k = 0; k < 4; k++) bit(g.x, g.y, "・", { vx: (rand() - 0.5) * 6, vy: -3 - rand() * 3, fall: 14, life: 0.6, ink: k ? INK.BONE : INK.RED });
          }
          return;
        }
        case "sleep": {
          if (!w.home || !w.site) return set({ kind: "shelter", stage: 0, y: me.y });
          const [bx, by] = bedOf(w.site);
          if (!g.asleep) {
            const r = travel((x, y) => x === bx && y === by, bx, by, { dig: true, build: true, budget: 16000 });
            if (r === "fail") set({ kind: "shelter", stage: 0, y: me.y });
            else if (r === "here") g.asleep = true;
            return;
          }
          if (!bedtime(phase())) finish("日");
          return;
        }
        case "shelter": {
          if (g.stage === 0) {
            // two blocks down into the ground
            if (me.y >= g.y + 2 || !diggable(me.x, me.y + 1)) g.stage = 1;
            else if (holds(me.x, me.y)) strike(me.x, me.y + 1);
            return;
          }
          if (g.stage === 1) {
            // and the hole closed over its head
            if (me.y > g.y && pass(get(me.x, me.y - 1)) && get(me.x, me.y - 1) !== WATER) {
              const b = spend("rock");
              if (b >= 0) place(me.x, me.y - 1, b);
            }
            g.stage = 2;
            return;
          }
          if (!bedtime(phase())) set({ kind: "surface" }, "日");
          return;
        }
        case "surface": {
          const r = travel((x, y) => open[idx(x, y)] > 0.6, me.x, 0, { dig: true, build: true });
          if (r !== "going") finish();
          return;
        }
        case "fish": {
          if (g.cast < 0) {
            const r = travel((x, y) => x === g.x && y === g.y, g.x, g.y, { build: true });
            if (r === "fail") {
              shun(idx(g.x, g.y));
              return finish("？");
            }
            if (r !== "here") return;
            if (get(g.bx, g.by) !== WATER) return finish();
            g.cast = w.clock;
            w.bobber = { x: g.bx, y: g.by };
            return;
          }
          me.dir = g.dir;
          if (g.bite < 0) {
            // the nearest fish comes to look
            let near: Fish | null = null;
            let nd = 30;
            for (const f of w.fish) {
              if (f.air) continue;
              const d = Math.hypot(f.x - g.bx, f.y - g.by);
              if (d < nd) {
                nd = d;
                near = f;
              }
            }
            if (near) {
              near.lure = true;
              if (nd < 1.1) {
                g.bite = w.clock;
                w.fish.splice(w.fish.indexOf(near), 1);
              }
            }
            if (w.clock - g.cast > 16) finish("？");
            return;
          }
          if (w.clock - g.bite > 0.8) {
            // reeled in: it arcs over to the bank
            const t = 0.55;
            bit(g.bx, g.by - 1, "魚", { vx: (me.x - g.bx) / t, vy: -10, fall: 2 * ((me.y - g.by + 1) + 10 * t) / (t * t), life: t, a: 0.95 });
            me.inv.fish++;
            finish("！");
          }
          return;
        }
        case "harvest": {
          const x = g.i % cols;
          const y = (g.i - x) / cols;
          if (blk[g.i] !== CROP) return finish();
          const r = travel((xx, yy) => Math.abs(xx - x) <= 2 && Math.abs(yy - y) <= 1 && !(xx === x && yy === y), x, y, {});
          if (r === "fail") return finish("？");
          if (r !== "here") return;
          smash(g.i, "me");
          if (get(x, y + 1) === FARM) place(x, y, CROP);
          return finish();
        }
        case "store": {
          if (!w.site) return finish();
          const [cx, cy] = chestOf(w.site);
          const r = travel((x, y) => Math.abs(x - cx) <= 1 && Math.abs(y - cy) <= 1, cx, cy, {});
          if (r === "fail") return finish("？");
          if (r !== "here") return;
          for (const k of ["coal", "iron", "gold", "gem", "ruby"] as const) {
            const keep = k === "coal" ? 4 : 0;
            if (me.inv[k] > keep) {
              w.stash += me.inv[k] - keep;
              me.inv[k] = keep;
            }
          }
          placed[idx(cx, cy)] = w.clock;
          return finish("箱");
        }
        case "eat": {
          const k = me.inv.fish > 0 ? "fish" : "wheat";
          if (me.inv[k] > 0) {
            me.inv[k]--;
            me.food = Math.min(10, me.food + 5);
          }
          return finish("食");
        }
        case "collect": {
          const d = g.drop;
          if (!w.drops.includes(d)) return finish();
          const r = travel((x, y) => Math.abs(x - d.x) <= 1 && Math.abs(y - d.y) <= 1, d.x, d.y, { build: true });
          if (r === "fail") {
            w.drops.splice(w.drops.indexOf(d), 1);
            finish("？");
          }
          return;
        }
        case "plant": {
          if (get(g.x, g.y) !== AIR || get(g.x, g.y + 1) !== GRASS) return finish();
          const r = travel((x, y) => Math.abs(x - g.x) === 1 && y === g.y, g.x, g.y, {});
          if (r === "fail") return finish("？");
          if (r !== "here") return;
          place(g.x, g.y, SAPLING);
          me.inv.seed--;
          return finish();
        }
        case "fight": {
          const m = g.mob;
          if (!w.mobs.includes(m)) return finish();
          if (me.hp <= 1 || (m.kind === "bomb" && m.fuse >= 0 && w.clock - m.fuse > 0.7)) return set({ kind: "flee", tx: clamp(me.x + (me.x > m.x ? 10 : -10), 2, cols - 3) }, "！");
          if (Math.abs(m.x - me.x) <= 1 && Math.abs(m.y - me.y) <= 1) {
            me.dir = m.x > me.x ? 1 : m.x < me.x ? -1 : me.dir;
            m.hp--;
            m.hurt = w.clock;
            const push = m.x >= me.x ? 1 : -1;
            if (roam(get(m.x + push, m.y))) m.x += push;
            if (m.hp <= 0) {
              kill(m);
              finish("！");
            }
            return;
          }
          me.path.length = 0; // it moves: a fresh route every beat
          if (travel((x, y) => Math.abs(x - m.x) <= 1 && Math.abs(y - m.y) <= 1, m.x, m.y, {}) === "fail") finish("？");
          return;
        }
        case "flee": {
          if (travel((x) => Math.abs(x - g.tx) <= 1, g.tx, me.y, { build: true }) !== "going") finish();
          return;
        }
      }
    };

    const brain = () => {
      if (me.dead >= 0) return;
      const p = phase();
      const goal = me.goal;
      const asleep = (goal?.kind === "sleep" && goal.asleep) || (goal?.kind === "shelter" && goal.stage === 2);
      // asleep it stays asleep, unless something actually gets at it
      const safe = asleep && w.clock - me.hurt > 1;

      // trouble close by: stand and fight, or run
      if (!safe && goal?.kind !== "fight" && goal?.kind !== "flee") {
        const m = w.mobs.find((m) => m.burn < 0 && Math.abs(m.x - me.x) <= 6 && Math.abs(m.y - me.y) <= 3);
        if (m) {
          // a lit fuse, or too hurt to fight: run; otherwise go at it before it gets close
          const away = clamp(me.x + (me.x >= m.x ? 9 : -9), 2, cols - 3);
          if ((m.kind === "bomb" && m.fuse >= 0) || me.hp < (m.kind === "bomb" ? 3 : 2)) set({ kind: "flee", tx: away }, "！");
          else set({ kind: "fight", mob: m }, "！");
          w.bobber = null;
          me.thought!.red = true;
        }
      }
      // evening: up out of the mine in time to get home
      if (p > 0.58 && me.goal?.kind === "mine" && !me.goal.back) {
        me.goal.back = true;
        me.path.length = 0;
        me.replans = 0;
        think("家");
      }
      if (bedtime(p) && me.goal && !["sleep", "shelter", "fight", "flee"].includes(me.goal.kind)) {
        w.bobber = null;
        me.goal = null;
      }

      // the pointer close by: it turns to look, and waves
      const pt = api.pointer;
      const calm = !me.goal || me.goal.kind === "wander" || me.goal.kind === "rest" || (me.goal.kind === "fish" && me.goal.cast >= 0);
      if (pt.on && calm && !asleep) {
        const dx = pt.x - (me.x + 0.5);
        const d = Math.hypot(dx, pt.y - (me.y + 0.5));
        if (d < 10 && Math.abs(dx) > 0.6) me.dir = dx > 0 ? 1 : -1;
        if (d < 4.5 && w.clock - me.greeted > 7) {
          me.wave = w.clock + 1.5;
          me.greeted = w.clock;
          think("！");
        }
      }
      // a cut trunk comes down a log a beat
      const log = w.timber.shift();
      if (log !== undefined && blk[log] === LOG) smash(log, "me");
      if (me.wave > w.clock) return;

      if (!me.goal) decide();
      if (me.goal) pursue(me.goal);
      if (asleep && w.clock - me.lastZ > 1.4) {
        me.lastZ = w.clock;
        bit(me.x + 0.6, me.y - 1, "ｚ", { vx: 0.5, vy: -0.8, life: 2.4, a: 0.55, ink: INK.DIM });
      }
    };

    /* -- the world going on round it ------------------------------------------- */

    const kill = (m: Mob) => {
      const k = w.mobs.indexOf(m);
      if (k >= 0) w.mobs.splice(k, 1);
      for (let n = 0; n < 4; n++) bit(m.x + (rand() - 0.5), m.y, "煙", { vy: -1.5 - rand(), vx: (rand() - 0.5) * 2, life: 1.2, a: 0.4, ink: INK.DIM });
    };

    const blast = (cx: number, cy: number, r: number) => {
      w.blasts.push({ x: cx, y: cy, at: w.clock });
      for (let y = Math.floor(cy - r); y <= cy + r; y++) {
        for (let x = Math.floor(cx - r); x <= cx + r; x++) {
          if (x < 0 || x >= cols || y < 0 || y >= rows - 1) continue;
          const d = Math.hypot(x - cx, y - cy);
          if (d > r - hash(x, y, 61) * 0.8) continue;
          const i = idx(x, y);
          const b = blk[i];
          if (!breakable(b)) continue;
          if (solid(b)) bit(x, y, BLOCK[b], { vx: (x - cx) * 5 + (rand() - 0.5) * 4, vy: (y - cy) * 4 - 7, fall: 20, life: 0.9, a: 0.85 });
          smash(i, "blast");
          if (FLAMMABLE[get(x, y - 1)] && rand() < 0.3) ignite(idx(x, y - 1));
        }
      }
      const d = Math.hypot(me.x - cx, me.y - cy);
      if (d < r + 1.6) hurt(2, me.x >= cx ? 1 : -1);
      for (const s of w.sheep) if (Math.hypot(s.x - cx, s.y - cy) < r + 2) s.hop = w.clock;
      for (const m of [...w.mobs]) if (Math.hypot(m.x - cx, m.y - cy) < r) kill(m);
    };

    const lightning = (x: number) => {
      x = clamp(Math.round(x), 0, cols - 1);
      const ty = Math.min(rows - 2, top[x]);
      const cells: [number, number, string][] = [];
      let px = clamp(x + Math.round((rand() - 0.5) * 10), 0, cols - 1);
      for (let y = 0; y < ty; y++) {
        let dx = rand() < 0.45 ? 0 : rand() < 0.5 ? -1 : 1;
        if (Math.abs(x - px) >= ty - y) dx = Math.sign(x - px);
        px += dx;
        cells.push([px, y, dx === 0 ? LINE.v : dx > 0 ? LINE.down : LINE.up]);
        // a fork, now and then
        if (y > 2 && y < ty - 3 && rand() < 0.06) {
          let fx = px;
          const fd = rand() < 0.5 ? -1 : 1;
          for (let k = 1; k < 4 + rand() * 4 && y + k < ty; k++) {
            fx += rand() < 0.7 ? fd : 0;
            cells.push([fx, y + k, fd > 0 ? LINE.down : LINE.up]);
          }
        }
      }
      w.bolts.push({ cells, at: w.clock, x, y: ty });
      w.weather.flash = w.clock;
      const i = idx(x, ty);
      const b = blk[i];
      if (FLAMMABLE[b]) ignite(i);
      else if (b !== WATER && breakable(b) && rand() < 0.35) smash(i, "blast");
      if (Math.abs(me.x - x) < 14 && me.dead < 0) {
        think("！", true);
        if (Math.abs(me.x - x) <= 1 && Math.abs(me.y - ty) <= 2) hurt(2, me.x >= x ? 1 : -1);
      }
      for (const s of w.sheep) if (Math.abs(s.x - x) < 6) s.hop = w.clock;
      for (const m of [...w.mobs]) if (Math.abs(m.x - x) <= 1 && Math.abs(m.y - ty) <= 2) kill(m);
    };

    const tend = () => {
      const wx = w.weather;
      // water runs down into anything open, and out sideways at sea level and below;
      // sand falls; lava that water reaches sets hard
      const wet: number[] = [];
      for (let y = rows - 2; y >= 0; y--) {
        for (let x = 0; x < cols; x++) {
          const i = idx(x, y);
          const b = blk[i];
          if (b === WATER) {
            const d = blk[i + cols];
            if (d === AIR) wet.push(i + cols);
            else if ((solid(d) || d === WATER) && y >= sea) {
              if (x > 0 && blk[i - 1] === AIR) wet.push(i - 1);
              if (x < cols - 1 && blk[i + 1] === AIR) wet.push(i + 1);
            }
          } else if (b === SAND && blk[i + cols] === AIR) {
            blk[i + cols] = SAND;
            blk[i] = AIR;
            dirty();
          } else if (b === LAVA && (get(x, y - 1) === WATER || get(x - 1, y) === WATER || get(x + 1, y) === WATER)) {
            blk[i] = OBSIDIAN;
            for (let k = 0; k < 3; k++) bit(x + (rand() - 0.5), y - 1, "〜", { vy: -2 - rand() * 2, life: 1, a: 0.45, ink: INK.DIM });
            dirty();
          }
        }
      }
      for (const i of wet.slice(0, 60)) {
        blk[i] = WATER;
        dirty();
      }
      // grass creeps back over bare earth in the light
      for (let k = 0; k < 50; k++) {
        const i = Math.floor(rand() * (N - cols * 2)) + cols;
        if (blk[i] !== DIRT || open[i] < 0.8 || !pass(blk[i - cols])) continue;
        if (blk[i - 1] === GRASS || blk[i + 1] === GRASS || blk[i - cols - 1] === GRASS || blk[i - cols + 1] === GRASS) blk[i] = GRASS;
      }
      // rain hurries everything growing along
      const rush = wx.wet > 0.3 ? 0.35 * wx.wet : 0;
      for (const [i, when] of w.growing) {
        if (rush) w.growing.set(i, when - rush);
        if (w.clock < when) continue;
        const x = i % cols;
        const y = (i - x) / cols;
        // as tall as there's room for, under whatever's been built over it
        let room = 0;
        while (room < 6 && (get(x, y - room - 1) === AIR || get(x, y - room - 1) === LEAF)) room++;
        w.growing.delete(i);
        if (room >= 3 && blk[i] === SAPLING) {
          setTree(blk, cols, x, y, Math.min(room - 1, 3 + Math.floor(rand() * 2)), y < rows * 0.42);
          dirty();
        } else if (blk[i] === SAPLING) w.growing.set(i, w.clock + 20);
      }
      if (rush) for (const [i, when] of w.crops) w.crops.set(i, when - rush);
      // leaves with nothing left to hold them come down
      for (const [i, when] of w.decay) {
        if (w.clock < when) continue;
        w.decay.delete(i);
        if (blk[i] === LEAF && !held(i)) {
          blk[i] = AIR;
          const x = i % cols;
          bit(x, (i - x) / cols, "葉", { vy: 2.2, life: 4, a: 0.55, leaf: rand() * 6 });
          dirty();
        }
      }
      // fire: smoke, spreading up and along through anything that burns, out in the rain
      for (const [i, at] of [...w.burning]) {
        if (blk[i] !== FIRE) {
          w.burning.delete(i);
          continue;
        }
        const x = i % cols;
        const y = (i - x) / cols;
        if (rand() < 0.5) bit(x + (rand() - 0.5) * 0.8, y - 1, "煙", { vy: -2.4, vx: wx.wind * 1.5, life: 1.6, a: 0.35, ink: INK.DIM });
        if ((wx.wet > 0.3 && rand() < wx.wet * 0.12) || w.clock - at > 2.2 + hash(i, 5) * 2.5) {
          blk[i] = AIR;
          w.burning.delete(i);
          dirty();
          continue;
        }
        if (w.burning.size > 90) continue;
        for (const [dx, dy, chance] of [[0, -1, 0.35], [-1, 0, 0.18], [1, 0, 0.18], [-1, -1, 0.2], [1, -1, 0.2], [0, 1, 0.06]]) {
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 0 || xx >= cols || yy < 0 || yy >= rows) continue;
          if (FLAMMABLE[blk[idx(xx, yy)]] && rand() < chance * (1 - wx.wet * 0.8)) ignite(idx(xx, yy));
        }
      }
      // the weather turns
      if (w.clock > wx.until) {
        wx.kind = wx.kind !== "clear" ? "clear" : rand() < 0.6 ? "rain" : "storm";
        wx.until = w.clock + (wx.kind === "clear" ? 60 + rand() * 70 : 35 + rand() * 40);
        wx.nextBolt = w.clock + 6;
      }
      if (wx.kind === "storm" && wx.wet > 0.6 && w.clock > wx.nextBolt) {
        wx.nextBolt = w.clock + 4 + rand() * 8;
        // the tallest of a few places it might come down
        let bx = 0;
        let by = rows;
        for (let k = 0; k < 4; k++) {
          const x = Math.floor(rand() * cols);
          if (top[x] < by) {
            by = top[x];
            bx = x;
          }
        }
        lightning(bx);
      }
      // the lake keeps its fish
      if (w.fish.length < w.fishCap && rand() < 0.08) {
        for (let k = 0; k < 40; k++) {
          const i = Math.floor(rand() * N);
          if (blk[i] !== WATER || i < cols || blk[i - cols] !== WATER) continue;
          w.fish.push({ x: i % cols, y: Math.floor(i / cols), vx: rand() < 0.5 ? -1 : 1, vy: 0, air: false, lure: false });
          break;
        }
      }
      for (const [i, until] of w.shun) if (until < w.clock) w.shun.delete(i);
    };

    // a beast's step: along, up one, or turn back from water and cliffs
    const amble = (b: { x: number; y: number; dir: number }, wary: boolean) => {
      const nx = b.x + b.dir;
      if (nx < 1 || nx > cols - 2) {
        b.dir = -b.dir;
        return;
      }
      if (roam(get(nx, b.y))) {
        let drop = 0;
        while (drop < 4 && roam(get(nx, b.y + 1 + drop)) && get(nx, b.y + 1 + drop) !== WATER) drop++;
        if (wary && (drop > 2 || get(nx, b.y + 1 + drop) === WATER || get(nx, b.y + 1 + drop) === LAVA)) b.dir = -b.dir;
        else b.x = nx;
      } else if (roam(get(nx, b.y - 1)) && roam(get(b.x, b.y - 1))) {
        b.x = nx;
        b.y--;
      } else b.dir = -b.dir;
    };

    const graze = () => {
      const night = nightOf(phase());
      for (const s of w.sheep) {
        if (get(s.x, s.y) === WATER) {
          if (roam(get(s.x, s.y - 1))) s.y--;
          amble(s, false);
          continue;
        }
        if (!beastHolds(s.x, s.y)) {
          s.y++;
          continue;
        }
        if (solid(get(s.x, s.y))) s.y--;
        const threat = w.mobs.find((m) => Math.abs(m.x - s.x) < 5 && Math.abs(m.y - s.y) < 3);
        if (threat) {
          s.dir = s.x >= threat.x ? 1 : -1;
          amble(s, false);
          continue;
        }
        if (night > 0.6) continue;
        const mate = w.sheep.find((o) => o !== s && Math.abs(o.x - s.x) > 4 && Math.abs(o.x - s.x) < 18);
        if (mate && rand() < 0.3) s.dir = mate.x > s.x ? 1 : -1;
        else if (rand() < 0.12) s.dir = -s.dir;
        if (rand() < 0.4) amble(s, true);
        else if (get(s.x, s.y + 1) === GRASS && rand() < 0.06) {
          blk[idx(s.x, s.y + 1)] = DIRT;
          bit(s.x, s.y, "・", { vy: -1, life: 0.6, a: 0.5 });
        }
      }
      // lambs, by day
      if (w.sheep.length && w.sheep.length < w.sheepCap && night < 0.3 && rand() < 0.02) {
        const a = w.sheep[Math.floor(rand() * w.sheep.length)];
        if (w.sheep.some((b) => b !== a && Math.abs(b.x - a.x) <= 2 && Math.abs(b.y - a.y) <= 1)) {
          w.sheep.push({ x: a.x, y: a.y, dir: -a.dir, hop: w.clock });
          bit(a.x, a.y - 1, "・", { vy: -1.5, life: 0.8 });
        }
      }
    };

    const prowl = () => {
      const night = nightOf(phase());
      for (const m of [...w.mobs]) {
        if (m.burn >= 0) {
          if (w.clock - m.burn > 1.6) kill(m);
          continue;
        }
        if (get(m.x, m.y) === WATER) {
          if (roam(get(m.x, m.y - 1))) m.y--;
        } else if (!beastHolds(m.x, m.y)) {
          if (++m.y >= rows - 1) kill(m);
          continue;
        }
        // the sun finds anything out in the open
        if (night < 0.3) {
          if (open[idx(m.x, m.y)] > 0.7) {
            m.burn = w.clock;
            continue;
          }
          if (rand() < 0.04) {
            kill(m);
            continue;
          }
        }
        const dx = me.x - m.x;
        const dy = me.y - m.y;
        const close = me.dead < 0 && Math.abs(dx) <= 1 && Math.abs(dy) <= 1;
        if (m.kind === "bomb") {
          if (close || (m.fuse >= 0 && Math.abs(dx) <= 3 && Math.abs(dy) <= 2)) {
            if (m.fuse < 0) m.fuse = w.clock;
            if (w.clock - m.fuse > 1.4) {
              const k = w.mobs.indexOf(m);
              if (k >= 0) w.mobs.splice(k, 1);
              blast(m.x, m.y, 2.6);
            }
            continue;
          }
          m.fuse = -1;
        } else if (close) {
          if (w.clock - m.hitAt > 1.1) {
            m.hitAt = w.clock;
            hurt(1, dx > 0 ? 1 : dx < 0 ? -1 : 0);
          }
          continue;
        }
        if (me.dead < 0 && Math.abs(dx) < 32 && dx) m.dir = dx > 0 ? 1 : -1;
        else if (rand() < 0.1) m.dir = -m.dir;
        if (rand() < 0.2) continue; // shambling
        amble(m, false);
      }
    };

    const spawn = () => {
      if (nightOf(phase()) < 0.6 || w.mobs.length >= Math.min(4, 1 + Math.floor(cols / 45))) return;
      for (let tries = 0; tries < 12; tries++) {
        const x = 2 + Math.floor(rand() * (cols - 4));
        if (Math.abs(x - me.x) < 12) continue;
        if (w.site && x > w.site.x0 - 5 && x < w.site.x0 + 10) continue;
        const y = rand() < 0.65 ? top[x] - 1 : ground[x] + 3 + Math.floor(rand() * Math.max(1, rows - ground[x] - 5));
        if (y < 1 || y >= rows - 1) continue;
        const i = idx(x, y);
        if (blk[i] !== AIR || !solid(get(x, y + 1)) || lamp[i] > 0.25) continue;
        w.mobs.push({ kind: rand() < 0.28 ? "bomb" : "oni", x, y, dir: x < me.x ? 1 : -1, hp: 3, hitAt: 0, hurt: -99, fuse: -1, burn: -1 });
        for (let k = 0; k < 4; k++) bit(x + (rand() - 0.5) * 2, y, "・", { vy: -1 - rand(), life: 0.9, a: 0.5, ink: INK.DIM });
        return;
      }
    };

    const fall = () => {
      if (me.dead >= 0) {
        if (w.clock - me.dead > 2.4) respawn();
      } else {
        const here = get(me.x, me.y);
        if (solid(here)) {
          if (pass(get(me.x, me.y - 1))) me.y--;
          else smash(idx(me.x, me.y), "blast");
        } else if (here === LAVA || here === FIRE) {
          hurt(1, 0);
          if (pass(get(me.x, me.y - 1))) me.y--;
        } else if (here === WATER) {
          if (!me.path.length && get(me.x, me.y - 1) === WATER) me.y--;
        } else if (!holds(me.x, me.y)) me.y++;
        if (me.y >= rows - 1) respawn();
      }
      for (const d of [...w.drops]) {
        if (roam(get(d.x, d.y + 1)) && get(d.x, d.y + 1) !== WATER) d.y++;
        if (me.dead < 0 && Math.abs(d.x - me.x) <= 1 && Math.abs(d.y - me.y) <= 1) {
          const item = yieldOf(d.b);
          if (item) me.inv[item] = Math.min(40, me.inv[item] + 1);
          w.drops.splice(w.drops.indexOf(d), 1);
        } else if (w.clock - d.at > 60) w.drops.splice(w.drops.indexOf(d), 1);
      }
    };

    /* -- in between beats ----------------------------------------------------- */

    const fly = (dt: number, p: number) => {
      const away = (p > 0.6 && p < 0.985) || w.weather.kind === "storm";
      if (!away && !w.birds.length && rand() < dt * 0.06) {
        // a flock comes back in over one edge
        const side = rand() < 0.5 ? -1 : 1;
        const n = clamp(Math.round(cols / 10), 5, 13);
        for (let k = 0; k < n; k++) {
          w.birds.push({ x: side < 0 ? -2 - rand() * 4 : cols + 2 + rand() * 4, y: rows * 0.1 + rand() * rows * 0.1, vx: -side * 6, vy: 0, phase: rand() * 6 });
        }
      }
      const pt = api.pointer;
      for (const b of w.birds) {
        let ax = 0;
        let ay = 0;
        let cx = 0;
        let cy = 0;
        let vx = 0;
        let vy = 0;
        let n = 0;
        for (const o of w.birds) {
          if (o === b) continue;
          const dx = o.x - b.x;
          const dy = o.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > 49) continue;
          n++;
          cx += dx;
          cy += dy;
          vx += o.vx;
          vy += o.vy;
          if (d2 < 2.6) {
            ax -= (dx / (d2 + 0.1)) * 2.4;
            ay -= (dy / (d2 + 0.1)) * 2.4;
          }
        }
        if (n) {
          ax += (cx / n) * 0.55 + (vx / n - b.vx) * 0.9;
          ay += (cy / n) * 0.55 + (vy / n - b.vy) * 0.9;
        }
        // keep to the sky, over the hills and the trees
        const gx = clamp(Math.round(b.x), 0, cols - 1);
        const ceil = Math.min(top[gx], ground[gx]) - 4;
        if (b.y > ceil) ay -= (b.y - ceil) * 4;
        if (b.y < 2) ay += (2 - b.y) * 3;
        if (away) ax += (b.x < cols / 2 ? -1 : 1) * 5;
        else {
          if (b.x < 4) ax += (4 - b.x) * 1.6;
          if (b.x > cols - 5) ax -= (b.x - cols + 5) * 1.6;
        }
        ax += (fbm(b.x * 0.05, w.clock * 0.2 + b.phase, 2) - 0.5) * 7;
        ay += (fbm(b.y * 0.07 + 9, w.clock * 0.2 + b.phase, 2) - 0.5) * 5;
        // and scatter from the pointer
        if (pt.on) {
          const dx = b.x - pt.x;
          const dy = b.y - pt.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 70) {
            ax += (dx / (d2 + 1)) * 70;
            ay += (dy / (d2 + 1)) * 70;
          }
        }
        b.vx += ax * dt;
        b.vy += ay * dt;
        const s = Math.hypot(b.vx, b.vy);
        const k = s > 10 ? 10 / s : s < 4 && s > 0 ? 4 / s : 1;
        b.vx *= k;
        b.vy *= k;
        b.x += b.vx * dt;
        b.y += b.vy * dt * 0.7;
        b.phase += dt * (5 + s * 0.8);
      }
      if (away) w.birds = w.birds.filter((b) => b.x > -6 && b.x < cols + 6);
    };

    const swim = (dt: number) => {
      const bob = w.bobber;
      for (const f of [...w.fish]) {
        if (f.air) {
          f.vy += 16 * dt;
          f.x += f.vx * dt;
          f.y += f.vy * dt;
          const b = get(Math.round(f.x), Math.floor(f.y));
          if (f.vy > 0 && b === WATER) {
            f.air = false;
            f.vy = 0.5;
            bit(f.x, f.y - 1, "〜", { life: 0.5, a: 0.6 });
          } else if (f.y >= rows || solid(b)) w.fish.splice(w.fish.indexOf(f), 1);
          continue;
        }
        if (get(Math.round(f.x), Math.floor(f.y)) !== WATER) {
          // its water has gone
          w.fish.splice(w.fish.indexOf(f), 1);
          bit(f.x, f.y, "魚", { vy: -3, fall: 12, life: 0.6, a: 0.6 });
          continue;
        }
        if (bob && f.lure) {
          f.vx += (bob.x - f.x) * dt * 2.2;
          f.vy += (bob.y + 0.6 - f.y) * dt * 2.2;
        } else {
          f.vx += (rand() - 0.5) * dt * 3;
          f.vy += (rand() - 0.5) * dt * 2;
        }
        f.vx = clamp(f.vx, -2.6, 2.6);
        f.vy = clamp(f.vy, -1.2, 1.2);
        if (Math.abs(f.vx) < 0.6) f.vx = f.vx < 0 ? -0.6 : 0.6;
        const nx = f.x + f.vx * dt;
        if (get(Math.round(nx), Math.floor(f.y)) === WATER) f.x = nx;
        else f.vx = -f.vx;
        const ny = f.y + f.vy * dt;
        if (get(Math.round(f.x), Math.floor(ny)) === WATER) f.y = ny;
        else if (f.vy < 0 && !f.lure && get(Math.round(f.x), Math.floor(ny)) === AIR && rand() < 0.15) {
          // up at the surface: sometimes a leap
          f.air = true;
          f.vy = -7 - rand() * 3;
          f.vx = (f.vx < 0 ? -1 : 1) * (2 + rand() * 2);
          bit(f.x, f.y - 1, "〜", { life: 0.5, a: 0.6 });
        } else f.vy = -f.vy * 0.5;
      }
    };

    /* -- the frame ------------------------------------------------------------ */

    let last = 0;
    return (t) => {
      const dt = Math.min(0.1, Math.max(0, t - last));
      last = t;
      w.clock += dt;
      const now = w.clock;
      const nx = w.next;
      if (now >= nx.fall) {
        fall();
        nx.fall = now + 0.08;
      }
      if (now >= nx.think) {
        brain();
        nx.think = now + 0.17;
      }
      if (now >= nx.tend) {
        tend();
        nx.tend = now + 0.35;
      }
      if (now >= nx.mobs) {
        prowl();
        nx.mobs = now + 0.32;
      }
      if (now >= nx.sheep) {
        graze();
        nx.sheep = now + 0.55;
      }
      if (now >= nx.spawn) {
        spawn();
        nx.spawn = now + 2.2;
      }
      if (now >= nx.heal) {
        if (me.dead < 0 && me.hp < 5 && me.food > 2) me.hp++;
        nx.heal = now + 7;
      }
      if (now >= nx.hunger) {
        me.food = Math.max(0, me.food - 1);
        nx.hunger = now + 25;
      }
      if (!w.lit && now - w.litAt > 0.2) relight();

      const p = phase();
      const night = nightOf(p);
      const wx = w.weather;
      wx.wet += ((wx.kind === "storm" ? 1 : wx.kind === "rain" ? 0.7 : 0) - wx.wet) * (1 - Math.exp(-dt * 0.25));
      wx.wind = Math.sin(now * 0.031) * 0.8 + (wx.kind === "storm" ? 0.5 : 0);
      fly(dt, p);
      swim(dt);

      for (const tap of api.taps.splice(0)) {
        const cx = Math.floor(tap.x);
        const cy = Math.floor(tap.y);
        if (cx < 0 || cx >= cols || cy < 0 || cy >= rows) continue;
        // on the 人: it jumps
        if (Math.abs(cx - me.x) <= 1 && Math.abs(cy - me.y) <= 1 && me.dead < 0) {
          if (holds(me.x, me.y) && pass(get(me.x, me.y - 1))) me.y--;
          me.jump = now;
          think("！");
          continue;
        }
        const s = w.sheep.find((s) => Math.abs(s.x - cx) <= 1 && Math.abs(s.y - cy) <= 1);
        if (s) {
          s.hop = now;
          continue;
        }
        const m = w.mobs.find((m) => Math.abs(m.x - cx) <= 1 && Math.abs(m.y - cy) <= 1);
        if (m) {
          m.hp -= 2;
          m.hurt = now;
          if (m.hp <= 0) kill(m);
          continue;
        }
        // on open sky: lightning
        if (blk[idx(cx, cy)] === AIR && cy < top[cx]) {
          lightning(cx);
          continue;
        }
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (Math.abs(dx) + Math.abs(dy) > 1 && hash(cx + dx, cy + dy, 3) > 0.5) continue;
            const x = cx + dx;
            const y = cy + dy;
            if (x >= 0 && x < cols && y >= 0 && y < rows - 1) smash(idx(x, y), dx || dy ? "blast" : "hand");
          }
        }
        if (Math.abs(cx - me.x) < 14 && Math.abs(cy - me.y) < 10 && me.dead < 0 && me.goal?.kind !== "sleep") think("！");
      }

      /* -- the picture -- */

      // the sky turns: the sun crosses, then the moon, and the stars come out between
      const lit = p < 0.66;
      const arc = lit ? p / 0.66 : (p - 0.66) / 0.34;
      const bodyX = Math.round(cols * (0.04 + 0.92 * arc));
      const bodyY = Math.round(rows * (0.34 - 0.26 * Math.sin(Math.PI * arc)));
      const flash = Math.max(0, 1 - (now - wx.flash) / 0.3);
      const homeDoor = w.home && w.site ? idx(doorOf(w.site), w.site.fy - 1) : -1;
      const ajar = homeDoor >= 0 && Math.abs(me.x - doorOf(w.site!)) <= 1 && me.y === w.site!.fy - 1;
      const tick = Math.floor(now * 8);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const b = blk[i];
          if (now - struck[i] < 0.22) {
            api.put(x, y, G.hit, 1, INK.RED);
            continue;
          }
          if (b === AIR) {
            const l = lamp[i];
            if (y >= top[x]) {
              // covered: a cave, a shaft, a room, the shade under a tree
              if (l > 0.25) api.put(x, y, G.dot, l * (0.35 + 0.15 * hash(x, y, tick)), INK.BONE);
              else if (y > ground[x] && (x + y) % 2 === 0) api.put(x, y, G.dot, 0.07 + l * 0.32, INK.DIM);
              continue;
            }
            if (y < rows * 0.32) {
              const band = Math.exp(-(((y - rows * 0.13) / (rows * (0.08 + wx.wet * 0.04))) ** 2));
              const puff = smooth(0.42 - wx.wet * 0.15, 0.62, fbm((x + now * (0.7 + wx.wet)) * 0.025, 5.1, 2));
              const cn = fbm((x + now * (0.7 + wx.wet)) * 0.05, y * 0.3 + now * 0.04, 3) * band * (0.35 + 0.75 * puff);
              if (cn > 0.6 - wx.wet * 0.13) {
                api.put(x, y, G.cloud, Math.min(1, 0.24 + (cn - 0.6 + wx.wet * 0.13) * 1.8 + flash * 0.5));
                continue;
              }
              if (cn > 0.46 - wx.wet * 0.1) {
                api.put(x, y, G.wave, 0.12 + (cn - 0.46) * 1.6 + flash * 0.3);
                continue;
              }
            }
            const d = Math.hypot(x - bodyX, (y - bodyY) * 1.1);
            if (wx.wet < 0.55 && d === 0) api.put(x, y, lit ? G.sun : G.moon, 1);
            else if (lit && wx.wet < 0.55 && d < 6) {
              const ring = Math.sin(d * 1.7 - now * 2);
              if (ring > 0.75 && (x + y) % 2 === 0) api.put(x, y, G.dot, 0.3 * (1 - d / 6));
            } else if (night > 0 && hash(x, y, 13) < 0.014) {
              api.put(x, y, G.dot, (0.08 + 0.3 * (0.5 + 0.5 * Math.sin(now * 1.3 + hash(x, y, 4) * 30))) * night * (1 - wx.wet * 0.8));
            } else if (l > 0.2 && hash(x, y, tick) < l * 0.4) api.put(x, y, G.dot, l * 0.25, INK.DIM);
            continue;
          }
          let a = SHADE[b];
          let g = glyph[b];
          let ink: number = INK.BONE;
          if (b === STONE) {
            const depth = y - ground[x];
            a = Math.max(0.14, 0.32 - (depth - 4) * 0.005) * (0.55 + 0.9 * fbm(x * 0.07 - now * 0.05, y * 0.11 + now * 0.03, 2));
          } else if (b === LEAF) a *= 0.75 + 0.25 * Math.sin(now * (1.6 + wx.wet * 2) + x * 0.9 + y);
          else if (b === FLOWER) a *= 0.8 + 0.2 * Math.sin(now * 2 + x);
          else if (b === LAVA) {
            a *= 0.7 + 0.3 * Math.sin(now * 3 + x * 0.7);
            ink = INK.RED;
          } else if (b === RUBY) ink = INK.RED;
          else if (b === FIRE) {
            a = 0.6 + 0.4 * hash(x, y, tick);
            ink = INK.RED;
          } else if (b === TORCH) a = 0.82 + 0.18 * Math.sin(now * 9 + x * 3);
          else if (b === WATER) {
            if (y > 0 && blk[i - cols] === AIR) {
              const crest = Math.sin(x * 0.55 - now * (2.2 + wx.wet * 2)) > 0.1 - wx.wet * 0.3;
              g = crest ? G.wave : g;
              a = crest ? 0.8 : 0.5;
            } else a = 0.3 + 0.16 * Math.sin(x * 0.3 - now * 1.4 + y * 0.7);
          } else if (b === CROP) {
            const ripe = (w.crops.get(i) ?? 0) <= now;
            g = ripe ? g : G.sprout;
            a = ripe ? 0.8 + 0.2 * Math.sin(now * 2 + x) : 0.55;
          } else if (b === DOOR && i === homeDoor && ajar) a = 0.3;
          else if (b === GLASS) a = 0.45 + lamp[i] * night * 0.55;
          // night falls on everything under the sky; lamps and fire light what's near them
          a *= 1 - open[i] * night * 0.5;
          if (lamp[i] > 0.05 && solid(b)) a += lamp[i] * lamp[i] * 0.7;
          if (flash) a += flash * open[i] * 0.35;
          if (now - placed[i] < 0.5) a = 1;
          api.put(x, y, g, Math.min(1, a), ink);
        }
      }

      // rain, slanting with the wind, splashing where it lands
      if (wx.wet > 0.05) {
        const streak = Math.abs(wx.wind) < 0.3 ? G.v : wx.wind > 0 ? G.down : G.up;
        for (let x = 0; x < cols; x++) {
          for (let k = 0; k < 3; k++) {
            if (hash(x, k, 51) > wx.wet * 0.75) continue;
            const span = rows + 8;
            const yy = ((now * (15 + hash(x, k, 52) * 8) + hash(x, k, 53) * span * 3) % span) - 4;
            const y = Math.floor(yy);
            if (y < 0 || y >= rows) continue;
            const xx = (((x + Math.round(wx.wind * y * 0.45)) % cols) + cols) % cols;
            const t0 = top[xx];
            if (y < t0) api.put(xx, y, streak, 0.2 + 0.2 * wx.wet, INK.DIM);
            else if (y === t0 && y > 0) api.put(xx, y - 1, blk[idx(xx, y)] === WATER ? G.wave : G.dot, 0.45, INK.DIM);
          }
        }
      }

      // drops waiting to be picked up
      for (const d of w.drops) api.put(d.x, d.y, glyph[d.b], 0.45 + 0.25 * Math.sin(now * 4 + d.x), INK.BONE);

      // the living
      for (const s of w.sheep) {
        const hop = now - s.hop < 0.35 ? -1 : 0;
        api.put(s.x, s.y + hop, G.sheep, night > 0.6 ? 0.5 : 0.85, INK.BONE);
      }
      for (const f of w.fish) {
        const fx = Math.round(f.x);
        const fy = Math.floor(f.y);
        if (f.air || get(fx, fy) === WATER) api.put(fx, fy, G.fish, f.air ? 0.95 : 0.6 + 0.2 * Math.sin(now * 3 + f.x), INK.BONE);
      }
      for (const m of w.mobs) {
        let g = m.kind === "bomb" ? G.bomb : G.oni;
        let ink: number = INK.BONE;
        let a = 0.88;
        if (now - m.hurt < 0.2) {
          g = G.hit;
          ink = INK.RED;
        } else if (m.burn >= 0) {
          if (tick % 2) g = G.fire;
          ink = INK.RED;
        } else if (m.fuse >= 0 && tick % 2) ink = INK.RED;
        else a = 0.6 + 0.3 * night;
        api.put(m.x, m.y, g, a, ink);
      }
      for (const b of w.birds) {
        const bx = Math.round(b.x);
        const by = Math.round(b.y);
        if (get(bx, by) === AIR) api.put(bx, by, Math.sin(b.phase) > 0 ? G.bird : G.wave, 0.72, INK.BONE);
      }

      // passing marks: chips, debris, smoke, leaves, sleep
      w.bits = w.bits.filter((k) => {
        const age = now - k.at;
        if (age > k.life) {
          if (k.leaf !== undefined) {
            const x = Math.round(k.x);
            const y = Math.floor(k.y);
            if (get(x, y) === AIR && get(x, y + 1) === GRASS && rand() < 0.08) place(x, y, SAPLING);
          }
          return false;
        }
        if (k.leaf !== undefined) k.vx = Math.cos(age * 3 + k.leaf) * 1.6;
        k.vy += k.fall * dt;
        k.x += k.vx * dt;
        k.y += k.vy * dt;
        const x = Math.round(k.x);
        const y = Math.floor(k.y);
        if ((k.fall > 0 || k.leaf !== undefined) && k.vy > 0 && solid(get(x, y))) {
          k.at = now - k.life; // landed
          return true;
        }
        api.put(x, y, gl(k.g), k.a * (1 - age / k.life) ** 0.8, k.ink);
        return true;
      });

      // lightning: on, off, on, and gone
      w.bolts = w.bolts.filter((bo) => {
        const age = now - bo.at;
        if (age > 0.4) return false;
        if (age > 0.08 && age < 0.13) return true;
        const a = 1 - age / 0.55;
        for (const [x, y, s] of bo.cells) api.put(x, y, gl(s), a, INK.BONE);
        api.put(bo.x, bo.y, G.hit, 1, INK.RED);
        return true;
      });

      // a blast: an octagonal ring opening out, red, then grey behind it
      w.blasts = w.blasts.filter((bl) => {
        const age = now - bl.at;
        if (age > 0.55) return false;
        for (const [rad, ink] of [[age * 16, INK.RED], [age * 16 - 2.5, INK.DIM]] as const) {
          if (rad < 1) continue;
          for (let y = Math.floor(bl.y - rad - 1); y <= bl.y + rad + 1; y++) {
            for (let x = Math.floor(bl.x - rad - 1); x <= bl.x + rad + 1; x++) {
              const dx = x - bl.x;
              const dy = y - bl.y;
              const ax = Math.abs(dx);
              const ay = Math.abs(dy);
              const ad = (ax + ay) * Math.SQRT1_2;
              if (Math.abs(Math.max(ax, ay, ad) - rad) > 0.6) continue;
              const s = ad >= ax && ad >= ay ? (dx * dy > 0 ? G.down : G.up) : ax > ay ? G.v : G.h;
              api.put(x, y, s, 1 - age / 0.55, ink);
            }
          }
        }
        return true;
      });

      // fishing: the rod, the line, and the float
      const goal = me.goal;
      if (goal?.kind === "fish" && goal.cast >= 0 && me.dead < 0) {
        const tipX = me.x + goal.dir;
        const tipY = me.y - 1;
        api.put(tipX, tipY, goal.dir > 0 ? G.up : G.down, 0.8, INK.BONE);
        const n = Math.max(Math.abs(goal.bx - tipX), Math.abs(goal.by - tipY));
        for (let k = 1; k < n; k++) {
          const lx = Math.round(tipX + ((goal.bx - tipX) * k) / n);
          const ly = Math.round(tipY + ((goal.by - 1 - tipY) * k) / n);
          if (get(lx, ly) === AIR) api.put(lx, ly, gl(lineChar(Math.atan2(goal.by - tipY, goal.bx - tipX), FLOW)), 0.3, INK.DIM);
        }
        const biting = goal.bite >= 0;
        api.put(goal.bx, goal.by - (biting ? 0 : Math.sin(now * 3) > 0.6 ? 1 : 0), biting ? G.wave : G.dot, 1, biting ? INK.RED : INK.BONE);
      }

      // the 人, and what it has in mind
      if (me.dead >= 0) {
        if (tick % 2) api.put(me.x, me.y, G.lie, 1, INK.RED);
      } else {
        const asleep = (goal?.kind === "sleep" && goal.asleep) || (goal?.kind === "shelter" && goal.stage === 2);
        let g = G.me;
        if (asleep) g = G.lie;
        else if (me.wave > now) g = Math.floor(now * 5) % 2 ? G.arms : G.me;
        else if (now - me.hurt < 0.4 || now - me.jump < 0.3) g = G.arms;
        api.put(me.x, me.y, g, now - me.hurt < 0.6 && tick % 2 ? 0.35 : 1, INK.RED);
      }
      const th = me.thought;
      if (th) {
        const age = now - th.at;
        if (age > 2.8) me.thought = null;
        else {
          const a = Math.min(1, age / 0.15) * Math.min(1, (2.8 - age) / 0.5);
          api.put(me.x, me.y - 2, gl(th.g), 0.92 * a, th.red ? INK.RED : INK.BONE);
          if (pass(get(me.x, me.y - 1))) api.put(me.x, me.y - 1, G.dot, 0.4 * a, INK.DIM);
        }
      }
    };
  },
};
