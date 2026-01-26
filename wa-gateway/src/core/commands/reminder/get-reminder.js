import { getReminder } from "../../action/reminder/get-reminder.js";

export default class GetReminderCommand {
    constructor() {
        this.name = 'reminder-get';
        this.description = 'Fetches and displays a list of reminders.';
    }

    async execute(sock, m, ...args) {
        const limit = parseInt(args[0][0]) || 5;
        await getReminder({ sock, m, limit });
    }
}