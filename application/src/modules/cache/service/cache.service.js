import { cacheClient } from "../client/cache-client.js";

class CacheService {
    constructor() {
        this.cacheClient = cacheClient;
    }

    async handleArrayOfObjects(key, cb, limit) {
        return await this.cacheClient.handleArrayOfObjects(key, cb, limit);
    }

    getClient() {
        return this.cacheClient.client;
    }
}
export const cacheService = new CacheService();