import { cacheClient } from "../core/client/cache.client.js";

class CacheService {
    constructor() {
        this.cacheClient = cacheClient;
    }

    getClient() {
        return this.cacheClient.client;
    }
}
export const cacheService = new CacheService();