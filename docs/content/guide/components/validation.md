---
title: Validation
description: Field-level and form-level validation and validation behavior and error messages
order: 2
next: guide/components/handling-forms
---

# Validation

vee-validate handles complex validations in a very easy way, it supports synchronous and asynchronous validation and allows defining rules on the field-level or the form level using validation schemas with built-in support for [yup](https://github.com/jquense/yup).

You will be using the following components to validate your forms:

- A `Field` component represents a single form input and can be used to render any kind of HTML elements or Vue components.
- A `Form` component that renders a form. Do not confuse the `<Form>` tag with the HTML `<form>` tag.
- An `ErrorMessage` component that displays an error message for a field, you don't have to use it as there are many ways to render error messages.

Here is the most simple example in action:

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="logaretm" data-slug-hash="rNxbMzq" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Basic Example">
  <span>See the Pen <a href="https://codepen.io/logaretm/pen/rNxbMzq">
  Basic Example</a> by Abdelrahman Awad (<a href="https://codepen.io/logaretm">@logaretm</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

<doc-tip>

From this point forwards, the docs will assume basic knowledge of [Vue's SFC components](https://v3.vuejs.org/guide/single-file-component.html) and will demonstrate examples as such and will be using ES6+ code snippets. So be sure to brush up on these if you haven't already.

</doc-tip>

## Field-level Validation

You can define validation rules for your fields using the `Field` component, your rules can be as simple as a function that accepts the current value and returns an error message.

```vue
<template>
  <Form>
    <Field name="field" :rules="isRequired" />
    <ErrorMessage name="field" />
  </Form>
</template>

<script>
import { Field, Form, ErrorMessage } from 'vee-validate';

export default {
  components: {
    Field,
    Form,
    ErrorMessage,
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

[`yup`](https://github.com/jquense/yup) is a very popular, simple and powerful data validation library for JavaScript, you can use it in combination with vee-validate, You can use `yup` to define your validation rules for that field:

```vue{3,10,20}
<template>
  <Form>
    <Field name="password" type="password" :rules="passwordRules" />
    <ErrorMessage name="password" />
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
  <Form @submit="submit" :validation-schema="simpleSchema">
    <Field name="email" />
    <ErrorMessage name="email" />

    <Field name="password" type="password" />
    <ErrorMessage name="password" />

    <button>Submit</button>
  </Form>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate';

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
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
const schema = yup.object({
  email: yup.string().required().email(),
  name: yup.string().required(),
  password: yup.string().required().min(8),
});
```

vee-validate has built-in support for yup schemas, You can pass your schemas to the `<Form />` component using the `validation-schema` prop:

```vue
<template>
  <Form @submit="submit" :validation-schema="schema">
    <Field name="email" />
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
};
</script>
```

For more information on the `Form` component, read [the API reference](/api/form).

<doc-tip title="Yup Schema Optimizations" type="warn">

There are a couple of optimization caveats when it comes to using `yup` schemas to validate your forms, be sure to check the [best practices guide](/tutorials/best-practices).

</doc-tip>

<doc-tip title="Zod Schema Plugin">

There is an official integration available for [Zod validation](https://github.com/colinhacks/zod) that you can use as a drop-in replacement for `yup`. Check the [zod integration page](/integrations/zod-schema-validation).

</doc-tip>

### Reactive Form Schema

You can have reactive form schemas using `computed` if you are looking to create dynamic schemas using either `yup` or a validation object.

```js
import * as yup from 'yup';

export default {
  data: () => ({
    min: 6,
  }),
  computed: {
    schema() {
      return yup.object({
        password: yup.string().min(this.min),
      });
    },
  },
};
```

```vue
<template>
  <Form @submit="submit" :validation-schema="schema">
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
  data: () => ({
    min: 6,
  }),
  computed: {
    schema() {
      return yup.object({
        password: yup.string().min(this.min),
      });
    },
  },
};
</script>
```

When the validation schema changes, only the fields that were validated at least once will be re-validated, the other fields won't be validated to avoid aggressive validation behavior.

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

- When the form has been submitted with either `handleSubmit` or `submitForm` on the `<Form />` component slot props

### Customizing Validation Triggers

By default vee-validate adds multiple event listeners to your fields:

- **input:** Adds a `handleChange` handler that updates the field value, and it may validate if configured to do so (may update `meta.dirty` flag if the value changed).
- **change:** Adds a `handleChange` handler that updates the field value and validates the field (may update `meta.dirty` flag if the value changed).
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

You can also specify if a `handleChange` call should trigger validation or not by providing the second argument:

```vue
<!-- Only update field value without validating it -->
<Field v-slot="{ field, handleChange }">
  <input @change="$event => handleChange($event, false)" :value="field.value" />
</Field>
```

<doc-tip title="Vue components validation triggers">

When applying `v-bind="field"` to a Vue component, be careful that the listeners will both be applied for Vue and native DOM events, meaning you might trigger validation unintentionally.

It is recommended that you listen to the proper events when using `v-bind` with custom components, the following sample uses `modelValue` events.

```vue
<Field v-slot="{ handleChange, field }">
  <CustomInput :modelValue="field.value" @update:modelValue="handleChange" />
</Field>
```

For 3rd party components you may consult their documentation to figure which events to trigger validation for. Here are a few examples for the common UI frameworks [here](/examples/ui-libraries).

</doc-tip>

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

This is convenient if you have a complex markup for your input and would like to keep everything contained within, it also allows you to create input components with built-in validation.

### Using the Form slot-props

As you noticed the `<Form />` component gives you access to the `errors` on its scoped-slot props which you can use to display any error messages for any `<Field />` within that form:

```vue
<Form v-slot="{ errors }">
  <Field name="field" :rules="rules" />
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

  <Field name="name" :rules="rules" />
  <Field name="email" :rules="rules" />
  <Field name="password" :rules="rules" />
</Form>
```

### Using ErrorMessage component

You've seen how the `ErrorMessage` works in the previous examples, by default the `ErrorMessage` component renders a `span` but you can specify any kind of HTML element or global component to the `as` prop.

```vue
<Form>
  <Field name="field" :rules="rules" />
  <!-- Render the error message as a div element -->
  <ErrorMessage name="field" as="div" />
</Form>
```

The `<ErrorMessage />` component is very flexible and you can customize its render output with scoped slots to build complex messages markup, read the [ErrorMessage API reference](/api/error-message) for more information.

### Custom Field Labels

More often than not, your fields will have names with underscores or shorthands which isn't very nice when showing in error messages, for example, you might have specific encoding to your field names because they might be generated by the backend. Ideally, you want to avoid having messages like:

```txt
The down_p is required
```

And instead, show something more meaningful to the user

```txt
The down payment is required
```

You can do this in two ways depending on which validators you are using (yup or [global validators](/guide/global-validators)).

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

Each field has metadata associated with it, the `meta` property available on the `<Field />` component contains additional information about the field:

- `valid`: The current field validity, automatically updated for you.
- `touched`: If the field was blurred (unfocused), can be updated with the `handleBlur` function or `setTouched` on the field's slot scope props.
- `dirty`: If the field value was updated, you cannot change its value.
- `pending`: If the field's validations are still running, useful for long-running async validation.
- `initialValue`: The field's initial value, is `undefined` if you didn't specify any.

```vue
<Field name="email" type="email" :rules="validateEmail" v-slot="{ field, meta }">
  <input v-bind="field" />
  <pre>{{ meta }}</pre>
</Field>
```

This is the typescript interface for a field's meta-object value

```ts
interface FieldMeta {
  dirty: boolean;
  pending: boolean;
  touched: boolean;
  valid: boolean;
  initialValue: any;
}
```

<doc-tip title="Field Dirty Flag and Initial Values">
  
The default value is `undefined` unless specified which may cause unexpected `meta.dirty` results. To get accurate results for the `meta.dirty` flag, you must provide an initial value to your field even if the values are empty.

```vue
<Field name="email" value="" type="email" v-slot="{ field, meta }">
  <input v-bind="field" />
  <pre>{{ meta }}</pre>
</Field>
```

To reduce the verbosity of adding a `value` prop to each field, you could provide the `initial-values` prop to your `<Form />` component instead.

</doc-tip>

<doc-tip title="Valid Flag Combinations">
  
Since the `meta.valid` flag is initially `true` (because it just means there are no errors yet), it would cause problems if you have a "success" UI state an indicator.

To avoid this case you could combine the `valid` flag with either `meta.dirty` or `meta.touched` to get accurate representation:

```vue
<Field name="email" type="email" :rules="validateEmail" v-slot="{ field, errorMessage, meta }">
  <input v-bind="field" />
  <span v-if="errorMessage">⛔️ {{ errorMessage }}</span>
  <span v-if="meta.valid && meta.touched">✅ Field is valid</span>
</Field>
```

</doc-tip>

### Form-level Meta

Forms also have their own `meta` value containing useful information about the form, it is an aggregation of the metadata for the fields inside that form.

The form's metadata properties are:

- `valid`: The form's validity status, will be `true` if the errors array is empty. After the form is mounted, vee-validate will update the flag to its accurate state
- `touched`: If at least one field was blurred (unfocused) inside the form.
- `dirty`: If at least one field's value was updated.
- `pending`: If at least one field's validation is still pending.
- `initialValues`: All fields' initial values, packed into an object where the keys are the field names.

```vue
<Form v-slot="{ meta }">
  <!-- Some fields -->
  <pre>{{ meta }}</pre>
</Form>
```

Here is a similar example where we disable the form's submit button if no value was changed, we will check the `dirty` flag on the form's scoped slot props which should tell us if the form values have changed or not.

```vue
<template>
  <Form v-slot="{ meta }" :initial-values="initialValues">
    <Field name="email" />

    <button :disabled="!meta.dirty">Submit</button>
  </Form>
</template>

<script>
import { Field, Form } from 'vee-validate';

export default {
  components: {
    Field,
    Form,
  },
  data() {
    return {
      initialValues: { email: '' },
    };
  },
};
</script>
```

<doc-tip title="Form Dirty Flag and Initial Values">
  
Notice that the `initial-values` in the previous example were provided, like mentioned for the `meta.dirty` accuracy for fields, to get accurate results for the `meta.dirty` flag, you must provide initial values to your forms even if the values are empty.

</doc-tip>

<doc-tip title="Valid Flag Combinations">
  
Forms `meta.valid` flag is also initially `true` (because it just means there are no errors yet), it would cause problems if you have a "success" UI state or an indicator.

To avoid this case you could combine the form's `valid` flag with either `meta.dirty` or `meta.touched` to get accurate representation:

```vue
<Form v-slot="{ meta, errors }">
  <Field name="email" type="email" :rules="validateEmail" />
  <span v-if="errors.email">⛔️ {{ errors.email }}</span>
  <span v-if="meta.valid && meta.touched">✅ Form is valid</span>
</Form>
```

</doc-tip>

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
