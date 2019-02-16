# Validation Provider

The `ValidationProvider` component is a regular component that wraps your inputs and provides validation state using [scoped slots](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots).

Using the ValidationProvider offers isolated scope for each field validation state, and does not inject/mutate anything outside its slot. You can import it and use whenever you need it. Using the validation context will allow you to apply classes, flags and pass state to your template.

Here is a quick example:

```vue
<template>
  <div>
    <ValidationProvider rules="required">
      <div slot-scope="{ errors }">
        <input v-model="value" type="text">
        <span id="error">{{ errors[0] }}</span>
      </div>
    </ValidationProvider>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate';

export default {
  components: {
    ValidationProvider
  }
};
</script>
```

It also works for custom components and solves the issue of authoring __self validated__ components, which is hard to achieve normally because of the directive limitations.

::: tip
  The fields being validated __must have__ a `v-model` so the component can correctly identify the element/component being validated __unless__ the field accepts a __file__
:::

## Scoped Slot Data

The object passed down to the slot scope is called the __validation context__. It has the following properties:

| Name    | Type                       |  Description |
|:--------|:--------------------------:|:--------------------------------------------------------------------|
| errors  | `string[]`                 | The list of error messages.                                         |
| valid   | `boolean`                  | The current validation state.                                       |
| flags   | `{ [x: string]: boolean }` | The flags map object state.                                         |
| aria    | `{ [x: string]: string }`  | Map object of aria attributes for accessibility.                    |
| classes | `{ [x: string]: boolean }` | Map object of the classes configured based on the validation state. |
| validate| `(e: any) => Promise`      | A function that is used as an event handler to trigger validation. Useful for fields that do not use v-model. |
| reset   | `() => void`               | A function that resets the validation state on the provider.        |

Since slot scopes can take advantage of ES6 destructing, you can opt-in for any of those properties and pass down to your slot template as you see fit. The example above only needed the `errors` array.

## Examples

The previous quick sample validates simple HTML inputs, lets take this up a notch and validate popular 3rd party components like [Vuetify's TextInput](https://vuetifyjs.com/en/components/text-fields).

### Basic Example

This passes error messages down to Vuetify's text field component.

```vue
<ValidationProvider rules="required">
  <VTextField slot-scope="{ errors }" v-model="value" :error-messages="errors" />
</ValidationProvider>
```

::: tip
  ValidationProvider is a __renderless__ component, meaning it does not render anything of its own. It only renders its slot, as such you need to have __only one root element__ in your slot. Using the `template` tag might cause render errors.
:::

### Manual Validation

Triggering validation on any of the providers is simple, but it is opt-in. Meaning you need to explicity call the validation on the provider instance. Using [refs](https://vuejs.org/v2/api/#ref) and the [public method](#methods) `validate` makes it straight forward.

```vue
<template>
  <div>
    <ValidationProvider rules="required" ref="myinput">
      <VTextField slot-scope="{ errors }" v-model="value" :error-messages="errors" />
    </ValidationProvider>

    <v-btn @click="validateField('myinput')" >Submit</v-btn>
  </div>
</template>

<script>
export default {
  // ...
  methods: {
    validateField (field) {
      const provider = this.$refs[field];

      // Validate the field
      return provider.validate();
    }
  },
  // ..
};
</script>
```

If you only plan to trigger manual validation using the UI, you can use the `validate` handler on the slot-scope data to trigger validation without having to use `refs`.

```vue
<ValidationProvider rules="required">
  <div slot-scope="{ validate, errors }">
    <input type="text" @input="validate">
    <p id="error">{{ errors[0] }}</p>
  </div>
</ValidationProvider>
```

Note that the `validate` method on the validation handler, you can use the `$event` in the Vue template to reference the event arg that is emitted with the event if your handlers are more complex.

```vue
<ValidationProvider rules="required">
  <div slot-scope="{ validate, errors }">
    <input type="text" @input="syncVuex($event.target.value) || validate($event)">
    <p id="error">{{ errors[0] }}</p>
  </div>
</ValidationProvider>
```

::: tip
  Using the same approach you can reset validation state for the provider using the public method `reset()` and the slot scope method of the same name.
:::

### File Validation

While `v-model` is generally required when using the ValidationProvider component, some inputs like `file` do not benefit from having `v-model`. Instead, you can use the manual `validate` method to avoid having to use `v-model` in this instance.

```vue
<ValidationProvider rules="required">
  <div slot-scope="{ validate, errors }">
    <input type="file" @change="handleFileChange($event) || validate($event)">
    <p id="error">{{ errors[0] }}</p>
  </div>
</ValidationProvider>
```

### Input Groups (Checkbox/Radio)

Like radio inputs and checkboxes (sometimes), some inputs behave as a single input entity. You can wrap the whole group of inputs __given that they have the same `v-model`__ in a single ValidationProvider component. You can group as many inputs as you want inside the ValidationProvider component.

```vue
<ValidationProvider rules="required">
  <div slot-scope="{ errors }">
    <input type="radio" v-model="drink" value="">
    <input type="radio" v-model="drink" value="coffee">
    <input type="radio" v-model="drink" value="coke">
  </div>
</ValidationProvider>
```

### Confirmed/Target based Validation

When using the directive, the `confirmed` rule targets the other field that has a corresponding `ref`. Using the ValidationProvider is slightly different; it looks for a ValidationProvider component that has a matching `vid` prop. The `vid` can be either a number or a string.

```vue
<ValidationProvider rules="required|confirmed:confirm">
  <VTextField slot-scope="{ errors }" v-model="password" type="password" :error-messages="errors" />
</ValidationProvider>

<ValidationProvider vid="confirm" rules="required">
  <VTextField slot-scope="{ errors }" v-model="passwordConfirm" type="password" :error-messages="errors" />
</ValidationProvider>
```

[You can see providers in action here](/examples/validation-providers.md)

## Refactoring Validation Providers

While the ValidationProvider has its advantages, it is more verbose than using the `v-model` directive, and can be very annoying when creating large forms. There are a couple of ways to address this issue.

### Creating Higher-Order Components

A common pattern in React is to use higher-order components to produce new components with slightly different behavior. This is similar to creating a wrapper or a mixin for our component, except it uses props/events to communicate state.

The `withValidation` method takes a component as an argument and creates a new one with the validation behavior enabled. Let's create a `VTextFieldWithValidation` using this method:

```js
import { withValidation } from 'vee-validate';
import { VTextField } from 'vuetify/lib';

const VTextFieldWithValidation = withValidation(VTextField, ({ errors }) => ({
  'error-messages': errors
}));

export default {
  components: {
    VTextFieldWithValidation
  }
};
```

::: tip
Note that the second parameter is a function that transforms the validation context to props object to be passed to the wrapped component. In this case we want to pass the `errors` array as the `error-messages` prop to the `VTextField` component.
:::

With this approach the last example becomes:

```vue
<VTextFieldWithValidation rules="required|confirmed:confirm" v-model="password" />

<VTextFieldWithValidation vid="confirm" rules="required" v-model="password" />
```

::: danger
This approach has some cons, for example if the wrapped component accepts props that have the same name as the `ValidationProvider` component. while it will receive these props, they may be of different types, which could lead to serious issues. The problem with HOCs is that you need to be aware of the underlying component implementation. THis can be problematic when working with 3rd party components.
:::

### Wrapping Components Manually

Instead we can wrap the field component with the ValidationProvider in a new component. This is easier and more flexible, and avoids some of the potential problems with Higher-Order components.

Consider this new `VTextFieldWithValidation` component.

```vue
<template>
  <ValidationProvider :rules="rules">
    <VTextField slot-scope="{ errors }" v-model="innerValue" :error-messages="errors" />
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate';

export default {
  props: {
    rules: [String],
    value: null
  },
  components: {
    ValidationProvider
  },
  data: () => ({
    innerValue: null
  }),
  watch: {
    innerValue (val) {
      this.$emit('input', val);
    }
  }
};
</script>

```

Ideally you would pass the props you need to either the `ValidationProvider` or the `VTextField` being validated, with this approach solves the verbosity problem while preserving the simple scoped slots API. It also allows you to distribute props without the issues of having a conflict, unlike HOC.

Using either of these approaches is at your preference.

## Reference

Below is the reference of the ValidationProvider public API.

### Props

All the following props are optional.

|Prop       | Type      | Default Value         | Description                                                                  |
|-----------|-----------|-----------------------|------------------------------------------------------------------------------|
| rules     | `string`  | `undefined`           | The validation rules.                                                        |
| vid       | `string`  | auto increment number | Identifier used for target/cross-field based rules.                          |
| immediate | `boolean` | `false`               | If the field should be validated immediately after render (initially).        |
| events    | `string[]`| `['input']`           | Events that will trigger validation.                                         |
| name      | `string`  | `undefined`           | A string that will be used to replace `{field}` in error messages and for [custom error messages](/guide/messages.md#field-specific-custom-messages). |
| bails     | `boolean` | `true`                | If true the validation will stop on the first failing rule.                  |
| debounce  | `number`  | `0`                   | Debounces the validation for the specified amount of milliseconds.           |

## Methods

Those are the only methods meant for public usage, other methods that may exist on the ValidationProvider are strictly internal.

|Method       | Args    | Return Value                | Description                                                                                                 |
|-------------|:-------:|:---------------------------:|-------------------------------------------------------------------------------------------------------------|
| validate    | `value?: any`  | `Promise<ValidationResult>` | Runs a validation of the current value against the rules defined. If a value is provided, it is used as the current value and validates it. |
| validateSilent | `void`  | `Promise<ValidationResult>` | Runs a validation of the current value against the rules defined. __does not mutate the validation state.__  |
| applyResult | `ValidationResult` | `void`           | Takes a __validation result__ object and applies it on the current state.                                   |
| reset       | `void`  | `void`                      | Resets validation state.                                                                                    |

### Events

The validation provider does not emit any events at this time.
