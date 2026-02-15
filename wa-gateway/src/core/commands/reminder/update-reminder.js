import { stateService } from "../../../services/state.service.js";
import { updateReminder } from "../../action/reminder/update-reminder.js";

class UpdateReminderCommand {
    constructor() {
        this.name = 'update_reminder';
        this.description = 'Updates an existing reminder with new details.';
    }

    async execute(bot, m, ...args) {
        stateService.setState(m.chat.id, {
            cmd: this.name,
            step: 'WAIT_REMINDER_UPDATE_DETAILS'
        });
        await bot.sendMessage(m.chat.id, "😊 Kasih tau aku ID remindernya, terus apa yang mau kamu ubah?", {
            parse_mode: 'Markdown',
            reply_markup: {
                force_reply: true,
                selective: true
            }
        });
    }

    async onReply(bot, m) {
        const chatId = m.chat.id;
        const id = m.text.split(' ')[0];
        const text = m.text.split(' ').slice(1).join(' ');
        await updateReminder({
            telegramId: m.from.id,
            id,
            text,
            bot,
            m
        });
        stateService.clearState(chatId);
    }
}

export default UpdateReminderCommand;