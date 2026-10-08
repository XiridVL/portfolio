/**
 * Small geometry helpers for the case-study diagrams (spec §11).
 * Everything is in SVG user units; the diagrams scale with their viewBox.
 */
export type Pt = readonly [number, number];

/** Which ends of a connector get an arrowhead. */
export type Heads = 'end' | 'start' | 'both' | 'none';

/** How a connector bends: straight, or an S-curve leaving/entering horizontally or vertically. */
export type Bend = 'straight' | 'h' | 'v';

const HEAD_LENGTH = 9;
const HEAD_HALF_WIDTH = 4.5;

/** Path data for a connector from `a` to `b`. */
export function connectorPath(a: Pt, b: Pt, bend: Bend = 'straight'): string {
  const [x1, y1] = a;
  const [x2, y2] = b;
  if (bend === 'h') {
    const mx = (x1 + x2) / 2;
    return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
  }
  if (bend === 'v') {
    const my = (y1 + y2) / 2;
    return `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`;
  }
  return `M${x1},${y1} L${x2},${y2}`;
}

/**
 * Unit direction of travel when arriving at `tip` from `from` along a connector
 * of the given bend (curves arrive tangent to their axis).
 */
function arrivalDirection(from: Pt, tip: Pt, bend: Bend): Pt {
  let dx = tip[0] - from[0];
  let dy = tip[1] - from[1];
  if (bend === 'h') dy = 0;
  if (bend === 'v') dx = 0;
  const len = Math.hypot(dx, dy) || 1;
  return [dx / len, dy / len];
}

/** Triangle points for an arrowhead whose tip sits at `tip`. */
export function arrowHead(tip: Pt, dir: Pt): string {
  const [ux, uy] = dir;
  const bx = tip[0] - ux * HEAD_LENGTH;
  const by = tip[1] - uy * HEAD_LENGTH;
  const px = -uy * HEAD_HALF_WIDTH;
  const py = ux * HEAD_HALF_WIDTH;
  const r = (n: number) => Math.round(n * 100) / 100;
  return `${r(tip[0])},${r(tip[1])} ${r(bx + px)},${r(by + py)} ${r(bx - px)},${r(by - py)}`;
}

/**
 * Connector path plus its arrowheads. The line is shortened under each head so
 * the stroke never pokes through the tip.
 */
export function connector(a: Pt, b: Pt, bend: Bend = 'straight', heads: Heads = 'end') {
  const atEnd = heads === 'end' || heads === 'both';
  const atStart = heads === 'start' || heads === 'both';
  const endDir = arrivalDirection(a, b, bend);
  const startDir = arrivalDirection(b, a, bend);
  const inset = HEAD_LENGTH - 1;
  const a2: Pt = atStart ? [a[0] - startDir[0] * inset, a[1] - startDir[1] * inset] : a;
  const b2: Pt = atEnd ? [b[0] - endDir[0] * inset, b[1] - endDir[1] * inset] : b;
  return {
    d: connectorPath(a2, b2, bend),
    heads: [...(atStart ? [arrowHead(a, startDir)] : []), ...(atEnd ? [arrowHead(b, endDir)] : [])],
  };
}
