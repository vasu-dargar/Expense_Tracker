import React, { useEffect, useState } from "react";
import { z } from "zod";
import { toISODateInputValue } from "../utils/format.js";
import { EXPENSE_CATEGORIES } from "../utils/categories.js";

const schema = z.object({
  title: z.string().min(1, "Title required"),
  amount: z.coerce.number().nonnegative("Amount must be >= 0"),
  category: z.string().min(1, "Category required"),
  date: z.string().min(1, "Date required"),
  notes: z.string().optional()
});

function buildFormState(initial) {
  if (!initial) {
    return {
      title: "",
      amount: "",
      category: "",
      date: "",
      notes: ""
    };
  }

  return {
    title: initial.title || "",
    amount: String(initial.amount ?? ""),
    category: initial.category || "",
    date: toISODateInputValue(initial.date),
    notes: initial.notes || ""
  };
}

export default function ExpenseForm({
  initial,
  onSubmit,
  submitLabel = "Save",
  disabled,
  resetKey
}) {
  const [form, setForm] = useState(() => buildFormState(initial));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(buildFormState(initial));
    setErrors({});
  }, [initial]);

  useEffect(() => {
    setForm(buildFormState(initial));
    setErrors({});
  }, [resetKey]);

  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errObj = {};
      for (const issue of parsed.error.issues) errObj[issue.path[0]] = issue.message;
      setErrors(errObj);
      return;
    }

    const payload = {
      title: parsed.data.title,
      amount: parsed.data.amount,
      category: parsed.data.category,
      date: new Date(parsed.data.date).toISOString(),
      notes: parsed.data.notes || ""
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <label>Title</label>
        <input name="title" value={form.title} onChange={change} style={{ padding: 10 }} />
        {errors.title ? <div style={{ color: "#b00020" }}>{errors.title}</div> : null}
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label>Amount</label>
        <input
          name="amount"
          value={form.amount}
          onChange={change}
          style={{ padding: 10 }}
          inputMode="decimal"
        />
        {errors.amount ? <div style={{ color: "#b00020" }}>{errors.amount}</div> : null}
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label>Category</label>

        <select name="category" value={form.category} onChange={change} style={{ padding: 10 }}>
          <option value="" disabled>
            Select category
          </option>

          {EXPENSE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {errors.category ? <div style={{ color: "#b00020" }}>{errors.category}</div> : null}
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={change}
          max={toISODateInputValue(new Date())}
          style={{ padding: 10 }}
        />
        {errors.date ? <div style={{ color: "#b00020" }}>{errors.date}</div> : null}
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label>Notes (optional)</label>
        <textarea name="notes" value={form.notes} onChange={change} style={{ padding: 10 }} />
      </div>

      <button type="submit" disabled={disabled} style={{ padding: 10, cursor: "pointer" }}>
        {submitLabel}
      </button>
    </form>
  );
}