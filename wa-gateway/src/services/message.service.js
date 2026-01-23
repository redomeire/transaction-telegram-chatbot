import { commandService } from "./command.service.js";

export class MessageService {
    constructor(sock) {
        this.sock = sock;
    }

    async handleIncomingMessage(event) {
        for (const m of event.messages) {
            const msgContent = m.message?.conversation || m.message?.extendedTextMessage?.text;
            if (!msgContent || !msgContent.startsWith('!')) continue;
            const { commandName, args } = this.trimMessage(msgContent);

            const command = commandService.getCommand(commandName);

            if (command) {
                try {
                    await command.execute(this.sock, m, args);
                } catch (error) {
                    console.error(`Error executing command "${commandName}":`, error);
                }
            } else {
                await this.sock.sendMessage(m.key.remoteJid, {
                    text: `🤖 [Bot Assistant]: Maaf, perintah "${commandName}" tidak dikenali. Ketik !help untuk daftar perintah yang tersedia.`
                }, { quoted: m });
            }
        }
    }

    trimMessage(msgContent) {
        const args = msgContent.slice(1).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        return { commandName, args }
    }
}