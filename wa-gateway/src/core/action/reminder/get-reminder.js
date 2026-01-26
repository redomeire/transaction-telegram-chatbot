import { fetcher } from "../../../utils/api.js";

const baseUrl = process.env.VERCEL_API_URL;

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
            console.log(data);
            await sock.sendMessage(m.key.remoteJid, {
                react: {
                    text: '✅',
                    key: m.key
                }
            })
            // await sock.sendMessage(m.key.remoteJid, {
            //     text: `🤖[Bot Transaction] \n\n✅ Reminder baru berhasil didapatkan!`
            // })
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