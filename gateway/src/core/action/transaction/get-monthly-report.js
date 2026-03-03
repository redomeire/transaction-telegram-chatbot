import { fetcher } from "../../../utils/api.js";
import { rupiahFormatter } from "../../../utils/rupiahformatter.js";

const baseUrl = process.env.TRANSACTION_APP_API_URL;

const getMonthlyReport = async ({
    telegramId,
    bot,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/transaction/${telegramId}/report`,
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
            const { totalIncome, totalExpense, notes } = data.data;
            const difference = totalIncome - totalExpense;
            const isProfit = difference >= 0;

            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nLaporan Bulanan:\n\n💰 Total Pengeluaran: ${rupiahFormatter(totalExpense)}\n💵 Total Pemasukan: ${rupiahFormatter(totalIncome)}\n📊 ${isProfit ? 'Keuntungan' : 'Kerugian'}: ${rupiahFormatter(Math.abs(difference))}\n\n📝 Catatan: ${notes || 'Tidak ada catatan'}`);
        },
        onError: async (error) => {
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nGagal menganalisis laporan bulanan. \n\nError: ${error.message || 'Unknown error'}`)
        }
    })
    return response;
}

export { getMonthlyReport };