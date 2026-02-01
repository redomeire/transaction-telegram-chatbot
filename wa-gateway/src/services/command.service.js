import fs from 'fs';
import path from 'path';
import { dirname } from '../utils/path.js';

export class CommandService {
    constructor() {
        this.commands = new Map();
    }

    async init() {
        const commandsPath = path.join(dirname, '../core/commands');
        const entries = fs.readdirSync(commandsPath, { recursive: true, withFileTypes: true });
        for (const entry of entries) {
            if (entry.isFile() && entry.name.endsWith('.js')) {
                const fullPath = path.join(entry.path, entry.name);
                const module = await import(`file://${fullPath}`);
                const CommandClass = module.default;
                if (CommandClass) {
                    const cmd = new CommandClass();
                    this.commands.set(cmd.name, cmd);
                }
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