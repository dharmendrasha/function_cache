import NodeCache from "node-cache";
const nodeCache = new NodeCache();

function getCacheKey(target: any, propertyKey: string, args: any[]): string {
  // Generate a cache key based on the class name, method name, and arguments
  const functionArgsBase64 = Buffer.from(
    JSON.stringify(args),
    "utf-8"
  ).toString("base64");
  return `${target.constructor.name}.${propertyKey}:${functionArgsBase64}`;
}

export function cache(ttl: number = 10) {
  return function (
    target: any,
    propertyName: string,
    propertyDescriptor: PropertyDescriptor
  ) {
    const originalMethod = propertyDescriptor.value; // Save the original method

    propertyDescriptor.value = async function (...args: any[]) {
      const cacheKey = getCacheKey(target, propertyName, args);
      const cachedResult = nodeCache.get(cacheKey);

      if (cachedResult !== undefined) {
        // Return cached result if available
        if (cachedResult instanceof Error) {
          throw cachedResult; // Throw the cached error
        }
        return cachedResult;
      }

      try {
        // Call the original method and store its result in cache
        const result = await originalMethod.apply(this, args);
        nodeCache.set(cacheKey, result, ttl);
        return result;
      } catch (error) {
        nodeCache.set(cacheKey, error, ttl);
        throw error;
      }
    };

    return propertyDescriptor;
  };
}

export default cache;
