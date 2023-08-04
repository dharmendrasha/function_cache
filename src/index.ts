import NodeCache from "node-cache";
export const nodeCache = new NodeCache();

export const getCacheKey = (
  target: any,
  propertyKey: string,
  args: any[]
): string => {
  const functionArgsBase64 = Buffer.from(
    JSON.stringify(args),
    "utf-8"
  ).toString("base64");
  return `${target.constructor.name}.${propertyKey}:${functionArgsBase64}`;
};

export const isAsync = (func: Function) => {
  const string = func.toString().trim();
  return !!(
    string.match(/^async /) ||
    // babel (this may change, but hey...)
    string.match(/return _ref[^\.]*\.apply/)
  );
};

export const cache = (ttl: number = 10) => {
  return (
    target: any,
    propertyName: string,
    propertyDescriptor: PropertyDescriptor
  ) => {
    const originalMethod = propertyDescriptor.value; // Save the original method

    propertyDescriptor.value = function (...args: any[]) {
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
        const result = isAsync(originalMethod)
          ? Promise.resolve(originalMethod.apply(this, args))
          : originalMethod.apply(this, args);
        nodeCache.set(cacheKey, result, ttl);
        return result;
      } catch (error) {
        nodeCache.set(cacheKey, error, ttl);
        throw error;
      }
    };

    return propertyDescriptor;
  };
};

export default cache;
