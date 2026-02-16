import { Request, Response } from "express";
import { AIAgentService } from "@/modules/ai-agent/service/ai-agent.service.js";
import { TransactionService } from "../service/transaction.service.js";
import { UserService } from "@/modules/user/service/user.service.js";

export class TransactionController {
  aiAgentService: AIAgentService;
  transactionService: TransactionService;
  userService: UserService;
  constructor(
    aiAgentService: AIAgentService,
    transactionService: TransactionService,
    userService: UserService,
  ) {
    this.aiAgentService = aiAgentService;
    this.transactionService = transactionService;
    this.userService = userService;

    // binds
    this.create = this.create.bind(this);
    this.getLatestTransactions = this.getLatestTransactions.bind(this);
    this.updateTransaction = this.updateTransaction.bind(this);
    this.deleteTransaction = this.deleteTransaction.bind(this);
    this.bulkDeleteTransactions = this.bulkDeleteTransactions.bind(this);
    this.recapTransactions = this.recapTransactions.bind(this);
  }
  async create(req: Request, res: Response) {
    try {
      const { text, telegramId } = req.body;
      const categories =
        await this.transactionService.getUserCategoriesByTelegramId(telegramId);
      const promptResult = await this.aiAgentService.analyzePromptCreate({
        text,
        categories,
      });
      const result = await this.transactionService.create({
        ...promptResult,
        userId: telegramId,
      });
      return res.status(201).json({
        error: false,
        message: "Transaction created successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({ error: true, message: error.message });
    }
  }
  async getLatestTransactions(req: Request, res: Response) {
    try {
      const { telegramId } = req.params as { telegramId: string };
      const { limit = 10 } = req.query as { limit?: string };
      const transactions = await this.transactionService.getByUserId(
        BigInt(telegramId),
        Number(limit),
      );
      if (transactions.length === 0) {
        return res.status(404).json({
          error: true,
          message: "No transactions found for this user",
        });
      }
      res.status(200).json({
        error: false,
        message: "Transactions retrieved successfully",
        data: transactions,
      });
    } catch (error: any) {
      res.status(500).json({ error: true, message: error.message });
    }
  }
  async updateTransaction(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const { text, telegramId } = req.body;
      const transaction = await this.transactionService.getById(Number(id));
      if (!transaction) {
        return res
          .status(404)
          .json({ error: true, message: "Transaction not found" });
      }
      const promptResult = await this.aiAgentService.analyzePromptUpdate({
        text,
        previousData: transaction,
      });
      const updatedTransaction = await this.transactionService.update(
        BigInt(telegramId),
        Number(id),
        promptResult,
      );
      res.status(200).json({
        error: false,
        message: "Transaction updated successfully",
        data: updatedTransaction,
      });
    } catch (error: any) {
      res.status(500).json({ error: true, message: error.message });
    }
  }
  async deleteTransaction(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const { telegramId } = req.body;
      await this.transactionService.delete(BigInt(telegramId), Number(id));
      res.status(200).json({
        error: false,
        message: "Transaction deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({ error: true, message: error.message });
    }
  }
  async bulkDeleteTransactions(req: Request, res: Response) {
    try {
      const { ids, telegramId } = req.body as {
        ids: number[];
        telegramId: bigint;
      };
      const deletedIds = await this.transactionService.bulkDelete(
        telegramId,
        ids,
      );
      res.status(200).json({
        error: false,
        message: "Transactions deleted successfully",
        data: deletedIds.map((item) => item.id.toString()),
      });
    } catch (error: any) {
      res.status(500).json({ error: true, message: error.message });
    }
  }
  async recapTransactions(req: Request, res: Response) {
    try {
      const { telegramId } = req.params as { telegramId: string };
      const transactions = await this.transactionService.recapTransactions(
        BigInt(telegramId),
      );
      res.status(200).json({
        error: false,
        message: "Transactions recap generated successfully",
        data: transactions,
      });
    } catch (error: any) {
      res.status(500).json({ error: true, message: error.message });
    }
  }
}
