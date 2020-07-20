<p align="center">
  <a href="https://logaretm.github.io/vee-validate/" target="_blank">
    <img width="200" src="https://github.com/logaretm/vee-validate/blob/master/logo.png">
  </a>
</p>

<p align="center">

[![Financial Contributors on Open Collective](https://opencollective.com/vee-validate/all/badge.svg?label=financial+contributors)](https://opencollective.com/vee-validate)
[![codecov](https://codecov.io/gh/logaretm/vee-validate/branch/master/graph/badge.svg)](https://codecov.io/gh/logaretm/vee-validate)
[![Build Status](https://travis-ci.org/logaretm/vee-validate.svg?branch=master)](https://travis-ci.org/logaretm/vee-validate)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/087bd788687c4ccab6650756ce56fa05)](https://www.codacy.com/app/logaretm/vee-validate?utm_source=github.com&utm_medium=referral&utm_content=logaretm/vee-validate&utm_campaign=Badge_Grade)
[![CDNJS](https://img.shields.io/cdnjs/v/vee-validate.svg)](https://cdnjs.com/libraries/vee-validate/)
[![npm](https://img.shields.io/npm/dm/vee-validate.svg)](https://npm-stat.com/charts.html?package=vee-validate)
[![npm](https://img.shields.io/npm/v/vee-validate.svg)](https://www.npmjs.com/package/vee-validate)
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/logaretm/vee-validate.svg)](http://isitmaintained.com/project/logaretm/vee-validate 'Average time to resolve an issue')
[![Percentage of issues still open](http://isitmaintained.com/badge/open/logaretm/vee-validate.svg)](http://isitmaintained.com/project/logaretm/vee-validate 'Percentage of issues still open')

</p>
<br>

vee-validate is a template-based validation framework for [Vue.js](https://vuejs.org/) that allows you to validate inputs and display errors.

Being template-based you only need to specify for each input what kind of validators should be used when the value changes. The errors will be automatically generated with 40+ locales supported. [Many rules are available out of the box](https://logaretm.github.io/vee-validate/guide/rules.html).

This plugin is inspired by [PHP Framework Laravel's validation](https://laravel.com/).

## Features

- **🍞Simple:** Template based validation that is familiar and easy to setup
- **🧘‍♀️ Flexible:** Synchronous, Asynchronous, field-level or form-level validation
- **⚡️ Fast:** Build faster forms faster with intuitive API and small footprint
- **🦐 Minimal:** < 4kb minified and gzipped size
- 💪 Written in TypeScript
- 🌍 i18n Support and error Messages in 40+ locales

## Getting Started

### Installation

```sh
# install with yarn
yarn add vee-validate@next

# install with npm
npm install vee-validate@next --save
```

### Usage

Register the `Field` and `Form` components and create a simple `required` validator:

```js
import { Field, Form } from 'vee-validate';

export default {
  components: {
    Field,
    Form,
  },
  setup() {
    // Validator function
    const isRequired = value => (value ? true : 'This field is required');

    return {
      isRequired,
    };
  },
};
```

Then use the `Form` and `Field` components to render your form:

```vue
<Form v-slot="{ errors }">
  <Field name="field" as="input" :rules="isRequired" />

  <span>{{ errors.field }}</span>
</Form>
```

## 📚 Documentation

Read the [documentation and demos](https://vee-validate.logaretm.com/v4).

## Compatibility

This library uses ES6 Promises so be sure to provide a polyfill for it for the browsers that do not support it.

## Contributing

You are welcome to contribute to this project, but before you do, please make sure you read the [contribution guide](CONTRIBUTING.md).

## Credits

- Inspired by Laravel's [validation syntax](https://laravel.com/docs/5.4/validation).
- v4 API Inspired by [Formik's](https://github.com/formium/formik)
- Logo by [Baianat](https://github.com/baianat).

## Emeriti

Here we honor past contributors and sponsors who have been a major part on this project.

- [Baianat](https://github.com/baianat).

## ⚖️ License

MIT
