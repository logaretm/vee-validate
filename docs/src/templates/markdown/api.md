## [v-validate Directive](#directive)

The `v-validate` directive is the main way to validate your inputs, the directive accepts either a string or an object as a value.  
If a string was passed it must be a valid rules string, that is the validation rules seperated by pipes '|'.

```vue
  <input v-validate="'required|email'" name="field" type="text">
```  

If an object was passed it must contain a rules property which can be either a rule string like above or an object, here is the valid directive expression values:

```js
// String
const expression = 'required|regex:^[0-9]+';

// Object with rules as string.
const expression = {
  rules: 'required|regex:^[0-9]+', // required
  scope: 'myscope', // optional
  arg: 'form.email' // optional
};

// Object with rules as object.
const expression = {
  rules: {
    // parameterless rules take a boolean value.
    required: true,
    // single parameter rules take a single value.
    regex: /.(js|ts)$/,
    // multiple paramter rules take a single array.
    in: [1, 2, 3] 
  },
  scope: 'myscope', // optional
  arg: 'from.email' // optional
};

// You can omit the omit nesting the rules in a property if you don't
// need to provide other options.
const expression = {
  // parameterless rules take a boolean value.
  required: true,
  // single parameter rules take a single value.
  regex: /.(js|ts)$/,
  // multiple paramter rules take a single array.
  in: [1, 2, 3]
};
```

## [args](#directive-args)

The directive also accepts an arg, that denotes the name of the vue model to validate.

```vue
  <input v-model="email" v-validate:email="'required|email'" name="field" type="text">
```

```js
export default {
  data: () => ({
    email: ''
  })
};
```

However the arg is entirly optional, additionaly, `v-validate` checks if the input/component has `v-model` assigned to it, and treats that expression as the arg. But keep in mind that the arg must be a simple dot notation string, and it must be present on the vue instance.

> You might ask when to use arg at all? since `v-model` can be detected. A valid situation is when you need to validate a computed property.


## [data-* Attributes](#data-attributes)

data-* attributes provide an alternate interface for the plugin to specify what exactly should happen, providing a simple and Vue version-compatiable API. They are useful if you do not like to pass complex expressions to the directive.


<table class="table">
    <thead>
        <tr>
            <th>Attribute</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="is-method-name">data-vv-as</td>
            <td>Specifies a pretty name for the field.</td>
        </tr>
        <tr>
            <td class="is-method-name">data-vv-delay</td>
            <td>Specifies the delay amount in milliseconds for triggering the validation.</td>
        </tr>
        <tr>
            <td class="is-method-name">data-vv-name</td>
            <td>Specifies a name for the field, used in components validation and as a fallback name for inputs.</td>
        </tr>
        <tr>
            <td class="is-method-name">data-vv-rules [deprecated]</td>
            <td>Specifies the list of validations to be run against the field value.</td>
        </tr>
        <tr>
            <td class="is-method-name">data-vv-value-path</td>
            <td>Specifies the value path within a component $data to retrive the component current value. Only used for components.</td>
        </tr>
        <tr>
            <td class="is-method-name">data-vv-validate-on</td>
            <td>Used to specify a list of event names seperated by pipes, the default varies by the type of the input</td>
        </tr>
    </tbody>
</table>


## [ErrorBag](#error-bag)

The single error must look like this:

```js
const error = {
  field: 'Field name',
  msg: 'Error message',
  rule: 'Rule Name',
  scope: 'Scope Name'
};
```

The ErrorBag class is a wrapper around an array - a collection object -, it is standalone and has no dependencies, you can use it in your code for any reason:

```js
import { ErrorBag } from 'vee-validate';

const bag = new ErrorBag();

// For example you may want to add an errror related to authentication:
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
      <td>{String field}, {String msg}, {String ruleName}, {String scope?}</td>
      <td>undefined</td>
      <td>Adds an error to the errors object.</td>
    </tr>
    <tr>
      <td class="is-method-name">all</td>
      <td>{String scope?}</td>
      <td>Array</td>
      <td>Gets all error messages in an array, specifying a scope will retrive the messages within that scope.</td>
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
      <td>Collects errors associated with a specific field. not passing the field name will group all errors by field name instead. specifying a scope will limit the collecting behavior to a specific scope. You can optionally specify if the errors objects should be mapped to error messages or not,  providing false will return objects containing the full information about the error.</td>
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
      <td>undefined</td>
      <td>Removes all errors associated with a specific field, specifying a scope will remove messages only for that field and scope.</td>
    </tr>
  </tbody>
</table>

## [Validator](#validator)

The validator is injected to the Vue instance as `$validator` automatically. However it is also a standalone class and can be used separately for programmatically validating values. The constructor can optionally take an object to map each field name to a set of validations.

```js
import { Validator } from 'vee-validate';
const validator = new Validator({
  email: 'required|email',
  name: 'required|alpha|min:3'
});

// Or
Validator.create();
```

But you can construct the object without passing anything and add the validation rules later.

```js
import { Validator } from 'vee-validate';
const validator = new Validator();

validator.attach('email', 'required|email'); // attach field.
validator.attach('name', 'required|alpha', { prettyName: 'Full Name' }); // attach field with display name for error generation.
validator.detach('email'); // you can also detach fields.
```
After that you can validate values with `validate(field, value)` which should return a boolean if all validations pass. Like this:

```js
validator.validate('email', 'foo@bar.com'); // true
validator.validate('email', 'foo@bar'); // false
```
> Most validators return a Boolean, however some validators (very few) return a `Promise` The validator is aware of this and will only return a Promise if at least one validation yields a promise. the promise is resolved to boolean which you can later chain to check your fields.

You can validate multiple values at the same time using `validateAll(obj)`:
```js
validator.validateAll({ email: 'foo@bar.com', name: 'John Snow' }).then(result => {
  if (!result) {
    // validation failed.
  }
  // success stuff.
}).catch(() => {
  // something went wrong (non-validation related).
});
```

Returns a `Promise` The ErrorBag will be populated with any errors encountered, Throws if any error has been encountered. You can access the `errorBag` property directly or using `getErrors()`.

```js
var errorBag = validator.errorBag;
// or
var errorBag = validator.getErrors();
```

The validator instance can only generate messages for one locale at a time. But you need to use `setLocale` method to switch the validator locale. 

```js
validator.setLocale('ar');
```
> All validators share the same locale configuration. so any locale changes will update all validator instances across your app. For more information about how to overwrite messages and add new ones, please refer to the [custom messages](rules.html#custom-messages) section.

```js
import { Validator } from 'vee-validate'; 

// Also exposed on the class.
Validator.setLocale('ar'); // Set all validator locales to 'ar'.

Validator.create().getLocale() // 'ar';

Validator.setLocale(); // resets to english because no argument was passed, all validators will be switched to English.
```

Check the full API at [GitHub](https://github.com/logaretm/vee-validate/blob/master/src/validator.js)

## [Validator Example](#validator-example)

Here is an example of using the validator without the directive, which means you will be responsible for monitoring input changes on your own, and calling the API methods as you see fit. This example uses a Vue instance to simplify things, but it can be used in plain JavaScript as well.
