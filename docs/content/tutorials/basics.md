---
title: Validation Basics
description: Build a newsletter form with vee-validate
order: 1
---

# Validation Basics

VeeValidate offers many ways to do form validation, this tutorial will teach you how to do basic form validation using the simplest approach.

## What are we building

In this tutorial we will be building a "sign up newsletter" form where the user would have to fill a field to complete their sign up.

## Prerequisites

You will need to be familiar with HTML and a good understanding of modern JavaScript like arrow functions and ES modules, also you will need to have basic understanding of Vue's scoped slots feature.

Also to make it clear, this tutorial code snippets are formatted into steps and to avoid repetitive code, any unchanged snippets in-between steps will be collapsed as comments.

## Setup

It is preferable to use a local development environment to follow along, make sure to have to following:

- Prepare a Vue 3.x project using the [`vue-cli`](https://cli.vuejs.org/)
- Install `vee-validate`

<details>

<summary>Optional: Detailed Steps</summary>

1. If not already prepared, install the New Vue CLI

```sh
npm install -g @vue/cli@next
```

2. Using the `vue-cli`, create a new project and choose Vue 3 template:

```sh
vue create vee-validate-tutorial
```

<doc-tip>

If your project was created using Vue 2 project you can migrate to Vue 3:

```sh
vue add vue-next
```

</doc-tip>

3. Add `vee-validate` to your project

```sh
yarn add vee-validate

# or

npm install vee-validate
```

4. Cleanup the contents of `App.vue` so it contains an empty template, it should look like the following:

```vue
<template>
  <div id="app"></div>
</template>

<script>
export default {};
</script>
```

And that's it, follow the tutorial for the next steps.

</details>

## Building the Form

First, start by adding the markup you would typically have for a sign up form, you can start by having a `form` wrapping a few `input` elements.

```vue
<template>
  <div id="app">
    <form>
      <input type="text" name="name" />
      <input type="password" name="password" />

      <button>Sign up</button>
    </form>
  </div>
</template>

<script>
export default {};
</script>
```

So far so good, this form currently submits whenever the button is clicked and is not being validated and the page refreshes because by defaults forms submit a `GET` request to the current page if not specified otherwise.

Fix that by adding a `submit` event handler that prevents the native form submission using the `prevent` modifier, we will use `onSubmit` function to handle our form submission.

```vue
<template>
  <div id="app">
    <form @submit.prevent="onSubmit">
      <input type="email" name="email" />

      <button>Sign up</button>
    </form>
  </div>
</template>

<script>
export default {
  methods: {
    onSubmit() {
      alert('Submitted');
    },
  },
};
</script>
```

And that typically represents most of your forms, while your forms would have more fields with more complex markup, the same principles apply. Now that you have the form not reloading the page on submit and is correctly triggering our handlers, we've yet to make sure it validates our input.

## Adding Validation

VeeValidate exposes 2 components that you will be using regularly, the `<Field>` and `<Form>` components are higher-order components (HOC) that will help you validate your forms and inputs. Import them and register them on the component, then use them to re-write the form:

```vue
<template>
  <div id="app">
    <Form @submit="onSubmit">
      <Field name="email" as="input" />

      <button>Sign up</button>
    </Form>
  </div>
</template>

<script>
import { Form, Field } from 'vee-validate';

export default {
  components: {
    Form,
    Field,
  },
  methods: {
    onSubmit() {
      alert('Submitting :(');
    },
  },
};
</script>
```

<doc-tip type="danger" title="Component Registration">

It might be necessary to rename the `Form` and `Field` components to something else to avoid conflicting with HTML native elements tag names, while this will work fine in [Vue's single file components (SFCs)](https://v3.vuejs.org/guide/single-file-component.html) because the compiler is able to determine which one to render, but in native browser environment the `Form` will still render the native HTML counterpart because HTML is case-insensitive.

</doc-tip>

Another distinction is that the `.prevents` modifier is removed, this is because the `Form` component does that automatically for you since you won't be listening to the `submit` event unless you want to handle it in JavaScript. And lastly, it sends all the fields values to your submit handler and that saves you the need to use `v-model` to bind your inputs.

Similarly the `Field` component also accepts an `as` prop that allows it to render any type of input, in our case we still want it to render an `input` element.

This is all the boilerplate necessary to prepare your forms for validation, all that remains is to add validation rules to validate the input as currently it doesn't have any rules and will still submit in any case.

There are multiple ways to define rules with VeeValidate, this tutorial will cover the most basic and straightforward way which is just defining our rules directly in the setup function:

```vue
<template>
  <div id="app">
    <Form @submit="onSubmit">
      <Field name="email" as="input" :rules="validateEmail" />

      <button>Sign up</button>
    </Form>
  </div>
</template>

<script>
import { Form, Field } from 'vee-validate';

export default {
  components: {
    Form,
    Field,
  },
  methods: {
    onSubmit(values) {
      alert(JSON.stringify(values, null, 2));
    },
    validateEmail(value) {
      // if the field is empty
      if (!value) {
        return 'This field is required';
      }

      // if the field is not a valid email
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        return 'This field must be a valid email';
      }

      // All is good
      return true;
    },
  },
};
</script>
```

The `validateEmail` validator function makes sure the `email` field is both required and is a valid email. Using the `rules` prop, you can define validators for your `Field` components and whenever their value change the validators will be run against the new value.

If you try submitting the form now you will notice that it doesn't submit while the field is empty, but once you input a valid email and click on the button it will be submitted, this means the validation is now working and is preventing submission until the form as a whole becomes valid.

You are not quite there yet, The last step is to show error messages that you already return in the `validateEmail` so that your users have a better understanding of what is going on and why the form isn't submitting.

## Displaying Error Messages

There are multiple ways to display error messages with VeeValidate. In this tutorial you will use the `ErrorMessage` component to display the error message.

First, grab the `ErrorMessage` component from `vee-validate` and register it in your component:

```js
import { Field, Form, ErrorMessage } from 'vee-validate';

export default {
  components: {
    Field,
    Form,
    ErrorMessage,
  },
};
```

Then add the `<ErrorMessage />` component to your template, passing a `name` prop that matches the `<Field />` name prop:

```vue
<template>
  <div id="app">
    <Form @submit="onSubmit">
      <Field name="email" as="input" :rules="validateEmail" />
      <ErrorMessage name="email" />

      <button>Sign up</button>
    </Form>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate';

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  methods: {
    onSubmit(values) {
      alert(JSON.stringify(values, null, 2));
    },
    validateEmail(value) {
      // if the field is empty
      if (!value) {
        return 'This field is required';
      }

      // if the field is not a valid email
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        return 'This field must be a valid email';
      }

      // All is good
      return true;
    },
  },
};
</script>
```

If you try the form now, it validates and renders error messages while preventing submitting the form while invalid.

You can checkout the finished code in action:

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="logaretm" data-slug-hash="yLeraZR" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Tutorial - Basics">
  <span>See the Pen <a href="https://codepen.io/logaretm/pen/yLeraZR">
  Tutorial - Basics</a> by Abdelrahman Awad (<a href="https://codepen.io/logaretm">@logaretm</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

There is a lot more you can do with vee-validate and while this example is verbose, there are other ways and features you can use to clean up your form validation logic. Here is a few things that you can do with vee-validate:

- Declare rules globally and use them in a Laravel-like syntax
- Using 3rd-party libraries like `yup` to validate
- Doing form-level validation using a validation schema
- Advanced rendering of your inputs and forms using scoped-slots
- Component-less validation with the composition API
- Generating localized messages
