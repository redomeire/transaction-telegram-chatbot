import { fetcher } from "../../../utils/api.js";

const baseUrl = process.env.TRANSACTION_APP_API_URL;

const getUser = async ({
    telegramId,
    bot,
    m
}) => {
    const response = await fetcher({
        url: `${baseUrl}/user/${telegramId}`,
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
            await bot.sendMessage(m.chat.id,
                `✅ Selamat datang kembali ${data.data.username}!`
            )
        },
        onError: async (error) => {
            console.error('Error fetching user:', error);
        }
    })
    return response;
}

export { getUser };