import { MessageService } from "../services/message.service.js";

export default async function onMessageUpsert(sock, event) {
    if (event.type !== 'notify') return;
    const messageService = new MessageService(sock);
    await messageService.handleIncomingMessage(event);
}