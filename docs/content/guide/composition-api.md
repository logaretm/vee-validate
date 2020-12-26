---
title: Composition API
description: Using `useField` and `useForm` to compose validation into your inputs
order: 7
---

# Composition API

vee-validate is built from the ground up with the composition API through a collection of functions, mainly the `useField` and `useForm` functions. Internally the `<Form />` and `<Field />` components actually use the composition functions under the hood.

Meaning you can create your own custom input and form components and they will be treated the same as `<Form />` and `<Field />` components. You can mix them together and use a `Form` component with any other custom component that uses `useField` and vice versa.

All of the features discussed previously in the guides with `Form` or `Field` components are supported in a similar manner with `useField` and `useForm`.

Aside from `useField` and `useForm`, vee-validate offers simpler utility composable functions that you can use to build very specific and specialized components that contribute to your form experience, they are mentioned later on in this page.

## When to use composition API

Before you go through the details of `useField` and `useForm`, you first need to understand when you should be using the composition functions over the components.

vee-validate **does not** deal with arbitrary values, meaning you should not (while you could) use the composition API as means to force vee-validate to be an imperative validation library. To validate arbitrary values, you can use other libraries or validation tools, like `yup` or `validator.js` which you are likely to use anyways for your validation rules.

To re-iterate, vee-validate is all about forms and inputs. Not values, so if you need a piece of data validated, you need to express it as a form field.

Now that we covered what vee-validate is about, when should you use the composition API over the declarative components?

The declarative components cover tons of use-cases and they are extremely easy to use, for most forms you should use them. They are especially useful if you are working with native HTML input elements, or generally do not have heavy UI customization.

When your input's complexities grow, you might then consider using `useField` and `useForm`. While they require more labor to integrate into your inputs, they give you access to the same logical parts of vee-validate's validation at a much lower level.

It's up to you what to do with what `useField` and `useForm` give you, for example `useField` doesn't handle input events automatically, you will need to do that. And it doesn't handle blur events, you still need to do that as well.

To summarize, **the composition API is a great power with a great responsibility.**

## useField()

`useField` is a composable function that gives you access to the same parts that power the `<Field />` component, it is up to you how you are going to use them. This is an example of a field that validates when it's value change:

```vue
<template>
  <div>
    <input type="text" v-model="value" />
    <span>{{ errorMessage }}</span>
  </div>
</template>

<script>
import { useField } from 'vee-validate';

export default {
  name: 'MyInput',
  setup() {
    function validate(value) {
      if (!value) {
        return 'This field is required';
      }

      if (value.length < 3) {
        return 'Must contain more than 3 characters';
      }

      return true;
    }

    const { value, errorMessage } = useField('fieldName', validate);

    return {
      value,
      errorMessage,
    };
  },
};
</script>
```

The `value` exposed by the `useField` function is a mutable `Ref` that you can update the field's value by setting it. Whenever the value changes, the `useField` function will re-run your validators against the new value and will report back any errors with the `errorMessage`.

You can use the same exact validators as the previous guides have covered, the previous sample covered **validation functions**.

You can also use **[yup](https://github.com/jquense/yup) validators**

```js
import { useField } from 'vee-validate';
import * as yup from 'yup';

const { ... } = useField('fieldName', yup.string().required().min(3)));
```

You can also use string rules with [global validators](/guide/global-validators)

```js
import { useField } from 'vee-validate';

const { ... } = useField('fieldName', 'required|min:3');
```

There are tons of stuff you can do with `useField`, but always keep in mind that you should use it when building custom input components. Do not just use it to validate values because while you can do that just fine, it will prove difficult once you have more than a few values to validate.

For more information check the [useField API reference](/api/use-field), and the [examples section](/examples/custom-inputs).

## useForm()

The `useForm` function allows you to create **"Form contexts"** for your component and it's children. Meaning any child component that uses `<Field />` components or using `useField` will be automatically grouped as form inputs for this form.

The `useForm` function accepts the same props accepted by the `<Form />` component

The following snippet extracts the `validate` function from `useForm`.

```js
const { validate } = useForm();

// Validates all child `Field` or `useField`
validate();
```

The `useForm` component is only useful if you plan to build your own form component and have it behave similarly to vee-validate's `<Form />` component.

The most notable functionality you can use from `useForm` is submission handlers, you can use the `handleSubmit` function to create form submission handlers.

```vue
<template>
  <form @submit="onSubmit">...</form>
</template>

<script>
import { useForm } from 'vee-validate';

export default {
  name: 'MyForm',
  setup() {
    const { handleSubmit } = useForm();
    // create an `onSubmit` function that can be used as a submission handler.
    // The callback function will be executed only if the form is valid
    // The submission handler receives the `values` and `actions` arguments just like the `<Form />` component
    const onSubmit = handleSubmit((values, actions) => {
      // handle data submission to API
      alert(JSON.stringify(values, null, 2));

      // perform some actions
      actions.resetForm();
    });

    return {
      onSubmit,
    };
  },
};
</script>
```

The submission handlers created using this way will automatically prevent the default form submission behavior which is typical in most modern JavaScript applications, if you still need to submit the form using the default behavior then use `submitForm` instead of `handleSubmit`.

You can also provide validation schemas to your fields with `useForm`, this example uses a yup schema:

```js
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const { ... } = useForm({
  validationSchema: yup.object().shape({
    email: yup.string().required().email(),
    password: yup.string().required().min(3),
  })
});
```

You can do a lot more than that with `useForm`, check the [useForm API reference](/api/use-form) for more information.

## Composition Helpers

These are a collection of simple functions that you can use to opt-in specific parts of vee-validate features like form state and various actions you can perform on fields and forms.

Here are a few examples of what you can build with these functions:

- A custom submission progress component
- A custom error message component.
- A form validity indicators
- reset buttons or submit buttons

Here is a list of the functions available that you can use:

- `useFieldError` Gives access to a single field's first error message
- `useFormErrors` Gives access to the entire error bag of the form
- `useIsFieldDirty` If a field is dirty
- `useIsFormDirty` If the form is dirty (form contains at least one dirty field)
- `useIsFieldTouched` If a field is touched
- `useIsFormTouched` If the form is touched (form contains at least one touched field)
- `useIsFieldValid` If a field is valid
- `useIsFormValid` If all fields are **validated and valid**
- `useValidateField` Returns a function that validates a specific field
- `useValidateForm` Returns a function that validates the entire form
- `useResetForm` Resets the form to its initial state
- `useSubmitForm` Creates a submission function that validates and submits the form (even if no `form` element is involved)
- `useIsSubmitting` If the form is currently submitting
- `useSubmitCount` The number of times the user attempted to submit the form
- `useFieldValue` Returns a specific fields' current value
- `useFormValues` Returns the current form field values

For more information about the functions, you can head over to the [API reference and check them out](/api/composition-helpers).
