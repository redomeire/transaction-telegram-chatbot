import { createReminder } from '../../action/reminder/create-reminder.js';

export const REMINDER_CREATE_COMMAND = {
    name: 'reminder-create',
    description: 'Creates a new reminder with the provided details.',
    execute: (services) => async (sock, m, ...args) => {
        const text = args.join(' ');
        await createReminder({
            m,
            sock,
            text
        })
    }
}