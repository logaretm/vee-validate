# @vee-validate/nuxt

<p align="center">
  <a href="https://vee-validate.logaretm.com/v4/guide/global-validators" target="_blank">
    <img width="150" src="https://github.com/logaretm/vee-validate/raw/main/logo.png">
  </a>

  <a href="https://nuxt.com/" target="_blank">
    <img width="150" src="https://nuxt.com/assets/design-kit/logo/icon-green.svg">
  </a>
</p>

> Official vee-validate Nuxt module

<p align="center">
  <a href="https://github.com/sponsors/logaretm">
    <img src='https://sponsors.logaretm.com/sponsors.svg'>
  </a>
</p>

Official vee-validate's Nuxt module

## Features

- Auto import of vee-validate components
- Auto import of vee-validate composables
- Detecting if you are using `zod` or `yup` and exposing the `toTypedSchema` suitable for either.

## Getting Started

In your nuxt project install the vee-validate nuxt module:

```sh
# npm
npm i @vee-validate/nuxt

# pnpm
pnpm add @vee-validate/nuxt

# yarn
yarn add @vee-validate/nuxt
```

Then add the module to your `modules` config in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  // ...
  modules: [
    //...
    '@vee-validate/nuxt',
  ],
});
```

## Types

No types are exposed by default to avoid having conflicts with other libraries, aside from vee-validate's main API components/composables. You can still import them via `vee-validate`.

## Configuration

You can configure a few aspects of the `@vee-validate/nuxt` module. Here is the config interface:

```ts
export default defineNuxtConfig({
  // ...
  modules: [
    //...
    [
      '@vee-validate/nuxt',
      {
        // disable or enable auto imports
        autoImports: true,
        // Use different names for components
        componentNames: {
          Form: 'VeeForm',
          Field: 'VeeField',
          FieldArray: 'VeeFieldArray',
          ErrorMessage: 'VeeErrorMessage',
        },
      },
    ],
  ],
});
```

You can also use the `veeValidate` config key instead of the array syntax:

```ts
export default defineNuxtConfig({
  // ...
  modules: [
    //...
    '@vee-validate/nuxt',
  ],
  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
    // Use different names for components
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  },
});
```
