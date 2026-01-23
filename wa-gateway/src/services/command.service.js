import fs from 'fs';
import path from 'path';
import { dirname } from '../utils/path.js';

class CommandService {
    constructor() {
        this.commands = new Map();
    }

    async init() {
        const commandsPath = path.join(dirname, '../core/commands');
        const files = fs.readdirSync(commandsPath);
        for (const file of files) {
            if (file.endsWith('.js')) {
                const module = await import(`file://${path.join(commandsPath, file)}`)
                const CommandClass = module.default;
                const cmd = new CommandClass();
                this.commands.set(cmd.name, cmd);
            }
        }
        console.log(`Loaded ${this.commands.size} commands.`);
    }

    getCommand(commandName) {
        return this.commands.get(commandName)
    }

    hasCommand(commandName) {
        return this.commands.has(commandName)
    }
}

export const commandService = new CommandService();