import { fetcher } from "../../../utils/api.js";

const baseUrl = process.env.VERCEL_API_URL;

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
            await sock.sendMessage(m.key.remoteJid, {
                react: {
                    text: '✅',
                    key: m.key
                }
            })
            await sock.sendMessage(m.key.remoteJid, {
                text: `🤖[Bot Transaction] \n\n✅ Reminder baru berhasil dibuat!`
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