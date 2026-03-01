import { Request, Response } from "express";
import { AIAgentService } from "@/modules/ai-agent/service/ai-agent.service.js";
import { TransactionService } from "../service/transaction.service.js";
import { UserService } from "@/modules/user/service/user.service.js";
import { CacheService } from "@/modules/cache/service/cache.service.js";

export class TransactionController {
  private aiAgentService: AIAgentService;
  private transactionService: TransactionService;
  private userService: UserService;
  private cacheService: CacheService;
  constructor(
    aiAgentService: AIAgentService,
    transactionService: TransactionService,
    userService: UserService,
    cacheService: CacheService,
  ) {
    this.aiAgentService = aiAgentService;
    this.transactionService = transactionService;
    this.userService = userService;
    this.cacheService = cacheService;

    // binds
    this.create = this.create.bind(this);
    this.getLatestTransactions = this.getLatestTransactions.bind(this);
    this.updateTransaction = this.updateTransaction.bind(this);
    this.deleteTransaction = this.deleteTransaction.bind(this);
    this.bulkDeleteTransactions = this.bulkDeleteTransactions.bind(this);
    this.recapTransactions = this.recapTransactions.bind(this);
    this.getMonthlyReport = this.getMonthlyReport.bind(this);
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
  // TODO: group transactions by category and provide insights
  async getMonthlyReport(req: Request, res: Response) {
    try {
      const { telegramId } = req.params as { telegramId: string };
      const cacheClient = this.cacheService.getClient();
      const key = `monthly_report:${telegramId}`;
      const exists = await cacheClient.exists(key);

      if (exists) {
        const cachedReport = await cacheClient.hGetAll(key);
        return res.status(200).json({
          error: false,
          message: "Monthly report retrieved from cache",
          data: cachedReport,
        });
      }

      const report = await this.transactionService.getMonthlyReport(
        BigInt(telegramId),
      );
      let notes = "";
      if (report.totalExpense > report.totalIncome) {
        notes =
          "Perhatian! Kamu mengeluarkan lebih banyak daripada yang kamu hasilkan bulan ini. Pertimbangkan untuk meninjau kembali pengeluaranmu dan mencari cara untuk meningkatkan pendapatanmu.";
      } else {
        notes =
          "Kerja bagus! Kamu menghasilkan lebih banyak daripada yang kamu keluarkan bulan ini. Pertahankan kebiasaan baik ini untuk keuangan yang sehat.";
      }
      await cacheClient.hSet(key, {
        totalIncome: report.totalIncome,
        totalExpense: report.totalExpense,
        notes,
      });
      await cacheClient.expire(key, 20 * 60);
      return res.status(200).json({
        error: false,
        message: "Monthly report generated successfully",
        data: {
          ...report,
          notes,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: true, message: error.message });
    }
  }
}
