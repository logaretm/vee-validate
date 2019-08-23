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

`ValidationProvider` is one of the components provided by `vee-validate`, you will use this component to validate your fields.

Here is an input field without validation:

```html
<input v-model="email" type="text" />
```

To validate it, wrap the `input` with a `ValidationProvider` component:

```vue{1,4}
<ValidationProvider rules="secret" v-slot="{ errors }">
  <input v-model="email" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

The `rules` prop passed to the `ValidationProvider` is the validation rules that will be checked against the input, the syntax is Laravel-like by placing the rules names between pipes, for that input we want to make sure it is required.

To display error messages, the `ValidationProvider` exposes `errors` array through [scoped slots](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots).

### Demo

Here is the above example in action, enter `example` or leave it empty to pass the validation.

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
