// One-shot PNG renderer for the aaen brand asset set.
// Reads every SVG in assets/svg, writes a PNG to assets/png.
// Per-file density override where a fixed size is wanted.
const sharp = require('C:/Users/Ellio/AppData/Local/Temp/aaenz-sharp/node_modules/sharp');
const fs = require('fs');
const path = require('path');

const SVG_DIR = path.join(__dirname, 'assets', 'svg');
const PNG_DIR = path.join(__dirname, 'assets', 'png');

// name -> { width?, density? } where density scales the intrinsic px size
const overrides = {
  'favicon': { sizes: [[16, 16], [32, 32], [64, 64], [192, 192], [512, 512]] },
  'favicon-light': { sizes: [[16, 16], [32, 32], [64, 64], [192, 192], [512, 512]] },
  'og-image': { width: 1200 },                           // keep native 1200x630
  'mark-primary': { width: 480 },
  'mark-primary-reversed': { width: 480 },
  'mark-primary-reversed-light': { width: 480 },
  'mark-monoline': { width: 480 },
  'mark-blaze': { width: 480 },
  'lockup-horizontal': { width: 1040 },                  // 2x for retina
  'lockup-horizontal-reversed': { width: 1040 },
  'lockup-stacked': { width: 640 },
  'lockup-full': { width: 1280 },
  'icon-set': { width: 1440 },
  'pattern-contours': { width: 1600 },                   // big enough to crop from
  'pattern-grid': { width: 800 },
  'pattern-paper': { width: 480 },
};

(async () => {
  if (!fs.existsSync(PNG_DIR)) fs.mkdirSync(PNG_DIR, { recursive: true });
  const svgs = fs.readdirSync(SVG_DIR).filter(f => f.endsWith('.svg'));
  let ok = 0, fail = 0;
  for (const file of svgs) {
    const base = file.replace(/\.svg$/, '');
    const src = fs.readFileSync(path.join(SVG_DIR, file));
    const cfg = overrides[base] || { width: 800 };
    const targets = cfg.sizes || [[cfg.width, null]];
    for (const [w, h] of targets) {
      const outName = (cfg.sizes && h) ? `${base}-${w}.png` : `${base}.png`;
      try {
        const res = await sharp(src, { density: 144 })
          .resize(w, h || undefined, { fit: 'outside', withoutEnlargement: false })
          .png()
          .toFile(path.join(PNG_DIR, outName));
        console.log(`  ✓ ${outName.padEnd(34)} ${res.width}x${res.height}`);
        ok++;
      } catch (e) {
        console.error(`  ✗ ${outName} — ${e.message}`);
        fail++;
      }
    }
  }
  console.log(`\nDone. ${ok} rendered, ${fail} failed.`);
})();
