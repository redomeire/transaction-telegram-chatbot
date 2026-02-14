import { updateReminder } from "../../action/reminder/update-reminder.js";

class UpdateReminderCommand {
    constructor() {
        this.name = 'update_reminder';
        this.description = 'Updates an existing reminder with new details.';
    }

    async execute(bot, m, ...args) {
        const firstArrayElement = args[0];
        const id = firstArrayElement[0];
        const restOfWords = args.join(' ').replace(id, '').trim();
        await updateReminder({
            id,
            text: restOfWords,
            bot,
            m
        })
    }
}

export default UpdateReminderCommand;