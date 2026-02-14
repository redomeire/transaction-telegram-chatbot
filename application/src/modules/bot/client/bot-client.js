import TelegramBot from 'node-telegram-bot-api'

const { TELEGRAM_BOT_TOKEN } = process.env;

class BotClient {
    constructor() {
        this.bot = new TelegramBot(TELEGRAM_BOT_TOKEN,
            { polling: true }
        );
    }
}

export const botClient = new BotClient();