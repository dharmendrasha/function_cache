import { cache, nodeCache } from "./index";

describe("@dharmendrasha/function_cache sync", () => {
  class TestClass {
    @cache(10) // TTL parameter passed directly to @cache
    testMethod(param1: string, param2: string) {
      return `Result for ${param1}-${param2}`;
    }
  }
  beforeEach(() => {
    nodeCache.flushAll(); // Clear the cache before each test
  });

  it("should cache the result for the same parameters", () => {
    const test = new TestClass();

    // First call - result stored in cache
    const result1 = test.testMethod("John", "Doe");
    // Second call with the same parameters - result taken from cache
    const result2 = test.testMethod("John", "Doe");
    expect(result1).toBe("Result for John-Doe");
    expect(result1).toBe(result2);
  });

  it("should cache the result with TTL", async () => {
    const test = new TestClass();

    // Call with TTL of 1 second
    const result1 = test.testMethod("John", "Doe");

    // Wait for more than 1 second
    await new Promise((resolve) => setTimeout(resolve, 1100));

    // Call again with the same parameters - original method is called
    const result2 = test.testMethod("John", "Doe");

    // Check that the result is different due to TTL expiration
    expect(result1).toBe("Result for John-Doe");
    expect(result2).toBe("Result for John-Doe");
  });

  it("should not cache methods returning undefined or null", () => {
    const test = new TestClass();

    // Call the method that returns undefined
    const result1 = test.testMethod("John", "Doe");
    const result2 = test.testMethod("Jane", "Doe");

    // Check that the results are not cached
    expect(result1).toBe("Result for John-Doe");
    expect(result2).toBe("Result for Jane-Doe");
  });

  it("should cache thrown errors", () => {
    class TestClassWithErrors {
      @cache(10)
      testMethod(param: number) {
        if (param === 1) {
          throw new Error("Error with param 1");
        } else {
          return `Result for ${param}`;
        }
      }
    }

    const test = new TestClassWithErrors();

    // Call with param 2 - result is cached
    const result1 = test.testMethod(2);

    // Call with param 1 - error is cached
    expect(() => test.testMethod(1)).toThrow("Error with param 1");

    // Call with param 2 again - result is taken from cache
    const result2 = test.testMethod(2);

    // Check that both results are correct
    expect(result1).toBe("Result for 2");
    expect(result2).toBe("Result for 2");
  });
});

describe("@dharmendrasha/function_cache Async", () => {
  class TestClass {
    @cache(10) // TTL parameter passed directly to @cache
    async testMethodAsync(param1: string, param2: string) {
      return Promise.resolve(`Result for ${param1}-${param2}`);
    }
  }
  beforeEach(() => {
    nodeCache.flushAll(); // Clear the cache before each test
  });

  it("should cache the result for the same parameters", async () => {
    const test = new TestClass();

    // First call - result stored in cache
    const result1 = await test.testMethodAsync("John", "Doe");

    // Second call with the same parameters - result taken from cache
    const result2 = await test.testMethodAsync("John", "Doe");

    // Check that both results are the same
    expect(result1).toBe("Result for John-Doe");
    expect(result1).toBe(result2);
  });

  it("should not cache the result for different parameters", async () => {
    const test = new TestClass();

    // Call with different parameters - original method is called
    const result1 = await test.testMethodAsync("John", "Doe");
    const result2 = await test.testMethodAsync("Jane", "Doe");

    // Check that the results are different
    expect(result1).toBe("Result for John-Doe");
    expect(result2).toBe("Result for Jane-Doe");
  });

  it("should cache the result with TTL for async methods", async () => {
    const test = new TestClass();

    // Call with TTL of 1 second
    const result1 = await test.testMethodAsync("John", "Doe");

    // Wait for more than 1 second
    await new Promise((resolve) => setTimeout(resolve, 1100));

    // Call again with the same parameters - original method is called
    const result2 = await test.testMethodAsync("John", "Doe");

    // Check that the result is different due to TTL expiration
    expect(result1).toBe("Result for John-Doe");
    expect(result2).toBe("Result for John-Doe");
  });

  it("should not cache methods returning undefined or null for async methods", async () => {
    const test = new TestClass();

    // Call the method that returns undefined
    const result1 = await test.testMethodAsync("John", "Doe");
    const result2 = await test.testMethodAsync("Jane", "Doe");

    // Check that the results are not cached
    expect(result1).toBe("Result for John-Doe");
    expect(result2).toBe("Result for Jane-Doe");
  });
});

describe("@dharmendrasha/function_cache Error", () => {
  class TestClass {
    @cache(10) // TTL parameter passed directly to @cache
    testMethodWithError(param: number) {
      if (param === 1) {
        throw new Error("Error for param 1");
      }
      return `Result for param ${param}`;
    }
  }

  beforeEach(() => {
    nodeCache.flushAll(); // Clear the cache before each test
  });

  it("should cache the error for the same parameter", () => {
    const test = new TestClass();

    // Call the method with parameter 1 (throws an error)
    let error1: Error | undefined;
    try {
      test.testMethodWithError(1);
    } catch (err) {
      error1 = err as Error;
    }

    // Call the method again with the same parameter (error should be retrieved from cache)
    let error2: Error | undefined;
    try {
      test.testMethodWithError(1);
    } catch (err) {
      error2 = err as Error;
    }

    // Check that both errors are the same
    expect(error1).toBeDefined();
    expect(error2).toBeDefined();
    expect(error1).toStrictEqual(error2);
  });

  it("should not cache the error for different parameters", () => {
    const test = new TestClass();

    // Call the method with parameter 1 (throws an error)
    let error1: Error | undefined;
    try {
      test.testMethodWithError(1);
    } catch (err) {
      error1 = err as Error;
    }

    // Call the method with a different parameter (error should not be cached)
    let error2: Error | undefined;
    try {
      test.testMethodWithError(1);
    } catch (err) {
      error2 = err as Error;
    }

    // Check that the errors are different
    expect(error1).toBeDefined();
    expect(error2).toBeDefined();
    expect(error1).not.toBe(error2);
  });
});
