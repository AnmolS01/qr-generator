"use client";

import { useEffect, useState } from "react";
import { generateQrMatrix } from "@/library/qr/generateMatrix";
import { QrSvgGrid } from "@/components/qr/QrSvgGrid";
import type { QrShape } from "@/library/qr/shapes";

export function QrWorkspace() {
  const [matrix, setMatrix] = useState<boolean[][] | null>(null);
  const [shape, setShape] = useState<QrShape>({ type: "square" });

  useEffect(() => {
    generateQrMatrix("https://example.com").then(setMatrix);
  }, []);

  if (!matrix) return null;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        gap: "24px",
        padding: "32px",
        background: "#f3f4f6",
        alignItems: "start",
      }}
    >
      {/* Controls (temporary for Step 2 testing) */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "16px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          display: "grid",
          gap: "12px",
          height: "fit-content",
        }}
      >
        <div style={{ fontWeight: 700 }}>Shape (Step 2 Test)</div>

        <button onClick={() => setShape({ type: "square" })}>Square</button>
        <button onClick={() => setShape({ type: "circle" })}>Circle</button>
        <button onClick={() => setShape({ type: "polygon", sides: 5 })}>
          Pentagon
        </button>
        <button onClick={() => setShape({ type: "polygon", sides: 6 })}>
          Hexagon
        </button>
      </div>

      {/* Preview */}
      <div
        style={{
          display: "grid",
          placeItems: "center",
          background: "white",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        }}
      >
        <QrSvgGrid matrix={matrix} shape={shape} />
      </div>
    </main>
  );
}
