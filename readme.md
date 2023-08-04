# @dharmendrasha/function_cache

The `cache` function is a TypeScript method decorator designed to cache the result of a method call using the `node-cache` library. The decorator is applied to class methods, and it caches the results of the method calls in memory, reducing the need to recompute the results for repeated method calls with the same arguments.

The `cache` decorator accepts an optional `ttl` (time-to-live) parameter, which determines how long the cached results should be retained in memory before expiring. If no `ttl` is provided, the default value of 10 seconds is used.

The decorator works in the following way:

1. When a method decorated with `@cache` is called, the decorator first generates a cache key based on the class name, method name, and method arguments. It then checks if the cache contains a result associated with that key.
2. If the cache contains a result for the given key, the decorator returns the cached result immediately, and the original method is not called.
3. If the cache does not contain a result for the given key, the original method is called with the provided arguments, and its result is stored in the cache with the corresponding cache key.
4. The cached result is associated with the specific combination of method arguments, so different arguments will produce different cache entries, ensuring correct caching behavior.

The decorator handles various scenarios, such as caching methods that throw errors and excluding methods that return `undefined` or `null` from being cached. Additionally, it takes argument types into account, so different types of arguments will not produce cache hits.

This decorator simplifies the caching process for methods, reducing computational overhead and improving the performance of the decorated methods, especially for methods with expensive computations or data retrieval operations.

1. [GITHUB link](https://github.com/dharmendrasha/function_cache)

2. [NPM link](https://www.npmjs.com/package/@dharmendrasha/function_cache)

## Installation

Install this package with multiple package manager like pnpm | yarn | yarn take a look these commands

```bash
# npm
npm i @dharmendrasha/function_cache

# yarn
yarn install @dharmendrasha/function_cache

# pnpm
pnpm add @dharmendrasha/function_cache

```

# Usage

## Typescript

eg.

```typescript
//OutGoingRequestHandler.ts
import "reflect-metadata";
import cache from '@dharmendrasha/function_cache';


class Person {
  @cache(10) // TTL parameter passed directly to @cache
  fullName(firstName: string, LastName: string) {
    
    return {[firstName]: LastName};
  }
}

const person = new Person();

// first call to the method - result stored in cache
const result = person.fullName('John', 'Doe');
console.log(result) // {"John": "Doe"}

// call with different parameters, original method is called
const result2 = person.fullName('Filipe', 'Silve');
console.log(result2) // {"Filipe": "Silve"}


// result3 is returned from cache
const result3 = person.fullName('John', 'Doe');
console.log(result3)// {"John": "Doe"}

```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
