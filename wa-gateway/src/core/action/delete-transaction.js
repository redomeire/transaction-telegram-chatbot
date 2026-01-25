import { fetcher } from "../../utils/api.js";

const baseUrl = process.env.VERCEL_API_URL;

const deleteTransaction = async ({
    id,
    sock,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/google-sheet/delete/${id}`,
        options: {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        },
        onLoading: async () => {
            await sock.sendMessage(m.key.remoteJid, {
                react: {
                    text: '⏳',
                    key: m.key
                }
            })
        },
        onSuccess: async () => {
            await sock.sendMessage(m.key.remoteJid, {
                react: {
                    text: '✅',
                    key: m.key
                }
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
                text: `🤖[Bot Transaction] \n\nGagal menghapus transaksi dengan ID ${id}.\n\nError: ${error.message || 'Unknown error'}`
            })
        }
    })
    return response;
}

export { deleteTransaction };