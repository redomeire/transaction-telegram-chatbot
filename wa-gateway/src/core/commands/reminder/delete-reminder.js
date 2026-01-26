import { deleteReminder } from "../../action/reminder/delete-reminder.js";

export default class DeleteReminderCommand {
    constructor() {
        this.name = 'reminder-delete';
        this.description = 'Fetches and displays a list of reminders.';
    }

    async execute(sock, m, ...args) {
        const id = args[0];
        await deleteReminder({ id, sock, m });
    }
}