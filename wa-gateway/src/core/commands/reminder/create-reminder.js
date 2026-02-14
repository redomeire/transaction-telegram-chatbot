import { createReminder } from '../../action/reminder/create-reminder.js';

export default class CreateReminderCommand {
    constructor() {
        this.name = 'create_reminder';
        this.description = 'Creates a new reminder with the provided details.';
    }

    async execute(bot, m, ...args) {
        const text = args.join(' ');
        await createReminder({
            m,
            bot,
            text
        })
    }
}