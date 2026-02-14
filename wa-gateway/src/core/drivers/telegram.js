import BaseDriver from './BaseDriver.js';
import TelegramBot from 'node-telegram-bot-api';

export class TelegramDriver extends BaseDriver {
    constructor(config) {
        super(config);
        this.client = null;
    }

    async connect({ onMessageUpsert, onConnectionUpdate }) {
        this.client = new TelegramBot(this.config.token, { polling: true })
        this.client.on('message', (message => {
            onMessageUpsert(message, this.client, this);
        }));
        this.client.on('polling_error', (error) => {
            onConnectionUpdate({ connection: 'close', lastDisconnect: { error } }, this.client, this);
        });
        onConnectionUpdate({ connection: 'open' }, this.client, this);
    }

    async sendMessage(to, text, options) {
        if (!this.client) throw new Error('Bot not connected');
        await this.client.sendMessage(to, text, options);
    }

    async disconnect() {
        if (this.client) {
            await this.client.stopPolling();
            this.client = null;
        }
    }
}