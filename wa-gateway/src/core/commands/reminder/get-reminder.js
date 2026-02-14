import { getReminder } from "../../action/reminder/get-reminder.js";

export default class GetReminderCommand {
    constructor() {
        this.name = 'get_reminder';
        this.description = 'Fetches and displays a list of reminders.';
    }

    async execute(bot, m, ...args) {
        const limit = parseInt(args[0][0]) || 5;
        await getReminder({ bot, m, limit });
    }
}