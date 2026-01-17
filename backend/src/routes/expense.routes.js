import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createExpense,
  listExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  exportExpensesCsv
} from "../controllers/expense.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/export/csv", exportExpensesCsv);

router.post("/", createExpense);
router.get("/", listExpenses);
router.get("/:id", getExpenseById);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;