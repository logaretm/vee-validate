# Vee-Validate
[![codecov](https://codecov.io/gh/logaretm/vee-validate/branch/master/graph/badge.svg)](https://codecov.io/gh/logaretm/vee-validate)
[![Build Status](https://travis-ci.org/logaretm/vee-validate.svg?branch=master)](https://travis-ci.org/logaretm/vee-validate)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/087bd788687c4ccab6650756ce56fa05)](https://www.codacy.com/app/logaretm1/vee-validate?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=logaretm/vee-validate&amp;utm_campaign=Badge_Grade)

vee-validate is a lightweight plugin for [Vue.js](https://vuejs.org/) that allows you to validate input fields, and display errors.

**What makes it different is:** You don't have to do anything fancy in your app, most of the work goes into the html, You only need to specify for each input what kind of validators should be used when the value changes. You will then get informed of the errors for each field.

Although most of the validations occur automatically, you can use the validator however you see fit. The validator object has no dependencies and is a standalone object. This plugin is built with localization in mind. and currently there are over 20 validation rules available in the plugin. Read the [docs](http://vee-validate.logaretm.com/) for more info.

This plugin is inspired by [PHP Framework Laravel's validation](https://laravel.com/).

### Installation

#### npm

```
npm install vee-validate --save
```

or if you are using **Vue 2.0**:
```
npm install vee-validate@next --save
```

#### bower

**Vue 1.0**:
```
bower install vee-validate#1.0.0-beta.9 --save
```

**Vue 2.0**:

```
bower install vee-validate#2.0.0-beta.15 --save
```

### CDN

vee-validate is also available on jsdelivr cdn:

[select whatever version](https://www.jsdelivr.com/projects/vee-validate) you would like to use.

### Getting Started

In your script entry point:
```javascript
import Vue from 'vue';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);
```

Now you are all setup to use the plugin.

### Usage

Just apply the `v-validate` directive on your input and a `data-vv-rules` attribute which is a list of validations separated by a pipe, for example we will use the `required` and the `email` validators:

```html
<input v-validate data-vv-rules="required|email" type="text" name="email">
```

Now every time the input changes, the validator will run the list of validations from left to right, populating the errors helper object whenever an input fails validation.

To access the errors object (in your vue instance):

```javascript
this.$validator.errorBag;
// or
this.errors; // injected into $data by the plugin, you can customize the property name.
```

so lets display the error for the email input we've created:
```html
<!-- If it has an email error, display the first message associated with it. -->
<span v-show="errors.has('email')">{{ errors.first('email') }}</span>
```

Of course there is more to it than that, refer to the documentation for more details about the rules, and usage of this plugin.

### Documentation

Read the [documentation and demos](http://vee-validate.logaretm.com/).

### Compatibility

This plugin should be compatible with the major browsers, but it requires few polyfills to work on older ones.

The reason they are not included is because most of the workflows already use polyfills within their code, so to cut down the package size the redundant polyfills were removed, you can use [Polyfill.io](https://polyfill.io/v2/docs/) to provide the needed polyfills for all browsers automatically, or feel free to provide them on your own.

### Contributing

You are welcome to contribute to this repo with anything you think is useful. fixes are more than welcome.
However if you are adding a new validation rule, it should have multiple uses or as generic as possible.

You can find more information in the [contribution guide](contributing.md).

### Tutorials and Examples

- [Form Validation using Vue.js 2](https://dotdev.co/form-validation-using-vue-js-2-35abd6b18c5d#.m95idzlj2) by [Alex Kyriakidis](https://github.com/hootlex)
- [Vue Multi Step From](http://statemachine.davestewart.io/html/examples/vue/vue-sign-up.html) by [Dave Stewart](https://github.com/davestewart)

### license MIT
