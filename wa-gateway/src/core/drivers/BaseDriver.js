export default class BaseDriver {
    constructor(config) {
        this.config = config;
        this.client = null;
    }
    async connect() {
        throw new Error('Method "connect" must be implemented');
    }
    async sendMessage(to, text, options) {
        throw new Error('Method "sendMessage" must be implemented');
    }
    async disconnect() {
        throw new Error('Method "disconnect" must be implemented');
    }
}