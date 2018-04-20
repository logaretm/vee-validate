## [ErrorBag](#error-bag)

The single error structure looks like this:

```js
const error = {
  field: 'Field name',
  msg: 'Error message',
  rule: 'Rule Name', // optional
  scope: 'Scope Name', // optional
  id: 'uniqueId' // optional
};
```

The ErrorBag class is a wrapper around an array - a collection object -, it is standalone and has no dependencies, you can use it in your code for any purpose:

```js
import { ErrorBag } from 'vee-validate';

const bag = new ErrorBag();

// For example, you may want to add an error related to authentication:
bag.add('email', 'Wrong Credentials', 'auth');

// Display it like this:
bag.first('email:auth');
```

<table class="table">
  <thead>
    <tr>
      <th>Method</th>
      <th>Params</th>
      <th>Return</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="is-method-name">add</td>
      <td>{error Object}</td>
      <td>void</td>
      <td>
        Adds an error to the error bag, the error object must conform the object signature mentioned above.
      </td>
    </tr>
    <tr>
      <td class="is-method-name">all</td>
      <td>{String scope?}</td>
      <td>Array</td>
      <td>Gets all error messages in an array, specifying a scope will retrieve the messages within that scope.</td>
    </tr>
    <tr>
      <td class="is-method-name">any</td>
      <td>{String scope?}</td>
      <td>Boolean</td>
      <td>Checks if any errors exist, specifying a scope will limit the check to within that scope.</td>
    </tr>
    <tr>
      <td class="is-method-name">clear</td>
      <td>{String scope?}</td>
      <td>undefined</td>
      <td>Clears (removes) all errors, specifying a scope will remove errors only associated with that scope.</td>
    </tr>
    <tr>
      <td class="is-method-name">collect</td>
      <td>{String name?},{String scope?}, {Boolean mapped?}</td>
      <td>Array|Object</td>
      <td>Collects errors associated with a specific field. Not passing the field name will group all errors by field name instead. Specifying a scope will limit the collecting behavior to a specific scope. You can optionally specify if the errors objects should be mapped to error messages or not, providing false will return objects containing the full information about the error.</td>
    </tr>
    <tr>
        <td class="is-method-name">count</td>
        <td></td>
        <td>Number</td>
        <td>Returns the number of errors that are currently in the collection.</td>
    </tr>
    <tr>
        <td class="is-method-name">first</td>
        <td>{String field|selector}, {String scope?}</td>
        <td>String</td>
        <td>Returns the first error message associated with a specific field or specified by the selector, providing a scope will look for messages within that scope.</td>
    </tr>
    <tr>
        <td class="is-method-name">firstById</td>
        <td>{String id}</td>
        <td>String</td>
        <td>Returns the first error message for a field with the given id.</td>
    </tr>
    <tr>
        <td class="is-method-name">firstByRule</td>
        <td>{String field}, {String rule}, {String scope?}</td>
        <td>String</td>
        <td>Returns the first error message associated with a specific field and rule, providing a scope will look for messages within that scope.</td>
    </tr>
  <tr>
      <td class="is-method-name">has</td>
      <td>{String field|selector}, {String scope?}</td>
      <td>Boolean</td>
      <td>Checks if there is an error message associated with a specific field or specified by the selector, providing a scope will check for messages within that scope.</td>
    </tr>
    <tr>
      <td class="is-method-name">remove</td>
      <td>{String field}, {String scope?}</td>
      <td>void</td>
      <td>Removes all errors associated with a specific field, specifying a scope will remove messages only for that field and scope.</td>
    </tr>
    <tr>
      <td class="is-method-name">update</td>
      <td>{String id}, {Object diff}</td>
      <td>void</td>
      <td>Updates a specific field's erorr messages data, used internally to keep field errors scope up to date.</td>
    </tr>
  </tbody>
</table>