---
title: Handling Forms
description: Handling form state and submissions
order: 3
next: guide/composition-api/nested-objects-and-arrays
---

# Handling Forms

vee-validate offers many helpers to handle form submissions, resets, and DX to make your forms much easier to reason about and less of a burden to maintain. The `useForm` function allow you to easily handle:

<div class="features">

- Submitting forms with JavaScript listeners (AJAX)
- Submitting forms using the classic/native approach (page reload)
- Handling form resets

</div>

## Handling Submissions

Before we get to submitting forms, there are a few things to keep in mind.

The main goal of the composition API is to enable you to add validation logic to your components and UI. So in real-world examples `useField` will be called in `TextField` and `SelectField` components, while `useForm` will be called in their parent form component.

vee-validate exposes useful defaults to help you handle form submissions whether you submit them using JavaScript or native HTML submissions, in most cases, you would like to make sure all your fields are valid before you submit the form, this is done for you by default.

### JavaScript Submissions (AJAX)

Mainly you will be using the `handleSubmit` function to create submission handlers for your forms, the `handleSubmit` function accepts a callback that receives the final form values, which is very convenient since you don't normally have access to the form values in the parent component.

```vue
<template>
  <form @submit="onSubmit">
    <!-- some fields -->
  </form>
</template>

<script>
import { useForm } from 'vee-validate';

export default {
  setup() {
    const { handleSubmit } = useForm();

    const onSubmit = handleSubmit(values => {
      alert(JSON.stringify(values, null, 2));
    });

    return {
      onSubmit,
    };
  },
};
</script>
```

The `handleSubmit` function will only execute your callback once the returned function (`onSubmit` in the example) if all fields are valid, meaning you don't have to handle if the form is invalid in your logic.

You can call the returned function either manually or via an event like `@submit` and it will validate all the fields and execute the callback if everything passes validation.

As a bonus, when the returned function is used as an event handler (like in the previous example) it will automatically prevent the default submission of the form so you don't need to use the `prevent` modifier like you normally would.

### Full-Page Submissions (non-AJAX)

For non-ajax submissions that trigger a full page reload, you can use the `submitForm` function instead of `handleSubmit`. You normally would use this if you are not building a single-page application.

```vue
<template>
  <form action="/users" method="post" @submit="submitForm">
    <!-- some fields -->
  </form>
</template>

<script>
import { useForm } from 'vee-validate';

export default {
  setup() {
    const { submitForm } = useForm();

    return {
      submitForm,
    };
  },
};
</script>
```

In that case **YOU MUST** use `submitForm` as an event handler for the `submit` event for a native `form` element, otherwise, it would have no effect.

### Handling Invalid Submissions

In case you want to perform some logic after a form fails to submit due to validation errors (e.g: focusing the first invalid field), you can pass a callback as the second argument to `handleSubmit` function.

```vue{14-18,22}
<template>
  <form @submit="onSubmit">
    <!-- some fields -->
  </form>
</template>

<script>
import { useForm } from 'vee-validate';

export default {
  setup() {
    const { handleSubmit } = useForm();

    function onInvalidSubmit({ values, errors, results }) {
      console.log(values); // current form values
      console.log(errors); // a map of field names and their first error message
      console.log(results); // a detailed map of field names and their validation results
    }

    const onSubmit = handleSubmit(values => {
      alert(JSON.stringify(values, null, 2));
    }, onInvalidSubmit);

    return {
      onSubmit,
    };
  },
};
</script>
```

## Submission Progress

Quite often you need to show your users a submission indicator, or you might want to disable the submit button entirely until the submission attempt is done. The `useForm` function exposes an `isSubmitting` ref that you can use.

The `isSubmitting` state will be set to `true` once the validation of the form starts (as a result of a submit event) and will keep track of the submission handler you passed to either `onSubmit` or until it calls `submitForm`. If the submission handler throws any errors or completes successfully it will be set to `false` afterward.

```vue
<template>
  <form @submit="onSubmit">
    <!-- Some fields -->

    <button type="submit" :disabled="isSubmitting">Submit</button>
  </form>
</template>

<script>
import { useForm } from 'vee-validate';

export default {
  setup() {
    const { handleSubmit, isSubmitting } = useForm();

    const onSubmit = handleSubmit(() => {
      // Send stuff to the API
    });

    return {
      onSubmit,
      isSubmitting,
    };
  },
};
</script>
```

## Submit Count

The `useForm` function also exposes a `submitCount` ref that you can use to track the number of submissions attempted by the user. Maybe you want to lock the form if too many attempts were made.

```vue
<template>
  <form v-if="!isTooManyAttempts" @submit="onSubmit">
    <!-- Some fields -->

    <button type="submit" :disabled="isSubmitting">Submit</button>
  </form>

  <p v-else>Sorry but you have attempted to submit too many times</p>
</template>

<script>
import { computed } from 'vue';
import { useForm } from 'vee-validate';

export default {
  setup() {
    const { handleSubmit, submitCount } = useForm();

    const onSubmit = handleSubmit(() => {
      // Send stuff to the API
    });

    // too many attempts
    const isTooManyAttempts = computed(() => {
      return submitCount.value >= 10;
    });

    return {
      onSubmit,
      isTooManyAttempts,
    };
  },
};
</script>
```

## Initial Values

Since with vee-validate you don't have to use `v-model` to track your values, the `useForm` function allows you to define the starting values for your fields, by default all fields start with `undefined` as a value.

Using the `initialValues` option you can send an object that contains the field names as keys and their values:

```vue
<template>
  <form>
    <!-- Some fields -->
  </form>
</template>

<script>
import { useForm } from 'vee-validate';

export default {
  setup() {
    // Initial values
    const formValues = {
      email: 'example@example.com',
      name: 'John Smith',
      password: 'P@$$w0Rd',
    };

    useForm({
      initialValues: formValues,
    });
  },
};
</script>
```

All fields created with `useField` or `<Field />` component will then grab their initial value from the object you passed to `useForm`.

<doc-tip>

It's generally recommended that you provide the `initialValues`, this is because vee-validate cannot assume a reasonable initial value for your fields other than `undefined` which may cause unexpected behavior when using a 3rd-party validator that does not deal with `undefined`.

</doc-tip>

## Setting Form Values

You can set any field's value on the form-level component using either `setFieldValue` or `setValues` returned by `useForm`.

```vue
<template>
  <form>
    <!-- Some fields -->
  </form>
</template>

<script>
import { useForm } from 'vee-validate';

export default {
  setup() {
    const { setFieldValue, setValues } = useForm();

    setFieldValue('fieldName', 'newValue');
    setValues({
      fieldName: 'newValue',
    });
  },
};
</script>
```

## Submission Behavior

vee-validate does the following when calling submission handlers created by `handleSubmit` or when calling `submitForm` as a result of the user submitting the form.

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

- Calls the `handleSubmit` handler you passed
- After the callback finishes (it will wait if the result is asynchronous), then it will set `isSubmitting` to `false`

Note that there isn't a need to have `isSubmitting` set back to false if you've used `submitForm`, as this submission method will perform a full-page refresh (native forms behavior).

## Handling Resets

vee-validate also handles form resets in a similar way to submissions. When resetting the form, all fields' errors and meta flags will be reset to their original state, including the fields' values.

To reset forms you can use the `resetForm` function returned by `useForm`.

```vue
<template>
  <div>
    <input name="email" v-model="value" />

    <button @click="resetForm()">Reset</button>
  </div>
</template>

<script>
import { useForm, useField } from 'vee-validate';

export default {
  setup() {
    const { resetForm } = useForm();
    const { value } = useField('email');

    return {
      resetForm,
      value,
    };
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

### Resetting Forms After Submit

Usually you will reset your forms after a successful submission. For convenience, the `onSubmit` handler receives an additional `FormActions` object in the second argument that allows you do some actions on the form after submissions, this is the shape of the `FormActions` object:

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
  <form @submit="onSubmit">
    <!-- fields ... -->
  </form>
</template>

<script>
import { useForm } from 'vee-validate';

export default {
  setup() {
    const { handleSubmit } = useForm();

    const onSubmit = handleSubmit((values, { resetForm }) => {
      console.log(values); // send data to API
      // reset the form and the field values to their initial values
      resetForm();
    });

    return {
      onSubmit,
    };
  },
};
</script>
```

## Initial Errors

If you are building a non-SPA application it is very common to pre-fill form errors using server-side rendering, frameworks like Laravel and Rails make this very easy to do. vee-validate supports filling the errors initially before any validation is done using the `initialErrors` option.

The `initialErrors` option accepts an object containing the field names as keys with their corresponding error message string.

```vue
<template>
  <form>
    <input type="text" v-model="value" />
    <span>{{ errorMessage }}</span>
  </form>
</template>

<script>
import { useForm, useField } from 'vee-validate';

export default {
  setup() {
    useForm({
      initialErrors: {
        email: 'This email is already taken',
        password: 'The password is too short',
      },
    });

    const { value, errorMessage } = useField('email');
    // add more fields if needed

    return {
      value,
      errorMessage,
    };
  },
};
</script>
```

<doc-tip>

`initialErrors` are applied once the component that called `useForm` is mounted and is ignored after, so any changes to the `initialErrors` props won't affect the messages.

</doc-tip>

## Setting Errors Manually

Quite often you will find yourself unable to replicate some validation rules on the client-side due to natural limitations. For example, `unique` email validation is complex to implement on the client-side, which the ability to set errors manually can be useful.

You can set messages for fields by using either `setFieldError` which sets an error message for one field at a time, and the `setErrors` function which allows you to set error messages for multiple fields at once.

Both functions are available as a return value from `useForm`. In the following example, we check if the server response contains any validation errors and we set them on the fields:

```vue
<template>
  <form @submit="onSubmit">
    <!-- some fields -->
  </form>
</template>

<script>
import { useForm } from 'vee-validate';

export default {
  setup() {
    const { handleSubmit, setFieldError, setErrors } = useForm();

    const onSubmit = handleSubmit(async values => {
      // Send data to the API
      const response = await client.post('/users/');

      // all good
      if (!response.errors) {
        return;
      }

      // set single field error
      if (response.errors.email) {
        setFieldError('email', response.errors.email);
      }

      // set multiple errors, assuming the keys are the names of the fields
      // and the values are the error message(s)
      setErrors(response.errors);
    });

    return {
      onSubmit,
    };
  },
};
</script>
```

Alternatively you can use the `FormActions` passed as the second argument to the `handleSubmit` callback which contains both functions for convenience:

```js
const onSubmit = handleSubmit(async (values, actions) => {
  // Send data to the API
  const response = await client.post('/users/');
  // ...

  // set single field error
  if (response.errors.email) {
    actions.setFieldError('email', response.errors.email);
  }

  // set multiple errors, assuming the keys are the names of the fields
  // and the values is the error message
  actions.setErrors(response.errors);
});
```
