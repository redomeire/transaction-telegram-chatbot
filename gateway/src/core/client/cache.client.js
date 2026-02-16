import Redis from 'ioredis';

class CacheClient {
    constructor() {
        this.client = new Redis(process.env.REDIS_URL, {
            maxRetriesPerRequest: null,
            enableReadyCheck: true,
        });
        this.client.on('error', (err) => console.log(err));
        this.client.on('connect', () => {
            console.log('🟢 Redis client connected')
        })
    }

    async connect() {
        if (this.client.status === 'ready') return;
        return new Promise((resolve, reject) => {
            this.client.once('ready', resolve);
            this.client.once('error', reject);
        })
    }
}

export const cacheClient = new CacheClient();
await cacheClient.connect();