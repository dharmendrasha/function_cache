import type { Config } from "jest";
import * as path from "path";

export const jestOutPutDir = () => {
  return path.resolve(__dirname, "test", "reports");
};

export default async (): Promise<Config> => {
  const coverageDir = path.resolve(__dirname, "test", "coverage");
  const rootDir = path.resolve(__dirname, "src");

  return {
    rootDir,
    coverageDirectory: coverageDir,
    verbose: true,
    moduleFileExtensions: ["js", "json", "ts"],
    testRegex: ".*\\.spec\\.ts$",
    transform: {
      "^.+\\.(t|j)s$": "ts-jest",
    },
    testResultsProcessor: "jest-junit",
    collectCoverageFrom: ["**/**.(t|j)s"],
    reporters: [
      "default",
      [
        "jest-junit",
        {
          suiteName: `jest tests`,
          outputDirectory: jestOutPutDir(),
          outputName: `junit.xml`,
          uniqueOutputName: "false",
          classNameTemplate: "{classname}-{title}",
          titleTemplate: "{classname}-{title}",
          ancestorSeparator: " › ",
          usePathForSuiteName: "true",
        },
      ],
    ],
    testEnvironment: "node",
  };
};
