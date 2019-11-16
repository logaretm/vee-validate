# Validation Provider

The `ValidationProvider` component is a component that wraps your inputs and provides validation state using [scoped slots](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots).

## Scoped Slot Props

These are the properties available on the slot scope accessible with `v-slot`:

| Name        |            Type            | Description                                                                                                   |
| :---------- | :------------------------: | :------------------------------------------------------------------------------------------------------------ |
| errors      |         `string[]`         | The list of error messages.                                                                                   |
| failedRules |   `[x: string]: string`    | A map object of failed rules with (rule, message) as a (key, value)                                           |
| aria        | `{ [x: string]: string }`  | Map object of aria attributes for accessibility.                                                              |
| classes     | `{ [x: string]: boolean }` | Map object of the classes configured based on the validation state.                                           |
| validate    |   `(e: any) => Promise`    | A function that is used as an event handler to trigger validation. Useful for fields that do not use v-model. |
| reset       |        `() => void`        | A function that resets the validation state on the provider.                                                  |
| valid       |    `boolean|undefined`     | If The field is valid.                                                                                        |
| invalid     |    `boolean|undefined`     | If the field is invalid.                                                                                      |
| changed     |         `boolean`          | If the field value has been changed.                                                                          |
| touched     |         `boolean`          | If the field has been blurred.                                                                                |
| untouched   |         `boolean`          | If the field wasn't blurred.                                                                                  |
| pristine    |         `boolean`          | If the field value was not manipulated.                                                                       |
| dirty       |         `boolean`          | If the field value has been manipulated.                                                                      |
| pending     |         `boolean`          | Indicates if the field validation is in progress.                                                             |
| required    |         `boolean`          | If the field is required.                                                                                     |
| validated   |         `boolean`          | If the field has been validated at least once.                                                                |
| passed      |         `boolean`          | If the field has been validated and is valid.                                                                 |
| failed      |         `boolean`          | If the field has been validated and is invalid.                                                               |

Since slot scopes can take advantage of ES6 destructing, you can opt-in for any of those properties and pass down to your slot template as you see fit, this is a small example that uses the `errors` prop:

```vue{1,3}
<ValidationProvider rules="required" v-slot="{ errors }">
  <div>
    <input type="text" v-model="value">
    <span>{{ errors[0] }}</span>
  </div>
</ValidationProvider>
```

## Rendering

By default, the `ValidationProvider` renders a `span`, Consider the following example where the highlighted represent the render output of the Provider component.

```vue
<ValidationProvider rules="required" v-slot="{ errors }">
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>

<!-- HTML Output -->
<span>
  <input type="text">
  <span>ERROR_MSG_PLACEHOLDER</span>
</span>
```

The default the rendered **tag** can be changed using the provider's `tag` prop.

```vue{2,10,16,19}
<!-- Multiple Child nodes using templates -->
<ValidationProvider rules="required" tag="div">
  <template v-slot="{ errors }">
    <input v-model="value" type="text">
    <span>{{ errors[0] }}</span>
  </template>
</ValidationProvider>

<!-- Multiple Child nodes directly -->
<ValidationProvider rules="required" v-slot="{ errors }" tag="div">
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>

<!-- Both have the same HTML Output -->
<div>
  <input type="text">
  <span>ERROR_MSG_PLACEHOLDER</span>
</div>
```

### Forcing Renderless

Sometimes it is unsuitable for a Provider component in principle to render anything extra, because of limitations in the Vue rendering engine, you cannot have multiple root nodes which limits the design choice to move away from renderless at the moment, in Vue 3.x it this may change with fragments.

A `slim` prop can be used to force the component to be renderless, by default it is set to `false`.

```vue{2,5,9,12}
<ValidationProvider rules="required" v-slot="{ errors }" slim>
  <div>
    <input v-model="value" type="text">
    <span>{{ errors[0] }}</span>
  </div>
</ValidationProvider>

<!-- HTML Output, NO OUTER SPANS -->
<div>
  <input type="text">
  <span>ERROR_MSG_PLACEHOLDER</span>
</div>
```

Note that **only the first child** will be rendered when `slim` is used, any other nodes will be dropped as you cannot have multiple root nodes in a renderless component. Be mindful of that when using the `slim` prop.

```vue{2,7}
<ValidationProvider rules="required" v-slot="{ errors }" slim>
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>

<!-- Only input is rendered, the span is dropped -->
<input type="text">
```

## Props

All the following props are optional.

| Prop           | Type                      | Default Value         | Description                                                                                         |
| -------------- | ------------------------- | --------------------- | --------------------------------------------------------------------------------------------------- |
| rules          | `string`                  | `undefined`           | The validation rules.                                                                               |
| vid            | `string`                  | auto increment number | Identifier used for target/cross-field based rules.                                                 |
| immediate      | `boolean`                 | `false`               | If the field should be validated immediately after render (initially).                              |
| name           | `string`                  | `undefined`           | Specifies a field name to be used in error messages.                                                |
| bails          | `boolean`                 | `true`                | If true, the validation will stop on the first failing rule.                                        |
| skipIfEmpty    | `boolean`                 | `true`                | If true, the validation will be skipped if the value is empty).                                     |
| debounce       | `number`                  | `0`                   | Debounces the validation for the specified amount of milliseconds.                                  |
| tag            | `string`                  | `span`                | The default tag to [render](#rendering).                                                            |
| disabled       | `boolean`                 | `false`               | If true, the provider will be ignored when `validate` is called by a parent observer.               |
| customMessages | `{ [k: string]: string }` | `{}`                  | Custom error messages, keyed by rule name. These will override any default and configured messages. |

## Methods

Those are the only methods meant for public usage, other methods that may exist on the ValidationProvider are strictly internal.

| Method         |        Args        |        Return Value         | Description                                                                                                                                 |
| -------------- | :----------------: | :-------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------- |
| validate       |   `value?: any`    | `Promise<ValidationResult>` | Runs a validation of the current value against the rules defined. If a value is provided, it is used as the current value and validates it. |
| validateSilent |       `void`       | `Promise<ValidationResult>` | Runs a validation of the current value against the rules defined. **does not mutate the validation state.**                                 |
| applyResult    | `ValidationResult` |           `void`            | Takes a **validation result** object and applies it on the current state.                                                                   |
| reset          |       `void`       |           `void`            | Resets validation state.                                                                                                                    |
| setFlags       |       Object       |           `void`            | Updates the field flag states with an object, the object properties should be the flag names and the values should be boolean values.       |
| setErrors      |     `string[]`     |           `void`            | Updates the field errors and flags if errors length is > 1                                                                                  |

## Events

The validation provider does not emit any events at this time.
