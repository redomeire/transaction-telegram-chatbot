import { initReminder } from '../../action/reminder/init-reminder.js';

export const REMINDER_INIT_COMMAND = {
    name: 'reminder-init',
    description: 'Initializes reminders from the database and sets them up in the cron service.',
    startup: true,
    execute: (services) => async (sock, m, ...args) => {
        await initReminder({ sock, m });
    }
}