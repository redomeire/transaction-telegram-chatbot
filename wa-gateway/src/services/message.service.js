import { RateLimiterRes } from "rate-limiter-flexible";
import { stateService } from "./state.service.js";

export class MessageService {
    constructor(commandService, rateLimiter) {
        this.commandService = commandService;
        this.rateLimiter = rateLimiter;
    }

    async handleIncomingMessage(bot, msg) {
        const chatId = msg.chat.id;
        const text = msg.text;

        const activeState = stateService.getState(chatId);
        if (activeState) {
            const command = this.commandService.getCommand(activeState.cmd);
            if (command && command.onReply) {
                return await command.onReply(bot, msg);
            }
        }

        if (!text || !text.startsWith('/')) return;

        const { commandName, args } = this.trimMessage(text);
        const command = this.commandService.getCommand(commandName);

        if (command) {
            try {
                await this.rateLimiter.consume(chatId, command.points || 1);
                await command.execute(bot, msg, args);
            } catch (error) {
                if (error instanceof RateLimiterRes) {
                    const seconds = Math.ceil(error.msBeforeNext / 1000);
                    await bot.sendMessage(chatId, `⏳ Limit reached. Please wait ${seconds} seconds before trying again.`);
                } else {
                    console.error(`Error executing ${commandName}:`, error);
                }
            }
        } else {
            await bot.sendMessage(chatId, `❓ Unknown command: ${commandName}`);
        }
    }

    trimMessage(msgContent) {
        const args = msgContent.slice(1).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        return { commandName, args }
    }
}