export interface StorageAdapter {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  getOrDefault<T>(key: string, defaultValue: T): Promise<T>;
  keys(): Promise<string[]>;
}

/**
 * Create a namespaced storage wrapper around figma.clientStorage.
 * Keys are prefixed with "marcel:{namespace}:" to avoid collisions.
 * All operations are wrapped in try/catch — storage can fail (quota exceeded).
 * Quota: 5MB per plugin total.
 *
 * Usage:
 *   const linterStorage = createStorage("linter");
 *   await linterStorage.set("config", { ... });
 *   const config = await linterStorage.get<LinterConfig>("config");
 */
export function createStorage(namespace: string): StorageAdapter {
  const prefix = `marcel:${namespace}:`;

  return {
    async get<T>(key: string): Promise<T | undefined> {
      try {
        const value = await figma.clientStorage.getAsync(prefix + key);
        return value as T | undefined;
      } catch (e) {
        console.error(`[Marcel] Storage get failed for ${prefix + key}:`, e);
        return undefined;
      }
    },

    async set<T>(key: string, value: T): Promise<void> {
      try {
        await figma.clientStorage.setAsync(prefix + key, value);
      } catch (e) {
        console.error(`[Marcel] Storage set failed for ${prefix + key}:`, e);
      }
    },

    async delete(key: string): Promise<void> {
      try {
        await figma.clientStorage.deleteAsync(prefix + key);
      } catch (e) {
        console.error(`[Marcel] Storage delete failed for ${prefix + key}:`, e);
      }
    },

    async getOrDefault<T>(key: string, defaultValue: T): Promise<T> {
      const value = await this.get<T>(key);
      return value !== undefined ? value : defaultValue;
    },

    async keys(): Promise<string[]> {
      try {
        const allKeys = await figma.clientStorage.keysAsync();
        return allKeys.filter(k => k.startsWith(prefix)).map(k => k.slice(prefix.length));
      } catch (e) {
        console.error(`[Marcel] Storage keys failed for ${namespace}:`, e);
        return [];
      }
    },
  };
}
