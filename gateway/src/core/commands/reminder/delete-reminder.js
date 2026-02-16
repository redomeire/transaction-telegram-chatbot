import { stateService } from "../../../services/state.service.js";
import { deleteReminder } from "../../action/reminder/delete-reminder.js";

export default class DeleteReminderCommand {
    constructor() {
        this.name = 'delete_reminder';
        this.description = 'Fetches and displays a list of reminders.';
    }

    async execute(bot, m, ...args) {
        stateService.setState(m.chat.id, {
            cmd: this.name,
            step: 'WAIT_REMINDER_ID'
        });
        await bot.sendMessage(m.chat.id, "😊 Kasih tau aku ID remindernya!", {
            parse_mode: 'Markdown',
            reply_markup: {
                force_reply: true,
                selective: true
            }
        });
    }

    async onReply(bot, m) {
        const chatId = m.chat.id;
        const id = m.text;
        await deleteReminder({
            telegramId: m.from.id,
            id,
            bot,
            m
        });
        stateService.clearState(chatId);
    }
}