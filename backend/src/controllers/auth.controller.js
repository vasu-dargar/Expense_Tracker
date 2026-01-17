import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/apiResponse.js";
import { signupService, loginService } from "../services/auth.service.js";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters")
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required")
});

export const signup = asyncHandler(async (req, res) => {
  const body = signupSchema.parse(req.body);
  const result = await signupService(body);
  return ok(res, result, "Signup successful", 201);
});

export const login = asyncHandler(async (req, res) => {
  const body = loginSchema.parse(req.body);
  const result = await loginService(body);
  return ok(res, result, "Login successful");
});