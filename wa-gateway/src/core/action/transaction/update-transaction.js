import { fetcher } from "../../../utils/api.js";
import { rupiahFormatter } from "../../../utils/rupiahformatter.js";
import { dateformatter } from "../../../utils/dateformatter.js";

const baseUrl = process.env.TRANSACTION_APP_API_URL;

const updateTransaction = async ({
    id,
    telegramId,
    text,
    bot,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/transaction/${id}`,
        options: {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, telegramId })
        },
        onLoading: async () => {
            await bot.sendChatAction(m.chat.id, 'typing');
        },
        onSuccess: async (data) => {
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nBerhasil mengupdate transaksi dengan ID ${id}:\n\n📝 Nama : ${data.data.title ?? ''}\n💰 Jumlah: ${rupiahFormatter(data.data.amount)}\n📅 Tanggal: ${dateformatter(data.data.createdAt)}\n`)
        },
        onError: async (error) => {
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nGagal mengupdate transaksi dengan ID ${id}. \n\nError: ${error.message || 'Unknown error'}`
            )
        }
    })
    return response;
}

export { updateTransaction };