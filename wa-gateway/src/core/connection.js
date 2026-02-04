import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import pino from 'pino';
import { EventEmitter } from 'events';

export class Connection extends EventEmitter {
    constructor() {
        super();
        this.sock = null;
    }

    async connect({ onConnectionUpdate, onMessageUpsert }) {
        const { state, saveCreds } = await useMultiFileAuthState('auth_info');
        this.sock = makeWASocket({
            logger: pino({ level: 'silent' }),
            auth: state,
            browser: ['Ubuntu', 'Chrome', '20.0.04'],
            connectTimeoutMs: 60000,
            defaultQueryTimeoutMs: 0,
            keepAliveIntervalMs: 10000
        });

        this.sock.ev.on('connection.update', (update) => onConnectionUpdate(
            update, this.sock, this
        ));
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