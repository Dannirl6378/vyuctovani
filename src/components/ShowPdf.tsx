import React from "react";

export default function PdfPreview() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        src="/2025_demo.pdf" // cesta k PDF ve public
        width="100%"
        height="100%"
        style={{ border: "1px solid #ccc" }}
        title="Náhled PDF"
      ></iframe>
    </div>
  );
}
