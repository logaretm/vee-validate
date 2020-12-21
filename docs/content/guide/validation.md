---
title: Validation
description: Field-level and form-level validation and validation behavior and error messages
order: 2
---

# Validation

vee-validate handles complex validations in a very easy way, it supports synchronous and asynchronous validation, and allows defining rules on the field-level or on the form level using validation schemas with built-in support for [yup](https://github.com/jquense/yup).

With Vue 3, vee-validate offers both flavors of doing validation: an _imperative validation_ approach with composition functions API and a _declarative approach_ with higher order components (HOC) and scoped slots.

This guide will discuss all those aspects of vee-validate.

vee-validate supports both flavors of doing validation, using either _the composition API_ or _higher-order components_, the latter will be focused upon more as it offers a lot of convenience over the composition API and will make building forms faster and fun.

vee-validate exposes the following components that you will be using frequently to validate your forms:

- A `Field` component which represents a single form input.
- A `Form` component which represents a form.

## Field-level Validation

You can define validation rules for your fields using the `Field` component or `useField` composition API function, your rules can be as simple as a function that accepts the current value and returns an error message.

This is an example using the `<Field />` component:

```vue
<template>
  <Form v-slot="{ errors }">
    <Field name="field" as="input" :rules="isRequired" />
    {{ errors.field }}
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
    isRequired(value) {
      if (value && value.trim()) {
        return true;
      }

      return 'This is required';
    },
  },
};
</script>
```

### Validating fields with yup

yup is a very popular, simple and powerful data validation library for JavaScript, you can use it in combination with vee-validate, You can use [`yup`](https://github.com/jquense/yup) to define your validation rules for that field:

```vue
<template>
  <Form v-slot="{ errors }">
    <Field name="password" as="input" type="password" :rules="passwordRules" />
    {{ errors.field }}
  </Form>
</template>

<script>
import { Field, Form } from 'vee-validate';
import * as yup from 'yup';

export default {
  components: {
    Field,
    Form,
  },
  data() {
    return {
      passwordRules: yup.string().required().min(8),
    };
  },
};
</script>
```

For more information on the `Field` component, read [the API reference](/api/field).

## Form-level Validation

vee-validate supports using a validation schema to define all your validations on your fields beforehand so you don't have to define them individually on your fields.
Form-level validation is convenient if you are building large forms and want to keep your templates cleaner.

A simple validation schema can be an object containing field names as keys and validation functions as the value for those keys:

```vue
<template>
  <Form @submit="submit" :validation-schema="simpleSchema" v-slot="{ errors }">
    <Field name="email" as="input" />
    <span>{{ errors.email }}</span>

    <Field name="password" as="input" type="password" />
    <span>{{ errors.password }}</span>

    <button>Submit</button>
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
    const simpleSchema = {
      email(value) {
        // validate email value...
      },
      name(value) {
        // validate name value...
      },
      // If you defined global rules you can also use them
      password: 'required|min:8',
      // ...
    };

    return {
      simpleSchema,
    };
  },
};
</script>
```

### Validation schemas with yup

Fortunately there is already a very neat way to build validation schemas for your forms by using `yup`, it allows you create validation objects like this:

```js
const schema = yup.object().shape({
  email: yup.string().required().email(),
  name: yup.string().required(),
  password: yup.string().required().min(8),
});
```

vee-validate has built-in support for yup schemas, You can pass your schemas to the `<Form />` component using the `validation-schema` prop:

```vue
<template>
  <Form @submit="submit" :validation-schema="schema" v-slot="{ errors }">
    <Field name="email" as="input" />
    <span>{{ errors.email }}</span>

    <Field name="password" as="input" type="password" />
    <span>{{ errors.password }}</span>

    <button>Submit</button>
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
    const schema = yup.object().shape({
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

For more information on the `Form` component, read [the API reference](/api/form).

<doc-tip title="Yup Schema Optimizations">
  There are a couple of optimization caveats when it comes to using `yup` schemas to validate your forms, be sure to check the [best practices guide](/tutorials/best-practices)
</doc-tip>

## Validation Behavior

By default vee-validate runs validation in these scenarios:

**After field value change**

- When a `change` event is dispatched/emitted
- value changed externally (model update or others)

Note that `input` event is not considered to be a trigger because it would make it too aggressive, you can configure the triggers in the next section to suit your needs.

**After Rules change**

- Only if the field was validated before via user interaction

**After field is blurred**

- Field has been blurred (`blur` event was emitted)

**After form submissions**

- When the form has been submitted with either `handleSubmit` or `submitForm` on the `<Form />` component

<doc-tip>

This is only relevant to the `<Field />` and `<Form />` components

</doc-tip>

### Customizing Validation Triggers

By default vee-validate adds multiple event listeners to your fields:

- **input:** Adds a `handleInput` handler that updates the `meta.dirty` flag and updates the field value.
- **change:** Adds a `handleInput` handler just like the input event but also adds a `handleChange` event that updates the field value and validates the field
- **blur:** Adds a `handleBlur` handler that updates the `meta.touched` flag.
- **update:modelValue** Adds a `handleChange` handler to components emitting the `update:modelValue` event

Notice that in all of these, the `handleChange` handler is the only one that triggers validation. You can configure if a handler should validate by using the `configure` helper:

```js
import { configure } from 'vee-validate';

// Default values
configure({
  validateOnBlur: true, // controls if `blur` events should trigger validation with `handleChange` handler
  validateOnChange: true, // controls if `change` events should trigger validation with `handleChange` handler
  validateOnInput: false, // controls if `input` events should trigger validation with `handleChange` handler
  validateOnModelUpdate: true, // controls if `update:modelValue` events should trigger validation with `handleChange` handler
});
```

Note that configuring any of these options to `false` will not remove all the events, they only control if each event triggers a validation check or not.

This might not be flexible enough for your needs, which is why you can define the same config per `Field` component instance:

```vue
<!-- Turns off validation events -->
<Field name="email" :validateOnBlur="false" :validateOnChange="false" :validateOnInput="false" />
```

Additionally if you need to use different events or have specific needs in mind, you can control which events to listen to by using the scoped-slot `handleChange` prop of the `<Field />` component and binding it to the desired event:

```vue
<!-- Listen to all events, this is the default behavior -->
<Field v-slot="{ field }">
  <input v-bind="field" />
</Field>

<!-- Only validate when the change event is dispatched -->
<Field v-slot="{ field, handleChange }">
  <input @change="handleChange" :value="field.value" />
</Field>
```

<doc-tip type="danger">

When using `handleChange` in scoped slot or with `useField`, make sure to pass the event object or the new value. Otherwise vee-validate won't pick up the new value.

```js
handleChange(e);

handleChange(newValue);
```

</doc-tip>

`useField()` composition function is not concerned with any events, it only validates whenever the `value` ref changes. It gives you everything you need to setup your own validation experience.

In addition to those events, you can also validate when the `<Field />` or `<Form />` components are mounted with `validateOnMount` prop present on both components:

```vue
<!-- Trigger validation when this field is mounted (initial validation) -->
<Field name="name" validate-on-mount />

<!-- Trigger validation on all fields inside this form when the form is mounted -->
<Form validate-on-mount>
  <Field name="email" />
  <Field name="password" />
</Form>
```

## Displaying Error Messages

### Using the Field slot-props

If you intend to use the scoped slot on the `Field` component, you can access `errors` or `errorMessage` on the scoped slot props to render your messages:

```vue
<Field name="field" :rules="rules" v-slot="{ field, errors, errorMessage }">
  <input v-bind="field" type="text" />
  <span>{{ errors[0] }}</span>
  <!-- Or -->
  <span>{{ errorMessage }}</span>
</Field>
```

This is convenient if you have a complex markup for your input and would like to keep everything contained within, it also allows you create input components with built-in validation.

### Using the Form slot-props

As you noticed the `<Form />` component gives you access to the `errors` on its scoped-slot props which you can use to display any error messages for any `<Field />` within that form:

```vue
<Form v-slot="{ errors }">
  <Field name="field" as="input" :rules="rules" />
  {{ errors.field }}
</Form>
```

and if you would like, you could display all error messages for your fields by iterating over the `errors` object:

```vue
<Form v-slot="{ errors }">
  <template v-if="Object.keys(errors).length">
    <p>Please correct the following errors</p>
    <ul>
      <li v-for="(message, field) in errors" :key="field">
        {{ message }}
      </li>
    </ul>
  </template>

  <Field name="name" as="input" :rules="rules" />
  <Field name="email" as="input" :rules="rules" />
  <Field name="password" as="input" :rules="rules" />
</Form>
```

### Using ErrorMessage component

vee-validate offers an `<ErrorMessage />` component that displays your error messages in a convenient manner.

```vue
<template>
  <Form>
    <Field name="field" as="input" :rules="rules" />
    <ErrorMessage name="field" />
  </Form>
</template>

<script>
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

export default {
  components: {
    Field,
    Form,
    ErrorMessage,
  },
  data() {
    const rules = yup.string().required();

    return {
      rules,
    };
  },
};
</script>
```

The `<ErrorMessage />` component is very flexible and you can customize its render output with scoped slots to build complex messages markup, read the [ErrorMessage API reference](/api/error-message) for more information.

### Custom Field Labels

More often than not, your fields will have names with underscores or shorthands which isn't very nice when showing in error messages, for example you might have specific encoding to your field names because they might be generated by backend. Ideally you want to avoid having messages like:

```
The down_p is required
```

And instead show something more meaningful to the user

```
The down payment is required
```

You can do this in two ways depending on which validators you are using (yup or [global validators](/guide/global-validators)).

#### Custom Labels with Yup

With yup it is very straightforward, you just need to call `label()` after defining your field's validations either in field level or form level:

```js
const schema = Yup.object().shape({
  email_addr: Yup.string().email().required().label('Email Address'),
  acc_pazzword: Yup.string().min(5).required().label('Your Password'),
});
```

Here is a live example:

<code-sandbox id="vee-validate-v4-custom-field-labels-with-yup-qikju" title="Custom Labels with yup"></code-sandbox>

If you are interested on how to do the same for global validators check the [i18n guide](/guide/i18n#custom-labels)
