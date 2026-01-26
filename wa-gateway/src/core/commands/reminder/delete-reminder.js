import { cronService } from "../../../services/cron.service";

export default class DeleteReminderCommand {
    constructor() {
        this.name = 'reminder-delete';
        this.description = 'Fetches and displays a list of reminders.';
    }

    async execute(sock, m, ...args) {
        try {
            const cronName = args.join(' ');
            cronService.removeCron(cronName);
            await sock.sendMessage(m.key.remoteJid, {
                text: `🤖[Bot Transaction] \n\n✅ Reminder "${cronName}" has been deleted successfully.`
            })
        } catch (error) {
            await sock.sendMessage(m.key.remoteJid, {
                text: `🤖[Bot Transaction] \n\nGagal menghapus reminder. \n\nError: ${error.message || 'Unknown error'}`
            })
        }
    }
}