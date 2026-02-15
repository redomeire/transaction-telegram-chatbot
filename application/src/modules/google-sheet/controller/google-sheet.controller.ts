import { AIAgentService } from "@/modules/ai-agent/service/ai-agent.service.js";
import { GoogleSheetService } from "../service/google-sheet.service.js";
import { CacheService } from "@/modules/cache/service/cache.service.js";
import { Request, Response } from "express";

export class GoogleSheetController {
  googleSheetService: GoogleSheetService;
  aiAgentService: AIAgentService;
  cacheService: CacheService;

  constructor(
    googleSheetService: GoogleSheetService,
    aiAgentService: AIAgentService,
    cacheService: CacheService,
  ) {
    this.googleSheetService = googleSheetService;
    this.aiAgentService = aiAgentService;
    this.cacheService = cacheService;

    this.createNewRow = this.createNewRow.bind(this);
    this.updateRow = this.updateRow.bind(this);
    this.getLatestRows = this.getLatestRows.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.bulkDeleteRows = this.bulkDeleteRows.bind(this);
    this.getTodayTransactions = this.getTodayTransactions.bind(this);
  }

  async createNewRow(req: Request, res: Response) {}

  async getLatestRows(req: Request, res: Response) {}

  async updateRow(req: Request, res: Response) {}

  async deleteRow(req: Request, res: Response) {}

  async bulkDeleteRows(req: Request, res: Response) {}

  async getTodayTransactions(req: Request, res: Response) {}
}
