import type { QrShape } from "@/library/qr/shapes";
import { isPointInsideShape } from "@/library/qr/shapes";
import { isProtectedQrCell } from "@/library/qr/qrSafety";

type QrSvgGridProps = {
  matrix: boolean[][];
  moduleSize?: number;
  quietZone?: number;
  foreground?: string;
  background?: string;

  shape?: QrShape;

  /**
   * Extra internal padding (in modules) to keep QR scannable
   * when using circle/polygon masks.
   */
  shapeInsetModules?: number;
};

export function QrSvgGrid({
  matrix,
  moduleSize = 8,
  quietZone = 4,
  foreground = "#000000",
  background = "#ffffff",
  shape = { type: "square" },
  shapeInsetModules = 2,
}: QrSvgGridProps) {
  const qrSize = matrix.length;

  // Total grid including quiet zone
  const totalModules = qrSize + quietZone * 2;
  const dimension = totalModules * moduleSize;

  // Shape is applied to the full SVG canvas
  const shapeSize = dimension;

  // Convert inset from modules → pixels
  const insetPx = shapeInsetModules * moduleSize;

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox={`0 0 ${dimension} ${dimension}`}
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100%" height="100%" fill={background} />

      {matrix.map((row, r) =>
        row.map((cell, c) => {
          if (!cell) return null;

          const rectX = (c + quietZone) * moduleSize;
          const rectY = (r + quietZone) * moduleSize;

          // Center point of module
          const centerX = rectX + moduleSize / 2;
          const centerY = rectY + moduleSize / 2;

          // Always keep protected QR cells (finder/timing)
          const protectedCell = isProtectedQrCell(r, c, qrSize);

          // For square: draw everything
          if (shape.type === "square") {
            return (
              <rect
                key={`${c}-${r}`}
                x={rectX}
                y={rectY}
                width={moduleSize}
                height={moduleSize}
                fill={foreground}
              />
            );
          }

          // For circle/polygon:
          // Apply shape boundary AND an inset (keeps quiet-zone ring)
          const inside = isPointInsideShape({
            shape,
            x: centerX,
            y: centerY,
            size: shapeSize - insetPx * 2,
          });

          // Translate point into inset coordinate space
          // (we shrink the shape, not the QR)
          const insideInset = isPointInsideShape({
            shape,
            x: centerX - insetPx,
            y: centerY - insetPx,
            size: shapeSize - insetPx * 2,
          });

          const shouldDraw = protectedCell || insideInset;

          if (!shouldDraw) return null;

          return (
            <rect
              key={`${c}-${r}`}
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
