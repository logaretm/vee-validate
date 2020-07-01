<p align="center">
  <a href="https://logaretm.github.io/vee-validate/" target="_blank">
    <img width="200" src="https://github.com/logaretm/vee-validate/blob/master/logo.svg">
  </a>
</p>

<p align="center">

[![codecov](https://codecov.io/gh/logaretm/vee-validate/branch/master/graph/badge.svg)](https://codecov.io/gh/logaretm/vee-validate)
[![Build Status](https://travis-ci.org/logaretm/vee-validate.svg?branch=master)](https://travis-ci.org/logaretm/vee-validate)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/087bd788687c4ccab6650756ce56fa05)](https://www.codacy.com/app/logaretm/vee-validate?utm_source=github.com&utm_medium=referral&utm_content=logaretm/vee-validate&utm_campaign=Badge_Grade)
[![CDNJS](https://img.shields.io/cdnjs/v/vee-validate.svg)](https://cdnjs.com/libraries/vee-validate/)
[![npm](https://img.shields.io/npm/dm/vee-validate.svg)](https://npm-stat.com/charts.html?package=vee-validate)
[![npm](https://img.shields.io/npm/v/vee-validate.svg)](https://www.npmjs.com/package/vee-validate)
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/logaretm/vee-validate.svg)](http://isitmaintained.com/project/logaretm/vee-validate 'Average time to resolve an issue')
[![Percentage of issues still open](http://isitmaintained.com/badge/open/logaretm/vee-validate.svg)](http://isitmaintained.com/project/logaretm/vee-validate 'Percentage of issues still open')
[![xscode](https://img.shields.io/badge/Available%20on-xs%3Acode-blue?style=?style=plastic&logo=appveyor&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRF////////VXz1bAAAAAJ0Uk5T/wDltzBKAAAAlUlEQVR42uzXSwqAMAwE0Mn9L+3Ggtgkk35QwcnSJo9S+yGwM9DCooCbgn4YrJ4CIPUcQF7/XSBbx2TEz4sAZ2q1RAECBAiYBlCtvwN+KiYAlG7UDGj59MViT9hOwEqAhYCtAsUZvL6I6W8c2wcbd+LIWSCHSTeSAAECngN4xxIDSK9f4B9t377Wd7H5Nt7/Xz8eAgwAvesLRjYYPuUAAAAASUVORK5CYII=)](https://xscode.com/logaretm/vee-validate)

</p>
<br>

vee-validate is a template-based validation framework for [Vue.js](https://vuejs.org/) that allows you to validate inputs and display errors.

Being template-based you only need to specify for each input what kind of validators should be used when the value changes. The errors will be automatically generated with 40+ locales supported. [Many rules are available out of the box](https://logaretm.github.io/vee-validate/guide/rules.html).

This plugin is inspired by [PHP Framework Laravel's validation](https://laravel.com/).

### Features

- Template based validation that is both familiar and easy to setup.
- 🌍 i18n Support and error Messages in 40+ locales.
- 💫 Async and Custom Rules Support.
- 💪 Written in TypeScript.
- No dependencies.

### Installation

#### yarn

```bash
yarn add vee-validate
```

#### npm

```bash
npm i vee-validate --save
```

#### CDN

vee-validate is also available on these CDNs:

- [jsdelivr](https://cdn.jsdelivr.net/npm/vee-validate@latest/dist/vee-validate.js) [![jsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/vee-validate/badge?style=rounded)](https://www.jsdelivr.com/package/npm/vee-validate)
- [unpkg](https://unpkg.com/vee-validate)

> When using a CDN via script tag, all the exported modules on VeeValidate are available on the VeeValidate Object. ex: VeeValidate.Validator

### Getting Started

Install the rules you will use in your app, we will install the `required` rule for now:

```js
import { extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';

// Add the required rule
extend('required', {
  ...required,
  message: 'This field is required'
});

// Add the email rule
extend('email', {
  ...email,
  message: 'This field must be a valid email'
});
```

Import the `ValidationProvider` component and register it:

#### Global Registration

```js
import { ValidationProvider } from 'vee-validate';

// Register it globally
// main.js or any entry file.
Vue.component('ValidationProvider', ValidationProvider);
```

#### Local Registration

```js
import { ValidationProvider } from 'vee-validate';

export default {
  components: {
    ValidationProvider
  }
};
```

All the JavaScript work is done. Next in the template add the inputs you want to validate them:

```vue
<ValidationProvider name="email" rules="required|email">
  <div slot-scope="{ errors }">
    <input v-model="email">
    <p>{{ errors[0] }}</p>
  </div>
</ValidationProvider>
```

The validation provider accepts two props: `rules` which is in its simplest form, a string containing the validation rules separated by a `|` character, and a `name` prop which is the field name that will be used in error messages.

and That's it, your input will be validated automatically, notice that the `ValidationProvider` uses [scoped slots](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots) to pass down validation state and results.

There is more that can be done! You can customize events, validate initial values, manually validate or reset the field and much more. Make sure to [read the docs](https://logaretm.github.io/vee-validate).

### Documentation

Read the [documentation and demos](https://logaretm.github.io/vee-validate/).

### Compatibility

This library uses ES6 Promises so be sure to provide a polyfill for it for the browsers that do not support it.

### Contributing

You are welcome to contribute to this project, but before you do, please make sure you read the [contribution guide](CONTRIBUTING.md).

### Tutorials and Examples

#### Docs Highlights

- [Backend and Server Side Validation](https://logaretm.github.io/vee-validate/advanced/server-side-validation.html)
- [Localization (i18n)](https://logaretm.github.io/vee-validate/guide/localization.html)
- [Handling Forms](https://logaretm.github.io/vee-validate/guide/forms.html)
- [UI Libraries Validation Samples](https://logaretm.github.io/vee-validate/guide/3rd-party-libraries.html)
  - [Vuetify](https://logaretm.github.io/vee-validate/guide/3rd-party-libraries.html#vuetify)
  - [Quasar](https://logaretm.github.io/vee-validate/guide/3rd-party-libraries.html#quasar)
  - [BootstrapVue](https://logaretm.github.io/vee-validate/guide/3rd-party-libraries.html#bootstrapvue)
  - [Buefy](https://logaretm.github.io/vee-validate/guide/3rd-party-libraries.html#buefy)
  - [Ant Design](https://logaretm.github.io/vee-validate/guide/3rd-party-libraries.html#ant-design)

### Credits

- Inspired by Laravel's [validation syntax](https://laravel.com/docs/5.4/validation).

### License

MIT
