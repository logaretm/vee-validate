# Contributing to Vee-Validate

First of all, thanks for taking interest into contributing to this repository, below is what you need to know about the project.

### Getting Started

Clone the repo

`git clone https://github.com/logaretm/vee-validate.git`

Install npm dev dependencies

`npm install` or `yarn`

Check the `scripts` section of `package.json` for any npm scripts that might find useful.

### Folder Structure

As you can see we have:
- `src` contains the working code for the repository:
    - `exceptions`: contains any validator-specific exceptions.
    - `messages`: contains default English messages.
    - `plugins`: contains any sort of add-on behavior and rules, that may or not may be available at all times.
    - `rules`: contains validation rules that are available to the validator instances.
    - `utils`: contains small utility functions.
- `dist` contains the unminified and the minified build of the repository.
- `__tests__` contains the test files for the project, it uses [jest](https://facebook.github.io/jest/) for testing. it contains a similar folder structure as the `src` folder.

If you want to contribute to the docs you can find it [here](https://github.com/logaretm/vee-validate-docs).

### Source Code

Currently we are using ES2015 (ES6) for the source code, using Babel and Rollup to convert it to ES5, the available builds are: non-minified, minified and es6.

### Testing

Each test file represents a unit test to the corresponding file in the src folder.

To run the tests:

`npm test`

Currently I'm not testing the directive and the mixin, I will work on adding those tests later if I can, help will be appreciated.

### Building

Use `npm run build` to build the project both minified and unminified versions as well as the es6 version.
