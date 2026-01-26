import { cronService } from "../../../services/cron.service";

export default class GetReminderCommand {
    constructor() {
        this.name = 'reminder-get';
        this.description = 'Fetches and displays a list of reminders.';
    }

    async execute(sock, m, ...args) {
        try {
            const crons = cronService.crons.keys();
            await sock.sendMessage(m.key.remoteJid, {
                text: `🤖[Bot Transaction] \n\n✅ Current Reminders:\n\n${[...crons].map((name, index) => `${index + 1}. ${name}`).join('\n') || 'No reminders found.'}`
            })
        } catch (error) {
            await sock.sendMessage(m.key.remoteJid, {
                text: `🤖[Bot Transaction] \n\nGagal mendapatkan daftar reminder. \n\nError: ${error.message || 'Unknown error'}`
            })
        }
    }
}