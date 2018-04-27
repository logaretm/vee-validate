# Validator API

The validator offers an API to add new fields and trigger validations.

## API

### Properties

|Name  | Type  | Description  |
|---------|---------|---------|
| errors | [`ErrorBag`](/api/errorbag.md)| Instance of the ErrorBag class to manage errors. |
| fields     | [`FieldBag`](/api/fieldbag.md)| Instance of the FieldBag class to manage fields. |
| locale | `string` | The Currently activated locale. |

### Methods

|Name  | Return Type  |Description  |
|---------|---------|---------|
|attach(field: Field | FieldOptions) | `Field` | attaches a new field to the validator. |
| validate(selector?: String) | `Promise<boolean>` | Validates the matching fields of the provided [selector](#selector-api). |
| pause() | `void` | Disables validation. |
| resume() | `void` | Enables validation. |
| detach(name: string, scope?: string) | `void` | Detaches the field that matches the name and the scope of the provided values. |
| extend(name: string, rule: Rule) | `void` | Adds a new validation rule. The provided rule param must be a [valid Rule function or object](/validation.md#custom-rules). |

### Selector API

The selector passed to the `validate` method can have the following forms:

```js
// validate all fields within the context component.
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