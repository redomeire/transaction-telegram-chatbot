export async function onMessageUpsert(messageService) {
    return async (sock, event) => {
        if (event.type !== 'notify') return;
        await messageService.handleIncomingMessage(sock, event);
    }
}