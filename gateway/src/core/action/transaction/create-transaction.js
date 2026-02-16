import { fetcher } from "../../../utils/api.js";
import { dateformatter } from "../../../utils/dateformatter.js";
import { rupiahFormatter } from "../../../utils/rupiahformatter.js";

const baseUrl = process.env.TRANSACTION_APP_API_URL;

const createTransaction = async ({
    text,
    telegramId,
    bot,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/transaction/create`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, telegramId }),
        },
        onLoading: async () => {
            await bot.sendChatAction(m.chat.id, 'typing');
        },
        onSuccess: async (data) => {
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nBerhasil membuat transaksi:\n\n🆔 ID: ${data.data.id} \n\n📝 Nama : ${data.data.title ?? ''}\n💰 Jumlah: ${rupiahFormatter(data.data.amount)}\n📅 Tanggal: ${dateformatter(data.data.createdAt)}`)
        },
        onError: async (error) => {
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nGagal membuat transaksi. \n\nError: ${error.message || 'Unknown error'}`
            )
        }
    })
    return response;
}

export { createTransaction };