import type { QrShape } from "@/library/qr/shapes";
import { getPolygonPath, isPointInsideShape } from "@/library/qr/shapes";
import { isProtectedQrCell } from "@/library/qr/qrSafety";

type LogoConfig = {
  enabled: boolean;
  src: string | null;
};

type QrSvgGridProps = {
  matrix: boolean[][];
  moduleSize?: number;
  quietZone?: number;
  foreground?: string;
  background?: string;
  shape?: QrShape;

  // Only used for circle masking
  shapeInsetModules?: number;

  // Step 3 (logo will be re-added after frame mode is stable)
  logo?: LogoConfig;
};

export function QrSvgGrid({
  matrix,
  moduleSize = 8,
  quietZone = 4,
  foreground = "#000000",
  background = "#ffffff",
  shape = { type: "square" },
  shapeInsetModules = 3,
  logo,
}: QrSvgGridProps) {
  const qrSize = matrix.length;
  const totalModules = qrSize + quietZone * 2;
  const dimension = totalModules * moduleSize;

  const center = dimension / 2;

  // Polygon frame styling (visual only)
  const polygonPadding = dimension * 0.06; // inner padding for polygon frame
  const polygonStrokeWidth = Math.max(6, dimension * 0.02);

  const isPolygon = shape.type === "polygon";

  // Circle masking inset
  const insetPx = shapeInsetModules * moduleSize;

  // Logo sizing (safe)
  const logoRadius = dimension * 0.14;

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox={`0 0 ${dimension} ${dimension}`}
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Base background */}
      <rect width="100%" height="100%" fill={background} />

      {/* Polygon frame mode (scan-safe) */}
      {isPolygon && (
        <>
          {/* Soft polygon background */}
          <path
            d={getPolygonPath({
              size: dimension,
              sides: shape.sides,
              paddingPx: polygonPadding,
            })}
            fill="#ffffff"
          />

          {/* Polygon border frame */}
          <path
            d={getPolygonPath({
              size: dimension,
              sides: shape.sides,
              paddingPx: polygonPadding,
            })}
            fill="none"
            stroke="#111827"
            strokeWidth={polygonStrokeWidth}
            opacity={0.15}
          />
        </>
      )}

      {/* QR modules */}
      {matrix.map((row, r) =>
        row.map((cell, c) => {
          if (!cell) return null;

          const rectX = (c + quietZone) * moduleSize;
          const rectY = (r + quietZone) * moduleSize;
          const centerX = rectX + moduleSize / 2;
          const centerY = rectY + moduleSize / 2;

          const protectedCell = isProtectedQrCell(r, c, qrSize);

          // Circle masking mode (true mask)
          if (shape.type === "circle") {
            const inside = isPointInsideShape({
              shape,
              x: centerX - insetPx,
              y: centerY - insetPx,
              size: dimension - insetPx * 2,
            });

            if (!inside && !protectedCell) return null;
          }

          // Square + polygon: do not clip
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

      {/* Center logo (optional) */}
      {logo?.enabled && logo.src && (
        <>
          <circle cx={center} cy={center} r={logoRadius} fill="#ffffff" />

          <clipPath id="logoClip">
            <circle cx={center} cy={center} r={logoRadius * 0.9} />
          </clipPath>

          <image
            href={logo.src}
            x={center - logoRadius}
            y={center - logoRadius}
            width={logoRadius * 2}
            height={logoRadius * 2}
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#logoClip)"
          />
        </>
      )}
    </svg>
  );
}
