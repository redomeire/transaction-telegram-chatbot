import { RateLimiterRes } from "rate-limiter-flexible";

export class MessageService {
    constructor(commandService, rateLimiter) {
        this.commandService = commandService;
        this.rateLimiter = rateLimiter;
    }

    async handleIncomingMessage(sock, event) {
        for (const m of event.messages) {
            const msgContent = m.message?.conversation || m.message?.extendedTextMessage?.text;
            if (!msgContent || !msgContent.startsWith('!')) continue;
            const { commandName, args } = this.trimMessage(msgContent);

            const command = this.commandService.getCommand(commandName);

            if (command) {
                try {
                    await this.rateLimiter.consume(m.key.remoteJid, command.points)
                    await command.execute(sock, m, args);
                } catch (error) {
                    console.error(`Error executing command "${commandName}":`, error);
                    if (error instanceof RateLimiterRes) {
                        const seconds = Math.ceil(error.msBeforeNext / 1000);
                        await sock.sendMessage(m.key.remoteJid, {
                            text: `⏳ [Bot Assistant]: Batas penggunaan perintah telah tercapai. Silakan tunggu sekitar ${seconds} detik sebelum mencoba lagi.`
                        }, { quoted: m });
                    }
                }
            } else {
                await sock.sendMessage(m.key.remoteJid, {
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