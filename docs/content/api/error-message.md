---
title: ErrorMessage
description: API reference for the ErrorMessage component
menuTitle: '<ErrorMessage />'
order: 3
---

# ErrorMessage

The `ErrorMessage` component is used to conveniently display error messages without resorting to scoped slots on either the `Form` and `Field` components.

The basic usage looks like this:

```vue
<template>
  <Form>
    <Field name="email" as="input" type="email" :rules="validateEmail" />
    <ErrorMessage name="email" />
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
    const validateEmail = yup.string().required().email();

    return {
      validateEmail,
    };
  },
};
</script>
```

## Rendering Messages

The `ErrorMessage` component accepts an `as` prop that allows to control the root node to render for your error messages, by default it will render a `span` if none provided.

```vue
<ErrorMessage name="email" as="p" />
```

For more flexible markup and the ability to render multiple root nodes, you can use the `ErrorMessage` component's default scoped slot

```vue
<ErrorMessage name="email" v-slot="{ message }">
  <p>Error:</p>
  <p>{{ message }}</p>
</ErrorMessage>
```

If an `as` prop is not provided while having a slot, it will render the slot contents only. _Effectively becoming a renderless-component._

You can use a combination of both to render a root node with children:

```vue
<ErrorMessage as="div" name="email" v-slot="{ message }">
  <p>Error:</p>
  <p>{{ message }}</p>
</ErrorMessage>
```

## API

### Props

| Prop | Type     | Required/Default | Description                              |
| :--- | :------- | :--------------- | :--------------------------------------- |
| as   | `string` | `"span"`         | The element to render as a root node     |
| name | `string` | Required         | The field's name to display messages for |

### Slots

#### default

The default slot gives you access to the following props:

| Scoped Prop | Type     | Description                 |
| :---------- | :------- | :-------------------------- |
| message     | `string` | The element's error message |

Check the sample above for rendering with scoped slots

## Caveats

- The ErrorMessage component must be used inside a `Form` component otherwise it won't be able to find the errors.
- ErrorMessage component can only display errors for a field that exists within the same form, it cannot reference fields outside its own form.
