import React from "react";

export default function Loading({ label = "Loading..." }) {
  return (
    <div style={{ padding: 12, fontSize: 14, opacity: 0.8 }}>
      <span>{label}</span>
    </div>
  );
}