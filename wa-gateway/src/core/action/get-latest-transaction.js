import { fetcher } from "../../utils/api.js";

const baseUrl = process.env.VERCEL_API_URL;

const getLatestTransaction = async ({
    limit = 5,
    sock,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/google-sheet/read?limit=${limit}`,
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
                text: `🤖[Bot Transaction] \n Berikut ${limit} transaksi terbaru anda:\n\n${data.data.map((tx, index) => `${index + 1}. ${tx.ID ?? ''} - ${tx.Tanggal ?? ''} - ${tx.Judul} - ${tx.Harga}`).join('\n')}`
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
                text: `🤖[Bot Transaction] \n\nGagal mendapatkan transaksi.\n\nError: ${error.message || 'Unknown error'}`
            })
        }
    })
    return response;
}

export { getLatestTransaction };