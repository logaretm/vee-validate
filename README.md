<p align="center">
  <a href="https://vee-validate.logaretm.com" target="_blank">
    <img width="200" src="https://s3.eu-central-1.amazonaws.com/logaretm/vee-validate.svg">
  </a>
</p>

<p align="center">

[![codecov](https://codecov.io/gh/baianat/vee-validate/branch/master/graph/badge.svg)](https://codecov.io/gh/baianat/vee-validate)
[![Build Status](https://travis-ci.org/baianat/vee-validate.svg?branch=master)](https://travis-ci.org/baianat/vee-validate)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/087bd788687c4ccab6650756ce56fa05)](https://www.codacy.com/app/baianat/vee-validate?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=baianat/vee-validate&amp;utm_campaign=Badge_Grade)
[![CDNJS](https://img.shields.io/cdnjs/v/vee-validate.svg)](https://cdnjs.com/libraries/vee-validate/2.0.0-rc.25)
[![npm](https://img.shields.io/npm/dm/vee-validate.svg)](https://npm-stat.com/charts.html?package=vee-validate)
[![npm](https://img.shields.io/npm/v/vee-validate.svg)](https://www.npmjs.com/package/vee-validate)
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/baianat/vee-validate.svg)](http://isitmaintained.com/project/baianat/vee-validate "Average time to resolve an issue")
[![Percentage of issues still open](http://isitmaintained.com/badge/open/baianat/vee-validate.svg)](http://isitmaintained.com/project/baianat/vee-validate "Percentage of issues still open")

</p>
<br>

vee-validate is a plugin for [Vue.js](https://vuejs.org/) that allows you to validate input fields and display errors.

You don't have to do anything fancy in your app -- most of the work goes into the html. You only need to specify for each input what kind of validators should be used when the value changes. The errors will be automatically generated. The plugin offers [many validations out of the box](http://vee-validate.logaretm.com/rules).

Although most of the validations occur automatically, you can use the validator however you see fit. The validator object has no dependencies and is a standalone object. This plugin is built with localization in mind. Read the [docs](http://vee-validate.logaretm.com/) for more info.

This plugin is inspired by [PHP Framework Laravel's validation](https://laravel.com/).

### Installation

#### npm

```
npm install vee-validate --save
```

### yarn

```
yarn add vee-validate
```

### CDN

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

Just apply the `v-validate` directive on your input and pass a **string value** which is a list of validations separated by a pipe. For example, we will use the `required` and the `email` validators:

```vue
<input v-validate="'required|email'" type="text" name="email">
```

Alternatively you can pass an object for more flexibility:

```vue
<input v-validate="{ required: true, email: true, regex: /[0-9]+/ }" type="text" name="email">
```

Now every time the input changes, the validator will run the list of validations from left to right, populating the errors helper object whenever an input fails validation.

To access the errors object (in your vue instance):

```javascript
this.$validator.errorBag;
// or
this.errors; // injected into $data by the plugin, you can customize the property name.
```

Let's display the error for the email input we've created:
```html
<!-- If it has an email error, display the first message associated with it. -->
<span v-show="errors.has('email')">{{ errors.first('email') }}</span>
```

Of course there is more to it than that. Refer to the documentation for more details about the rules and usage of this plugin.

### Documentation

Read the [documentation and demos](http://vee-validate.logaretm.com/).


### Compatibility

This library uses ES6 Promises so be sure to provide a polyfill for it for the browsers that do not support it.

### Contributing

You are welcome to contribute to this repo with anything you think is useful. Fixes are more than welcome.
However if you are adding a new validation rule, it should have multiple uses or be as generic as possible.

You can find more information in the [contribution guide](CONTRIBUTING.md).

### Tutorials and Examples

- [Vue Multi Step Form](http://statemachine.davestewart.io/html/examples/vue/vue-sign-up.html) by [Dave Stewart](https://github.com/davestewart)
- [Laravel 5.4 with Vue and Vee Validate (Windows)](https://medium.com/@kanokpit.skuberg/laravel-5-4-with-vue-and-vee-validate-windows-c3ff7f4cdabc) by [Noi Skuberg](https://medium.com/@kanokpit.skuberg)
- [Vee-validate (Intro and Example)](https://medium.com/@ngLahin/vee-validate-intro-and-example-22d8b95e25e1) by [Hussain Muhammad Lahin](https://medium.com/@ngLahin)
- [An imperative guide to forms in Vue.js](https://blog.logrocket.com/an-imperative-guide-to-forms-in-vue-js-7536bfa374e0) by [Olayinka Omole](https://blog.logrocket.com/@olayinka.omole).

### Credits
- Some validations/test scenarios are provided/based on [validator.js](https://github.com/chriso/validator.js).
- Inspired by Laravel's [validation syntax](https://laravel.com/docs/5.4/validation).
- Logo by [Abdelrahman Ismail](https://github.com/Abdelrahman3D)

### license

MIT
