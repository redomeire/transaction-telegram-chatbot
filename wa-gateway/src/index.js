import dotenv from 'dotenv';
import { CommandService } from "./services/command.service.js";
import { MessageService } from './services/message.service.js';
import { RateLimiterService } from "./services/rate-limiter.service.js";
import { connectionInstance } from "./core/connection.js";

import { onConnectionUpdate } from './events/onConnectionUpdate.js';
import { onMessageUpsert } from './events/onMessageUpsert.js';

dotenv.config();

const rateLimiter = RateLimiterService.factory('redis', {
    points: 10,
    duration: 60,
    blockDuration: 60
})
const commandService = new CommandService();
const messageService = new MessageService(commandService, rateLimiter);

async function start() {
    await commandService.init();
    const messageHandler = await onMessageUpsert(messageService);
    await connectionInstance.connect({
        onConnectionUpdate,
        onMessageUpsert: messageHandler
    });
}

await start();