import makeWASocket, {
    DisconnectReason,
    useMultiFileAuthState
} from "@whiskeysockets/baileys";
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import { commands, transactionsCommands } from "./commands.js";
import dotenv from 'dotenv';

dotenv.config();

async function connectToWhatsapp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({
        logger: pino({ level: 'info' }),
        auth: state,
        browser: ['my-whatsapp-bot', 'Chrome', '1.0.0'],
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000
    });
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            console.log('QR RECEIVED : ', qr);
            console.log('Scan QR Code ini untuk login:');
            qrcode.generate(qr, { small: true });
        }
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if (shouldReconnect) {
                connectToWhatsapp()
            }
        } else if (connection === 'open') {
            console.log('opened connection')
        }
    });
    sock.ev.on('messages.upsert', async (event) => {
        if (event.type !== 'notify') return;
        for (const m of event.messages) {
            const msgContent = m.message?.conversation || m.message?.extendedTextMessage?.text;

            if (!msgContent || !msgContent.startsWith('!')) continue;
            const args = msgContent.slice(1).trim().split(/ +/);

            const command = args.shift().toLowerCase();
            const restOfWords = args.join(' ');
            console.log('received command:', command);

            if (command in commands) {
                await sock.sendMessage(m.key.remoteJid, {
                    text: commands[command]
                }, { quoted: m });
                continue;
            } else if (command in transactionsCommands) {
                await transactionsCommands[command]({
                    text: restOfWords,
                    sock,
                    m
                });
            } else {
                await sock.sendMessage(m.key.remoteJid, {
                    text: `🤖 [Bot Assistant]: Maaf, perintah "${command}" tidak dikenali. Ketik !help untuk daftar perintah yang tersedia.`
                }, { quoted: m });
            }
        }
    })
    sock.ev.on('creds.update', saveCreds);
}

connectToWhatsapp();