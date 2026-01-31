import { initReminder } from '../../action/reminder/init-reminder.js';

export default class InitReminderCommand {
    constructor() {
        this.name = 'reminder-init';
        this.description = 'Initializes reminders from the database and sets them up in the cron service.';
    }

    async execute(sock, m, ...args) {
        await initReminder({ sock, m });
    }
}