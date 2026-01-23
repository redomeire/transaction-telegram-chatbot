import dotenv from 'dotenv';
import { commandService } from "./services/command.service.js";
import { connectionInstance } from "./core/connection.js";

dotenv.config();

async function start() {
    await commandService.init();
    await connectionInstance.connect();
}

await start();