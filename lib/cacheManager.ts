interface CacheItem<T> {
    data: T;
    timestamp: number;
    expiry: number;
    key: string;
}

interface CacheConfig {
    defaultTTL: number; // Time to live in milliseconds
    maxSize: number;
    storageKey: string;
}

export class CacheManager {
    private config: CacheConfig;
    private cache: Map<string, CacheItem<any>>;

    constructor(config: Partial<CacheConfig> = {}) {
        this.config = {
            defaultTTL: 5 * 60 * 1000, // 5 minutes
            maxSize: 100,
            storageKey: 'app_cache',
            ...config,
        };
        this.cache = new Map();
        this.loadFromStorage();
    }

    set<T>(key: string, data: T, ttl?: number): void {
        const expiry = Date.now() + (ttl || this.config.defaultTTL);
        const item: CacheItem<T> = {
            data,
            timestamp: Date.now(),
            expiry,
            key,
        };

        // Remove oldest items if cache is full
        if (this.cache.size >= this.config.maxSize) {
            const oldestKey = Array.from(this.cache.keys())[0];
            this.cache.delete(oldestKey);
        }

        this.cache.set(key, item);
        this.saveToStorage();
    }

    get<T>(key: string): T | null {
        const item = this.cache.get(key);

        if (!item) {
            return null;
        }

        // Check if expired
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            this.saveToStorage();
            return null;
        }

        return item.data as T;
    }

    has(key: string): boolean {
        const item = this.cache.get(key);
        if (!item) return false;

        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            this.saveToStorage();
            return false;
        }

        return true;
    }

    delete(key: string): boolean {
        const result = this.cache.delete(key);
        this.saveToStorage();
        return result;
    }

    clear(): void {
        this.cache.clear();
        this.saveToStorage();
    }

    // Get cache statistics
    getStats() {
        const now = Date.now();
        const items = Array.from(this.cache.values());

        return {
            totalItems: items.length,
            validItems: items.filter((item) => now <= item.expiry).length,
            expiredItems: items.filter((item) => now > item.expiry).length,
            oldestItem: items.length > 0 ? Math.min(...items.map((item) => item.timestamp)) : null,
            newestItem: items.length > 0 ? Math.max(...items.map((item) => item.timestamp)) : null,
            cacheSize: this.cache.size,
            maxSize: this.config.maxSize,
        };
    }

    // Clean expired items
    cleanup(): number {
        const now = Date.now();
        let removedCount = 0;

        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiry) {
                this.cache.delete(key);
                removedCount++;
            }
        }

        if (removedCount > 0) {
            this.saveToStorage();
        }

        return removedCount;
    }

    private loadFromStorage(): void {
        if (typeof window === 'undefined') return;

        try {
            const stored = localStorage.getItem(this.config.storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                this.cache = new Map(data);
                this.cleanup(); // Remove expired items on load
            }
        } catch (error) {
            console.error('Error loading cache from storage:', error);
        }
    }

    private saveToStorage(): void {
        if (typeof window === 'undefined') return;

        try {
            const data = Array.from(this.cache.entries());
            localStorage.setItem(this.config.storageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving cache to storage:', error);
        }
    }

    // Generate cache key for search queries
    static generateSearchKey(query: string, filters: any): string {
        const filterString = JSON.stringify(filters, Object.keys(filters).sort());
        return `search_${btoa(query + filterString)}`;
    }

    // Generate cache key for API responses
    static generateAPIKey(provider: string, model: string, prompt: string): string {
        return `api_${provider}_${model}_${btoa(prompt)}`;
    }
}

// Global cache instance
export const cacheManager = new CacheManager({
    defaultTTL: 10 * 60 * 1000, // 10 minutes for search results
    maxSize: 50,
    storageKey: 'ai_search_cache',
});

// API cache for longer-term storage
export const apiCache = new CacheManager({
    defaultTTL: 30 * 60 * 1000, // 30 minutes for API responses
    maxSize: 20,
    storageKey: 'ai_api_cache',
});
