import express from "express";
import { TransactionController } from "../controller/transaction.controller.js";
import { aiAgentService } from "@/modules/ai-agent/service/ai-agent.service.js";
import { transactionService } from "../service/transaction.service.js";
import { userService } from "@/modules/user/service/user.service.js";
import { cacheService } from "@/modules/cache/service/cache.service.js";

const transactionController = new TransactionController(
  aiAgentService,
  transactionService,
  userService,
  cacheService,
);

const router = express.Router();
router.post("/create", transactionController.create);
router.get("/recap/:telegramId", transactionController.recapTransactions);
router.get("/:telegramId/report", transactionController.getMonthlyReport);
router.get("/:telegramId", transactionController.getLatestTransactions);
router.put("/:id", transactionController.updateTransaction);
router.delete("/bulk-delete", transactionController.bulkDeleteTransactions);
router.delete("/:id", transactionController.deleteTransaction);

export { router as transactionRouter };
