import { cronService } from "../../../services/cron.service.js";
import { fetcher } from "../../../utils/api.js";

const baseUrl = process.env.TRANSACTION_APP_API_URL;

const deleteReminder = async ({
    telegramId,
    id,
    bot,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/reminder/delete/${id}`,
        options: {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ telegramId }),
        },
        onLoading: async () => {
            await bot.sendChatAction(m.chat.id, 'typing');
        },
        onSuccess: async () => {
            cronService.removeCron(`reminder-${id}`);
            await bot.sendMessage(m.chat.id, `🤖[Bot Transaction] \n\nBerhasil menghapus reminder dengan ID ${id}.`)
        },
        onError: async (error) => {
            await bot.sendMessage(m.chat.id, {
                text: `🤖[Bot Transaction] \n\nGagal menghapus reminder dengan ID ${id}. \n\nError: ${error.message || 'Unknown error'}`
            })
        }
    })
    return response;
}

export { deleteReminder };