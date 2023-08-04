# @dharmendrasha/function_cache

NodeJs Outgoing request logger

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
