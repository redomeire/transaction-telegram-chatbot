import { cronService } from "../../../services/cron.service.js";
import { fetcher } from "../../../utils/api.js";
import { crontime } from "../../../utils/crontime.js";

const baseUrl = process.env.TRANSACTION_APP_API_URL;

const createReminder = async ({
    text,
    bot,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/reminder/create`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        },
        onLoading: async () => {
            await bot.sendChatAction(m.chat.id, 'typing');
        },
        onSuccess: async (data) => {
            cronService.addCron({
                name: `reminder-${data.data.id}`,
                time: data.data.waktu,
                taskFn: async () => {
                    await bot.sendMessage(m.chat.id, `⏰ [Reminder] \n\n${data.data.pesan}`)
                }
            })
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nBerhasil membuat reminder:\n\n📝 Nama : ${data.data.nama ?? ''}\n⌚ Waktu: ${crontime(data.data.waktu)}\nPesan: ${data.data.pesan}`)
        },
        onError: async (error) => {
            await bot.sendMessage(m.chat.id, {
                text: `🤖[Bot Transaction] \n\nGagal membuat reminder. \n\nError: ${error.message || 'Unknown error'}`
            })
        }
    })
    return response;
}

export { createReminder };