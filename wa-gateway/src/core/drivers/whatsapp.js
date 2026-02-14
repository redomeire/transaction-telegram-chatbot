import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import BaseDriver from "./BaseDriver.js";

export class WhatsappDriver extends BaseDriver {
    constructor(config) {
        super(config);
        this.client = null;
    }

    async connect({ onMessageUpsert, onConnectionUpdate }) {
        const { state, saveCreds } = await useMultiFileAuthState('auth_info');
        this.client = makeWASocket({
            logger: pino({ level: 'silent' }),
            auth: state,
            browser: ['Ubuntu', 'Chrome', '20.0.04'],
            connectTimeoutMs: 60000,
            defaultQueryTimeoutMs: 0,
            keepAliveIntervalMs: 10000
        });

        this.client.ev.on('connection.update', (update) => onConnectionUpdate(
            update, this.client, this
        ));
        this.client.ev.on('messages.upsert', (event) => onMessageUpsert(this.client, event));
        this.client.ev.on('creds.update', saveCreds);
    }

    async sendMessage(to, text, options) {
        if (!this.client) throw new Error('Bot not connected');
        await this.client.sendMessage(to, { text }, options);
    }

    async disconnect() {
        if (this.client) {
            await this.client.logout();
            this.client = null;
        }
    }
}