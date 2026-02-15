import { fetcher } from "../../../utils/api.js";

const baseUrl = process.env.TRANSACTION_APP_API_URL;

const bulkDeleteTransaction = async ({
    ids,
    telegramId,
    bot,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/transaction/bulk-delete`,
        options: {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids, telegramId })
        },
        onLoading: async () => {
            await bot.sendChatAction(m.chat.id, 'typing');
        },
        onSuccess: async (result) => {
            const deletedIds = result.data;
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nBerhasil menghapus transaksi dengan ID: ${deletedIds.map(item => item).join(', ')}.`)
        },
        onError: async (error) => {
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nGagal menghapus transaksi. \n\nError: ${error.message || 'Unknown error'}`
            )
        }
    })
    return response;
}

export { bulkDeleteTransaction };