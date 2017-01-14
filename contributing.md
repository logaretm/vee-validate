# Contributing to Vee-Validate

First of all, thanks for taking interest into contributing to this repository, below is what you need to know about the project.

### Getting Started

Clone the repo

`git clone https://github.com/logaretm/vee-validate.git`

Install npm dev dependencies

`npm install` or for better results use `yarn`

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

### Pull Requests

- The `master` branch serves Vue 2.0 version of the plugin, for Vue 1.0 version check the `vue1` branch.
- Respect the ESlint rules, but we are open to any suggestions or alterations.
- You don't have to build the library with each pull request, but you will if you plan to test it manually. No need to submit it in the PR to avoid as much conflicts as possible.
- The clearer the PR title is, the faster it will get merged.
- Make sure that your PR is up to date with the branch you are targeting, use git rebase for this.
- Unfinished/In-Progress PRs should have `[WIP]` prefix to them.
- Make sure to mention which issues are being fixed by the PR so they can be closed properly.

### Source Code

Currently we are using ES2015 (ES6) for the source code, using buble and rollup to convert and bundle it to ES5, the available builds are: non-minified and minified.

Also we are using ESlint for code style, it based of airbnb config but with few modifications, please respect them as much as you can.

### Testing

Each test file represents a unit test to the corresponding file in the src folder.

To run the tests:

`npm test`

Currently I'm not testing the directive and the mixin, I will work on adding those tests later if I can, help will be appreciated if we can test the other stuff.

### Building

Use `npm run build` to build the project both minified and unminified versions.
