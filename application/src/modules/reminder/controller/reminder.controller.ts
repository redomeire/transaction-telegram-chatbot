import { AIAgentService } from "@/modules/ai-agent/service/ai-agent.service";
import { CacheService } from "@/modules/cache/service/cache.service";
import { Request, Response } from "express";

export class ReminderController {
  aiAgentService: AIAgentService;
  cacheService: CacheService;
  constructor(aiAgentService: AIAgentService, cacheService: CacheService) {
    this.aiAgentService = aiAgentService;
    this.cacheService = cacheService;

    this.createReminder = this.createReminder.bind(this);
    this.getReminders = this.getReminders.bind(this);
    this.updateReminder = this.updateReminder.bind(this);
    this.deleteReminder = this.deleteReminder.bind(this);
  }

  async createReminder(req: Request, res: Response) {
    try {
      const { text } = req.body;
      const cacheClient = this.cacheService.getClient();

      const promptResult = await this.aiAgentService.analyzePromptReminder({
        text,
      });
      await cacheClient.hSet(`reminders:${promptResult.id}`, promptResult);
      res.status(201).json({
        error: false,
        message: "Reminder created successfully",
        data: promptResult,
      });
    } catch (error: any) {
      res.status(500).json({ error: true, message: error.message });
    }
  }

  async getReminders(req: Request, res: Response) {
    try {
      const { limit = 10 } = { ...req.query } as { limit?: number };
      const results = [];
      const cacheClient = this.cacheService.getClient();

      for await (const rawKey of cacheClient.scanIterator({
        MATCH: "reminders:*",
        COUNT: limit || 30,
      })) {
        if (Array.isArray(rawKey) && rawKey.length === 0) {
          continue;
        }
        for (const key of rawKey) {
          const reminder = await cacheClient.hGetAll(key);
          results.push(reminder);
        }
      }
      if (results.length === 0)
        return res
          .status(404)
          .json({ error: true, message: "No reminders found" });
      res.status(200).json({
        error: false,
        message: "Reminders fetched successfully",
        data: results,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }

  async updateReminder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { text } = req.body;
      const promptResult = await this.aiAgentService.analyzePromptReminder({
        text,
      });
      const cacheClient = this.cacheService.getClient();
      const isHashExist = await cacheClient.exists(`reminders:${id}`);

      if (!isHashExist) {
        return res
          .status(404)
          .json({ error: true, message: "Reminder not found" });
      }

      await cacheClient.hSet(`reminders:${id}`, promptResult);

      res.status(200).json({
        error: false,
        message: "Reminder updated successfully",
        data: promptResult,
      });
    } catch (error: any) {
      res.status(500).json({ error: true, message: error.message });
    }
  }

  async deleteReminder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cacheClient = this.cacheService.getClient();
      const isHashExist = await cacheClient.exists(`reminders:${id}`);

      if (!isHashExist) {
        return res
          .status(404)
          .json({ error: true, message: "Reminder not found" });
      }

      await cacheClient.del(`reminders:${id}`);
      res.status(200).json({
        error: false,
        message: "Reminder deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({ error: true, message: error.message });
    }
  }
}
