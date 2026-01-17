import jwt from "jsonwebtoken";
import { fail } from "../utils/apiResponse.js";

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return fail(res, 401, "UNAUTHORIZED", "Missing or invalid Authorization header");
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user info to request
    req.user = { userId: payload.userId };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return fail(res, 401, "TOKEN_EXPIRED", "Token expired");
    }
    return fail(res, 401, "UNAUTHORIZED", "Invalid token");
  }
}