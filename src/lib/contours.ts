/**
 * Static isobaths (spec §8.6): nested, smooth closed contours from a seeded
 * noise function, computed at build time. Same seed -> same SVG on every build.
 */

/** String hash -> 32-bit seed (xmur3). */
function hashSeed(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

/** Small deterministic PRNG (mulberry32). */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface ContourOptions {
  width?: number;
  height?: number;
  /** Number of nested contours (6–8 per spec). */
  levels?: number;
  /** Points sampled per contour; fewer points = smaller SVG. */
  points?: number;
  seed?: string;
  /** Centre as a fraction of width/height. */
  cx?: number;
  cy?: number;
}

const round = (n: number) => Math.round(n);

/** Returns SVG path `d` strings, outermost first. */
export function contourPaths({
  width = 800,
  height = 600,
  levels = 7,
  points = 18,
  seed = 'rimini',
  cx = 0.5,
  cy = 0.5,
}: ContourOptions = {}): string[] {
  const rand = mulberry32(hashSeed(seed));
  // Three low-frequency harmonics shared by every level, so the rings nest.
  const harmonics = [2, 3, 5].map((k) => ({ k, amp: 0.05 + rand() * 0.09, phase: rand() * Math.PI * 2 }));
  const ox = width * cx;
  const oy = height * cy;
  const maxR = Math.min(width, height) * 0.62;
  const paths: string[] = [];

  for (let level = 0; level < levels; level++) {
    const t = 1 - level / levels; // 1 = outermost
    const r0 = maxR * (0.18 + 0.82 * t);
    const drift = rand() * 0.4; // per-level phase drift keeps rings from being parallel copies
    const pts: Array<[number, number]> = [];
    for (let i = 0; i < points; i++) {
      const a = (i / points) * Math.PI * 2;
      let r = 1;
      for (const h of harmonics) r += h.amp * Math.sin(h.k * a + h.phase + drift * h.k * 0.5);
      pts.push([ox + Math.cos(a) * r0 * r * 1.35, oy + Math.sin(a) * r0 * r]);
    }
    paths.push(closedCatmullRom(pts));
  }
  return paths;
}

/** Closed Catmull-Rom spline through the points, as cubic Béziers. */
function closedCatmullRom(pts: Array<[number, number]>): string {
  const n = pts.length;
  const at = (i: number) => pts[((i % n) + n) % n]!;
  let d = `M${round(at(0)[0])} ${round(at(0)[1])}`;
  for (let i = 0; i < n; i++) {
    const [x0, y0] = at(i - 1);
    const [x1, y1] = at(i);
    const [x2, y2] = at(i + 1);
    const [x3, y3] = at(i + 2);
    const c1x = x1 + (x2 - x0) / 6;
    const c1y = y1 + (y2 - y0) / 6;
    const c2x = x2 - (x3 - x1) / 6;
    const c2y = y2 - (y3 - y1) / 6;
    d += `C${round(c1x)} ${round(c1y)} ${round(c2x)} ${round(c2y)} ${round(x2)} ${round(y2)}`;
  }
  return `${d}Z`;
}
