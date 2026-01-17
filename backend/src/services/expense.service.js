import { Expense } from "../models/Expense.js";
import { AppError } from "../utils/appError.js";

export async function createExpenseService(userId, payload) {
  const created = await Expense.create({ ...payload, userId });
  return created;
}

export async function listExpensesService(userId, query) {
  const filter = { userId };

  if (query.category) filter.category = query.category;

  if (query.from || query.to) {
    filter.date = {};
    if (query.from) filter.date.$gte = new Date(query.from);
    if (query.to) filter.date.$lte = new Date(query.to);
  }

  // Sorting newest first
  const items = await Expense.find(filter).sort({ date: -1, createdAt: -1 });
  return items;
}

export async function getExpenseByIdService(userId, expenseId) {
  const found = await Expense.findOne({ _id: expenseId, userId });
  if (!found) throw new AppError("Expense not found", 404, "EXPENSE_NOT_FOUND");
  return found;
}

export async function updateExpenseService(userId, expenseId, updates) {
  const updated = await Expense.findOneAndUpdate(
    { _id: expenseId, userId },
    { $set: updates },
    { new: true, runValidators: true }
  );
  if (!updated) throw new AppError("Expense not found", 404, "EXPENSE_NOT_FOUND");
  return updated;
}

export async function deleteExpenseService(userId, expenseId) {
  const deleted = await Expense.findOneAndDelete({ _id: expenseId, userId });
  if (!deleted) throw new AppError("Expense not found", 404, "EXPENSE_NOT_FOUND");
  return deleted;
}

export function exportExpensesCursorService(userId, query) {
  const filter = { userId };

  if (query.category) filter.category = query.category;

  if (query.from || query.to) {
    filter.date = {};
    if (query.from) filter.date.$gte = new Date(query.from);
    if (query.to) filter.date.$lte = new Date(query.to);
  }

  return Expense.find(filter).sort({ date: -1, createdAt: -1 }).cursor();
}