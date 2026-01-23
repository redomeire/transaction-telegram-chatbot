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
        onError: async () => {
            await sock.sendMessage(m.key.remoteJid, {
                react: {
                    text: '❌',
                    key: m.key
                }
            })
        }
    })
    return response;
}

export { deleteTransaction };