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
        onLoading: async () => {
            await sock.sendMessage(m.key.remoteJid, {
                react: {
                    text: '⏳',
                    key: m.key
                }
            })
        },
        onSuccess: async (data) => {
            try {
                await sock.sendMessage(m.key.remoteJid, {
                    react: {
                        text: '✅',
                        key: m.key
                    }
                })
                const crons = data.data;
                crons.forEach(cron => {
                    cronService.addCron({
                        name: `reminder-${cron.id}`,
                        time: cron.waktu,
                        taskFn: async () => {
                            await sock.sendMessage(m.key.remoteJid, {
                                text: `⏰ [Reminder] \n\n${cron.pesan}`
                            })
                        }
                    })
                });
            } catch (error) {
                console.error('Error initializing reminders:', error);
                await sock.sendMessage(m.key.remoteJid, {
                    text: `🤖[Bot Transaction] \n\nGagal menginisialisasi reminder. \n\nError: ${error.message || 'Unknown error'}`
                })
            }
        },
        onError: async (error) => {
            await sock.sendMessage(m.key.remoteJid, {
                react: {
                    text: '❌',
                    key: m.key
                }
            })
            await sock.sendMessage(m.key.remoteJid, {
                text: `🤖[Bot Transaction] \n\nGagal memuat. \n\nError: ${error.message || 'Unknown error'}`
            })
        }
    })
    return response;
}

export { initReminder };