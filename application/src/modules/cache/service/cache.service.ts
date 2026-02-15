import { cacheClient } from "../client/cache-client.js";

export class CacheService {
  cacheClient: typeof cacheClient;
  constructor() {
    this.cacheClient = cacheClient;
  }

  async handleArrayOfObjects(
    key: string,
    cb: () => Promise<unknown[]>,
    limit = 10,
  ) {
    return await this.cacheClient.handleArrayOfObjects(key, cb, limit);
  }

  getClient() {
    return this.cacheClient.client;
  }
}
export const cacheService = new CacheService();
