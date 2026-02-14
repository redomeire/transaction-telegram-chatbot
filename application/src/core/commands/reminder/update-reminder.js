import { updateReminder } from "../../action/reminder/update-reminder.js";

export const UPDATE_REMINDER_COMMAND = {
    name: 'reminder-update',
    description: 'Updates an existing reminder with new details.',
    execute: (services) => async (sock, m, ...args) => {
        const firstArrayElement = args[0];
        const id = firstArrayElement[0];
        const restOfWords = args.join(' ').replace(id, '').trim();
        await updateReminder({
            id,
            text: restOfWords,
            sock,
            m
        })
    }
}