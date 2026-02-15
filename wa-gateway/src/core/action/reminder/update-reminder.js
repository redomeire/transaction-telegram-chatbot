import { cronService } from "../../../services/cron.service.js";
import { fetcher } from "../../../utils/api.js";
import { crontime } from "../../../utils/crontime.js";

const baseUrl = process.env.TRANSACTION_APP_API_URL;

const updateReminder = async ({
    telegramId,
    id,
    text,
    bot,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/reminder/update/${id}`,
        options: {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, telegramId }),
        },
        onLoading: async () => {
            await bot.sendChatAction(m.chat.id, 'typing');
        },
        onSuccess: async (data) => {
            cronService.updateCron({
                name: `reminder-${data.data.id}`,
                time: data.data.time,
                taskFn: async () => {
                    await bot.sendMessage(m.chat.id, `⏰ [Reminder] \n\n${data.data.message}`)
                }
            })
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nBerhasil mengupdate reminder:\n\n📝 Nama : ${data.data.title ?? ''}\n⌚ Waktu: ${crontime(data.data.time)}\nPesan: ${data.data.message}`)
        },
        onError: async (error) => {
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nGagal mengupdate reminder dengan ID ${id}. \n\nError: ${error.message || 'Unknown error'}`
            )
        }
    })
    return response;
}

export { updateReminder };