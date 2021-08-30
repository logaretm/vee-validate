---
title: Validation Basics
description: Build a newsletter form with vee-validate
order: 1
---

# Validation Basics

VeeValidate offers many ways to do form validation, this tutorial will teach you how to do basic form validation using the simplest approach.

## What are we building

In this tutorial, we will be building a "sign up newsletter" form where the user would have to fill a field to complete their sign-up.

## Prerequisites

You will need to be familiar with HTML and a good understanding of modern JavaScript like arrow functions and ES modules, also you will need to have a basic understanding of Vue's scoped slots feature.

Also to make it clear, this tutorial code snippets are formatted into steps and to avoid repetitive code, any unchanged snippets in-between steps will be collapsed as comments.

## Setup

It is preferable to use a local development environment to follow along, make sure to have the following:

1. Prepare a Vue 3.x project using the [`vue-cli`](https://cli.vuejs.org/)

<details>

<summary>Detailed Steps</summary>

If not already prepared, install the New Vue CLI

```sh
npm install -g @vue/cli@next
```

Using the `vue-cli`, create a new project and choose Vue 3 template:

```sh
vue create vee-validate-tutorial
```

</details>

2. Add `vee-validate` to your project

```sh
yarn add vee-validate

# or

npm install vee-validate
```

3. Cleanup the contents of `App.vue`, it should look like the following:

```vue
<template>
  <div id="app"></div>
</template>

<script>
export default {};
</script>
```

And that's it, now you have an empty Vue project and vee-validate installed.

## Building the Form

First, start by adding some markup, you can start by having a `form` wrapping a few `input` elements:

```vue
<template>
  <div id="app">
    <form>
      <input type="email" name="email" />

      <button>Sign up for newsletter</button>
    </form>
  </div>
</template>

<script>
export default {};
</script>
```

So far so good, try filling the `email` field with a dummy value like `hello`. Then click the submit button once and see what happens.

You will notice that the form submits and you should see `?email=` added in your URL in the address bar, it should have the sme value that you entered in the `email` field.

This is the native HTML form submission behavior. Usually in modern applications you don't want that and you prefer to handle submission with JavaScript.

Add a `submit` event handler that prevents the native form submission, we will use `onSubmit` function to handle our form submission.

```vue{3,13-17}
<template>
  <div id="app">
    <form @submit.prevent="onSubmit">
      <input type="email" name="email" />

      <button>Sign up for newsletter</button>
    </form>
  </div>
</template>

<script>
export default {
  methods: {
    onSubmit() {
      console.log('Submitted');
    },
  },
};
</script>
```

Now type anything in the `email` field and click submit. You will notice a couple of things:

1. The word "Submitted" being logged to the console.
2. The value you entered wasn't added to the address bar, this means you've prevented the default submission behavior.

So far so good, but the form isn't that useful unless it takes the correct data from the user. So let's add validation to the form.

## Adding Validation

VeeValidate exposes 2 components that you will be using regularly, the `<Field>` and `<Form>` are components that will help you validate your forms and inputs.

Import them and register them on the Vue component, then replace the following elements with the vee-validate component:

- Replace `<input>` with `<Field />` while keeping the same attributes.
- Replace `<form>` with `<Form />` but remove the `.prevent` modifier.

```vue{3,4,7,12,15-18}
<template>
  <div id="app">
    <Form @submit="onSubmit">
      <Field name="email" type="email" />

      <button>Sign up for newsletter</button>
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
      console.log('Submitting :(');
    },
  },
};
</script>
```

Change the `onSubmit` method so it receives an argument called `values` and logs it:

```js{7-9}
export default {
  components: {
    Form,
    Field,
  },
  methods: {
    onSubmit(values) {
      console.log(values);
    },
  },
};
```

Try typing anything into the `email` field and click submit. You will see form values being logged into the console with the value you entered, this means vee-validate extracted the form values for you and passed it to your `onSubmit` handler. Now all that remains is to add the validation rules.

There are multiple ways to define rules with VeeValidate, the most straightforward way is to use regular Vue methods.

Create a function called `validateEmail` that receives 1 argument called `value`.

It should look like this:

```vue{23-37}
<template>
  <div id="app">
    <Form @submit="onSubmit">
      <Field name="email" type="email" />

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
      console.log(JSON.stringify(values, null, 2));
    },
    validateEmail(value) {
      // if the field is empty
      if (!value) {
        return 'This field is required';
      }

      // if the field is not a valid email
      const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!regex.test(value)) {
        return 'This field must be a valid email';
      }

      // All is good
      return true;
    },
  },
};
</script>
```

The `validateEmail` function makes sure the `email` field is both required and is a valid email.

Now you need to tell the `<Field name="email />` component to use that function as a validation rule.

You can do that by passing the `validateEmail` function to the `rules` prop on the `Field` component:

```vue{4}
<template>
  <div id="app">
    <Form @submit="onSubmit">
      <Field name="email" type="email" :rules="validateEmail" />

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
      console.log(JSON.stringify(values, null, 2));
    },
    validateEmail(value) {
      // if the field is empty
      if (!value) {
        return 'This field is required';
      }

      // if the field is not a valid email
      const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!regex.test(value)) {
        return 'This field must be a valid email';
      }

      // All is good
      return true;
    },
  },
};
</script>
```

Try testing these scenarios:

1. Type a random non-email value like `example` into the `email` field and try clicking submit.
2. Type a valid email like `hello@example.com` into the `email` field and try clicking submit.

In the first case you will notice that nothing was logged to the console, while in the second case you will see your form values being logged into the console same as before.

This means validation is working and vee-validate is not executing your `onSubmit` handler until the `email` field validation passes.

The last step is to show error messages that you already return in the `validateEmail` so that your users have a better understanding of what is going on and why the form isn't submitting.

## Displaying Error Messages

To display the error message, you will use the `ErrorMessage` component.

First, grab the `ErrorMessage` component from `vee-validate` and register it in your component:

```js{1,7}
import { Field, Form, ErrorMessage } from 'vee-validate';

export default {
  components: {
    Field,
    Form,
    ErrorMessage,
  },
};
```

Then add the `<ErrorMessage />` component to your template, passing a `name` prop that matches the `<Field />` name prop which is `"email"`.

```vue{5}
<template>
  <div id="app">
    <Form @submit="onSubmit">
      <Field name="email" type="email" :rules="validateEmail" />
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
      console.log(values, null, 2);
    },
    validateEmail(value) {
      // if the field is empty
      if (!value) {
        return 'This field is required';
      }

      // if the field is not a valid email
      const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!regex.test(value)) {
        return 'This field must be a valid email';
      }

      // All is good
      return true;
    },
  },
};
</script>
```

If you try the form now without entering anything you will see the required error message appear. Try filling anything that's not an email and notice the invalid email message appearing instead.

Now you have successfully created a simple form and implemented validation and submission.

You can checkout the finished code in action:

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="logaretm" data-slug-hash="yLeraZR" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Tutorial - Basics">
  <span>See the Pen <a href="https://codepen.io/logaretm/pen/yLeraZR">
  Tutorial - Basics</a> by Abdelrahman Awad (<a href="https://codepen.io/logaretm">@logaretm</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

There is a lot more you can do with vee-validate, there are other ways and features you can use to clean up your form validation logic. Here are a few things that you can do with vee-validate:

- Declare rules globally and use them in a Laravel-like syntax
- Using 3rd-party libraries like `yup` to validate
- Doing form-level validation using a validation schema
- Advanced rendering of your inputs and forms using scoped-slots
- Component-less validation with the composition API
- Generating localized messages

You can visit the [guide section](/guide) to begin learning more about vee-validate.
