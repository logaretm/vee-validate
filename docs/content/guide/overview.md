---
title: Overview
description: Getting started with VeeValidate
order: 1
---

# Overview

Form validation is one of the most difficult subjects in frontend, not only you have to deal with ensuring correct values are submitted, you must also make sure to provide a pleasant UX for your users and we also have to deal with accessibility and making sure our forms are inclusive and usable for all types of our users.

Doing form validation by hand is painful and is a lot of work and you won't probably cover all your needs if you decide to build your own.

**The time you spend working on a custom form validation solution is better spent building your application logic**.

Most validation libraries will save you a lot of time, but `vee-validate` tackles the major pain points of form validation and addresses them in a very flexible way:

<div class="features">

- Tracking form state
- UI and UX
- Synchronous and Asynchronous Validation
- Handling submissions

</div>

## Getting Started

vee-validate primarily makes use of higher-order components to validate your fields, in the next examples you will find `Field`, `Form` and `ErrorMessage` components being used, don't worry about them for now as they are documented extensively later on.

### Using a script tag

You can use vee-validate with a script tag and a CDN, import the library like this:

```html
<script src="https://unpkg.com/vee-validate@next"></script>
```

This will inject `VeeValidate` global object, which you will use to access the various components, functions exposed by vee-validate.

Here is a basic example with vee-validate:

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="logaretm" data-slug-hash="rNxbMzq" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Basic Example">
  <span>See the Pen <a href="https://codepen.io/logaretm/pen/rNxbMzq">
  Basic Example</a> by Abdelrahman Awad (<a href="https://codepen.io/logaretm">@logaretm</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

<doc-tip>

From this point forwards, the docs will assume basic knowledge of [Vue's SFC components](https://v3.vuejs.org/guide/single-file-component.html) and will demonstrate examples as such and will be using ES6+ code snippets. So be sure to brush up on these if you haven't already.

</doc-tip>

### Using NPM

For a more modern workflow with a bundler, you can install vee-validate using a package manager like `yarn` or `npm`:

```sh
yarn add vee-validate@next

npm i vee-validate@next --save
```

Then you can import the various components from vee-validate:

```vue
<template>
  <Form v-slot="{ errors }">
    <Field name="field" as="input" :rules="isRequired" />

    <span>{{ errors.field }}</span>
  </Form>
</template>

<script>
import { Field, Form } from 'vee-validate';

export default {
  components: {
    Field,
    Form,
  },
  methods: {
    // Validator function
    isRequired(value) {
      return value ? true : 'This field is required';
    },
  },
};
</script>
```

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
