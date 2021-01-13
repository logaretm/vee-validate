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

vee-validate makes use of two flavors to add validation to your forms.

The first approach is using higher-order components (HOC) to validate your fields, in the next examples you will find `Field`, `Form` and `ErrorMessage` components being used.

The second flavor is using the composition API to add the validation logic into your existing components, You will be using `useField` and `useForm` to validation your fields/data.

Whichever approach you prefer to use, both flavors can be used interchangeably so you can mix and match between the two approaches when suitable.

### Using NPM

For a more modern workflow with a bundler, you can install vee-validate using a package manager like `yarn` or `npm`:

```bash
yarn add vee-validate@next
# or
npm i vee-validate@next --save
```

### Using a script tag

You can use vee-validate with a script tag and a CDN, import the library like this:

```html
<script src="https://unpkg.com/vee-validate@next"></script>
```

This will inject `VeeValidate` global object, which you will use to access the various components, functions exposed by vee-validate.
