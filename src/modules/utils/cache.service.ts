import NodeCache = require("node-cache");

export class CacheService {
    private nodeCache: NodeCache;
    private defaultTTL: number;

    constructor() {
        this.defaultTTL = (process.env.CACHE_TTL || 600) as number;
        // stdTTL is the default time-to-live for each cache entry in seconds
        this.nodeCache = new NodeCache({ stdTTL: this.defaultTTL });
    }

    getFromCache<T>(keys: string[]): T | undefined {
        return this.nodeCache.get<T>(keys.join('|'));
    }

    setToCache(keys: string[], value: any, ttl: number = this.defaultTTL): boolean {
        return this.nodeCache.set(keys.join('|'), value);
    }

    deleteFromCache(keys: string[]): number {
        return this.nodeCache.del(keys.join('|'));
    }

    flushAll() {
        this.nodeCache.flushAll();
    }
}