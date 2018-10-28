# Validator API

The validator offers an API to add new fields and trigger validations.

## API

### Properties

|Name  | Type  | Description  |
|---------|---------|---------|
| errors | [`ErrorBag`](/api/errorbag.md)| Instance of the ErrorBag class to manage errors. |
| fields     | [`FieldBag`](https://github.com/baianat/vee-validate/blob/master/src/core/fieldBag.js)| Instance of the FieldBag class to manage fields. |
| locale | `string` | The Currently activated locale. |

### Methods

|Name  | Return Type  |Description  |
|---------|---------|---------|
| attach(field: FieldOptions) | `Field` | attaches a new field to the validator. |
| validate(descriptor?: String, value?: any, options?: Object) | `Promise<boolean>` | Validates the matching fields of the provided [descriptor](#field-descriptor). when validation is done, the Promise resolves a boolean indicating whether the selected was valid or not. |
| validateAll(fields?: String or Object) | `Promise<boolean>` | Validates each value against the corresponding field validations. |
| pause() | `void` | Disables validation. |
| resume() | `void` | Enables validation. |
| verify(value: any, rules: string | Object) | { errors: string[], valid: boolean } | [verify method](#verify) |
| detach(name: string, scope?: string) | `void` | Detaches the field that matches the name and the scope of the provided values. |
| extend(name: string, rule: Rule, options?: ExtendOptions) | `void` | Adds a new validation rule. The provided rule param must be a [valid Rule function or object](/guide/custom-rules.md). |
| reset(matcher?: Object) | `void` | Resets field flags for all scoped fields. Resets all fields if no scope is provided. |

#### Scoped Reset() Usage
```js
let matcher = {
    scope: 'form-1',
    vmId: this.$validator.id
}

this.$validator.reset(matcher);
```

### Validate API

The validate method is the primary way to trigger validation, all arguments are optional but that will produce different results depending on which arguments you did provide.

#### Field Descriptor

The field descriptor is a string that can have the following forms:

```js
// validate all fields.
validator.validate();

// validate a field that has a matching name with the provided selector.
validator.validate('field');

// validate a field within a scope.
validator.validate('scope.field');

// validate all fields within this scope.
validator.validate('scope.*');

// validate all fields without a scope.
validator.validate('*');
```

#### Value

The value argument is optional, if the value is not passed to the `validate()` method, it will try to resolve it using the internal value resolution algorithm. When the value is passed, the algorithm will be skipped and that value will be used instead.

#### Validation Options

You can pass the options to modify the behavior of the validation, the options is an object that can contain the following:

|Property |Type       |Default    |Description  |
|---------|:---------:|:---------:|-------------|
|silent   | Boolean   | `false`   | If true the validate method will return the validation result without modifying the errors or the flags. |
|initial  | Boolean   | `false`   | If true the rules marked as [non-immediate](/guide/custom-rules.md#non-immediate-rules) will be skipped during this call, used to prevent initial validation from triggering backend calls. |

### Verify

The `Validator.verify` method validates a value against the specified rules, allowing you to use the validator programatically in your code without having to register fields using the `v-validate` directive, this is useful if you want to validate values rather than input fields, for example in a Vuex action.

```js
import { Validator } from 'vee-validate';

const v = new Validator();
const { valid, errors } = await v.verify('test', 'max:3');

// the valid prop indicates the result of validation.
console.log(valid); // false

// The `errors` is an array of error strings.
console.log(errors); // ["The {field} field may not be greater than 3 characters."]
```

::: tip
  Note that the messages returned will have {field} as the field name so you can replace it easily if you need to.
:::

#### Verify Options

Verify accepts a third parameter that is used to configure the validation and messages.

```js
v.verify(value, rules, opts);
```

|Prop     |Type       | Default Value | Description                                                                  |
|:--------|:---------:|:-------------:|:-----------------------------------------------------------------------------|
|name     | `string`  | `{field}`     | A string representing the field name used in error messages.                 |
|bails    | `boolean` |  `true`       | If true, stops validation on the first failing rule.                         |
|values   | `object`  |    `{}`       | An object mapping the values of other fields required for cross-field rules. |

#### Cross-Field Rules

Target dependant rules can be also used, you would need to pass the `values` object in the third parameter containing the other values keyed by target name.

```js
v.verify('pass', 'confirmed:conf', {
  values: {
    // target fields.
    conf: 'p@$$'
  }
});
```