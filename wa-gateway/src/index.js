import dotenv from 'dotenv';
import { CommandService } from "./services/command.service.js";
import { MessageService } from './services/message.service.js';
import { RateLimiterService } from "./services/rate-limiter.service.js";
import { connectionInstance } from "./core/connection.js";

import { onConnectionUpdate } from './events/onConnectionUpdate.js';
import { onMessageUpsert } from './events/onMessageUpsert.js';

dotenv.config();

const rateLimiter = RateLimiterService.factory(
    process.env.RATE_LIMIT_STORAGE,
    {
        points: process.env.RATE_LIMIT_POINTS,
        duration: process.env.RATE_LIMIT_DURATION,
        blockDuration: process.env.RATE_LIMIT_BLOCK_DURATION
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
    connectionInstance.once('ready', async (sock) => {
        await new Promise(resolve => setTimeout(resolve, 3000));

        if (!sock.user.id) return;
        await commandService.runStartupCommands(sock);
    })
}

await start();