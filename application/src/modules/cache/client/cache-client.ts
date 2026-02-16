import { createClient, RedisClientType } from "redis";

class CacheClient {
  client: RedisClientType;
  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
    });
    this.client.on("error", (err) => {
      console.log(err);
    });
    this.client.on("connect", () => {
      console.log("🟢 Redis client connected");
    });
  }

  async connect() {
    await this.client.connect();
  }

  async handleArrayOfObjects<T>(
    key: string,
    cb: () => Promise<T[]>,
    limit = 10,
  ): Promise<T[]> {
    try {
      const cachedData = await this.client.lRange(key, 0, limit - 1);
      if ((!cachedData || cachedData.length === 0) && cb) {
        const freshData = await cb();
        const serializedData = freshData.map((item) => JSON.stringify(item));
        try {
          const multi = this.client.multi();
          multi.del(key);
          multi.rPush(key, serializedData);
          multi.expire(key, 120);

          await multi.exec();
        } catch (error) {
          console.error("Error setting data in Redis:", error);
        }
        return [...freshData].slice(0, limit);
      }
      return cachedData.map((item) => {
        const parsedItem = JSON.parse(item);
        return parsedItem;
      });
    } catch (error) {
      console.error("Error in handleArrayOfObjects:", error);
      throw error;
    }
  }
}

export const cacheClient = new CacheClient();
await cacheClient.connect();
