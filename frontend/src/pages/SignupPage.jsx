import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { useAuth } from "../auth/AuthContext.jsx";
import { createApiClient } from "../api/client.js";
import ErrorBanner from "../components/ErrorBanner.jsx";
import Loading from "../components/Loading.jsx";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export default function SignupPage() {
  const nav = useNavigate();
  const { setToken, setUser, logout, token } = useAuth();

  const api = useMemo(
    () =>
      createApiClient(
        () => token,
        () => logout()
      ),
    [token, logout]
  );

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldError, setFieldError] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldError({});

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errors = {};
      for (const issue of parsed.error.issues) errors[issue.path[0]] = issue.message;
      setFieldError(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await api.request("/api/auth/signup", {
        method: "POST",
        body: parsed.data
      });

      // Backend returns: { success, data: { user, token } }
      const { user, token: jwt } = res.data;
      setToken(jwt);
      setUser(user);
      nav("/app/expenses", { replace: true });
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h2 style={{ marginBottom: 12 }}>Signup</h2>

      <ErrorBanner message={error} onClose={() => setError("")} />

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <label>
          Email
          <input
            name="email"
            value={form.email}
            onChange={onChange}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
            autoComplete="email"
          />
          {fieldError.email ? <div style={{ color: "#b00020" }}>{fieldError.email}</div> : null}
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
            autoComplete="new-password"
          />
          {fieldError.password ? (
            <div style={{ color: "#b00020" }}>{fieldError.password}</div>
          ) : null}
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: 10, cursor: loading ? "not-allowed" : "pointer" }}
        >
          Create account
        </button>

        {loading ? <Loading label="Creating account..." /> : null}
      </form>

      <div style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}