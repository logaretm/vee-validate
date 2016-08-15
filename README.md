# Vee-Validate
[![codecov](https://codecov.io/gh/logaretm/vee-validate/branch/master/graph/badge.svg?token=XFzlvHKFP5)](https://codecov.io/gh/logaretm/vee-validate)
[![Build Status](https://travis-ci.org/logaretm/vee-validate.svg?branch=next)](https://travis-ci.org/logaretm/vee-validate)

vee-validate is a lightweight plugin for [VueJS](https://vuejs.org/) that allows you to validate input fields, and display errors.

**What makes it different is:** You don't have to do anything fancy in your app, most of the work goes into the html, You only need to specify for each input what kind of validators should be used when the value changes. You will then get informed of the errors for each field.

Although most of the validations occur automatically, you can use the validator however you see fit. The validator object has no dependencies and is a standalone object. This plugin is built with localization in mind. and currently there are over 20 validation rules available in the plugin. Read the [docs](https://logaretm.github.io/vee-validate/) for more info.

This plugin is inspired by [PHP Framework Laravel's validation](https://laravel.com/).

### Installation

```
npm install vee-validate --save
```

or if you are using **Vue 2.0**:
```
npm install vee-validate@next --save
```

### Getting Started

In your script entry point:
```javascript
import Vue from 'vue';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);
```

Now you are all setup to use the plugin.

### Usage

Just apply the `v-validate` directive on your input and a `rules` attribute which is a list of validations separated by a pipe, for example we will use the `required` and the `email` validators:

```html
<input v-validate data-rules="required|email" type="text" name="email">
```

Now every time the input changes, the validator will run the list of validations from left to right, populating the errors helper object whenever an input fails validation.

To access the errors object (in your vue instance):

```javascript
this.$validator.errorBag;
// or
this.errors; // injected into $data by the plugin, you can customize the property name.
```

Of course there is more to it than that, refer to the documentation for more details about the rules, and usage of this plugin.

### Documentation

Read the [documentation and demos](https://logaretm.github.io/vee-validate/).

### license MIT
