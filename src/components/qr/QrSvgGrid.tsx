type QrSvgGridProps = {
  matrix: boolean[][];
  moduleSize?: number;
  quietZone?: number;
  foreground?: string;
  background?: string;
};

export function QrSvgGrid({
  matrix,
  moduleSize = 8,
  quietZone = 4,
  foreground = "#000000",
  background = "#ffffff",
}: QrSvgGridProps) {
  const size = matrix.length;
  const totalModules = size + quietZone * 2;
  const dimension = totalModules * moduleSize;

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
        row.map(
          (cell, x) =>
            cell && (
              <rect
                key={`${x}-${y}`}
                x={(x + quietZone) * moduleSize}
                y={(y + quietZone) * moduleSize}
                width={moduleSize}
                height={moduleSize}
                fill={foreground}
              />
            )
        )
      )}
    </svg>
  );
}
