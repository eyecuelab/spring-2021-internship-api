import find from 'find';
import Jasmine from 'jasmine';
import dotenv from 'dotenv';
import logger from '../src/shared/Logger';
import commandLineArgs from 'command-line-args';

// Set the env file
const result2 = dotenv.config({
  path: `./env/test.env`,
});
if (result2.error) {
  throw result2.error;
}

// Setup command line options
const options = commandLineArgs([
  {
    name: 'testFile',
    alias: 'f',
    type: String,
  },
]);

// Init Jasmine
const jasmine = new Jasmine(null);

// Set location of test files
jasmine.loadConfig({
  random: false,
  spec_dir: 'spec',
  spec_files: ['./**/*.spec.ts'],
  stopSpecOnExpectationFailure: false,
  reporter: 'jasmine-ts-console-reporter',
});

// Run all or a single unit-test
if (options.testFile) {
  const testFile = options.testFile;
  find.file(testFile + '.spec.ts', './spec', (files: string | any[]) => {
    if (files.length === 1) {
      jasmine.specFiles = [files[0]];
      jasmine.execute();
    } else {
      logger.error('Test file not found!');
    }
  });
} else {
  jasmine.execute();
}
