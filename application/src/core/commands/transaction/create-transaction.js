export const CREATE_TRANSACTION_COMMAND = {
    name: 'transaction_create',
    description: 'Creates a new transaction with the provided details.',
    points: 2,
    execute: (services) => async (message) => {
        const chatId = message.chat.id;
        const { botService, cacheService } = services;
        await cacheService.getClient().set(`state:${chatId}`, CREATE_TRANSACTION_COMMAND.name, 'EX', 1000);
        await botService.sendMessage({ chatId, message: 'Please provide your transaction details' });
    }
}