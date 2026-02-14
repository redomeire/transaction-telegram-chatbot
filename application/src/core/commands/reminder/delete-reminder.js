import { deleteReminder } from "../../action/reminder/delete-reminder.js";

export const DELETE_REMINDER_COMMAND = {
    name: 'reminder-delete',
    description: 'Fetches and displays a list of reminders.',
    execute: (services) => async (sock, m, ...args) => {
        const id = args[0];
        await deleteReminder({ id, sock, m });
    }
}