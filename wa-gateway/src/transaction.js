import { fetcher } from "./utils/api.js";

const baseUrl = process.env.VERCEL_API_URL;

const createTransaction = async ({
    text,
    sock,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/google-sheet/create`,
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
const updateTransaction = async ({ text, sock, m }) => {}
const deleteTransaction = async ({ text, sock, m }) => { }

export { createTransaction, updateTransaction, deleteTransaction };