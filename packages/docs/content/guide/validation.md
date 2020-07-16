---
title: 'Validation Guide'
description: How validation works and field-level validations vs form-level validations
---

# Validation

vee-validate handles complex validations in a very easy way, it supports synchronous and asynchronous validation, and allows defining rules on the field-level or on the form level using validation schemas with built-in support for [yup](https://github.com/jquense/yup).

With Vue 3, vee-validate offers both flavors of doing validation: an _imperative validation_ approach with composition functions API and a _declarative approach_ with higher order components (HOC) and scoped slots.

This guide will discuss all those aspects of vee-validate.

## Meet the Gang

vee-validate supports both flavors of doing validation, using either _the composition API_ or _higher-order components_, the latter will be focused upon more as it offers a lot of convenience over the composition API and will make building forms faster and fun.

vee-validate exposes the following components that you will be using frequently to validate your forms:

- A `Field` component which represents a single form input.
- A `Form` component which represents a form.

### Field Component

The `<Field />` component is an extremely flexible component that makes rendering input fields easy and intuitive, a simple text input looks like this:

```vue
<template>
  <Field name="field" as="input" type="text">
</template>

<script>
import { Field } from 'vee-validate';

export default {
  components: {
    Field,
  },
};
</script>
```

#### Rendering Fields

The `as` prop tells the Field component which tag to render in its place, you can pass any additional attributes like `type="text"` and it will be passed to the rendered `input` tag as well as any listeners and slots.

For example you could render a `select` input like this:

```vue
<Field name="field" as="select">
  <option>Coffee</option>
  <option>Tea</option>
  <option>Coke</option>
</Field>
```

You can also render any globally defined components:

```vue
<Field name="field" as="my-text-field" />
```

<doc-tip>

For validation to work, the rendered tag with `as` prop must conform to the events that the `Field` component listens for, you can view a list of these in the [Validation Behavior section](#validation-behavior)

</doc-tip>

The `as` prop is very easy to use but also limited as you cannot render a group of markup. Fortunately the `Field` component makes use of the scoped-slots (v-slot) feature to allow you to render complex markup:

```vue
<Field name="password" v-slot="{ field }">
  <input v-bind="field" type="password">
  <p>Hint: Enter a secure password you can remember</p>
</Field>
```

The most crucial part of rendering fields with `v-slot` is that you **must bind the `field` object to your input element/input**, the `field` object contains all the attributes and listeners required for the field to be validated, this is done automatically if you are using the `as` prop.

The `Field` component `v-slot` contains many useful props that will help you craft beautiful and accessible fields, read the [Field component API reference](../api/field) for more information.

When using `v-slot` on the `Field` component you no longer have to provide an `as` prop.

### Form Component

The `<Form />` component is like its name, a simple HTML form but with a few adjustments and DX improvements, like the `Field` component it requires an `as` prop that tells it what to render, usually you will pass `form` to it in most of the cases.

```vue
<Form as="form">
  <Field name="password" as="input" type="password">
</Form>
```

#### Rendering Forms

Just like the `Field` component you can pass whatever you want to render in its place, for example a custom `v-form` component that is registered globally:

```vue
<Form as="v-form">
  <Field name="password" as="input" type="password">
</Form>
```

By default a `submit` and `reset` listeners are added to the rendered tag specified by the `as` prop.

For more complex form markup, you can omit the `as` prop:

```vue
<Form>
  <h2>Sign up form</h2>
  <form>
    <Field name="name" as="input"">
    <Field name="email" as="input" type="email">
    <Field name="password" as="input" type="password">
  </form>
</Form>
```

<doc-tip type="error">

Notice the character-case difference between `Form` and `form`, the uppercased one is the component provided by vee-validate while the lowercased one is the native `form` element, you might run into issues when not using Vue compiler workflow like script tags. In these cases it is recommended to rename the `Form` component to something that will not conflict with native HTML.

```js
const component = {
  components: {
    ValidationForm: VeeValidate.Form,
  },
};
```

</doc-tip>

Lastly, you can use the `Form` component slot props:

```vue
<Form as="form" v-slot="{ values }">
  <Field name="name" as="input"">
  <Field name="email" as="input" type="email">
  <Field name="password" as="input" type="password">

  <!-- prints current form values -->
  <pre>
    {{ values }}
  </pre>
</Form>
```

You can also omit the `as` prop in the last example, and combine the scoped slots with a complex markup like:

```vue
<Form v-slot="{ values }">
  <h2>Sign up form</h2>
  <form>
    <Field name="name" as="input"">
    <Field name="email" as="input" type="email">
    <Field name="password" as="input" type="password">

    <!-- prints current form values -->
    <pre>
      {{ values }}
    </pre>
  </form>
</Form>
```

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
  setup() {
    const isRequired = value => {
      if (value && value.trim()) {
        return true;
      }

      return 'This is required';
    }

    return {
      isRequired,
    };
  },
};
</script>
```

You can also use `yup` to define your validation rules for that field:

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
  setup() {
    const passwordRules = yup.string().required().min(8);

    return {
      passwordRules,
    };
  },
};
</script>
```

## Form-level Validation

vee-validate supports using a validation schema to define all your validations on your fields beforehand so you don't have to define them individually on your fields.
Form-level validation is connivent if you are building large forms and want to keep your templates cleaner.

A simple validation schema can be an object containing field names as keys and validation functions as the value for those keys:

```js
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
```

Fortunately there is already a very neat way to build validation schemas for your forms by using `yup`, it allows you create validation objects like this:

```js
const schema = yup.object().shape({
  email: yup.string().required().email(),
  name: yup.string().required(),
  password: yup.string().required().min(8),
});
```

vee-validate has built-in support for yup schemas, this is because yup is very popular and extremely battle-tested, we recommend using it to validate your fields.

You can pass your schemas to the `<Form />` component using the `validation-schema` prop:

```vue
<template>
  <Form @submit="submit" as="form" :validation-schema="schema" v-slot="{ errors }">
    <Field name="email" as="input" />
    <span>{{ errors.email }}</span>

    <Field name="password" as="input" />
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
  setup() {
    const schema = yup.object().shape({
      email: yup.string().email(),
      password: yup.string().required().min(8),
    });

    return {
      schema,
    };
  },
};
</script>
```

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

You can specifically control which events to listen to by using the scoped-slot `field` prop of the `<Field />` component:

```vue
<!-- Listen to all events, this is the default behavior -->
<Field v-slot="{ field }">
  <input v-bind="field" />
</Field>

<!-- Only listen for the blur event -->
<Field v-slot="{ field }">
  <input @blur="field.onBlur" :value="field.value" />
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

export default {
  components: {
    Field,
    Form,
    ErrorMessage
  },
  setup() {
    // ...
  }
};
</script>
```

The `<ErrorMessage />` component is very flexible and you can customize its render output with scoped slots to build complex messages markup, read the [ErrorMessage API reference](/api/error-message) for more information.
