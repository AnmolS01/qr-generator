import QRCode from "qrcode";

/**
 * Returns a 2D boolean matrix representing a QR code.
 * true  = dark module
 * false = light module
 */
export async function generateQrMatrix(data: string): Promise<boolean[][]> {
  const qr = QRCode.create(data, {
    errorCorrectionLevel: "H",
  });

  const size = qr.modules.size;
  const raw = qr.modules.data;

  const matrix: boolean[][] = [];

  for (let row = 0; row < size; row++) {
    const rowData: boolean[] = [];
    for (let col = 0; col < size; col++) {
      rowData.push(Boolean(raw[row * size + col]));
    }
    matrix.push(rowData);
  }

  return matrix;
}
