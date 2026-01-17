import { AppError } from "../utils/appError.js";
import { fail } from "../utils/apiResponse.js";

export function globalErrorHandler(err, req, res, next) {
  // Zod validation error formatting
  if (err?.name === "ZodError") {
    const details = err.issues?.map((i) => ({
      path: i.path?.join("."),
      message: i.message
    }));
    return fail(res, 400, "VALIDATION_ERROR", "Invalid request data", details);
  }

  // Custom AppError
  if (err instanceof AppError) {
    return fail(res, err.statusCode, err.code, err.message);
  }

  // Mongoose invalid ObjectId
  if (err?.name === "CastError") {
    return fail(res, 400, "BAD_REQUEST", "Invalid ID format");
  }

  console.error("Unhandled error:", err);
  return fail(res, 500, "INTERNAL_ERROR", "Something went wrong");
}