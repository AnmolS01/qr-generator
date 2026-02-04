import type { QrShape } from "@/library/qr/shapes";
import { isPointInsideShape } from "@/library/qr/shapes";

type QrSvgGridProps = {
  matrix: boolean[][];
  moduleSize?: number;
  quietZone?: number;
  foreground?: string;
  background?: string;

  // Step 2
  shape?: QrShape;
};

export function QrSvgGrid({
  matrix,
  moduleSize = 8,
  quietZone = 4,
  foreground = "#000000",
  background = "#ffffff",
  shape = { type: "square" },
}: QrSvgGridProps) {
  const size = matrix.length;

  // Total grid including quiet zone
  const totalModules = size + quietZone * 2;
  const dimension = totalModules * moduleSize;

  // We treat the whole SVG as the shape container
  // Each module is tested using its center point
  const shapeSize = dimension;

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox={`0 0 ${dimension} ${dimension}`}
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100%" height="100%" fill={background} />

      {matrix.map((row, y) =>
        row.map((cell, x) => {
          if (!cell) return null;

          const rectX = (x + quietZone) * moduleSize;
          const rectY = (y + quietZone) * moduleSize;

          // Center point of module
          const centerX = rectX + moduleSize / 2;
          const centerY = rectY + moduleSize / 2;

          const inside = isPointInsideShape({
            shape,
            x: centerX,
            y: centerY,
            size: shapeSize,
          });

          if (!inside) return null;

          return (
            <rect
              key={`${x}-${y}`}
              x={rectX}
              y={rectY}
              width={moduleSize}
              height={moduleSize}
              fill={foreground}
            />
          );
        })
      )}
    </svg>
  );
}
