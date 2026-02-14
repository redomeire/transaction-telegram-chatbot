import { cronService } from "../../../services/cron.service.js";
import { fetcher } from "../../../utils/api.js";

const baseUrl = process.env.TRANSACTION_APP_API_URL;

const updateReminder = async ({
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
            body: JSON.stringify({ text }),
        },
        onLoading: async () => {
            await bot.sendChatAction(m.chat.id, 'typing');
        },
        onSuccess: async (data) => {
            cronService.updateCron({
                name: `reminder-${data.data.id}`,
                time: data.data.waktu,
                taskFn: async () => {
                    await sock.sendMessage(m.key.remoteJid, {
                        text: `⏰ [Reminder] \n\n${data.data.pesan}`
                    })
                }
            })
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nBerhasil mengupdate reminder:\n\n📝 Nama : ${data.data.nama ?? ''}\n⌚ Waktu: ${crontime(data.data.waktu)}\nPesan: ${data.data.pesan}`)
        },
        onError: async (error) => {
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nGagal mengupdate reminder dengan ID ${id}. \n\nError: ${error.message || 'Unknown error'}`
            )
        }
    })
    return response;
}

export { updateReminder };