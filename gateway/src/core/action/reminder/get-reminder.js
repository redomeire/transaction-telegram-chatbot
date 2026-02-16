import { fetcher } from "../../../utils/api.js";
import { crontime } from "../../../utils/crontime.js";

const baseUrl = process.env.TRANSACTION_APP_API_URL;

const getReminder = async ({
    telegramId,
    limit,
    bot,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/reminder/read?limit=${limit}&telegramId=${telegramId}`,
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
            const list = data.data.map((reminder) => `🆔 *${reminder.id ?? 'undefined'}*\n📝 Nama : ${reminder.title ?? ''}\n⌚ Waktu: ${crontime(reminder.time)}\n`).join('\n');
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nBerikut adalah daftar reminder yang telah dibuat:\n\n${list || 'Tidak ada reminder yang ditemukan.'}`)
        },
        onError: async (error) => {
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nGagal memuat. \n\nError: ${error.message || 'Unknown error'}`)
        }
    })
    return response;
}

export { getReminder };