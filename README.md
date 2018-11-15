<p align="center">
  <a href="https://baianat.github.io/vee-validate/" target="_blank">
    <img width="200" src="https://s3.eu-central-1.amazonaws.com/logaretm/vee-validate.svg">
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

vee-validate is a template-based validation framework for [Vue.js](https://vuejs.org/) that allows you to validate input fields and display errors.

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

vee-validate is also available on these cdns:

- [jsdelivr cdn](https://cdn.jsdelivr.net/npm/vee-validate@latest/dist/vee-validate.js) [![jsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/vee-validate/badge?style=rounded)](https://www.jsdelivr.com/package/npm/vee-validate)
- [unpkg](https://unpkg.com/vee-validate)

### Getting Started

In your script entry point:
```javascript
import Vue from 'vue';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);
```

Now you are all setup to use the plugin.

### Usage

There are two ways to use vee-validate, Using `v-validate` directive or using `Validation*` components.

#### Using directive

Just apply the `v-validate` directive on your input and pass a **string value** which is a list of validations separated by a pipe. For example, we will use the `required` and the `email` validators:

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

#### Using Components

Validation components uses the [scoped slots feature](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots) to pass down validation state and results.

```vue
<template>
  <div>
    <ValidationProvider rules="required|email">
      <div slot-scope="{ errors }">
        <input v-model="value">
        <p>{{ errors[0] }}</p>
      </div>
    </ValidationProvider>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate';

export default {
  data: () => ({
    value: ''
  }),
  components: {
    ValidationProvider
  }
}
</script>
```

### Documentation

Read the [documentation and demos](https://baianat.github.io/vee-validate/).

### Compatibility

This library uses ES6 Promises so be sure to provide a polyfill for it for the browsers that do not support it.

### Contributing

You are welcome to contribute to this repo with anything you think is useful. Fixes are more than welcome.
However if you are adding a new validation rule, it should have multiple uses or be as generic as possible.

You can find more information in the [contribution guide](CONTRIBUTING.md).

### UI Integrations

These libraries/projects make it a breeze integrating vee-validate into your favorite UI library/framework.

- [vee-element](https://github.com/davestewart/vee-element) for [Element](https://github.com/ElemeFE/element)

### Tutorials and Examples

- [Vue Multi Step Form](http://statemachine.davestewart.io/html/examples/vue/vue-sign-up.html) by [Dave Stewart](https://github.com/davestewart)
- [Laravel 5.4 with Vue and Vee Validate (Windows)](https://medium.com/@kanokpit.skuberg/laravel-5-4-with-vue-and-vee-validate-windows-c3ff7f4cdabc) by [Noi Skuberg](https://medium.com/@kanokpit.skuberg)
- [Vee-validate (Intro and Example)](https://medium.com/@ngLahin/vee-validate-intro-and-example-22d8b95e25e1) by [Hussain Muhammad Lahin](https://medium.com/@ngLahin)
- [An imperative guide to forms in Vue.js](https://blog.logrocket.com/an-imperative-guide-to-forms-in-vue-js-7536bfa374e0) by [Olayinka Omole](https://blog.logrocket.com/@olayinka.omole).
- [Template Driven Form Validation In Vue.js](https://scotch.io/tutorials/template-driven-form-validation-in-vuejs) by [Ogundipe Samuel Ayo](https://twitter.com/fucked_down)
- [Make Validation Great Again! Vue form validation with vee validate](https://qiita.com/nickhall/items/d1043f3f9874c90b6f8e) by [Nick Hall](https://github.com/nickhall)

### Credits

- Some validations/test scenarios are provided/based on [validator.js](https://github.com/chriso/validator.js).
- Inspired by Laravel's [validation syntax](https://laravel.com/docs/5.4/validation).
- Logo by [Abdelrahman Ismail](https://github.com/Abdelrahman3D)

### license

MIT
