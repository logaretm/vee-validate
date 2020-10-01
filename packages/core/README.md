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
[![Bundle Size](https://badgen.net/bundlephobia/minzip/vee-validate@next)](https://bundlephobia.com/result?p=vee-validate@next)
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/logaretm/vee-validate.svg)](http://isitmaintained.com/project/logaretm/vee-validate 'Average time to resolve an issue')
[![Percentage of issues still open](http://isitmaintained.com/badge/open/logaretm/vee-validate.svg)](http://isitmaintained.com/project/logaretm/vee-validate 'Percentage of issues still open')

</p>
<br>

vee-validate is a form validation library for [Vue.js](https://vuejs.org/) that allows you to validate inputs and build better form UIs in a familiar declarative style or using composition functions

## Features

- **🍞 Easy:** Declarative validation that is familiar and easy to setup
- **🧘‍♀️ Flexible:** Synchronous, Asynchronous, field-level or form-level validation
- **⚡️ Fast:** Build faster forms faster with intuitive API and small footprint
- **🏏 Minimal:** Only handles the complicated and painful form concerns, gives you full control over everything else
- **🍤 Tiny:** Small footprint < 5kb which makes your apps faster to load
- **😎 UI Agnostic:** Works with native HTML elements or your favorite UI library components
- **🦾 Progressive:** Works with any setup whether you use Vue.js as a progressive enhancement or in a complex setup
- **✅ Built-in Rules:** Companion lib with 25+ Rules that covers most needs in most web applications
- **🌐 i18n:** 45+ locales for built-in rules contributed by developers from all over the world

## Getting Started

### Installation

```sh
# install with yarn
yarn add vee-validate@next

# install with npm
npm install vee-validate@next --save
```

### Vue version support

| vue Version | vee-validate version |
| ----------- | -------------------- |
| `2.x`       | `2.x` or `3.x`       |
| `3.x`       | `4.x`                |

### Usage

#### Declarative Components (Recommended)

Higher-order components are better suited for most of your cases. Register the `Field` and `Form` components and create a simple `required` validator:

```js
import { Field, Form } from 'vee-validate';

export default {
  components: {
    Field,
    Form,
  },
  methods: {
    isRequired(value) {
    return value ? true : 'This field is required';
  },
};
```

Then use the `Form` and `Field` components to render your form:

```vue
<Form v-slot="{ errors }">
  <Field name="field" :rules="isRequired" />

  <span>{{ errors.field }}</span>
</Form>
```

The `Field` component renders an `input` of type `text` by default but you can [control that](https://vee-validate.logaretm.com/v4/api/field#rendering-fields)

#### Composition API Functions

If you want more fine grained control, you can use `useField` function to compose validation logic into your component:

```js
import { useField } from 'vee-validate';

export default {
  setup() {
    // Validator function
    const isRequired = value => (value ? true : 'This field is required');
    const { value, errorMessage } = useField('field', isRequired);

    return {
      value,
      errorMessage,
    };
  },
};
```

Then in your template use `v-model` to bind the `value` to your input and display the errors using `errorMessage`:

```vue
<input name="field" v-model="value" />
<span>{{ errorMessage }}</span>
```

## 📚 Documentation

Read the [documentation and demos](https://vee-validate.logaretm.com/v4).

## Compatibility

This library uses ES6 Promises so be sure to provide a polyfill for it for the browsers that do not support it.

## Contributing

You are welcome to contribute to this project, but before you do, please make sure you read the [contribution guide](CONTRIBUTING.md)

## Credits

- Inspired by Laravel's [validation syntax](https://laravel.com/docs/5.4/validation)
- v4 API Inspired by [Formik's](https://github.com/formium/formik)
- Logo by [Baianat](https://github.com/baianat)

## Emeriti

Here we honor past contributors and sponsors who have been a major part on this project.

- [Baianat](https://github.com/baianat).

## ⚖️ License

MIT
