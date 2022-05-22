<p align="center">
  <a href="https://vee-validate.logaretm.com" target="_blank">
    <img src="https://raw.githubusercontent.com/logaretm/vee-validate/main/logo.png" width="200" title="Go to website">
  </a>
</p>

<p align="center">

[![npm downloads](https://img.shields.io/npm/dm/vee-validate.svg)](https://npm-stat.com/charts.html?package=vee-validate 'Go to NPM stats')
[![CDNJS](https://img.shields.io/cdnjs/v/vee-validate.svg)](https://cdnjs.com/libraries/vee-validate/ 'Download using CDNJS')
[![npm version](https://img.shields.io/npm/v/vee-validate.svg)](https://www.npmjs.com/package/vee-validate 'Go to package on NPM')

</p>

<br>

vee-validate is a form validation library for [Vue.js](https://vuejs.org/) that allows you to validate inputs and build better form UIs in a familiar declarative style or using composition functions.

## Sponsors

Thanks for the following companies and individuals who are supporting vee-validate

<br>

<p align="center">
  <a href="https://getform.io" target="_blank">
    <img src="https://raw.githubusercontent.com/logaretm/vee-validate/main/docs/assets/img/sponsors/getform.svg" width="230" title="Go to getform.io">
  </a>
</p>

<br>

You can also help this this project and my other projects by donating one time or by sponsoring via the following link

<br>

<p align="center">
  <a href="https://www.buymeacoffee.com/logaretm" target="_blank">
      <img src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png" alt="Buy Me A Coffee" width="180" title="Go to Buy Me A Coffee site">
  </a>
</p>

<br>

## Features

- **🍞 Easy:** Declarative validation that is familiar and easy to setup
- **🧘‍♀️ Flexible:** Synchronous, Asynchronous, field-level or form-level validation
- **⚡️ Fast:** Build faster forms faster with intuitive API and small footprint
- **🏏 Minimal:** Only handles the complicated form concerns, gives you full control over everything else
- **😎 UI Agnostic:** Works with native HTML elements or your favorite UI library components
- **🦾 Progressive:** Works whether you use Vue.js as a progressive enhancement or in a complex setup
- **✅ Built-in Rules:** Companion lib with 25+ Rules that covers most needs in most web applications
- **🌐 i18n:** 45+ locales for built-in rules contributed by developers from all over the world

## Getting Started

### Installation

```sh
# Install with yarn
yarn add vee-validate

# Install with npm
npm install vee-validate --save
```

### Vue version support

The main v4 version supports Vue 3.x only, for previous versions of Vue, check the following the table

| vue Version | vee-validate version | Documentation Link                                                                       |
| ----------- | -------------------- | ---------------------------------------------------------------------------------------- |
| `2.x`       | `2.x` or `3.x`       | [v2](https://vee-validate.logaretm.com/v2) or [v3](https://vee-validate.logaretm.com/v3) |
| `3.x`       | `4.x`                | [v4](https://vee-validate.logaretm.com/v4)                                               |

### Usage

vee-validate offers two styles to integrate form validation into your Vue.js apps.

#### Declarative Components

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

#### Composition API

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

Then in your template, use `v-model` to bind the `value` to your input and display the errors using `errorMessage`:

```vue
<input name="field" v-model="value" />
<span>{{ errorMessage }}</span>
```

## 📚 Documentation

Read the [documentation and demos](https://vee-validate.logaretm.com/v4).

## Contributing

You are welcome to contribute to this project, but before you do, please make sure you read the [contribution guide](/CONTRIBUTING.md).

## Credits

- Inspired by Laravel's [validation syntax](https://laravel.com/docs/5.4/validation)
- v4 API Inspired by [Formik's](https://github.com/formium/formik)
- Logo by [Baianat](https://github.com/baianat)

## Emeriti

Here we honor past contributors and sponsors who have been a major part on this project.

- [Baianat](https://github.com/baianat).

## ⚖️ License

Released under [MIT](/LICENSE) by [@logaretm](https://github.com/logaretm).
