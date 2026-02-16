export async function onMessageUpsert(messageService) {
    return async (bot, message) => {
        await messageService.handleIncomingMessage(bot, message);
    }
}