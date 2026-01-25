import { cacheClient } from "../client/cache-client.js";

export class CacheService {
    constructor() {
        this.cacheClient = cacheClient;
    }

    async handleArrayOfObjects(key, cb, limit) {
        return await this.cacheClient.handleArrayOfObjects(key, cb, limit);
    }
}