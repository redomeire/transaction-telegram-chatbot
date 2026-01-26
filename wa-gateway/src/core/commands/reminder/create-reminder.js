import { createReminder } from '../../action/reminder/create-reminder.js';

export default class CreateReminderCommand {
    constructor() {
        this.name = 'reminder-create';
        this.description = 'Creates a new reminder with the provided details.';
    }

    async execute(sock, m, ...args) {
        const text = args.join(' ');
        await createReminder({
            m,
            sock,
            text
        })
    }
}