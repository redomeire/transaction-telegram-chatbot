import { deleteReminder } from "../../action/reminder/delete-reminder.js";

export default class DeleteReminderCommand {
    constructor() {
        this.name = 'delete_reminder';
        this.description = 'Fetches and displays a list of reminders.';
    }

    async execute(bot, m, ...args) {
        const id = args[0];
        await deleteReminder({ id, bot, m });
    }
}