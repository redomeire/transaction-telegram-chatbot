import { fetcher } from "../../../utils/api.js";

const baseUrl = process.env.TRANSACTION_APP_API_URL;

const createUser = async ({
    username,
    telegramId,
    bot,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/user/create`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, telegramId }),
        },
        onLoading: async () => {
            await bot.sendChatAction(m.chat.id, 'typing');
        },
        onSuccess: async (data) => {
            await bot.sendMessage(m.chat.id,
                `✅ User ${data.username} berhasil dibuat! Kamu sudah siap menggunakan TRANSACTION ASSISTANT. Ketik *!help* untuk melihat daftar perintah yang tersedia.`,
                {
                    parse_mode: 'Markdown'
                }
            )
        },
        onError: async (error) => {
            await bot.sendMessage(m.chat.id, `❌ Gagal membuat user: ${error.message}`);
        }
    })
    return response;
}

export { createUser };