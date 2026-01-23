export default class HelpCommand {
    constructor() {
        this.name = 'help';
        this.description = 'Displays help information about available commands.';
    }

    async execute(sock, m, ...args) {
        const message = `🤖 [Bot Assistant]: Berikut adalah daftar perintah yang dapat digunakan \n\n 1. *!help*: tampil daftar perintah \n 2. *!create*: membuat transaksi baru`
        await sock.sendMessage(m.key.remoteJid, { text: message }, { quoted: m });
    }
}