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

  /* ---------- Button styles (temporary, dev-only) ---------- */

  const baseBtn: React.CSSProperties = {
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    cursor: "pointer",
    fontWeight: 600,
    textAlign: "left",
  };

  const activeBtn: React.CSSProperties = {
    ...baseBtn,
    border: "1px solid #111827",
    background: "#f9fafb",
  };

  const isPolygon = (sides: number) =>
    shape.type === "polygon" && shape.sides === sides;

  /* --------------------------------------------------------- */

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
      {/* Controls (Step 2 test controls) */}
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

        <button
          style={shape.type === "square" ? activeBtn : baseBtn}
          onClick={() => setShape({ type: "square" })}
        >
          Square
        </button>

        <button
          style={shape.type === "circle" ? activeBtn : baseBtn}
          onClick={() => setShape({ type: "circle" })}
        >
          Circle
        </button>

        <button
          style={isPolygon(5) ? activeBtn : baseBtn}
          onClick={() => setShape({ type: "polygon", sides: 5 })}
        >
          Pentagon
        </button>

        <button
          style={isPolygon(6) ? activeBtn : baseBtn}
          onClick={() => setShape({ type: "polygon", sides: 6 })}
        >
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
