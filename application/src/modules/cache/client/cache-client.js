import { createClient } from 'redis';

class CacheClient {
    constructor() {
        this.client = createClient({
            url: process.env.REDIS_URL
        });
        this.client.on('error', (err) => console.log(err));
        this.client.on('connect', () => {
            console.log('🟢 Redis client connected')
        })
    }

    async connect() {
        await this.client.connect();
    }

    async handleArrayOfObjects(key, cb, limit = 10) {
        try {
            const cachedData = await this.client.lRange(key, 0, limit - 1);
            if (!cachedData || cachedData.length === 0) {
                const freshData = await cb();
                const serializedData = freshData.map(item => JSON.stringify(item));
                try {
                    const multi = this.client.multi();
                    multi.del(key);
                    multi.rPush(key, serializedData);
                    multi.expire(key, 120);

                    await multi.exec();
                } catch (error) {
                    console.error('Error setting data in Redis:', error);
                }
                return [...freshData].slice(0, limit);
            }
            return cachedData.map(item => {
                const parsedItem = JSON.parse(item);
                return parsedItem;
            })
        } catch (error) {
            console.error('Error in handleArrayOfObjects:', error);
            throw error;
        }
    }
}

export const cacheClient = new CacheClient();
await cacheClient.connect();