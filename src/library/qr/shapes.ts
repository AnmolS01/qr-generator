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

  // Normalize to center-based coordinates
  const cx = size / 2;
  const cy = size / 2;

  const px = x - cx;
  const py = y - cy;

  if (shape.type === "square") {
    return true;
  }

  if (shape.type === "circle") {
    const r = size / 2;
    return px * px + py * py <= r * r;
  }

  // Regular polygon
  const sides = Math.max(3, shape.sides);
  const radius = size / 2;

  // Convert point to polar angle
  const angle = Math.atan2(py, px);

  // Compute max radius at that angle for a regular polygon
  // Formula: r_max = R * cos(pi/n) / cos((theta mod 2pi/n) - pi/n)
  const twoPi = Math.PI * 2;
  const sector = twoPi / sides;
  const theta = ((angle % sector) + sector) % sector; // 0..sector
  const rMax =
    (radius * Math.cos(Math.PI / sides)) / Math.cos(theta - sector / 2);

  const dist = Math.sqrt(px * px + py * py);
  return dist <= rMax;
}
