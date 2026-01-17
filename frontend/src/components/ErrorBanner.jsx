import React from "react";

export default function ErrorBanner({ message, onClose }) {
  if (!message) return null;
  return (
    <div
      style={{
        padding: 12,
        marginBottom: 12,
        border: "1px solid #ffcccc",
        background: "#fff5f5",
        borderRadius: 8
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ color: "#b00020" }}>{message}</div>
        {onClose ? (
          <button onClick={onClose} style={{ cursor: "pointer" }}>
            ✕
          </button>
        ) : null}
      </div>
    </div>
  );
}