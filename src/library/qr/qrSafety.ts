export function isFinderPatternCell(row: number, col: number, size: number) {
  // Finder patterns are 7x7 blocks in 3 corners
  const inTopLeft = row < 7 && col < 7;
  const inTopRight = row < 7 && col >= size - 7;
  const inBottomLeft = row >= size - 7 && col < 7;

  return inTopLeft || inTopRight || inBottomLeft;
}

export function isTimingPatternCell(row: number, col: number) {
  // Timing patterns sit on row 6 and col 6
  return row === 6 || col === 6;
}

export function isProtectedQrCell(row: number, col: number, size: number) {
  // Expand finder pattern protection by 1 module margin
  const finderMargin = 1;

  const isFinder =
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

  if (isFinder) return true;

  if (isTimingPatternCell(row, col)) return true;

  return false;
}
