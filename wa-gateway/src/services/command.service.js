import fs from 'fs';
import path from 'path';
import { dirname } from '../utils/path.js';
import { jidNormalizedUser } from '@whiskeysockets/baileys';

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

    async runStartupCommands(sock) {
        const startupCommands = Array.from(
            this.commands.values()).filter(cmd => cmd.startup
        );
        // TODO: this is considered bad practice, refactor later
        const m = {
            key: {
                remoteJid: jidNormalizedUser(sock.user.id),
                fromMe: true,
                id: 'SYSTEM_STARTUP'
            },
            isSystem: true
        }
        for (const command of startupCommands) {
            try {
                await command.execute(sock, m);
            } catch (error) {
                console.error(`Error executing startup command ${command.name}:`, error);
            }
        }
    }

    getCommand(commandName) {
        return this.commands.get(commandName)
    }

    hasCommand(commandName) {
        return this.commands.has(commandName)
    }
}