---
title: Overview
description: Getting started with VeeValidate
meta:
  - name: og:title
    content: Getting Started
  - name: og:description
    content: Getting started with VeeValidate
---

# Overview

Form validation is one of the most difficult subjects in frontend, not only you have to deal with ensuring correct values are submitted, you must also make sure to provide a suitable UX for your users. And we also have to deal with accessability and making sure our forms are inclusive and usable for all types of our users, doing form validation by hand is painful and is a lot of work and you won't probably cover localization and cross-field validation! **The time you spend working on a custom form validation solution is better spent building your application logic**.

Most validation libraries will save you a lot of time, but `vee-validate` tackles the major pain points of form validation and addresses them in a very flexible way:

- Define validation rules declaratively or imperatively
- Cross Field validation
- Schema (form-level) Validation
- Built-in helpers to enhance your forms accessability and styling
- Localization and message generation support
- A package of the most common rules is available

## Getting Started

### Installation

#### yarn

```bash
yarn add vee-validate
```

#### npm

```bash
npm install vee-validate --save
```

#### CDN

```html
<!-- jsdelivr cdn -->
<script src="https://cdn.jsdelivr.net/npm/vee-validate@latest/dist/vee-validate.js"></script>

<!-- unpkg -->
<script src="https://unpkg.com/vee-validate@latest"></script>
```

### Usage

#### via script tag

include the script directly

<!-- TODO: Script tag tutorial -->

:::tip
All Examples from now on will use the ES2015 syntax, make sure to brush up on ES2015 if you haven't already.
:::

### Basic Example

<!-- TODO: Tutorial Video -->

VeeValidate exposes 2 components, `Field` component and `Form` that allow you to validate your fields. First, use the `Form` component to define your `Form`

```vue{1,4}
<Field rules="secret" v-slot="{ errors }">
  <input v-model="email" type="text">
  <span>{{ errors[0] }}</span>
</Field>
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

#### Demo

Here is the above example in action, enter `example` to pass validation:

@[example](getting-started)
