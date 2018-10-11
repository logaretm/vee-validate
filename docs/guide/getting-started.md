---
title: Getting Started
description: Getting started with VeeValidate
meta:
  - name: og:title
    content: Getting Started
  - name: og:description
    content: Getting started with VeeValidate
---
# Getting started

## Installation

You can install this plugin via [npm](#npm) or via a [CDN](#cdn).

### npm

```bash
npm install vee-validate --save
```

### CDN

```html
  <!-- jsdelivr cdn -->
  <script src="https://cdn.jsdelivr.net/npm/vee-validate@latest/dist/vee-validate.js"></script>

  <!-- unpkg -->
  <script src="https://unpkg.com/vee-validate@latest"></script>
```

## Usage

::: tip
  Examples use the ES2015 syntax, make sure to brush up on ES2015 if you haven't already.
:::

```js
import Vue from 'vue';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);
```

or include the script directly

```html
  <script src="path/to/vue.js"></script>
  <script src="path/to/vee-validate.js"></script>
  <script>
    Vue.use(VeeValidate); // good to go.
  </script>
```

## Basic Example

All you need is to add the `v-validate` directive to the input you wish to validate and make sure your input has a `name` attribute for error messages generation.

Then, pass to the directive a `rules` string which contains a list of validation rules separated by a pipe '`|`'. For the following example, the validation rules are straightforward. Use `required` to indicate that the field is required and `email` to indicate that the field must be an email. To combine both rules we assign the string value `required|email` to the `v-validate` expression value.

```html
<input v-validate="'required|email'" name="email" type="text">
```

To display the error message we simply use the `errors.first` method to fetch the first error generated for the field:

```html
<span>{{ errors.first('email') }}</span>
```

### Demo

Here is the basic example in action

<div>
  <input v-validate="'required|email'" name="email" type="text">
  <span>{{ errors.first('email') }}</span>
</div>

[More Examples](/examples/)

::: danger
  Client-side validation is never a substitute for server-side validation. Make sure to validate any input from the user on your backend as well.
:::

::: tip
  There are other ways to install the plugin, [check them out](/configuration.md#installation).
:::
