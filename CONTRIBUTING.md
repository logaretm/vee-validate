# Contributing to Vee-Validate

First of all, thanks for taking interest into contributing to this repository, below is what you need to know about the project.

## Getting Started

Fork the repository, or clone it:

```sh
git clone https://github.com/logaretm/vee-validate.git
```

Install dependencies using [pnpm](https://pnpm.io/)

```sh
pnpm i
```

## Issues

When creating issues, please provide as much details as possible. A clear explanation on the issue and a reliable production example can help us greatly in improving this project. Your issue may get closed if it cannot be easily reproduced so please provide a working example using either [Codesandbox](https://codesandbox.io/) or [StackBlitz](https://stackblitz.com/). Your example should only focus on the issue, minimal and clearly produces the issue.

You can fork this [StackBlitz template](https://stackblitz.com/edit/vee-validate-issue-template?file=src%App.vue) to get a starting working environment ready for your demo with all vee-validate packages pre-installed and using the latest release.

If your issue gets closed for not providing enough info or not responding to the maintainers' comments, do not consider it a hostile action. There are probably other issues that the maintainers are working on and must give priority to issues that are well investigated, you can always revisit the issue and address the reasons that it was closed and we will be happy to re-open it and address it properly. Sometimes a commit will close your issue without a response from the maintainers so make sure you read the issue timeline to prevent any misunderstandings.

## Code Style

The code style is enforced with `eslint` and `prettier` and is checked automatically whenever you commit. Any violation of the code style may prevent merging your contribution so make sure you follow it. And yes we love our semi-colons.

## Commit Style

Commit messages are enforced with `commitlint` which is configured to help you write a suitable commit message, the checks are run automatically when you commit.

## Contributing To The Docs

If you want to contribute to the docs you can find it in the `docs` folder.

The docs are using [astro](https://astro.build/) and the [MDX plugin](https://docs.astro.build/en/guides/integrations-guide/mdx/) to write the doc pages.

To run the documentation locally:

```sh
pnpm docs:dev
```

## Pull Requests

**Before you open a PR, make sure to communicate via issues about your intent to avoid PRing something you think is an issue when it might be a design choice**. This is a checklist of the stuff you need to be aware of:

- Make sure you fill the PR template provided
- PRs should have titles that are clear as possible
- Make sure that your PR is up to date with the branch you are targeting, use `git rebase` for this
- Unfinished/In-Progress PRs should be marked as a `draft`
- Make sure to mention which issues are being fixed by the PR so they can be closed properly
- Make sure to preview all pending PRs to make sure your work won't conflict with other ongoing pull-request
- Coordinate with ongoing conflicting PRs' authors to make it easier to merge both your PRs
- Make sure to generate a changeset on the PR branch before merging it, this will help us generate a changelog for the next release

## Source Code

Currently we are using TypeScript for the codebase, feel free to use any of it's features with a minor exception to:

- `Enums` as we prefer to use string literals instead.
- `namespace` not needed in our codebase

## Testing

Each test file represents a unit test to the corresponding file in the src folder.

You need to build the files before you run the tests:

```sh
pnpm build
```

Then to run the tests:

```sh
pnpm test
```

To check the tests coverage:

```sh
pnpm cover
```

## Mono repo

this project uses mono-repo style using pnpm workspaces and [changesets](https://github.com/changesets/changesets).

## Building

Use this command to build all project bundles

```sh
pnpm build
```

If you are working on a specific package within the vee-validate mono repo and only want to build that, then use the following command to build specific packages, the package id is the folder name in the `packages` folder.

```sh
pnpm build vee-validate
pnpm build rules
pnpm build zod
# etc...
```

## Tips for Testing your changes

If you need to try out your changes, here is a few tips

- Build vee-validate dist files once you are done with your changes
- To use the built files you can either use `pnpm link {PKG_NAME}` and link the package dist files to your project, or use [yalc](https://github.com/whitecolor/yalc).
