import { cronService } from "../../../services/cron.service.js";
import { fetcher } from "../../../utils/api.js";

const baseUrl = process.env.TRANSACTION_APP_API_URL;

const initReminder = async ({
    sock,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/reminder/read`,
        options: {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
        onSuccess: async (data) => {
            try {
                await sock.sendMessage(m.key.remoteJid, {
                    text: `🤖[Bot Transaction] \n\nBerhasil menginisialisasi reminder dari database. \n\nTotal reminders: ${data.data.length}`
                })
                const crons = data.data;
                for (const cron of crons) {
                    cronService.addCron({
                        name: `reminder-${cron.id}`,
                        time: cron.waktu,
                        taskFn: async () => {
                            await sock.sendMessage(m.key.remoteJid, {
                                text: `⏰ [Reminder] \n\n${cron.pesan}`
                            })
                        }
                    })
                };
            } catch (error) {
                console.error('Error initializing reminders:', error);
                await sock.sendMessage(m.key.remoteJid, {
                    text: `🤖[Bot Transaction] \n\nGagal menginisialisasi reminder. \n\nError: ${error.message || 'Unknown error'}`
                })
            }
        },
        onError: async (error) => {
            await sock.sendMessage(m.key.remoteJid, {
                text: `🤖[Bot Transaction] \n\nGagal memuat reminder. \n\nError: ${error.message || 'Unknown error'}`
            })
        }
    })
    return response;
}

export { initReminder };