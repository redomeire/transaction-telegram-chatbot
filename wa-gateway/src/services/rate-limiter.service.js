import { RateLimiterRedis, RateLimiterMemory } from 'rate-limiter-flexible';
import { cacheService } from './cache.service.js';

export class RateLimiterService {
    static factory(databaseName = 'memory',
        {
            points,
            duration,
            blockDuration
        }) {
        const standardOptions = {
            points: points || 5,
            duration: duration || 1 * 60,
            blockDuration: blockDuration || 1 * 60,
        }
        const rateLimiterInfo = {
            'redis': {
                class: RateLimiterRedis,
                options: {
                    storeClient: cacheService.getClient(),
                    ...standardOptions
                }
            },
            'memory': {
                class: RateLimiterMemory,
                options: standardOptions
            }
        };
        return new rateLimiterInfo[databaseName]
            .class(rateLimiterInfo[databaseName].options);
    }
}