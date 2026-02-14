import { initReminder } from '../../action/reminder/init-reminder.js';

export default class InitReminderCommand {
    constructor() {
        this.name = 'init_reminder';
        this.description = 'Initializes reminders from the database and sets them up in the cron service.';
        this.startup = true;
    }

    async execute(bot, m, ...args) {
        await initReminder({ bot, m });
    }
}