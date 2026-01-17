import { API_BASE_URL } from "../config.js";

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

async function parseJsonSafe(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return { raw: text };
  }
}

export function createApiClient(getToken, onUnauthorized) {
  async function request(path, { method = "GET", body, headers } = {}) {
    const token = getToken?.();
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers || {})
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const payload = await parseJsonSafe(res);

    if (res.status === 401) {
      onUnauthorized?.(payload);
      throw new ApiError(payload?.error?.message || "Unauthorized", 401, payload);
    }

    if (!res.ok) {
      throw new ApiError(payload?.error?.message || "Request failed", res.status, payload);
    }

    return payload;
  }

  // For streaming downloads (CSV export)
  async function requestStream(path) {
    const token = getToken?.();
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });

    if (res.status === 401) {
      const payload = await parseJsonSafe(res);
      onUnauthorized?.(payload);
      throw new ApiError(payload?.error?.message || "Unauthorized", 401, payload);
    }

    if (!res.ok) {
      const payload = await parseJsonSafe(res);
      throw new ApiError(payload?.error?.message || "Request failed", res.status, payload);
    }

    return res;
  }

  return { request, requestStream };
}