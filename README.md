<p align="center">
  <a href="https://baianat.github.io/vee-validate/" target="_blank">
    <img width="200" src="https://github.com/baianat/vee-validate/blob/master/logo.png">
  </a>
</p>

<p align="center">

[![codecov](https://codecov.io/gh/baianat/vee-validate/branch/master/graph/badge.svg)](https://codecov.io/gh/baianat/vee-validate)
[![Build Status](https://travis-ci.org/baianat/vee-validate.svg?branch=master)](https://travis-ci.org/baianat/vee-validate)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/087bd788687c4ccab6650756ce56fa05)](https://www.codacy.com/app/baianat/vee-validate?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=baianat/vee-validate&amp;utm_campaign=Badge_Grade)
[![CDNJS](https://img.shields.io/cdnjs/v/vee-validate.svg)](https://cdnjs.com/libraries/vee-validate/)
[![npm](https://img.shields.io/npm/dm/vee-validate.svg)](https://npm-stat.com/charts.html?package=vee-validate)
[![npm](https://img.shields.io/npm/v/vee-validate.svg)](https://www.npmjs.com/package/vee-validate)
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/baianat/vee-validate.svg)](http://isitmaintained.com/project/baianat/vee-validate "Average time to resolve an issue")
[![Percentage of issues still open](http://isitmaintained.com/badge/open/baianat/vee-validate.svg)](http://isitmaintained.com/project/baianat/vee-validate "Percentage of issues still open")

</p>
<br>

vee-validate is a template-based validation framework for [Vue.js](https://vuejs.org/) that allows you to validate inputs and display errors.

Being template-based you only need to specify for each input what kind of validators should be used when the value changes. The errors will be automatically generated with 40+ locales supported. [Many rules are available out of the box](https://baianat.github.io/vee-validate/guide/rules.html).

This plugin is inspired by [PHP Framework Laravel's validation](https://laravel.com/).

### Installation

#### yarn

```
yarn add vee-validate
```

#### npm

```
npm i vee-validate --save
```

#### CDN

vee-validate is also available on these CDNs:

- [jsdelivr](https://cdn.jsdelivr.net/npm/vee-validate@latest/dist/vee-validate.js) [![jsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/vee-validate/badge?style=rounded)](https://www.jsdelivr.com/package/npm/vee-validate)
- [unpkg](https://unpkg.com/vee-validate)

> When using a CDN via script tag, all the exported modules on VeeValidate are available on the VeeValidate Object. ex: VeeValidate.Validator

### Getting Started

In your script entry point:
```javascript
import Vue from 'vue';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);
```

Now you are all setup to use the plugin.

### Usage

There are two ways to use vee-validate:

#### Using Components (recommended)

> This is available in 2.1 onwards.

Import the `ValidationProvider` component and register it:

```js
import { ValidationProvider } from 'vee-validate';

// Register it globally
// main.js or any entry file.
Vue.component('ValidationProvider', ValidationProvider);


// or register it locally in a component
// mycomponent.vue
export default {
  components: {
    ValidationProvider
  }
};
```

All the JavaScript work is done. Next in the template add the inputs you want to validate them:

**With Vue 2.6.0+**

```vue
<validation-provider name="email" rules="required|email">
  <template #default="{ errors }">
    <input v-model="email">
    <p>{{ errors[0] }}</p>
  </template>
</validation-provider>
```

**Before Vue 2.6.0**

```vue
<validation-provider name="email" rules="required|email">
  <div slot-scope="{ errors }">
    <input v-model="email">
    <p>{{ errors[0] }}</p>
  </div>
</validation-provider>
```

The validation provider accepts two props: `rules` which is in its simplest form, a string containing the validation rules separated by a `|` character, and a `name` prop which is the field name that will be used in error messages.

and That's it, your input will be validated automatically, notice that the `ValidationProvider` uses [scoped slots](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots) to pass down validation state and results.


There is more that can be done! You can customize events, validate initial values, manually validate or reset the field and much more. Make sure to [read the docs](https://baianat.github.io/vee-validate/guide/components.html).

#### Using directive

Apply the `v-validate` directive on your input and pass a **string value** which is a list of validations separated by a pipe. For example, we will use the `required` and the `email` validators:

```vue
<input v-validate="'required|email'" type="text" name="email">
```

Now every time the input changes, the validator will run the list of validations from left to right, populating the errors helper object whenever an input fails validation.

To access the errors object (in your vue instance):

```js
this.$validator.errorBag;
// or
this.errors; // injected into $data by the plugin, you can customize the property name.
```

Let's display the error for the email input we've created:
```html
<!-- If it has an email error, display the first message associated with it. -->
<span v-show="errors.has('email')">{{ errors.first('email') }}</span>
```

### Documentation

Read the [documentation and demos](https://baianat.github.io/vee-validate/).

### Compatibility

This library uses ES6 Promises so be sure to provide a polyfill for it for the browsers that do not support it.

### Contributing

You are welcome to contribute to this project, but before you do, please make sure you read the [contribution guide](CONTRIBUTING.md).

### Tutorials and Examples

#### Articles

- [Validation Providers](https://medium.com/@logaretm/vee-validate-validation-providers-b5b38647c05c)
- [Authoring Validatble Vue Components](https://medium.com/@logaretm/authoring-validatable-custom-vue-input-components-1583fcc68314)
- [Vue Multi Step Form](http://statemachine.davestewart.io/html/examples/vue/vue-sign-up.html) by [Dave Stewart](https://github.com/davestewart)
- [An imperative guide to forms in Vue.js](https://blog.logrocket.com/an-imperative-guide-to-forms-in-vue-js-7536bfa374e0) by [Olayinka Omole](https://blog.logrocket.com/@olayinka.omole).
- [Template Driven Form Validation In Vue.js](https://scotch.io/tutorials/template-driven-form-validation-in-vuejs) by [Ogundipe Samuel Ayo](https://twitter.com/fucked_down)
- [Make Validation Great Again! Vue form validation with vee validate](https://qiita.com/nickhall/items/d1043f3f9874c90b6f8e) by [Nick Hall](https://github.com/nickhall)


### Credits

- Some validations/test scenarios are provided/based on [validator.js](https://github.com/chriso/validator.js).
- Inspired by Laravel's [validation syntax](https://laravel.com/docs/5.4/validation).

### license

MIT
