import React, { useMemo, useState } from "react";
import { createApiClient } from "../api/client.js";
import { useAuth } from "../auth/AuthContext.jsx";

function bytesToHuman(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ExportCsvButton({ queryString = "" }) {
  const { token, logout } = useAuth();

  const api = useMemo(
    () =>
      createApiClient(
        () => token,
        () => logout()
      ),
    [token, logout]
  );

  const [downloading, setDownloading] = useState(false);
  const [downloadedBytes, setDownloadedBytes] = useState(0);
  const [error, setError] = useState("");

  const onExport = async () => {
    setError("");
    setDownloading(true);
    setDownloadedBytes(0);

    try {
      const res = await api.requestStream(`/api/expenses/export/csv${queryString}`);

      const reader = res.body?.getReader();
      if (!reader) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "expenses.csv";
        a.click();
        URL.revokeObjectURL(url);
        return;
      }

      const chunks = [];
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        chunks.push(value);
        setDownloadedBytes((b) => b + value.byteLength);
      }

      const blob = new Blob(chunks, { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "expenses.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e.message || "Export failed");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <button onClick={onExport} disabled={downloading} style={{ padding: 10, cursor: "pointer" }}>
        {downloading ? "Exporting..." : "Export to CSV"}
      </button>

      {downloading ? (
        <div style={{ fontSize: 13, opacity: 0.8 }}>
          Downloaded: {bytesToHuman(downloadedBytes)}
        </div>
      ) : null}

      {error ? <div style={{ fontSize: 13, color: "#b00020" }}>{error}</div> : null}
    </div>
  );
}