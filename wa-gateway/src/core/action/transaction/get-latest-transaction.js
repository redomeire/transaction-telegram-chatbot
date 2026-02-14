import { fetcher } from "../../../utils/api.js";
import { rupiahFormatter } from "../../../utils/rupiahformatter.js";

const baseUrl = process.env.TRANSACTION_APP_API_URL;

const getLatestTransaction = async ({
    limit = 5,
    bot,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/google-sheet/read?limit=${limit}`,
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
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nTransaksi terbaru:\n\n${data.data.map((item, index) => `${index + 1}. 🆔 ID: ${item.ID}\n📝 Nama: ${item.Judul}\n💰 Jumlah: ${rupiahFormatter(item.Harga)}\n📅 Tanggal: ${item.Tanggal}\n`).join('\n\n')}`);
        },
        onError: async (error) => {
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nGagal mengambil transaksi terbaru. \n\nError: ${error.message || 'Unknown error'}`)
        }
    })
    return response;
}

export { getLatestTransaction };