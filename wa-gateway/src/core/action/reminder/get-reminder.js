import { fetcher } from "../../../utils/api.js";
import { crontime } from "../../../utils/crontime.js";

const baseUrl = process.env.TRANSACTION_APP_API_URL;

const getReminder = async ({
    limit,
    sock,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/reminder/read?limit=${limit}`,
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
            await sock.sendMessage(m.key.remoteJid, {
                react: {
                    text: '✅',
                    key: m.key
                }
            })
            await sock.sendMessage(m.key.remoteJid, {
                text: `🤖[Bot Transaction] \n\nBerikut ${limit !== -1 ? limit : 'semua'} reminder terbaru anda:\n\n${data.data.map((reminder, index) => `${index + 1}. *${reminder.id ?? 'undefined'}*\n📝 Nama : ${reminder.nama ?? ''}\n⌚ Waktu: ${crontime(reminder.waktu)}\n`).join('\n')}`
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
                text: `🤖[Bot Transaction] \n\nGagal memuat. \n\nError: ${error.message || 'Unknown error'}`
            })
        }
    })
    return response;
}

export { getReminder };