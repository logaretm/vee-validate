# Contributing to Vee-Validate

First of all, thanks for taking interest into contributing to this repository, below is what you need to know about the project.

### Getting Started

Clone the repo

`git clone https://github.com/baianat/vee-validate.git`

Install dependencies

```
npm install
```

or

```
yarn
```

Check the `scripts` section of `package.json` for any npm scripts that might find useful.

### Folder Structure

As you can see we have:
- `src` contains the working code for the repository:
    - `plugins`: contains any sort of add-on behavior and rules, that may or not may be available at all times.
    - `rules`: contains validation rules that are available to the validator instances.
    - `utils`: contains small utility functions.
- `dist` contains the unminified and the minified build of the repository.
- `docs` contains the src and built files for the documentation.
- `locale` contains the localized messages files.
- `tests` contains the test files for the project, it uses [jest](https://github.com/facebook/jest) for testing. it contains a similar folder structure as the `src` folder.

If you want to contribute to the docs you can find it in the `docs` folder.

### Pull Requests

- Respect the ESlint rules, but we are open to any suggestions or alterations.
- You don't have to build the library with each pull request, but you will if you plan to test it manually. No need to submit it in the PR to avoid unnecessary conflicts.
- PRs should have titles that are clear as possible.
- Make sure that your PR is up to date with the branch you are targeting, use git rebase for this.
- Unfinished/In-Progress PRs should have `[WIP]` prefix to them, and preferably a checklist for ongoing todos.
- Make sure to mention which issues are being fixed by the PR so they can be closed properly.

### Source Code

Currently we are using ES2015 (ES6) for the source code, using buble and rollup to convert and bundle it to ES5, the available builds are: non-minified and minified and es6 build.

Also we are using ESlint for code style, with the standard config with few modifications, please respect them as much as you can.

### Testing

Each test file represents a unit test to the corresponding file in the src folder.

To run the tests:

`npm test`

### Building

Use `npm run build` to build the project both minified and unminified versions.


### Issues

When creating issues, please provide as much details as possible. A clear explaination on the issue and a reliable production example can help us greatly in improving this project.

If your issue gets closed for not providing enough info or not responding to the maintainers' comments, do not consider it a hostile action. There are probably other issues that the maintainers are working on and must give priority to issues that are well investigated, you can always revisit the issue and address the reasons that it was closed and we will be happy to re-open it and address it properly.

To make sure your issues are addressed as fast as possible, follow the issue template and fill as much details as you can:

- Provide the versions that you encounter the issue with for `vue` and `vee-validate` and any other third party package that are involved.

- A clear details of what is happening and your comments on them.

- An example that demonstrates the issue clearly, you should make sure that it has no other issues except the one you are reporting. 

