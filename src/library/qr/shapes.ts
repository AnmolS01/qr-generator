export type QrShape =
  | { type: "square" }
  | { type: "circle" }
  | { type: "polygon"; sides: number };

export function isPointInsideShape(params: {
  shape: QrShape;
  x: number;
  y: number;
  size: number;
}): boolean {
  const { shape, x, y, size } = params;

  const cx = size / 2;
  const cy = size / 2;

  const px = x - cx;
  const py = y - cy;

  if (shape.type === "square") return true;

  if (shape.type === "circle") {
    const r = size / 2;
    return px * px + py * py <= r * r;
  }

  // Regular polygon
  const sides = Math.max(3, shape.sides);
  const radius = size / 2;

  const angle = Math.atan2(py, px);
  const twoPi = Math.PI * 2;
  const sector = twoPi / sides;

  const theta = ((angle % sector) + sector) % sector;
  const rMax =
    (radius * Math.cos(Math.PI / sides)) / Math.cos(theta - sector / 2);

  const dist = Math.sqrt(px * px + py * py);
  return dist <= rMax;
}

/**
 * SVG path for a regular polygon centered in a square canvas.
 * Used for "frame mode" rendering (visual only, scan-safe).
 */
export function getPolygonPath(params: {
  size: number;
  sides: number;
  paddingPx?: number;
}): string {
  const { size, sides, paddingPx = 0 } = params;

  const n = Math.max(3, sides);
  const cx = size / 2;
  const cy = size / 2;

  const radius = size / 2 - paddingPx;

  // Rotate so polygon looks upright (nice for pentagon/hexagon)
  const rotation = -Math.PI / 2;

  const points: Array<{ x: number; y: number }> = [];

  for (let i = 0; i < n; i++) {
    const a = rotation + (i * 2 * Math.PI) / n;
    points.push({
      x: cx + radius * Math.cos(a),
      y: cy + radius * Math.sin(a),
    });
  }

  const d = points
    .map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return `${d} Z`;
}
