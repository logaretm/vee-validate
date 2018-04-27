# Field

VeeValidate maps HTML elements and Vue components that are under validation to instances of `fields`, while this class not exposed to be used publicly you can find Its API very useful if you are planning to do some lower-level actions.

::: warning
  Any undocumented properties/methods are not intended for public use.
:::

## Getting the field instance

Getting a field instance is straightforward, you can use the `Validator.fields.find` method to get the field instance.

```js
// find the field which has a matching name of 'email'
const field = this.$validator.fields.find({ name: 'email' }));

// find the field which has a name of email and is in the 'newsletter' scope.
const field = this.$validator.fields.find({ name: 'email', scope: 'newsletter' });

// or use the id to find the field if it is known to you.
const field = this.$validator.fields.find({ id: 'fieldId' });
```

## API

::: danger
  Careful when using the field API, as it may disrupt the validator operations and may produce unintended results.
:::

### Constructor

### Properties

|Name  |Type  |Default  |Description  |
|---------|---------|---------|---------|
|id     | `string` |    `null`    | The id of the field (automatically generated).         |
|el     |    `HTMLElement`     |    `null`     | The element that is the HTML input or the root element of the component being validated. |
|updated | `boolean` | `false` | Indicates if the field should be re-scanned to update its properties like validation rules. |
|watchers | `Watcher[]` | `[]` | Array of wrappers for the event listeners being used by the field instance. |
|events     | `string[]` | `[]` | List of events that trigger validation. |
|rules | `{ [string]: Object }` | `{}` | A map of rules/params being used to validate the field. |
| validity | `boolean` | `false` | Whether the [HTML Constrained API](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation) should be used to apply error messages. |
| aria | `boolean` | `true` | If `aria-required` and `aria-invalid` attributes should be set/updated after validation. |
| vm | `Vue instance` | `null` | The context component that is using the directive in its template.|
| component | `Vue instance` | `null` | The component being validated if it is one. |
| ctorConfig | `VeeValidateConfig` | `null` | A scoped config for the field. |
| flags | `{ [string]: boolean }` | `{}` | A string/boolean map of the field current flags state.
| alias | `string` | `null` | A readonly prop for alternative name to be used by the field. |
| getter | `() => any` | `null` | A getter function that returns the current field value. |
| name | `string` | `null` | The field name. |
| scope | `string` | `null` | The field scope. |
| targetOf | `string` | `null` | The id of the field targeting this field for validation (confirmed/before/after). |
| initial | `boolean` | `false` | If this field should be validated upon creation. |
| classes | `boolean` | `false` | If flags based classes should be applied on the HTML input. |
| classNames | `Object` | `{}` | A map containing flag name / class names to be applied based on flags. |
| delay | `number` | `0` | The amount of delay for this field events triggers.|
| listen | `boolean` | `true` | If this field should have listeners. |
| model | `{ expression: string, lazy: boolean }` | `null` | Contains info about the model being bound to this field using `v-model`. |
| value | `any` | `() => undefined` | A readonly version of the `getter` prop.|
| isRequired | `boolean` | `true | false` | Readonly indicator if the field is required. (has required rule) |
| isDisabled | `boolean` | `true | false` | Readonly indicator if the field is disabled (skips validation). |
| validator | `Validator` | `null` | Readonly reference to the validator instance that created this field. |
| rejectsFalse | `boolean` | `false` | If `required` rule should fail when `false` is provided as a value. |

### Methods

|Signature  |Return Type  | Description |
|---------|---------|---------|
|matches(options: FieldMatchOptions) | `boolean` | Checks if the field matches the specified matching object criteria. |
|update(options: FieldOptions) | `void` | Updates the field properties and re-adds the listeners and syncs the classes applied. |
|reset() | `void` | Resets the field flags to their initial state. |
|setFlags(flags: { [string]: boolean }) | `void` | Updates the field flags and also updates the specified field counterparts eg. valid/invalid. |
|unwatch(tag?: RegExp) | `void` | Removes the listeners that has a matching tag or removes all if none is provided. |
| updateClasses() | `void` | Syncs the classes being applied on the element with the flags if enabled.|
| updateAriaAttrs() | `void` | Syncs the aria attributes applied on the element with the flags if enabled. |
| updateCustomValidity() | `void` | Syncs the constrained API validation message with the first error message for this field. |
| destroy() | `void` | Removes all listeners and dependencies of the field. |
