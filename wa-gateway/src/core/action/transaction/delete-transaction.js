import { fetcher } from "../../../utils/api.js";

const baseUrl = process.env.TRANSACTION_APP_API_URL;

const deleteTransaction = async ({
    id,
    bot,
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
            await bot.sendChatAction(m.chat.id, 'typing');
        },
        onSuccess: async () => {
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nBerhasil menghapus transaksi dengan ID ${id}.`)
        },
        onError: async (error) => {
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nGagal menghapus transaksi dengan ID ${id}. \n\nError: ${error.message || 'Unknown error'}`)
        }
    })
    return response;
}

export { deleteTransaction };