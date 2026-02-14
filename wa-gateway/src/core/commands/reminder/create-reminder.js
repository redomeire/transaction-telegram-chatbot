import { stateService } from '../../../services/state.service.js';
import { createReminder } from '../../action/reminder/create-reminder.js';

export default class CreateReminderCommand {
    constructor() {
        this.name = 'create_reminder';
        this.description = 'Creates a new reminder with the provided details.';
    }

    async execute(bot, m, ...args) {
        stateService.setState(m.chat.id, {
            cmd: this.name,
            step: 'WAIT_REMINDER_DETAILS'
        });
        await bot.sendMessage(m.chat.id, "😊 Reminder apa yang mau kamu buat?", {
            parse_mode: 'Markdown',
            reply_markup: {
                force_reply: true,
                selective: true
            }
        });
    }

    async onReply(bot, m) {
        const chatId = m.chat.id;
        const text = m.text;
        await createReminder({
            text,
            bot,
            m
        });
        stateService.clearState(chatId);
    }
}