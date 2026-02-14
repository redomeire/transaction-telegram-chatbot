import { aiAgentService } from "../../modules/ai-agent/service/ai-agent.service.js";
import { botService } from "../../modules/bot/service/bot.service.js";
import { cacheService } from "../../modules/cache/service/cache.service.js";
import { googleSheetService } from "../../modules/google-sheet/service/google-sheet.service.js";

export const services = {
    aiAgentService,
    botService,
    cacheService,
    googleSheetService
}