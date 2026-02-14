import { aiAgentService } from "../../modules/ai-agent/service/ai-agent.service";
import { botService } from "../../modules/bot/service/bot.service";
import { cacheService } from "../../modules/cache/service/cache.service";
import { googleSheetService } from "../../modules/google-sheet/service/google-sheet.service";

export const services = {
    aiAgentService,
    botService,
    cacheService,
    googleSheetService
}