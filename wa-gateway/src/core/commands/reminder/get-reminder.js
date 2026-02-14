import { stateService } from "../../../services/state.service.js";
import { getReminder } from "../../action/reminder/get-reminder.js";

export default class GetReminderCommand {
    constructor() {
        this.name = 'get_reminder';
        this.description = 'Fetches and displays a list of reminders.';
    }

    async execute(bot, m, ...args) {
        stateService.setState(m.chat.id, {
            cmd: this.name,
            step: 'WAIT_REMINDER_LIMIT'
        });
        await bot.sendMessage(m.chat.id, "😊 Mau lihat berapa reminder terakhir? Batasnya cuma 10", {
            parse_mode: 'Markdown',
            reply_markup: {
                force_reply: true,
                selective: true
            }
        });
    }

    async onReply(bot, m) {
        const chatId = m.chat.id;
        const limit = m.text;
        await getReminder({
            limit,
            bot,
            m
        });
        stateService.clearState(chatId);
    }
}