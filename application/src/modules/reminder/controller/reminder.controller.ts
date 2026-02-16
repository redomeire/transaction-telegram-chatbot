import { AIAgentService } from "@/modules/ai-agent/service/ai-agent.service";
import { CacheService } from "@/modules/cache/service/cache.service";
import { Request, Response } from "express";
import { ReminderService } from "../service/reminder.service";

export class ReminderController {
  constructor(
    private aiAgentService: AIAgentService,
    private cacheService: CacheService,
    private reminderService: ReminderService,
  ) {
    this.createReminder = this.createReminder.bind(this);
    this.getReminders = this.getReminders.bind(this);
    this.updateReminder = this.updateReminder.bind(this);
    this.deleteReminder = this.deleteReminder.bind(this);
  }

  async createReminder(req: Request, res: Response) {
    try {
      const { text, telegramId } = req.body;
      const cacheClient = this.cacheService.getClient();

      const promptResult = await this.aiAgentService.analyzePromptReminder({
        text,
      });
      const result = await this.reminderService.create({
        ...promptResult,
        userId: BigInt(telegramId),
      });

      const rKey = `reminder:${result.id}`;
      const indexKey = `user:reminders:${telegramId}`;

      await cacheClient
        .multi()
        .hSet(rKey, {
          id: result.id.toString(),
          userId: result.userId.toString(),
          title: result.title,
          time: result.time,
          message: promptResult.message ?? "",
        })
        .expire(rKey, 86400)
        .sAdd(indexKey, result.id.toString())
        .expire(indexKey, 86400)
        .exec();

      res.status(201).json({
        error: false,
        message: "Reminder created successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({ error: true, message: error.message });
    }
  }

  async getReminders(req: Request, res: Response) {
    try {
      const { telegramId } = req.query as { telegramId: string };
      const cacheClient = this.cacheService.getClient();
      const indexKey = `user:reminders:${telegramId}`;

      const reminderIds = await cacheClient.sMembers(indexKey);

      if (reminderIds.length > 0) {
        const cachedResults = await Promise.all(
          reminderIds.map((id) => cacheClient.hGetAll(`reminder:${id}`)),
        );

        const validResults = cachedResults.filter(
          (r) => Object.keys(r).length > 0,
        );

        if (validResults.length > 0) {
          return res.status(200).json({
            error: false,
            message: "Reminders fetched successfully",
            data: validResults,
          });
        }
      }

      const freshData = await this.reminderService.getByTelegramId(
        BigInt(telegramId),
      );

      if (freshData.length === 0) {
        return res
          .status(404)
          .json({ error: true, message: "No reminders found" });
      }

      const pipeline = cacheClient.multi();
      freshData.forEach((reminder) => {
        const rKey = `reminder:${reminder.id}`;
        pipeline.hSet(rKey, {
          id: reminder.id.toString(),
          userId: reminder.userId.toString(),
          title: reminder.title,
          time: reminder.time,
          message: reminder.message ?? "",
        });
        pipeline.expire(rKey, 86400);
        pipeline.sAdd(indexKey, reminder.id.toString());
      });
      pipeline.expire(indexKey, 86400);
      await pipeline.exec();

      return res.status(200).json({
        error: false,
        message: "Reminders fetched successfully",
        data: freshData,
      });
    } catch (error: any) {
      res.status(500).json({ error: true, message: error.message });
    }
  }

  async updateReminder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { text, telegramId } = req.body;
      const cacheClient = this.cacheService.getClient();

      const promptResult = await this.aiAgentService.analyzePromptReminder({
        text,
      });
      const result = await this.reminderService.updateReminder(
        Number(id),
        BigInt(telegramId),
        promptResult,
      );

      if (!result) {
        return res
          .status(404)
          .json({ error: true, message: "Reminder not found" });
      }

      const rKey = `reminder:${id}`;
      const isExist = await cacheClient.exists(rKey);

      if (isExist) {
        await cacheClient.hSet(rKey, {
          id: result.id.toString(),
          userId: result.userId.toString(),
          title: result.title,
          time: result.time,
          message: promptResult.message ?? "",
        });
      }

      res.status(200).json({
        error: false,
        message: "Reminder updated successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({ error: true, message: error.message });
    }
  }

  async deleteReminder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { telegramId } = req.body;
      const cacheClient = this.cacheService.getClient();

      const result = await this.reminderService.deleteReminder(
        Number(id),
        BigInt(telegramId),
      );

      if (!result) {
        return res
          .status(404)
          .json({ error: true, message: "Reminder not found" });
      }

      await cacheClient
        .multi()
        .del(`reminder:${id}`)
        .sRem(`user:reminders:${telegramId}`, id.toString())
        .exec();

      res.status(200).json({
        error: false,
        message: "Reminder deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({ error: true, message: error.message });
    }
  }
}
