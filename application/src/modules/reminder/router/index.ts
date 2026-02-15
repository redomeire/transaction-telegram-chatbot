import express from "express";
import { ReminderController } from "../controller/reminder.controller.js";
import { aiAgentService } from "../../ai-agent/service/ai-agent.service.js";
import { cacheService } from "../../cache/service/cache.service.js";

const reminderController = new ReminderController(aiAgentService, cacheService);

const router = express.Router();
router.post("/create", reminderController.createReminder);
router.get("/read", reminderController.getReminders);
router.put("/update/:id", reminderController.updateReminder);
router.delete("/delete/:id", reminderController.deleteReminder);

export { router as reminderRouter };
