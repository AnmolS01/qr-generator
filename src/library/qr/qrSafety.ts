export function isFinderPatternCell(row: number, col: number, size: number) {
  const inTopLeft = row < 7 && col < 7;
  const inTopRight = row < 7 && col >= size - 7;
  const inBottomLeft = row >= size - 7 && col < 7;
  return inTopLeft || inTopRight || inBottomLeft;
}

export function isTimingPatternCell(row: number, col: number) {
  return row === 6 || col === 6;
}

/**
 * Alignment pattern centers for a QR matrix size.
 * This is a simplified spec-based table approach.
 */
export function getAlignmentPatternCenters(size: number): number[] {
  // Version is derived from size: size = 21 + (version - 1) * 4
  const version = (size - 21) / 4 + 1;

  // No alignment patterns in version 1
  if (version < 2) return [];

  // Spec table compressed approach:
  // For most versions: centers start at 6 and end at size-7 with steps.
  // This is a known safe approximation used in many implementations.
  const centers: number[] = [6];

  const last = size - 7;

  if (version <= 6) {
    centers.push(last);
    return centers;
  }

  // Compute step size
  const count = Math.floor(version / 7) + 2;
  const step = Math.ceil((last - 6) / (count - 1));

  for (let i = 1; i < count - 1; i++) {
    centers.push(last - step * (count - 1 - i));
  }

  centers.push(last);

  // Remove duplicates and sort
  return Array.from(new Set(centers)).sort((a, b) => a - b);
}

export function isAlignmentPatternCell(row: number, col: number, size: number) {
  const centers = getAlignmentPatternCenters(size);
  if (centers.length === 0) return false;

  // Alignment patterns are 5x5 blocks centered on each pair of centers
  for (const r of centers) {
    for (const c of centers) {
      // Skip overlap with finder patterns
      if (
        (r === 6 && c === 6) ||
        (r === 6 && c === size - 7) ||
        (r === size - 7 && c === 6)
      ) {
        continue;
      }

      if (Math.abs(row - r) <= 2 && Math.abs(col - c) <= 2) {
        return true;
      }
    }
  }

  return false;
}

export function isProtectedQrCell(row: number, col: number, size: number) {
  // Finder patterns + margin
  const finderMargin = 1;

  const finder =
    isFinderPatternCell(row, col, size) ||
    isFinderPatternCell(
      Math.max(0, row - finderMargin),
      Math.max(0, col - finderMargin),
      size
    ) ||
    isFinderPatternCell(
      Math.min(size - 1, row + finderMargin),
      Math.min(size - 1, col + finderMargin),
      size
    );

  if (finder) return true;

  if (isTimingPatternCell(row, col)) return true;

  // NEW: protect alignment patterns
  if (isAlignmentPatternCell(row, col, size)) return true;

  return false;
}
