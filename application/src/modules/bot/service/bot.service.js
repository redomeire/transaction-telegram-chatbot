import { botClient } from "../client/bot-client.js";
class BotService {
    constructor() {
        this.client = botClient.bot;
    }

    async sendMessage({ chatId, message, opts }) {
        try {
            await this.client.sendMessage(chatId, message, opts);
        } catch (error) {
            console.error('Error sending message:', error);
            throw new Error('Failed to send message');
        }
    }
}

export const botService = new BotService();