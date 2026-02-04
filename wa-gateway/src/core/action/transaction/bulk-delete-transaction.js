import { fetcher } from "../../../utils/api.js";

const baseUrl = process.env.TRANSACTION_APP_API_URL;

const bulkDeleteTransaction = async ({
    ids,
    sock,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/google-sheet/delete/bulk`,
        options: {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids })
        },
        onLoading: async () => {
            await sock.sendMessage(m.key.remoteJid, {
                react: {
                    text: '⏳',
                    key: m.key
                }
            })
        },
        onSuccess: async (result) => {
            const deletedIds = result.data.deletedIDs;
            await sock.sendMessage(m.key.remoteJid, {
                react: {
                    text: '✅',
                    key: m.key
                }
            })
            await sock.sendMessage(m.key.remoteJid, {
                text: `🤖[Bot Transaction] \n\nBerhasil menghapus transaksi dengan ID: ${deletedIds.successRows.join(', ')}`
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
                text: `🤖[Bot Transaction] \n\nGagal menghapus transaksi.\n\nError: ${error.message || 'Unknown error'}`
            })
        }
    })
    return response;
}

export { bulkDeleteTransaction };