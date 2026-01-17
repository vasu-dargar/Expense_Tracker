import { z } from "zod";
import { stringify } from "csv-stringify";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/apiResponse.js";
import {
  createExpenseService,
  listExpensesService,
  getExpenseByIdService,
  updateExpenseService,
  deleteExpenseService,
  exportExpensesCursorService
} from "../services/expense.service.js";

const expenseCreateSchema = z.object({
  title: z.string().min(1),
  amount: z.number().nonnegative(),
  category: z.string().min(1),
  date: z.string().datetime().or(z.string().min(1)), // accept ISO; service will Date()
  notes: z.string().optional().default("")
});

const expenseUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  amount: z.number().nonnegative().optional(),
  category: z.string().min(1).optional(),
  date: z.string().datetime().or(z.string().min(1)).optional(),
  notes: z.string().optional()
});

export const createExpense = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const body = expenseCreateSchema.parse(req.body);

  const payload = {
    ...body,
    date: new Date(body.date)
  };

  const created = await createExpenseService(userId, payload);
  return ok(res, created, "Expense created", 201);
});

export const listExpenses = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const items = await listExpensesService(userId, req.query);
  return ok(res, items, "Expenses fetched");
});

export const getExpenseById = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const item = await getExpenseByIdService(userId, req.params.id);
  return ok(res, item, "Expense fetched");
});

export const updateExpense = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const updates = expenseUpdateSchema.parse(req.body);

  const normalized = { ...updates };
  if (updates.date) normalized.date = new Date(updates.date);

  const updated = await updateExpenseService(userId, req.params.id, normalized);
  return ok(res, updated, "Expense updated");
});

export const deleteExpense = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const deleted = await deleteExpenseService(userId, req.params.id);
  return ok(res, deleted, "Expense deleted");
});

export const exportExpensesCsv = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="expenses.csv"');
  res.setHeader("X-Content-Type-Options", "nosniff");

  const csv = stringify({
    header: true,
    columns: [
      { key: "date", header: "Date" },
      { key: "title", header: "Title" },
      { key: "amount", header: "Amount" },
      { key: "category", header: "Category" },
      { key: "notes", header: "Notes" }
    ]
  });

  csv.pipe(res);

  const cursor = exportExpensesCursorService(userId, req.query);

  try {
    for await (const doc of cursor) {
      csv.write({
        date: doc.date?.toISOString(),
        title: doc.title,
        amount: doc.amount,
        category: doc.category,
        notes: doc.notes || ""
      });
    }
  } finally {
    csv.end();
  }
});