import { fetcher } from "../../../utils/api.js";

const baseUrl = process.env.TRANSACTION_APP_API_URL;

const bulkDeleteTransaction = async ({
    ids,
    bot,
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
            await bot.sendChatAction(m.chat.id, 'typing');
        },
        onSuccess: async (result) => {
            const deletedIds = result.data.deletedIDs;
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nBerhasil menghapus transaksi dengan ID: ${deletedIds.join(', ')}.`)
        },
        onError: async (error) => {
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nGagal menghapus transaksi. \n\nError: ${error.message || 'Unknown error'}`
            )
        }
    })
    return response;
}

export { bulkDeleteTransaction };