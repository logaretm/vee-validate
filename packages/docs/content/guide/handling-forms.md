---
title: Handling Forms
description: Handling form state and submissions
---

# Handling Forms

vee-validate offers many helpers to handle form submissions, resets and DX to make your forms much easier to reason about and less of a burden to maintain. The `Form` component handles the following form cases:

<div class="features">

- Submitting forms with JavaScript listeners (AJAX)
- Submitting forms using the classic/native approach (page reload)
- Handling form resets

</div>

## Form Values

So far you probably noticed we didn't use `v-model` once in the examples. This is because in most cases you don't actually need the model values until you submit them to your API or not at all if you are submitting an HTML form without JavaScript.

Having to create models just to be able to reference them later is redundant and vee-validate goes around this by creating an internal model for the `<Field />` field component instances and tracks them and keeps them in sync with the input. You can still use `v-model` if you need it but vee-validate doesn't require it.

You may access your form's values using either the `Form` component scoped slot prop called "values":

```vue
<template>
  <Form v-slot="{ values }" :validation-schema="schema">
    <Field name="email" as="input">
    <Field name="name" as="input" type="email">
    <Field name="password" as="input" type="password">

    <!-- print form values -->
    <pre>
      {{ values }}
    </pre>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate';
import * as yup from 'yup';

export default {
  components: {
    Form,
    Field
  },
  data() {
    const schema = yup.object().shape({
      email: yup.string().required().email(),
      name: yup.string().required(),
      password: yup.string().required().min(8),
    });

    return {
      schema
    };
  }
};
</script>
```

You will rarely need to access the form values inside the template, but its there if you ever need it. The more interesting approach is that vee-validate follows the assumption that most likely you will need the form values at the submission phase.

So if you were to add a `submit` handler on the `<Form />` component, vee-validate will automatically pass the form values to your handler as the first argument.

```vue
<template>
  <Form @submit="onSubmit" :validation-schema="schema">
    <Field name="email" as="input">
    <Field name="name" as="input" type="email">
    <Field name="password" as="input" type="password">

    <button>Submit</button>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate';
import * as yup from 'yup';

export default {
  components: {
    Form,
    Field
  },
  data() {
    const schema = yup.object().shape({
      email: yup.string().required().email(),
      name: yup.string().required(),
      password: yup.string().required().min(8),
    });

    return {
      schema,
    };
  },
  methods: {
    onSubmit(values) {
      // Submit values to API...
    }
  }
};
</script>
```

## Handling Submissions

vee-validate exposes useful defaults to help you handle form submissions whether you submit them using JavaScript or native HTML submissions, in most cases you would like to make sure all your fields are valid before you submit the form, this is done for you by default.

Consider the last example, if you tried submitting the form, it won't be submitted unless all fields are valid. When rendering a form using the `as` prop, vee-validate will automatically listen for the `submit` event and prevent the execution of any `submit` listener you may have on the form.

If you have a `submit` listener on the `Form` component, vee-validate assumes you will be handling submissions via JavaScript (AJAX) and automatically calls `event.preventDefault()` for you and once the form is finished validating and turned out to be valid it will pass all the values of the `<Field />` components.

But in the case when you don't have a `submit` listener on your form, vee-validate assumes that the form will be submitted using the native HTML submission that causes the page to "reload". However vee-validate will make sure the form is not submitted unless all fields are valid, here is an example:

```vue
<Form method="post" action="/api/users" :validation-schema="schema">
  <Field name="email" as="input">
  <Field name="name" as="input" type="email">
  <Field name="password" as="input" type="password">

  <button>Submit</button>
</Form>
```

## Manually Handling Submissions

If you have complex markup requirements in your forms, you can use any of those `<Form />` component slot props:

- `handleSubmit`: automatically prevents native submission at all times, use for AJAX submissions
- `submitForm`: prevents native submissions as long as the form is invalid, use for native submissions
- `validate`: triggers validation on all fields belonging to the form

### Using handleSubmit

The `handleSubmit` slot prop is probably the most common method you will use to handle form submissions manually, it accepts a callback that will be executed with the form values if the form is valid.

```vue
<template>
  <VeeForm v-slot="{ handleSubmit }" :validation-schema="schema">
    <form @submit="handleSubmit(onSubmit)">
      <Field name="email" as="input">
      <Field name="name" as="input" type="email">
      <Field name="password" as="input" type="password">

      <button>Submit</button>
    </form>
  </VeeForm>
</template>

<script>
import { Form as VeeForm, Field } from 'vee-validate';
import * as yup from 'yup';

export default {
  components: {
    // Rename form to avoid confusion with native `form`
    VeeForm,
    Field
  },
  data() {
    const schema = yup.object().shape({
      email: yup.string().required().email(),
      name: yup.string().required(),
      password: yup.string().required().min(8),
    });

    return {
      schema,
    };
  },
  methods: {
    onSubmit(values) {
      // Submit values to API...
      console.log(values);
    }
  }
};
</script>
```

### Using submitForm

Alternatively if you plan to submit forms natively which will cause a page "reload" then use `submitForm` as an event handler:

```vue
<template>
  <VeeForm v-slot="{ submitForm }" :validation-schema="schema">
    <form @submit="submitForm" method="post" action="/api/users/">
      <Field name="email" as="input">
      <Field name="name" as="input" type="email">
      <Field name="password" as="input" type="password">

      <button>Submit</button>
    </form>
  </VeeForm>
</template>

<script>
import { Form as VeeForm, Field } from 'vee-validate';
import * as yup from 'yup';

export default {
  components: {
    // Rename form to avoid confusion with native `form`
    VeeForm,
    Field
  },
  data() {
    const schema = yup.object().shape({
      email: yup.string().required().email(),
      name: yup.string().required(),
      password: yup.string().required().min(8),
    });

    return {
      schema
    };
  }
};
</script>
```

This will prevent submitting the form until all fields are valid.

### Using validate()

You can validate the form without submissions using the `validate()` slot prop function:

```vue
<Form v-slot="{ validate }" :validation-schema="schema">
  <Field name="email" as="input">
  <Field name="name" as="input" type="email">
  <Field name="password" as="input" type="password">

  <button @click="validate">Submit</button>
</Form>
```

That form doesn't render a `form` tag, so vee-validate doesn't handle submissions for those group of fields. But you can still validate them using the `validate` function present on the `Form` component slot props.

## Handling Resets

vee-validate also handles form resets in similar way to submissions, consider this example:

```vue
<template>
  <Form :validation-schema="schema">
    <Field name="email" as="input">
    <Field name="name" as="input" type="email">
    <Field name="password" as="input" type="password">

    <button type="Submit">Submit</button>
    <button type="reset">Reset</button>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate';
import * as yup from 'yup';

export default {
  components: {
    Form,
    Field
  },
  data() {
    const schema = yup.object().shape({
      email: yup.string().required().email(),
      name: yup.string().required(),
      password: yup.string().required().min(8),
    });

    return {
      schema,
    };
  }
};
</script>
```

If you try resetting the form you see that vee-validate is automatically resetting the values to their initial state and removes any form errors as well. Form reset is handled automatically if you are using the `as` prop to render a `form` element.

Alternatively if you plan to use the scoped slot for complex markup, you can use the `handleReset` slot prop function to trigger the reset manually:

```vue
<Form v-slot="{ handleReset }" :validation-schema="schema">
  <Field name="email" as="input">
  <Field name="name" as="input" type="email">
  <Field name="password" as="input" type="password">

  <button type="button" @click="handleReset">Reset</button>
</Form>
```

## Initial Values

Since with vee-validate you don't use `v-model` often to track your values, the `Form` component allows you to define the starting values for your fields, by default all fields start with `undefined` as a value.

Using the `initialValues` prop you can send an object that contains the field names as keys and their values:

```vue
<template>
  <Form :validation-schema="schema" :initial-values="formValues">
    <Field name="email" as="input">
    <Field name="name" as="input" type="email">
    <Field name="password" as="input" type="password">

    <button type="Submit">Submit</button>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate';
import * as yup from 'yup';

export default {
  components: {
    Form,
    Field
  },
  data() {
    // Validation Schema
    const schema = yup.object().shape({
      email: yup.string().required().email(),
      name: yup.string().required(),
      password: yup.string().required().min(8),
    });

    // Initial values
    const formValues = {
      email: 'example@example.com',
      name: 'John Smith',
      password: 'P@$$w0Rd'
    };

    return {
      schema,
      formValues
    };
  }
};
</script>
```

Doing so will trigger initial validation on the form and it will generate messages for fields that fail the initial validation.
