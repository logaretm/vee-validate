---
title: Validation
description: Field-level and form-level validation and validation behavior and error messages
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
    <Field name="field" as="input" :rules="isRequired">
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
    }
  }
};
</script>
```

### Validating fields with yup

yup is a very popular, simple and powerful data validation library for JavaScript, you can use it in combination with vee-validate, You can use [`yup`](https://github.com/jquense/yup) to define your validation rules for that field:

```vue
<template>
  <Form v-slot="{ errors }">
    <Field name="password" as="input" type="password" :rules="passwordRules">
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

For more information on the `Field` component, read [the API reference](../api/field).

## Form-level Validation

vee-validate supports using a validation schema to define all your validations on your fields beforehand so you don't have to define them individually on your fields.
Form-level validation is connivent if you are building large forms and want to keep your templates cleaner.

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
      schema,
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

For more information on the `Form` component, read [the API reference](../api/form).

## Validation Behavior

By default vee-validate runs validation whenever one of the following is satisfied:

- Field value changed (`input` or `change` events were emitted).
- Field rules changed and it was validated before.
- Field has been blurred (`blur` event was emitted).
- Form has been submitted.

For field-triggered scenarios of the list above, vee-validate only validates that field, other fields won't be validated. Whenever a form is submitted all fields will be re-validated.

<doc-tip>

This is only relevant to the `<Field />` and `<Form />` components

</doc-tip>

### Customizing Validation Triggers

By default vee-validate adds the following event listeners to your fields:

- input
- change
- blur
- update:modelValue

You can specifically control which events to listen to by using the scoped-slot `handleChange` prop of the `<Field />` component and binding it to the desired event:

```vue
<!-- Listen to all events, this is the default behavior -->
<Field v-slot="{ field }">
  <input v-bind="field" />
</Field>

<!-- Only listen for the change and blur events -->
<Field v-slot="{ field, handleChange }">
  <input @change="handleChange" @blur="field.onBlur" :value="field.value" />
</Field>
```

`useField()` is not concerned with any events, it only validates whenever the `value` ref changes. It gives you everything you need to setup your own validation experience.

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
  <Field name="field" as="input" :rules="rules">
  {{ errors.field }}
</Form>
```

and if you would like, you could display all error messages for your fields by iterating over the `errors` object:

```vue
<Form v-slot="{ errors, meta }">
  <template v-if="meta.failed">
    <p>Please correct the following errors</p>
    <ul>
      <li v-for="(message, field) in errors" :key="field">
        {{ message }}
      </li>
    </ul>
  </template>

  <Field name="name" as="input" :rules="rules">
  <Field name="email" as="input" :rules="rules">
  <Field name="password" as="input" :rules="rules">
</Form>
```

### Using ErrorMessage component

vee-validate offers an `<ErrorMessage />` component that displays your error messages in a convenient manner, as an added bonus vee-validate automatically adds some accessability attributes to both the `<Field />` and the associated `<ErrorMessage />` component.

```vue
<template>
  <Form>
    <Field name="field" as="input" :rules="rules">
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
    ErrorMessage
  },
  data() {
    const rules = yup.string().required();

    return {
      rules
    };
  }
};
</script>
```

The `<ErrorMessage />` component is very flexible and you can customize its render output with scoped slots to build complex messages markup, read the [ErrorMessage API reference](../api/error-message) for more information.
