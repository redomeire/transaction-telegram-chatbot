import pino from 'pino';
import { EventEmitter } from 'events';
import { WhatsappDriver } from "./drivers/whatsapp.js";
import { TelegramDriver } from "./drivers/telegram.js";

export class Connection extends EventEmitter {
    constructor() {
        super();
        this.driver = null;
        this.instance = null;
        this.type = null;
    }

    initDriver(type, config) {
        this.type = type;
        const drivers = {
            whatsapp: WhatsappDriver,
            telegram: TelegramDriver
        };

        if (!drivers[type]) throw new Error(`Driver ${type} not supported.`);
        this.driver = new drivers[type](config);
    }

    async connect(type, config, { onMessageUpsert, onConnectionUpdate }) {
        this.initDriver(type, config);

        this.instance = await this.driver.connect({
            onConnectionUpdate: (update, client) => {
                onConnectionUpdate(update, client, this);
            },
            onMessageUpsert: (event, client) => {
                onMessageUpsert(client, event);
            }
        })
    }

    async sendMessage(to, text, options) {
        if (!this.driver) throw new Error('No driver initialized');
        await this.driver.sendMessage(to, text, options);
    }

    async disconnect() {
        if (this.instance && this.instance.close) {
            await this.instance.close();
        }
        this.driver = null;
        this.instance = null;
    }
}

export const connectionInstance = new Connection();