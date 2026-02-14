import { getReminder } from "../../action/reminder/get-reminder.js";

export const GET_REMINDER_COMMAND = {
    name: 'reminder-get',
    description: 'Fetches and displays a list of reminders.',
    execute: (services) => async (sock, m, ...args) => {
        await getReminder({ sock, m });
    }
}