import { fail } from "../utils/apiResponse.js";

export function notFoundHandler(req, res) {
  return fail(res, 404, "NOT_FOUND", `Route not found: ${req.method} ${req.originalUrl}`);
}