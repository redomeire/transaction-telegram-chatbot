import { fetcher } from "../../../utils/api.js";
import { rupiahFormatter } from "../../../utils/rupiahformatter.js";

const baseUrl = process.env.TRANSACTION_APP_API_URL;

const updateTransaction = async ({
    id,
    text,
    bot,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/google-sheet/update/${id}`,
        options: {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text })
        },
        onLoading: async () => {
            await bot.sendChatAction(m.chat.id, 'typing');
        },
        onSuccess: async (data) => {
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nBerhasil mengupdate transaksi dengan ID ${id}:\n\n📝 Nama : ${data.data.Judul ?? ''}\n💰 Jumlah: ${rupiahFormatter(data.data.Harga)}\n📅 Tanggal: ${data.data.Tanggal}\n`)
        },
        onError: async (error) => {
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nGagal mengupdate transaksi dengan ID ${id}. \n\nError: ${error.message || 'Unknown error'}`
            )
        }
    })
    return response;
}

export { updateTransaction };