---
title: Handling Forms
description: Handling form state and submissions
order: 3
next: guide/components/nested-objects-and-arrays
---

# Handling Forms

vee-validate offers many helpers to handle form submissions, resets, and DX to make your forms much easier to reason about and less of a burden to maintain. The `Form` component handles the following form cases:

<div class="features">

- Submitting forms with JavaScript listeners (AJAX)
- Submitting forms using the classic/native approach (page reload)
- Handling form resets

</div>

## Form Values

So far you probably noticed we didn't use `v-model` once in the examples. This is because in most cases you don't need the model values until you submit them to your API or not at all if you are submitting an HTML form without JavaScript.

Having to create models just to be able to reference them later is redundant and vee-validate goes around this by creating an internal model for the `<Field />` field component instances and tracks them and keeps them in sync with the input. You can still use `v-model` if you need it but vee-validate doesn't require it.

You may access your form's values using the `values` scoped slot prop on the `Form` component:

```vue
<template>
  <Form v-slot="{ values }">
    <Field name="email" type="email" />
    <Field name="password" type="password" />

    <!-- print form values -->
    <pre>{{ values }}</pre>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate';

export default {
  components: {
    Form,
    Field,
  },
  // no data, no v-model!!!
};
</script>
```

You will rarely need to access the form values inside the template, but it is there if you ever need it. What's interesting is that vee-validate follows the assumption that most likely you will need the form values at the submission phase.

So if you were to add a `submit` handler on the `<Form />` component, vee-validate will automatically pass the form values to your handler as the first argument.

```vue
<template>
  <Form @submit="onSubmit" :validation-schema="schema">
    <Field name="email" type="email" />
    <ErrorMessage name="email" />

    <Field name="password" type="password" />
    <ErrorMessage name="password" />

    <button>Submit</button>
  </Form>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object({
      email: yup.string().required().email(),
      password: yup.string().required().min(8),
    });

    return {
      schema,
    };
  },
  methods: {
    onSubmit(values) {
      // Submit values to API...
      alert(JSON.stringify(values, null, 2));
    },
  },
};
</script>
```

## Handling Submissions

vee-validate exposes useful defaults to help you handle form submissions whether you submit them using JavaScript or native HTML submissions, in most cases, you would like to make sure all your fields are valid before you submit the form, this is done for you by default.

Consider the last example, if you tried submitting the form, it won't be submitted unless all fields are valid. When rendering a form using the `as` prop, vee-validate will automatically listen for the `submit` event and prevent the execution of any `submit` listener you may have on the form.

If you have a `submit` listener on the `Form` component, vee-validate assumes you will be handling submissions via JavaScript (AJAX) and automatically calls `event.preventDefault()` for you and once the form is finished validating and turned out to be valid it will pass all the values of the `<Field />` components.

But in the case when you don't have a `submit` listener on your form, vee-validate assumes that the form will be submitted using the native HTML submission that causes the page to "reload". However vee-validate will make sure the form is not submitted unless all fields are valid, here is an example:

```vue
<Form method="post" action="/api/users" :validation-schema="schema" />
  <Field name="email" />
  <Field name="name" type="email" />
  <Field name="password" type="password" />

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
  <VeeForm v-slot="{ handleSubmit }" :validation-schema="schema" as="div">
    <form @submit="handleSubmit($event, onSubmit)">
      <Field name="email" type="email" />
      <ErrorMessage name="email" />

      <Field name="password" type="password" />
      <ErrorMessage name="password" />

      <button>Submit</button>
    </form>
  </VeeForm>
</template>

<script>
import { Form as VeeForm, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

export default {
  components: {
    // Rename form to avoid confusion with native `form`
    VeeForm,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object({
      email: yup.string().required().email(),
      password: yup.string().required().min(8),
    });

    return {
      schema,
    };
  },
  methods: {
    onSubmit(values) {
      // Submit values to API...
      alert(JSON.stringify(values, null, 2));
    },
  },
};
</script>
```

### Using submitForm

Alternatively if you plan to submit forms natively which will cause a page "reload" then use `submitForm` as an event handler:

```vue
<template>
  <VeeForm v-slot="{ submitForm }" :validation-schema="schema" as="div">
    <form @submit="submitForm" method="post" action="/api/users/">
      <Field name="email" type="email" />
      <ErrorMessage name="email" />

      <Field name="password" type="password" />
      <ErrorMessage name="password" />

      <button>Submit</button>
    </form>
  </VeeForm>
</template>

<script>
import { Form as VeeForm, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

export default {
  components: {
    // Rename form to avoid confusion with native `form`
    VeeForm,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object({
      email: yup.string().required().email(),
      password: yup.string().required().min(8),
    });

    return {
      schema,
    };
  },
};
</script>
```

This will prevent submitting the form until all fields are valid.

### Using validate()

You can validate the form without submissions using the `validate()` slot prop function:

```vue
<Form v-slot="{ validate }" :validation-schema="schema">
  <Field name="email" type="email" />
  <ErrorMessage name="email" />

  <Field name="password" type="password" />
  <ErrorMessage name="password" />

  <button type="button" @click="validate">Submit</button>
</Form>
```

That form doesn't render a `form` tag, so vee-validate doesn't handle submissions for that group of fields. But you can still validate them using the `validate` function present on the `Form` component slot props.

## Submission Progress

Quite often you need to show your users a submission indicator, or you might want to disable the submit button entirely until the submission attempt is done. The `Form` component offers an `isSubmitting` slot prop that you can use to show such UI indicators.

The `isSubmitting` state will be set to `true` once the validation of the form starts (as a result of a submit event) and will keep track of the submission handler you passed to either `onSubmit` or until it calls `submitForm`. If the submission handler throws any errors or completes successfully it will be set to `false` afterward.

Here is small example:

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="html,result" data-user="logaretm" data-slug-hash="xxVZOGX" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="vee-validate v4 isSubmitting">
  <span>See the Pen <a href="https://codepen.io/logaretm/pen/xxVZOGX">
  vee-validate v4 isSubmitting</a> by Abdelrahman Awad (<a href="https://codepen.io/logaretm">@logaretm</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

<doc-tip title="isSubmitting and validate()">

Note that calling `validate` from the `Form` slot props will not cause the `isSubmitting` state to change, it will only change if either `submitForm` or `handleSubmit` are called or when a submit event is triggered.

</doc-tip>

<doc-tip title="submitCount">

The `Form` component exposes a `submitCount` state that you can use to track the number of submission attempts done by the user. For more information check the [API Reference](/api/form).

</doc-tip>

## Handling Invalid Submissions

In case you want to perform some logic after a form fails to submit due to validation errors (e.g: focusing the first invalid field), you can listen for the `onInvalidSubmit` event emitted by the `<Form />` component.

```vue
<template>
  <Form @submit="onSubmit" :validation-schema="schema" @invalid-submit="onInvalidSubmit">
    <Field name="email" type="email" />
    <ErrorMessage name="email" />

    <Field name="password" type="password" />
    <ErrorMessage name="password" />

    <button>Submit</button>
  </Form>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object({
      email: yup.string().required().email(),
      password: yup.string().required().min(8),
    });

    return {
      schema,
    };
  },
  methods: {
    onSubmit(values) {
      // Submit values to API...
      alert(JSON.stringify(values, null, 2));
    },
    onInvalidSubmit({ values, errors, results }) {
      console.log(values); // current form values
      console.log(errors); // a map of field names and their first error message
      console.log(results); // a detailed map of field names and their validation results
    },
  },
};
</script>
```

Specifying a `onInvalidSubmit` prop or `@invalid-submit` will run your handler if you submit your form using either `handleSubmit` or the regular form submit event but not the `submitForm` function.

## Initial Values

Since with vee-validate you don't have to use `v-model` to track your values, the `Form` component allows you to define the starting values for your fields, by default all fields start with `undefined` as a value.

Using the `initialValues` prop you can send an object that contains the field names as keys and their values:

```vue
<template>
  <Form :validation-schema="schema" :initial-values="formValues">
    <Field name="email" type="email" />
    <ErrorMessage name="email" />

    <Field name="password" type="password" />
    <ErrorMessage name="password" />

    <button type="Submit">Submit</button>
  </Form>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    // Validation Schema
    const schema = yup.object({
      email: yup.string().required().email(),
      password: yup.string().required().min(8),
    });

    // Initial values
    const formValues = {
      email: 'example@example.com',
      password: 'P@$$w0Rd',
    };

    return {
      schema,
      formValues,
    };
  },
};
</script>
```

Doing so will trigger initial validation on the form and it will generate messages for fields that fail the initial validation. You can still use `v-model` on your fields to define model-based initial values.

You can use `validateOnMount` prop present on the `<Form />` component to force an initial validation when the component is mounted.

Note that **only the non-dirty fields will be updated**. In other words, **only the fields that were not manipulated by the user will be updated**. For information on how to set the values for all fields regardless of their dirty status check the following [Setting Form Values section](#setting-form-values)

<doc-tip>

It's generally recommended that you provide the `initialValues`, this is because vee-validate cannot assume a reasonable initial value for your fields other than `undefined` which may cause unexpected behavior when using a 3rd-party validator that does not deal with `undefined`.

</doc-tip>

## Setting Form Values

You can set any field's value using either `setFieldValue` or `setValues`, both methods are exposed on the `<Form />` component scoped slot props, and as component instance methods.

You can call them with template `$refs` and for an added convenience you can call them in the submit handler callback.

**Using scoped slot props**

```vue
<Form v-slot="{ setFieldValue, setValues }">
  <Field name="email"  />
  <ErrorMessage name="email" />

  <Field name="password"  />
  <ErrorMessage name="password" />

  <button type="button" @click="setFieldValue('email', 'test')">Set Field Value</button>
  <button type="button" @click="setValues({ email: 'test', password: 'test12' })">
    Set Multiple Values
  </button>
</Form>
```

**Using submit callback**

```vue
<template>
  <Form @submit="onSubmit">
    <Field name="email" />
    <ErrorMessage name="email" />

    <Field name="password" />
    <ErrorMessage name="password" />

    <button>Submit</button>
  </Form>
</template>

<script>
export default {
  // ...
  methods: {
    onSubmit(values, actions) {
      // Submit the values...

      // set single field value
      actions.setFieldValue('email', 'ummm@example.com');

      // set multiple values
      actions.setValues({
        email: 'ummm@example.com',
        password: 'P@$$w0Rd',
      });
    },
  },
};
</script>
```

**Using template `$refs`**

```vue
<template>
  <Form @submit="onSubmit" ref="myForm">
    <Field name="email" />
    <ErrorMessage name="email" />

    <Field name="password" />
    <ErrorMessage name="password" />

    <button>Submit</button>
  </Form>
</template>

<script>
export default {
  // ...
  methods: {
    onSubmit(values) {
      // Submit the values...

      // set single field value
      this.$refs.myForm.setFieldValue('email', 'ummm@example.com');

      // set multiple values
      this.$refs.myForm.setValues({
        email: 'ummm@example.com',
        password: 'P@$$w0Rd',
      });
    },
  },
};
</script>
```

Note that setting any field's value using this way will trigger validation

## Submission Behavior

vee-validate does the following when you submit a form rendered by `<Form />` or when calling either `handleSubmit` or `submitForm`:

### Before validation stage

- Sets all fields `touched` meta to `true`
- Sets `isSubmitting` form state to `true`
- Increments the `submitCount` form state by `1`

### Validation stage

- Sets form and individual fields meta `pending` to `true` to indicate validation is in progress
- Runs the validation function/schema/rule against the current form values asynchronously
- Checks for any errors in the validation result
  - If there are errors then it will skip the next stage and update the validation state (meta, errors) for the form and fields
  - If there aren't any errors then it will set the `pending` meta flag to `false` and proceed to the next stage

### After validation stage

- Calls the `@submit` handler you specified, or calls the `handleSubmit` callback you provided.
- After the callbacks in either method finish (it will wait if the result is asynchronous), then it will set `isSubmitting` to `false`

Note that there isn't a need to have `isSubmitting` set back to false if you've used `submitForm`, as this submission method will perform a full-page refresh (native forms behavior).

## Handling Resets

vee-validate also handles form resets in a similar way to submissions. When resetting the form, all fields' errors and meta flags will be reset to their original state, including the fields' values.

Form reset is handled automatically if you are using the `as` prop to render a `form` element, like shown in this example:

```vue
<template>
  <Form :validation-schema="schema">
    <Field name="email" type="email" />
    <ErrorMessage name="email" />

    <Field name="password" type="password" />
    <ErrorMessage name="password" />

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
    Field,
  },
  data() {
    const schema = yup.object({
      email: yup.string().required().email(),
      password: yup.string().required().min(8),
    });

    return {
      schema,
    };
  },
};
</script>
```

Alternatively if you plan to use the scoped slot for complex markup, you can use the `handleReset` slot prop function to trigger the reset manually:

```vue
<Form v-slot="{ handleReset }" :validation-schema="schema">
  <Field name="email" type="email" />
  <ErrorMessage name="email" />

  <Field name="password" type="password" />
  <ErrorMessage name="password" />

  <button type="button" @click="handleReset">Reset</button>
</Form>
```

### Resetting Forms After Submit

Usually you will reset your forms after a successful submission, the `onSubmit` handler receives an additional `FormActions` object in the second argument that allows you do some actions on the form after submissions, this is the shape of the `FormActions` object:

```ts
export interface FormActions {
  setFieldValue: (field: T, value: any) => void;
  setFieldError: (field: string, message: string | undefined) => void;
  setErrors: (fields: Partial<Record<string, string | undefined>>) => void;
  setValues: (fields: Partial<Record<T, any>>) => void;
  setFieldTouched: (field: string, isTouched: boolean) => void;
  setTouched: (fields: Partial<Record<string, boolean>>) => void;
  resetForm: (state?: Partial<FormState>) => void;
}
```

This is an example of using the form actions object to reset the form:

```vue
<template>
  <Form @submit="onSubmit" :validation-schema="schema">
    <!-- fields ... -->
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate';
import * as yup from 'yup';

export default {
  components: {
    Form,
    Field,
  },
  data() {
    const schema = yup.object({
      // ...
    });

    return {
      schema,
    };
  },
  methods: {
    onSubmit(values, { resetForm }) {
      console.log(values); // send data to API
      // reset the form and the field values to their initial values
      resetForm();
    },
  },
};
</script>
```

The `resetForm` accepts an optional `state` object that allows you to specify the new initial values for any of the fields state, this is the shape of the `FormState` object:

```ts
interface FormState {
  // any error messages
  errors: Record<string, string>;
  // dirty meta flags
  dirty: Record<string, boolean>;
  // touched meta flags
  touched: Record<string, boolean>;
  // Form Values
  values: Record<string, any>;
}
```

In the following snippet, `resetForm` is used to update the form values to specific ones other than their original values. This is useful if your receive your form state asynchronously

```js
resetForm({
  values: {
    email: 'example@example.com',
    password: '',
  },
});
```

You can also use template `$refs` to reset the form whenever you need:

```vue
<template>
  <Form ref="form" @submit="onSubmit" :validation-schema="schema">
    <!-- fields ... -->

    <button type="Submit">Submit</button>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate';
import * as yup from 'yup';

export default {
  components: {
    Form,
    Field,
  },
  data() {
    const schema = yup.object({
      // ...
    });

    return {
      schema,
    };
  },
  methods: {
    onSubmit(values) {
      console.log(values); // send data to API

      // reset the form
      this.$refs.form.resetForm();
    },
  },
};
</script>
```

## Initial Errors

If you are building a non-SPA application it is very common to pre-fill form errors using server-side rendering, frameworks like Laravel make this very easy to do. vee-validate supports filling the errors initially before any validation is done using the `initialErrors` prop which is present on the `<Form />` component scoped slot props.

The `initialErrors` property accepts an object containing the field names as keys with their corresponding error message string.

```vue
<template>
  <Form :initial-errors="initialErrors">
    <Field name="email" />
    <ErrorMessage name="email" />

    <Field name="password" />
    <ErrorMessage name="password" />

    <button>Submit</button>
  </Form>
</template>

<script>
export default {
  data: () => ({
    initialErrors: {
      email: 'This email is already taken',
      password: 'The password is too short',
    },
  }),
};
</script>
```

<doc-tip>

`initialErrors` are applied once the `Form` component is mounted and is ignored after, so any changes to the `initialErrors` props won't affect the messages.

See the next section for setting errors manually.

</doc-tip>

## Setting Errors Manually

Quite often you will find yourself unable to replicate some validation rules on the client-side due to natural limitations. For example, `unique` email validation is complex to implement on the client-side, which is why the `<Form />` component allows you to set errors manually.

You can set messages for fields by using either `setFieldError` which sets an error message for one field at a time, and the `setErrors` function which allows you to set error messages for multiple fields at once.

Both functions are available on the `Form` component scoped slot props, and also on the `Form` component instance which enables you to use it with template `$refs`, and also for added convenience on the `submit` event handler since it would be the most common place for its usage.

Here are a few snippets showcasing its usage in these various scenarios:

**Using scoped slot props (recommended)**

```vue
<Form v-slot="{ setFieldError, setErrors }">
  <Field name="email"  />
  <ErrorMessage name="email" />

  <Field name="password"  />
  <ErrorMessage name="password" />

  <button type="button" @click="setFieldError('email', 'nope')">Set Single Error</button>
  <button type="button" @click="setErrors({ email: 'nope', password: 'wrong' })">
    Set Multiple Errors
  </button>
</Form>
```

**Using submit callback (recommended)**

```vue
<template>
  <Form @submit="onSubmit">
    <Field name="email" />
    <ErrorMessage name="email" />

    <Field name="password" />
    <ErrorMessage name="password" />

    <button>Submit</button>
  </Form>
</template>

<script>
export default {
  // ...
  methods: {
    onSubmit(values, actions) {
      // Submit the values...

      // set single field error
      actions.setFieldError('email', 'this email is already taken');

      // set multiple errors
      actions.setErrors({
        email: 'this field is already taken',
        password: 'someone already has this password',
      });
    },
  },
};
</script>
```

**Using template `$refs`**

```vue
<template>
  <Form @submit="onSubmit" ref="myForm">
    <Field name="email" />
    <ErrorMessage name="email" />

    <Field name="password" />
    <ErrorMessage name="password" />

    <button>Submit</button>
  </Form>
</template>

<script>
export default {
  // ...
  methods: {
    onSubmit(values) {
      // Submit the values...

      // if API returns errors
      this.$refs.myForm.setFieldError('email', 'this email is already taken');
      this.$refs.myForm.setErrors({
        email: 'this field is already taken',
        password: 'someone already has this password',
      });
    },
  },
};
</script>
```

<doc-tip title="Avoid Template $refs" type="warn">

Always try to avoid using the template `$refs` to gain access to the `<Form />` component methods, template `$refs` are designed to be an escape hatch of sorts when all else fails.

So treat them as such and don't reach out for template `$refs` if you can help it.

</doc-tip>

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
