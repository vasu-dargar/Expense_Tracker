import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { AppError } from "../utils/appError.js";

export async function signupService({ email, password }) {
  const existing = await User.findOne({ email });
  if (existing) throw new AppError("Email already registered", 400, "EMAIL_EXISTS");

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, passwordHash });

  const token = signToken(user._id.toString());
  return { user: safeUser(user), token };
}

export async function loginService({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");

  const token = signToken(user._id.toString());
  return { user: safeUser(user), token };
}

function signToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing in .env");

  return jwt.sign({ userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h"
  });
}

function safeUser(userDoc) {
  return {
    id: userDoc._id.toString(),
    email: userDoc.email,
    createdAt: userDoc.createdAt
  };
}