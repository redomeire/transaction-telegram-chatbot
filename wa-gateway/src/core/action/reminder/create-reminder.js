import { cronService } from "../../../services/cron.service.js";
import { fetcher } from "../../../utils/api.js";
import { crontime } from "../../../utils/crontime.js";

const baseUrl = process.env.TRANSACTION_APP_API_URL;

const createReminder = async ({
    text,
    sock,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/reminder/create`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
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
            console.log(data);
            cronService.addCron({
                name: `reminder-${data.data.id}`,
                time: data.data.waktu,
                taskFn: async () => {
                    await sock.sendMessage(m.key.remoteJid, {
                        text: `⏰ [Reminder] \n\n${data.data.pesan}`
                    })
                }
            })
            await sock.sendMessage(m.key.remoteJid, {
                react: {
                    text: '✅',
                    key: m.key
                }
            })
            await sock.sendMessage(m.key.remoteJid, {
                text: `🤖[Bot Transaction] \n\n✅ Reminder baru berhasil dibuat! \n\n 🆔 ID : ${data.data.id}\n📝 Nama : ${data.data.nama}\n⌚ Waktu: ${crontime(data.data.waktu)}`
            })
        },
        onError: async (error) => {
            await sock.sendMessage(m.key.remoteJid, {
                react: {
                    text: '❌',
                    key: m.key
                }
            })
            await sock.sendMessage(m.key.remoteJid, {
                text: `🤖[Bot Transaction] \n\nGagal membuat reminder. \n\nError: ${error.message || 'Unknown error'}`
            })
        }
    })
    return response;
}

export { createReminder };