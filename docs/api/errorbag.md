# ErrorBag

The ErrorBag class is a wrapper around an array - a collection object -, it is standalone and has no dependencies, you can use it in your code for any purpose:

```js
import { ErrorBag } from 'vee-validate';

const bag = new ErrorBag();

// For example, you may want to add an error related to authentication:
bag.add({
  field: 'auth',
  msg: 'Wrong Credentials'
});

// Display it like this:
bag.first('auth');
```

The single error object looks like this:

```js
const error = {
  field: 'Field name',
  msg: 'Error message',
  rule: 'Rule Name', // optional
  scope: 'Scope Name', // optional
  regenerate: () => 'some string', // optional
  id: 'uniqueId' // optional
};
```

## API

|Method|Return|Description|
|:---|:---:|:----|
| add(error: ErrorObject) | `void` | Adds an error to the error bag, the error object must conform the object signature mentioned above.|
| all(scope?: string) | `Array` | Gets all error messages in an array, specifying a scope will retrieve the messages within that scope.|
| any(scope?: string) | `boolean` | Checks if any errors exist, specifying a scope will limit the check to within that scope.|
| clear(scope?: string) | `void` |Clears (removes) all errors, specifying a scope will remove errors only associated with that scope.|
| collect(field?: string, scope?:string, mapped?: boolean) | `Array|Object` | Collects errors associated with a specific field. Not passing the field name will group all errors by field name instead. Specifying a scope will limit the collecting behavior to a specific scope. You can optionally specify if the errors objects should be mapped to error messages or not, providing false will return objects containing the full information about the error.|
| count() | `number` | Returns the number of errors that are currently in the collection.|
| first(field: string, scope?: string) | `string|null` |Returns the first error message associated with a specific field or specified by the selector, providing a scope will look for messages within that scope.|
| firstById(id: string) |`string|null` |Returns the first error message for a field with the given id.|
| firstByRule(field: string, rule: string, scope?: string)| `string|null` |Returns the first error message associated with a specific field and rule, providing a scope will look for messages within that scope.|
| has(field: string, scope?: string) | `boolean` |Checks if there is an error message associated with a specific field or specified by the selector, providing a scope will check for messages within that scope.|
| remove(field: string, scope?: string) | `void`| Removes all errors associated with a specific field, specifying a scope will remove messages only for that field and scope.|
| removeById(id: string) | `void` | Removes a field which matches the provided id.
| update(id: string, diff: ErrorObject) | `void` | Updates a specific field's error messages data, used internally to keep field errors scope up to date.|
