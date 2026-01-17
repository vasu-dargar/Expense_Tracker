import React, { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext.jsx";
import { createApiClient } from "../api/client.js";

import Loading from "../components/Loading.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import ExpenseForm from "../components/ExpenseForm.jsx";
import ExpenseList from "../components/ExpenseList.jsx";
import ExportCsvButton from "../components/ExportCsvButton.jsx";

export default function ExpensesPage() {
  const nav = useNavigate();
  const { token, logout } = useAuth();

  const api = useMemo(
    () =>
      createApiClient(
        () => token,
        () => {
          logout();
          nav("/login", { replace: true });
        }
      ),
    [token, logout, nav]
  );

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(null);

  const [formResetKey, setFormResetKey] = useState(0);

  const fetchExpenses = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.request("/api/expenses");
      setItems(res.data || []);
    } catch (e) {
      setError(e.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const createExpense = async (payload) => {
    setError("");
    setBusy(true);
    try {
      await api.request("/api/expenses", { method: "POST", body: payload });

      setEditing(null);
      setFormResetKey((k) => k + 1);

      await fetchExpenses();
    } catch (e) {
      setError(e.message || "Create failed");
    } finally {
      setBusy(false);
    }
  };

  const updateExpense = async (id, payload) => {
    setError("");
    setBusy(true);
    try {
      await api.request(`/api/expenses/${id}`, { method: "PUT", body: payload });

      setEditing(null);
      setFormResetKey((k) => k + 1);

      await fetchExpenses();
    } catch (e) {
      setError(e.message || "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const deleteExpense = async (expense) => {
    const ok = confirm(`Delete "${expense.title}"?`);
    if (!ok) return;

    setError("");
    setBusy(true);
    try {
      await api.request(`/api/expenses/${expense._id}`, { method: "DELETE" });

      setEditing(null);
      setFormResetKey((k) => k + 1);

      await fetchExpenses();
    } catch (e) {
      setError(e.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  const doLogout = () => {
    logout();
    nav("/login", { replace: true });
  };

  return (
    <div style={{ maxWidth: 900, margin: "28px auto", padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center"
        }}
      >
        <h2 style={{ margin: 0 }}>Expense Tracker</h2>
        <button onClick={doLogout} style={{ padding: 10, cursor: "pointer" }}>
          Logout
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <ErrorBanner message={error} onClose={() => setError("")} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginTop: 16
        }}
      >
        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
          <h3 style={{ marginTop: 0 }}>{editing ? "Edit Expense" : "Add Expense"}</h3>

          <ExpenseForm
            initial={editing}
            resetKey={formResetKey}
            disabled={busy}
            submitLabel={editing ? "Update" : "Create"}
            onSubmit={(payload) => {
              if (editing) return updateExpense(editing._id, payload);
              return createExpense(payload);
            }}
          />

          {editing ? (
            <button
              onClick={() => setEditing(null)}
              style={{ marginTop: 10, padding: 10 }}
            >
              Cancel Edit
            </button>
          ) : null}
        </div>

        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
          <h3 style={{ marginTop: 0 }}>Export</h3>
          <ExportCsvButton />
          <div style={{ marginTop: 12, fontSize: 13, opacity: 0.75 }} />
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <h3>All Expenses</h3>
        {loading ? (
          <Loading label="Fetching expenses..." />
        ) : (
          <ExpenseList items={items} onEdit={(x) => setEditing(x)} onDelete={(x) => deleteExpense(x)} />
        )}
      </div>
    </div>
  );
}