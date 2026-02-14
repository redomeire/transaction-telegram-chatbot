import { fetcher } from "../../../utils/api.js";
import { crontime } from "../../../utils/crontime.js";

const baseUrl = process.env.TRANSACTION_APP_API_URL;

const getReminder = async ({
    limit,
    bot,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/reminder/read?limit=${limit}`,
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
            const list = data.data.map((reminder, index) => `${index + 1}. *${reminder.id ?? 'undefined'}*\n📝 Nama : ${reminder.nama ?? ''}\n⌚ Waktu: ${crontime(reminder.waktu)}\n`).join('\n');
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nBerikut adalah daftar reminder yang telah dibuat:\n\n${list || 'Tidak ada reminder yang ditemukan.'}`)
        },
        onError: async (error) => {
            await bot.sendMessage(m.chat.id, {
                text: `🤖[Bot Transaction] \n\nGagal memuat. \n\nError: ${error.message || 'Unknown error'}`
            })
        }
    })
    return response;
}

export { getReminder };