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

### yarn

```bash
yarn add vee-validate
```

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

### via script tag

include the script directly

```html
<script src="path/to/vue.js"></script>
<script src="path/to/vee-validate.js"></script>
<script>
  // Add a rule.
  VeeValidate.extend('secret', {
    validate: value => value === 'example',
    message: 'This is not the magic word'
  });

  // Register the component globally.
  Vue.component('ValidationProvider', VeeValidate.ValidationProvider);
</script>
```

### ES6+

```js
import Vue from 'vue';
import { ValidationProvider, extend } from 'vee-validate';

// Add a rule.
extend('secret', {
  validate: value => value === 'example',
  message: 'This is not the magic word'
});

// Register it globally
Vue.component('ValidationProvider', ValidationProvider);
```

:::tip
All Examples from now on will use the ES2015 syntax, make sure to brush up on ES2015 if you haven't already.
:::

## Basic Example

VeeValidate exposes a `ValidationProvider` component that allows you to validate your fields, simply wrap your field with a `validation-provider` component.

```vue{1,4}
<ValidationProvider rules="secret" v-slot="{ errors }">
  <input v-model="email" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

:::danger Component Casing

The examples will use Pascal case which should work fine if you are using Vue component files (SFC or `.vue` files). If you plan to use vee-validate in the browser build, you will need to use the kebab case. The previous example would then be:

```html{1,4}
<validation-provider rules="secret" v-slot="{ errors }">
  <input v-model="email" type="text" />
  <span>{{ errors[0] }}</span>
</validation-provider>
```

:::

The `rules` prop passed to the `ValidationProvider` is the validation rules that will be checked against the input.

To display error messages, the `ValidationProvider` exposes `errors` array through [scoped slots](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots), this array contains error messages related to that field.

### Demo

Here is the above example in action, enter `example` to pass validation:

<ValidationProvider rules="secret" v-slot="{ errors }">
  <input v-model="value" type="text" placeholder="type something">
  <span>{{ errors[0] }}</span>
</ValidationProvider>

<script>
export default {
 data: () => ({
    value: ''
  }),
  mounted () {
    this.extendRule('secret', {
      validate: value => value === 'example',
      message: 'This is not the magic word'
    });
  }
};
</script>
