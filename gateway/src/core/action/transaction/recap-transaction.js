import { fetcher } from "../../../utils/api.js";
import { rupiahFormatter } from "../../../utils/rupiahformatter.js";
import { dateformatter } from "../../../utils/dateformatter.js";

const baseUrl = process.env.TRANSACTION_APP_API_URL;

const recapTransaction = async ({
    telegramId,
    bot,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/transaction/recap/${telegramId}`,
        options: {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
        onLoading: async () => {
            await bot.sendChatAction(m.chat.id, 'typing');
        },
        onSuccess: async (data) => {
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nRekap transaksi hari ini:\n\n${data.data.map((item, index) => `${index + 1}. 🆔 ID: ${item.id}\n📝 Nama: ${item.title}\n💰 Jumlah: ${rupiahFormatter(item.amount)}\n📅 Tanggal: ${dateformatter(item.createdAt)}\n`).join('\n\n')}`);
        },
        onError: async (error) => {
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nGagal mengambil rekap transaksi. \n\nError: ${error.message || 'Unknown error'}`)
        }
    })
    return response;
}

export { recapTransaction };