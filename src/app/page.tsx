"use client";

import { useEffect, useState } from "react";
import { generateQrMatrix } from "@/library/qr/generateMatrix";
import { QrSvgGrid } from "@/components/qr/QrSvgGrid";

export default function Page() {
  const [matrix, setMatrix] = useState<boolean[][] | null>(null);

  useEffect(() => {
    generateQrMatrix("https://anmolsharma.com").then(setMatrix);
  }, []);

  if (!matrix) return null;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f3f4f6",
      }}
    >
      <QrSvgGrid matrix={matrix} />
    </main>
  );
}
