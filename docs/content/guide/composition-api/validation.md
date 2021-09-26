---
title: Validation
description: Field-level and form-level validation and validation behavior and error messages with composition API
order: 2
next: guide/composition-api/handling-forms
---

# Validation

vee-validate handles complex validations in a very easy way, it supports synchronous and asynchronous validation and allows defining rules on the field-level or the form level using validation schemas with built-in support for [yup](https://github.com/jquense/yup).

You will be using the following composition functions to validate your forms:

- `useField`: Creates a form field with its validation state, you will use this inside your custom input components.
- `useForm`: Creates a vee-validate's form context and associates any fields created with `useField` inside the same component or its children with it automatically, which you will use to create custom form components and to manage your fields in general.

There are tons of other composition API functions, check them out in the [API reference](/api/composition-helpers).

This is the most basic example with the composition API, you can create a simple field and validate it in a couple of lines:

<code-sandbox id="basic-example-composition-api-whocv" title="Basic Example - Composition API"> </code-sandbox>

## Field-level Validation

You can define validation rules for your fields using the `useField` composition API function, your rules can be as simple as a function that accepts the current value and returns an error message.

```vue
<template>
  <div>
    <input v-model="value" type="text" />
    <span>{{ errorMessage }}</span>
  </div>
</template>

<script>
import { useField } from 'vee-validate';

export default {
  setup() {
    function isRequired(value) {
      if (value && value.trim()) {
        return true;
      }

      return 'This is required';
    }

    const { errorMessage, value } = useField('fieldName', isRequired);

    return {
      errorMessage,
      value,
    };
  },
};
</script>
```

The validation happens automatically when `value` binding changes, meaning you can use `useField` to trigger validation for any kind of data and not just for inputs.

### Validating fields with yup

yup is a very popular, simple and powerful data validation library for JavaScript, you can use it in combination with vee-validate, You can use [`yup`](https://github.com/jquense/yup) to define your validation rules for that field:

```vue
<template>
  <div>
    <input v-model="value" type="text" />
    <span>{{ errorMessage }}</span>
  </div>
</template>

<script>
import { useField } from 'vee-validate';
import * as yup from 'yup';

export default {
  setup() {
    const { errorMessage, value } = useField('fieldName', yup.string().required().min(8));

    return {
      value,
      errorMessage,
    };
  },
};
</script>
```

For more information on the `useField` function, read [the API reference](/api/use-field).

## Form-level Validation

Instead of providing validations for each field individually which can clutter your code, you can define the validation schema using the `useForm` function by passing a `validationSchema` option. Each field will automatically be associated with it and will be validated accordingly.

A simple validation schema can be an object containing field names as keys and validation functions as the value for those keys.

```vue
<template>
  <div>
    <input name="email" v-model="email" />
    <span>{{ emailError }}</span>

    <input name="password" v-model="password" type="password" />
    <span>{{ passwordError }}</span>
  </div>
</template>

<script>
import { useForm, useField } from 'vee-validate';

export default {
  setup() {
    // Define a validation schema
    const simpleSchema = {
      email(value) {
        // validate email value and return messages...
      },
      name(value) {
        // validate name value and return messages...
      },
    };

    // Create a form context with the validation schema
    useForm({
      validationSchema: simpleSchema,
    });

    // No need to define rules for fields
    const { value: email, errorMessage: emailError } = useField('email');
    const { value: password, errorMessage: passwordError } = useField('password');

    return {
      email,
      emailError,
      password,
      passwordError,
    };
  },
};
</script>
```

### Validation schemas with yup

Fortunately there is already a very neat way to build validation schemas for your forms by using `yup`, it allows you create validation objects like this:

```js
const schema = yup.object({
  email: yup.string().required().email(),
  name: yup.string().required(),
  password: yup.string().required().min(8),
});
```

vee-validate has built-in support for yup schemas, You can pass your schemas to the `useForm` function using the same `validationSchema` option:

```vue
<template>
  <div>
    <input name="email" v-model="email" />
    <span>{{ emailError }}</span>

    <input name="password" v-model="password" type="password" />
    <span>{{ passwordError }}</span>
  </div>
</template>

<script>
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

export default {
  setup() {
    // Define a validation schema
    const schema = yup.object({
      email: yup.string().required().email(),
      password: yup.string().required().min(8),
    });

    // Create a form context with the validation schema
    useForm({
      validationSchema: schema,
    });

    // No need to define rules for fields
    const { value: email, errorMessage: emailError } = useField('email');
    const { value: password, errorMessage: passwordError } = useField('password');

    return {
      email,
      emailError,
      password,
      passwordError,
    };
  },
};
</script>
```

For more information on the `useForm` function, read [the API reference](/api/use-form).

<doc-tip title="Yup Schema Optimizations" type="warn">

There are a couple of optimization caveats when it comes to using `yup` schemas to validate your forms, be sure to check the [best practices guide](/tutorials/best-practices).

</doc-tip>

<doc-tip title="Zod Schema Plugin">

There is an official integration available for [Zod validation](https://github.com/colinhacks/zod) that you can use as a drop-in replacement for `yup`. Check the [zod integration page](/integrations/zod-schema-validation).

</doc-tip>

### Reactive Form Schema

You can have reactive form schemas using `computed` if you are looking to create dynamic schemas using either `yup` or a validation object.

```vue
<template>
  <input name="password" v-model="password" type="password" />
  <span>{{ passwordError }}</span>
</template>

<script>
import { computed, ref } from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

export default {
  setup() {
    const min = ref(0);
    const schema = computed(() => {
      return yup.object({
        password: yup.string().min(min.value),
      });
    });

    // Create a form context with the validation schema
    useForm({
      validationSchema: schema,
    });

    const { value: password, errorMessage: passwordError } = useField('password');

    return {
      password,
      passwordError,
    };
  },
};
</script>
```

When the validation schema changes, only the fields that were validated at least once will be re-validated, the other fields won't be validated to avoid aggressive validation behavior.

## Validation Behavior

<doc-tip>

This is only relevant to the `useField` and `useForm` API

</doc-tip>

By default vee-validate runs validation whenever the `value` ref changes whether it was bound by a `v-model` or changed in your code:

```js
const { value } = useField('fieldName', isRequired);

// validation WILL be triggered
value.value = 'something';
```

You can disable that behavior by passing a `validateOnValueUpdate` option set to `false`:

```js
const { value } = useField('fieldName', isRequired, {
  validateOnValueUpdate: false,
});

// validation WILL NOT trigger
value.value = 'something';
```

### Handling Events

`useField()` composition function is not concerned with any events, it only validates whenever the `value` ref changes. However, it gives you everything you need to set up your own validation experience.

The `useField` function exposes some handler functions, each handles a specific aspect of the validation experience:

- `handleChange`: Updates the field value, can be configured to trigger validation or silently update the value
- `handleBlur`: Updates the `meta.touched` flag, doesn't trigger validation.

```js
const { handleChange, handleBlur } = useField('someField');
```

In this example we are validating on `input` event (when the user types), which would make the validation aggressive:

```vue
<template>
  <div>
    <input @input="handleChange" :value="value" type="text" />
    <span>{{ errorMessage }}</span>
  </div>
</template>

<script>
import { useField } from 'vee-validate';

export default {
  setup() {
    function isRequired(value) {
      // ...
    }

    const { errorMessage, value, handleChange } = useField('fieldName', isRequired);

    return {
      errorMessage,
      value,
      handleChange,
    };
  },
};
</script>
```

With a slight adjustment we can make our validation lazy by changing the listener to `@change` (validates when the user leaves the control):

```vue
<div>
  <input @change="handleChange" :value="value" type="text" />
  <span>{{ errorMessage }}</span>
</div>
```

If we wanted to validate on `blur` as well, you can simply add `handleChange` as a handler for it:

```vue
<div>
  <input @change="handleChange" @blur="handleChange" :value="value" type="text" />
  <span>{{ errorMessage }}</span>
</div>
```

As you can see, the `useField` doesn't care which events you use `handleChange` for. This allows for greater flexibility that's not possible with the `<Field>` component, not as straightforward at least.

Consider this validation experience:

- Validate on Change/Blur initially (when user leaves the control), let's call this lazy mode.
- If the field is invalid, switch the validation to validate on input (when user types), let's call this aggressive mode.
- If the field is valid, go back to "lazy" mode, otherwise be "aggressive".

Implementing this requires some knowledge about how the `v-on` (we can bind objects on it) handler works and the `computed` function. It can be as easy as this:

```vue
<template>
  <div>
    <input v-on="validationListeners" :value="value" type="text" />
    <span>{{ errorMessage }}</span>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useField } from 'vee-validate';

export default {
  setup() {
    function isRequired(value) {
      // ...
    }

    const { errorMessage, value, handleChange } = useField('fieldName', isRequired, {
      validateOnValueUpdate: false,
    });

    const validationListeners = computed(() => {
      // If the field is valid or have not been validated yet
      // lazy
      if (!errorMessage.value) {
        return {
          blur: handleChange,
          change: handleChange,
          // disable `shouldValidate` to avoid validating on input
          input: e => handleChange(e, false),
        };
      }

      // Aggressive
      return {
        blur: handleChange,
        change: handleChange,
        input: handleChange, // only switched this
      };
    });

    return {
      errorMessage,
      value,
      validationListeners,
    };
  },
};
</script>
```

Check the working example here:

<code-sandbox id="cool-monad-7uy17" title="Implementing Eager Validation with VeeValidate"></code-sandbox>

## Displaying Error Messages

You can display error messages using either `useField` or `useForm`.

### Displaying Errors with useField

You've already seen how to display errors with `useField`, by using the `errorMessage` ref:

```vue
<template>
  <div>
    <input v-model="value" type="text" />
    <span>{{ errorMessage }}</span>
  </div>
</template>

<script>
import { useField } from 'vee-validate';

export default {
  setup() {
    function isRequired(value) {
      // ...
    }

    const { errorMessage, value } = useField('fieldName', isRequired);

    return {
      errorMessage,
      value,
    };
  },
};
</script>
```

In addition to this, you can get all errors for the field using the `errors` ref which contains multiple error messages if applicable:

```vue
<template>
  <div>
    <input v-model="value" type="text" />

    <template v-if="errors.length">
      <p>Please correct these errors:</p>
      <ol>
        <li v-for="message in errors" :key="message">{{ message }}</li>
      </ol>
    </template>
  </div>
</template>

<script>
import { useField } from 'vee-validate';

export default {
  setup() {
    function isRequired(value) {
      // ...
    }

    const { errors, value } = useField('fieldName', isRequired);

    return {
      errors,
      value,
    };
  },
};
</script>
```

### Displaying Errors with useForm

If you have multiple fields, it can be cumbersome to rename each `errorMessage` ref so they don't conflict with each other. Instead, you can use the `errors` returned by `useForm` to display messages for all fields.

```vue
<template>
  <div>
    <input name="email" v-model="email" />
    <span>{{ errors.email }}</span>

    <input name="password" v-model="password" type="password" />
    <span>{{ errors.password }}</span>
  </div>
</template>

<script>
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

export default {
  setup() {
    // Define a validation schema
    const schema = yup.object({
      email: yup.string().required().email(),
      password: yup.string().required().min(8),
    });

    // Create a form context with the validation schema
    const { errors } = useForm({
      validationSchema: schema,
    });

    // No need to define rules for fields
    const { value: email } = useField('email');
    const { value: password } = useField('password');

    return {
      errors,
      email,
      password,
    };
  },
};
</script>
```

### Custom Field Labels

More often than not, your fields will have names with underscores or shorthands which isn't very nice when showing in error messages, for example, you might have specific encoding to your field names because they might be generated by the backend. Ideally, you want to avoid having messages like:

```txt
The down_p is required
```

And instead show something more meaningful to the user

```txt
The down payment is required
```

You can do this in two ways depending on which validators you are using (yup or [global validators](/guide/global-validators)).

#### Custom Labels with Yup

With yup it is very straightforward, you just need to call `label()` after defining your field's validations either in field level or form level:

```js
const schema = Yup.object({
  email_addr: Yup.string().email().required().label('Email Address'),
  acc_pazzword: Yup.string().min(5).required().label('Your Password'),
});
```

Here is a live example:

<code-sandbox id="vee-validate-v4-custom-field-labels-with-yup-qikju" title="Custom Labels with yup"></code-sandbox>

If you are interested in how to do the same for global validators check the [i18n guide](/guide/i18n#custom-labels)

## Validation Metadata

### Field-level Meta

Each field has metadata associated with it, the `meta` property returned from `useField` contains information about the field:

- `valid`: The current field validity, automatically updated for you.
- `touched`: If the field was **touched**, can be updated with `setTouched` on `useField` return value.
- `dirty`: If the field value was updated, you cannot change its value.
- `pending`: If the field's validations are still running, useful for long-running async validation.
- `initialValue`: The field's initial value, is `undefined` if you didn't specify any.

```js
const { meta } = useField('fieldName');

meta.dirty;
meta.pending;
meta.touched;
meta.valid;
meta.initialValue;
```

This is the typescript interface for a field's meta value

```ts
interface FieldMeta {
  dirty: boolean;
  pending: boolean;
  touched: boolean;
  valid: boolean;
  initialValue: any;
}
```

In the following example, we use the `meta.dirty` flag to check if the field value was changed or not

```vue
<template>
  <input v-model="value" type="text" />

  <button :disabled="!meta.dirty">Submit</button>
</template>

<script>
import { useField } from 'vee-validate';

export default {
  setup() {
    // Provide initial value to make `meta.dirty` accurate
    const { value, meta } = useField('fieldName', undefined, {
      initialValue: '',
    });

    return {
      errorMessage,
      value,
      meta,
    };
  },
};
</script>
```

<doc-tip title="Field Dirty Flag and Initial Values">
  
Notice in the previous example, we passed an `initialValue`, this is because the default field value is `undefined` which may cause unexpected `meta.dirty` results.

To get accurate results for the `meta.dirty` flag, you must provide an initial value to your field even if the values are empty.

To reduce the verbosity of adding an `initialValue` prop to each field, you could provide the `initialValues` prop to your `useForm` call instead.

</doc-tip>

<doc-tip title="Valid Flag Combinations">
  
Since the `meta.valid` flag is initially `true` (because it just means there are no errors yet), it would cause problems if you have a "success" UI state an indicator.

To avoid this case you should combine the `valid` flag with either `meta.dirty` or `meta.touched` to get an accurate representation.

</doc-tip>

### Form-level Meta

Forms also have their own `meta` value containing useful information about the form, it acts as an aggregation of the metadata for the fields inside that form.

```js
const { meta } = useForm();

meta.value.dirty;
meta.value.pending;
meta.value.touched;
meta.value.valid;
meta.value.initialValues;
```

- `valid`: The form's validity status, will be `true` if the errors array is empty initially, but will be updated once the form is mounted.
- `touched`: If at least one field was blurred (unfocused) inside the form.
- `dirty`: If at least one field's value was updated.
- `pending`: If at least one field's validation is still pending.
- `initialValues`: All fields' initial values, packed into an object where the keys are the field names.

Here is a similar example where we disable the form's submit button if no value was changed, the same caveat applies is that we have to provide an `initialValues` prop to `useForm` to make sure `meta.dirty` works accurately:

```vue
<template>
  <form @submit="submit">
    <input v-model="value" type="text" />

    <button :disabled="!meta.dirty">Submit</button>
  </form>
</template>

<script>
import { useField, useForm } from 'vee-validate';

export default {
  setup() {
    const { meta, values } = useForm({
      initialValues: {
        email: '',
      },
    });

    // create some fields with useField
    const { value } = useField('email');

    function submit() {
      // send stuff to api
    }

    return {
      value,
      meta,
      submit,
    };
  },
};
</script>
```
