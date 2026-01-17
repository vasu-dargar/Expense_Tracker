import React from "react";
import { formatINR } from "../utils/format.js";

export default function ExpenseList({ items, onEdit, onDelete }) {
  if (!items?.length) return <div style={{ padding: 12, opacity: 0.8 }}>No expenses yet.</div>;

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {items.map((x) => (
        <div
          key={x._id}
          style={{
            border: "1px solid #eee",
            borderRadius: 10,
            padding: 12,
            display: "flex",
            justifyContent: "space-between",
            gap: 10
          }}
        >
          <div>
            <div style={{ fontWeight: 600 }}>{x.title}</div>
            <div style={{ fontSize: 13, opacity: 0.75 }}>
              {new Date(x.date).toLocaleDateString()} • {x.category}
            </div>
            {x.notes ? <div style={{ fontSize: 13, marginTop: 4 }}>{x.notes}</div> : null}
          </div>

          <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
            <div style={{ fontWeight: 700 }}>{formatINR(x.amount)}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => onEdit(x)} style={{ cursor: "pointer" }}>
                Edit
              </button>
              <button
                onClick={() => onDelete(x)}
                style={{ cursor: "pointer", color: "#b00020" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}