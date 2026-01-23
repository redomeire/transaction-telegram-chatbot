import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import pino from 'pino';
import onConnectionUpdate from "../events/onConnectionUpdate.js";
import onMessageUpsert from "../events/onMessageUpsert.js";

export class Connection {
    constructor() {
        this.sock = null;
    }

    async connect() {
        const { state, saveCreds } = await useMultiFileAuthState('auth_info');
        this.sock = makeWASocket({
            logger: pino({ level: 'info' }),
            auth: state,
            browser: ['my-whatsapp-bot', 'Chrome', '1.0.0'],
            connectTimeoutMs: 60000,
            defaultQueryTimeoutMs: 0,
            keepAliveIntervalMs: 10000
        });

        this.sock.ev.on('connection.update', onConnectionUpdate);
        this.sock.ev.on('messages.upsert', (event) => onMessageUpsert(this.sock, event));
        this.sock.ev.on('creds.update', saveCreds);
    }

    async disconnect() {
        if (this.sock) {
            await this.sock.logout('User initiated logout');
            this.sock = null;
        }
    }
}

export const connectionInstance = new Connection();