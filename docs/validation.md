# Validation

## Syntax

The validation rules have a simple syntax similar to [Laravel validation syntax](https://laravel.com/docs/5.4/validation).

A validation expression is a string of a series of validators separated by a pipe `|`:

```js
const single = 'required'; // single rule.
const multiple = 'required|numeric' // multiple rules.
```

Rules can also take on an object form for complex and more readable rules:

```js
const single = { required: true }; // required field.
const multiple = {
  required: true,
  numeric: true,
  email: true
};
```

Some rules can have parameters, which are passed in a comma separated list without spaces.

```js
const someRule = 'in:1,2,3,4';
const someRuleObj = { in: [1, 2, 3, 4] };
```

The validation rules have a simple syntax similar to [Laravel validation syntax](https://laravel.com/docs/5.4/validation).

A validation expression is a string of a series of validators separated by a pipe `|`:

```js
const single = 'required'; // single rule.
const multiple = 'required|numeric' // multiple rules.
```

Rules can also take on an object form for complex and more readable rules:

```js
const single = { required: true }; // required field.
const multiple = {
  required: true,
  numeric: true,
  email: true
};
```

Some rules can have parameters, which are passed in a comma separated list without spaces.

```js
const someRule = 'in:1,2,3,4';
const someRuleObj = { in: [1, 2, 3, 4] };
```

::: tip
  In object form, rules accept a single value if the rule accepts a single argument. If multiple arguments are passed, you should pass them as an array in the same order.
:::

::: warning
  Date validators require the `date_format` rule to always be present ([or globally set](https://github.com/baianat/vee-validate/releases/tag/2.0.0-rc.7)) and must preceed them in the rules order.
:::

## Available Rules

### [after:{target},{inclusion?}](#rule-after)

The field under validation must have a valid date and is after the date value in the target field.

- `target:` The input name to be validated against. Must have the same format as the date_format rule. Can also be a date value of the same format.
- `inclusion`: Whether to include equal dates as a valid value, setting it to any value will set it to true, it is false by default.

<input v-validate="'date_format:DD/MM/YYYY|after:after_field_target'" :class="{'input': true, 'is-danger': errors.has('after_field') }" name="after_field" type="text" placeholder="DD/MM/YYYY">
<span v-show="errors.has('after_field')" class="help is-danger">{{ errors.first('after_field') }}</span>

<input name="after_field_target" :class="{'input': true, 'is-danger': errors.has('after_field') }" type="text" placeholder="DD/MM/YYYY">

> Target based rules like `after`, `before`, and `confirmed` can target custom components as well as native inputs, but when targeting custom components the target field must have a `ref` attribute set and the confirmed paramter must be the same ref value prefixed with `$` sign to tell the validator that it should look for the target field in the component local `refs`. More  information are in the `RC.8` [release notes](https://github.com/baianat/vee-validate/releases/tag/2.0.0-rc.8).

### [alpha](#rule-alpha)

The field under validation may only contain alphabetic characters.

<input v-validate="'alpha'" :class="{'input': true, 'is-danger': errors.has('alpha_field') }" name="alpha_field" type="text" placeholder="Enter Some Characters...">
<span v-show="errors.has('alpha_field')" class="help is-danger">{{ errors.first('alpha_field') }}</span>

### [alpha_dash](#rule-alpha_dash)

The field under validation may contain alphabetic characters, numbers, dashes or underscores.

<input v-validate="'alpha_dash'" :class="{'input': true, 'is-danger': errors.has('alpha_dash_field') }" name="alpha_dash_field" type="text" placeholder="Enter characters or dashes">
<span v-show="errors.has('alpha_dash_field')" class="help is-danger">{{ errors.first('alpha_dash_field') }}</span>

### [alpha_num](#rule-alpha_num)

The field under validation may contain alphabetic characters or numbers.

<input v-validate="'alpha_num'" :class="{'input': true, 'is-danger': errors.has('alpha_num_field') }" name="alpha_num_field" type="text" placeholder="Enter characters and numbers">
<span v-show="errors.has('alpha_num_field')" class="help is-danger">{{ errors.first('alpha_num_field') }}</span>

### [alpha_spaces](#rule-alpha_spaces)

The field under validation may contain alphabetic characters or spaces.

<input v-validate="'alpha_spaces'" :class="{'input': true, 'is-danger': errors.has('alpha_spaces_field') }" name="alpha_spaces_field" type="text" placeholder="Enter characters and spaces">
<span v-show="errors.has('alpha_spaces_field')" class="help is-danger">{{ errors.first('alpha_spaces_field') }}</span>

### [before:{target},{inclusion?}](#rule-before)

The field under validation must have a valid date and is before the date value in the target field.

- `target`: The input name to be validated against. Must have the same format as the date_format rule. Can also be a date value of the same format.
- `inclusion`: Whether to include equal dates as a valid value, setting it to any value will set it to true, it is false by default.

<input v-validate="'date_format:DD/MM/YYYY|before:before_field_target'" :class="{'input': true, 'is-danger': errors.has('before_field') }" name="before_field" type="text" placeholder="DD/MM/YYYY">
<span v-show="errors.has('before_field')" class="help is-danger">{{ errors.first('before_field') }}</span>

<input name="before_field_target" :class="{'input': true, 'is-danger': errors.has('alpha_field') }" type="text" placeholder="DD/MM/YYYY">

### [between:{min},{max}](#rule-between)

The field under validation must have a numeric value bounded by a minimum value and a maximum value.

- `min:` The minimum value.
- `max:` The maximum value.

<input v-validate="'between:1,11'" :class="{'input': true, 'is-danger': errors.has('between_field') }" name="between_field" type="text" placeholder="Enter a number between 1 and 11">
<span v-show="errors.has('between_field')" class="help is-danger">{{ errors.first('between_field') }}</span>

### [confirmed:{target}](#rule-confirmed)

The field under validation must have the same value as the confirmation field.

- `target:` The name of the confirmation field.

<input v-validate="'confirmed:pw_confirm'" :class="{'input': true, 'is-danger': errors.has('confirm_field') }" name="confirm_field" type="password" placeholder="Enter The Password">
<span v-show="errors.has('confirm_field')" class="help is-danger">{{ errors.first('confirm_field') }}</span>

<input name="pw_confirm" :class="{'input': true, 'is-danger': errors.has('confirm_field') }" type="password" placeholder="Confirm the password">

### [credit_card](#rule-credit_card)

The field under validation must be a valid credit card.

<input v-validate="'credit_card'" :class="{'input': true, 'is-danger': errors.has('credit_field') }" name="credit_field" type="text" placeholder="Enter A Credit Card Number">
<span v-show="errors.has('credit_field')" class="help is-danger">{{ errors.first('credit_field') }}</span>

### [date_between:{min,max},{inclusion?}](#rule-date_between)

The field under validation must be a valid date between the two dates specified.

- `min:`The minimum allowed value for date. Must be in the same format as the date_format rule.
- `max:`The maximum allowed value for date. Must be in the same format as the date_format rule.
- `inclusion`: Whether to include equal dates as a valid value, it is set to `()` (exclude) by default.
   (For further information check the [monentjs inclusion docs](https://momentjs.com/docs/#/query/is-between/)vee-validate uses [date-fns](https://date-fns.org) but ported this functionality.

<input v-validate="'date_format:DD/MM/YYYY|date_between:10/09/2016,20/09/2016'" :class="{'input': true, 'is-danger': errors.has('date_between_field') }" name="date_between_field" type="text" placeholder="DD/MM/YYYY betweem 10/09/2016 and 20/09/2016">
<span v-show="errors.has('date_between_field')" class="help is-danger">{{ errors.first('date_between_field') }}</span>

### [date_format:{format}](#rule-date_format)

The field under validation must be a valid date in the specified format. This rule must be present when using any date rule.

- `format:` The date format. See [date-fns format](https://date-fns.org/v2.0.0-alpha.7/docs/format)

<input v-validate="'date_format:DD/MM/YYYY'" :class="{'input': true, 'is-danger': errors.has('date_format_field') }" name="date_format_field" type="text" placeholder="DD/MM/YYYY">
<span v-show="errors.has('date_format_field')" class="help is-danger">{{ errors.first('date_format_field') }}</span>

### [decimal:{decimals?}](#rule-decimal)

The field under validation must be numeric and may contain the specified amount of decimal points.

- `decimals:` The maximum allowed number of decimal point numbers. Not passing the decimals will accept numeric data which may or may not contain decimal point numbers.

<input v-validate="'decimal:3'" :class="{'input': true, 'is-danger': errors.has('decimal_field') }" name="decimal_field" type="text" placeholder="Numeric value with decimals">
<span v-show="errors.has('decimal_field')" class="help is-danger">{{ errors.first('decimal_field') }}</span>

### [digits:{length}](#rule-digits)

The field under validation must be numeric and have the specified number of digits.

- `length:` The number of digits.

<input v-validate="'digits:3'" :class="{'input': true, 'is-danger': errors.has('digits_field') }" name="digits_field" type="text" placeholder="Enter 3 digit number">
<span v-show="errors.has('digits_field')" class="help is-danger">{{ errors.first('digits_field') }}</span>

### [dimensions:{width},{height}](#rule-dimensions)

The file added to the field under validation must be an image (jpg,svg,jpeg,png,bmp,gif) having the exact specified dimension.

- `width:` The width of the image.
- `height:` The height of the image.

<input v-validate="'dimensions:30,30'" data-vv-as="image" name="dimensions_field" type="file">
<span v-show="errors.has('dimensions_field')" class="help is-danger">{{ errors.first('dimensions_field') }}</span>

### [email](#rule-email)

The field under validation must be a valid email.

<input v-validate="'email'" data-vv-as="email" :class="{'input': true, 'is-danger': errors.has('email_field') }" name="email_field" type="text" placeholder="Your Email">
<span v-show="errors.has('email_field')" class="help is-danger">{{ errors.first('email_field') }}</span>

### [ext:[extensions]](#rule-ext)

The file added to the field under validation must have one of the extensions specified.

- `extensions:` Comma separated list of extensions. ex: `ext:jpg,png,bmp,svg

<input v-validate="'ext:jpeg,jpg'" data-vv-as="field" name="ext_field" type="file">
<span v-show="errors.has('ext_field')" class="help is-danger">{{ errors.first('ext_field') }}</span>

### [image](#rule-image)

The file added to the field under validation must have an image mime type (image/*).

<input v-validate="'image'" data-vv-as="image" name="image_field" type="file">
<span v-show="errors.has('image_field')" class="help is-danger">{{ errors.first('image_field') }}</span>

### [in:[list]](#rule-in)

The field under validation must have a value that is in the specified list.

- `list:` Comma separated list of values. ex `in:1,2,3`

<span class="select">
  <select v-validate="'in:1,2,3'" :class="{ 'is-danger': errors.has('in_field') }" name="in_field" data-vv-as="selected">
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
    <option value="4">Invalid</option>
  </select>
</span>
<span v-show="errors.has('in_field')" class="help is-danger">{{ errors.first('in_field') }}</span>

### [ip](#rule-ip)
The field under validation must have a string that is a valid ipv4 value.

<input v-validate="'ip'" data-vv-as="ip" :class="{'input': true, 'is-danger': errors.has('ip_field') }" name="ip_field" type="text" placeholder="Your IP Address">
<span v-show="errors.has('ip_field')" class="help is-danger">{{ errors.first('ip_field') }}</span>

### [is:{value}](#rule-is)

The field under validation must be equal to the first argument passed, uses `===` for equality checks. This rule is useful for confirming passwords when used in object form. Note that using the string format will cause any arguments to be parsed as strings, so use the object format when using this rule.

- `value:` A value of anytype to be compared against the field value.

```html
<input v-validate="{ is: confirmation }" type="text" name="password">
<input v-model="confirmation" type="text" name="password_confirmation">
```

### [max:{length}](#rule-max)

The field under validation length may not exceed the specified length.

- `length:` A numeric value representing the maximum number of characters.

<input v-validate="'max:11'" data-vv-as="field" :class="{'input': true, 'is-danger': errors.has('max_field') }" name="max_field" type="text" placeholder="11 Characters or shorter">
<span v-show="errors.has('max_field')" class="help is-danger">{{ errors.first('max_field') }}</span>

### [max_value:{value}](#rule-max_value)

The field under validation must be a numeric value and must not be greater than the specified value.

- `value:` A numeric value representing the greatest value allowed.

<input v-validate="'max_value:9000'" data-vv-as="field" :class="{'input': true, 'is-danger': errors.has('max_value_field') }" name="max_value_field" type="text" placeholder="Can you go over 9000?">
<span v-show="errors.has('max_value_field')" class="help is-danger">{{ errors.first('max_value_field') }}</span>

### [mimes:[list]](#rule-mimes)

The file type added to the field under validation should have one of the specified mime types.

- `list:` List of comma separated mime types. `mimes:image/jpeg,image/png`

<label class="label">Image File</label>
<input v-validate="'mimes:image/*'" data-vv-as="image" name="mimes_field" type="file">
<span v-show="errors.has('mimes_field')" class="help is-danger">{{ errors.first('mimes_field') }}</span>

> You can use '*' to specify a wild card, something like `mimes:image/*` will accept all image types.

### [min:{length}](#rule-min)

The field under validation length should not be less than the specified length.

- `length:` A numeric value representing the minimum number of characters.

<input v-validate="'min:3'" data-vv-as="field" :class="{'input': true, 'is-danger': errors.has('min_field') }" name="min_field" type="text" placeholder="Min: 3">
<span v-show="errors.has('min_field')" class="help is-danger">{{ errors.first('min_field') }}</span>

### [min_value:{value}](#rule-min_value)

The field under validation must be a numeric value and must not be less than the specified value.

- `value:` A numeric value representing the lowest value allowed.

<input v-validate="'min_value:10'" data-vv-as="field" :class="{'input': true, 'is-danger': errors.has('min_value_field') }" name="min_value_field" type="text" placeholder="What is bigger than 10?">
<span v-show="errors.has('min_value_field')" class="help is-danger">{{ errors.first('min_value_field') }}</span>

### [not_in:[list]](#rule-not_in)

The field under validation length should not have any value within the specified value.

- `list:` Comma separated list of invalid values. ex: `not_in:1,2,3`

<span class="select">
  <select v-validate="'not_in:1,2,3'" :class="{ 'is-danger': errors.has('not_in_field') }" name="not_in_field" data-vv-as="selected">
    <option value="1">One - Invalid</option>
    <option value="2">Two - Invalid</option>
    <option value="3">Three - Invalid</option>
    <option value="4">Four - Valid</option>
  </select>
</span>
<span v-show="errors.has('not_in_field')" class="help is-danger">{{ errors.first('not_in_field') }}</span>

### [numeric](#rule-numeric)

The field under validation must only consist of numbers.

<input v-validate="'numeric'" data-vv-as="field" :class="{'input': true, 'is-danger': errors.has('numeric_field') }" name="numeric_field" type="text" placeholder="Numbers only">
<span v-show="errors.has('numeric_field')" class="help is-danger">{{ errors.first('numeric_field') }}</span>

### [regex:{pattern}](#rule-regex)

The field under validation must match the specified regular expression.

- `pattern:` A regular expression
- `flags:` list of regular expression flags (optional)

<label class="label">Regex: ^([0-9]+)$</label>
<input v-validate="'regex:^([0-9]+)$'" data-vv-as="field" :class="{'input': true, 'is-danger': errors.has('regex_field') }" name="regex_field" type="text" placeholder="Numbers only">
<span v-show="errors.has('regex_field')" class="help is-danger">{{ errors.first('regex_field') }}</span>

> You should not use the pipe '|' or commas ',' within your regular expression
> when using the string rules format as it will cause a conflict with how
> validators parsing works. You should use the object format of the rules
> instead. Note that when using the object format in your HTML template, you
> need to escape all backslashes.
> Example: `v-validate="{ required: true, regex: /\\.(js|ts)$/ }"`

### [required:{invalidateFalse?}](#rule-required)

The field under validation must have a non-empty value. By default, all validators pass the validation if they have "empty values" unless they are required. Those empty values are: empty strings, `undefined`, `null`.

By default, the boolean value of `false` will pass validate. Setting invalidateFalse to true will fail validation for false values. For example, using `v-validate="'required:true'"` is helpful to support pseudo-checkbox validations where the checkbox must be checked. Note that `<input type='checkbox' v-validate="'required'" />` automatically supports this scenario.

<input v-validate="'required'" data-vv-as="field" :class="{'input': true, 'is-danger': errors.has('required_field') }" name="required_field" type="text" placeholder="Is Required">
<span v-show="errors.has('required_field')" class="help is-danger">{{ errors.first('required_field') }}</span>

### [size:{kb}](#rule-size)

The file size added to the field under validation must not exceed the specified size in kilobytes.

- `size:` The maximum file size in kilobytes.

<input v-validate="'size:10'" name="size_field" data-vv-as="file" type="file">
<span class="help is-danger" v-show="errors.has('size_field')">{{ errors.first('size_field') }}</span>

### [url:{require_protocol?}](#rule-url)

The field under validation must be a valid url. Protocols are not required by default.

- `require_protocol:` If the protocol should be required. It's set to false by default. Passing anything will require it.

<input v-validate="'url:require_protocol'" data-vv-as="field" :class="{'input': true, 'is-danger': errors.has('url_field') }" name="url_field" type="text" placeholder="Enter a url">
<span v-show="errors.has('url_field')" class="help is-danger">{{ errors.first('url_field') }}</span>

## Flags

vee-validate includes few flags that could help you improve your user experience, each field under validation has its own set of flags which are:

- `touched`: indicates that the field has been touched or focused.
- `untouched`: indicates that the field has not been touched nor focused.
- `dirty`: indicates that the field has been manipluated.
- `pristine`: indicates that the field has not been manipluated.
- `valid`: indicates that the field has been validated at least once and that it passed the validation.
- `invalid`: indicates that the field has been validated at least once and that it failed the validation.
- `pending`: indicates that the field validation is in progress.
- `validated`: indicates that the field has been validated at least once.
- `changed`: indicates that the field value has been changed (strict check).

The flags are reactive objects, so you can build computed properties based on them. For example, here is how you can tell if a form has been manipulated, say maybe to disable/enable a button.

```js
export default {
  // ...
  computed: {
    isFormDirty() {
      return Object.keys(this.fields).some(key => this.fields[key].dirty);
    }
  },
  //...
}
```

The global fields flags are accessed via objects like this:

```js
// Is the 'name' field dirty?
this.fields.name.dirty;
```

However, for the scoped fields, the **FieldBag** will group those fields in an property name that is prefixed by a `$` to indicate that it is a scope object:

```js
// Is the 'name' field dirty?
this.fields.$myScope.name.dirty;

// Is the 'name' field clean?
this.fields.$myScope.name.pristine;
```

Here is what it would look like:

```html
<div class="form-input">
  <input type="text" name="email" v-validate="'required|email'" placeholder="Email">
  <span v-show="errors.has('field')">{{ errors.first('field') }}</span>
  <span v-show="fields.email && fields.email.dirty">I'm Dirty</span>
  <span v-show="fields.email && fields.email.touched">I'm touched</span>
  <span v-show="fields.email && fields.email.valid">I'm valid</span>
</div>
```

```html
<div class="form-input">
  <input data-vv-scope="scope" type="text" name="email" v-validate="'required|email'" placeholder="Email">
  <span v-show="errors.has('scope.field')">{{ errors.first('scope.field') }}</span>
  <span v-show="fields.$scope && fields.$scope.email && fields.$scope.email.dirty">I'm Dirty</span>
</div>
```

::: danger
  Notice the additional checks before the actual flag check, this is because the flags aren't actually available until the `mounted()` life cycle event, so to avoid `created()` life cycle errors we need to add those checks.
:::

This can become quite tedious if you are referencing multiple flags, so it might be useful to use the `mapFields` helper, which is similar to Vuex's `mapGetters` and `mapActions` as it maps a field object to a computed property.

```js
import { mapFields } from 'vee-validate'

export default {
  // ...
  computed: mapFields(['name', 'email', 'scope.email']),
 // ...
}
```

You can also provide an object to rename the mapped props:

```js
import { mapFields } from 'vee-validate'

export default {
  // ...
  computed: mapFields({
    fullname: 'name',
    phone: 'scope.phone'
  }),
 // ...
}
```

::: tip
  Note that scoped fields names in the array from is mapped to a non-nested name.
:::

You can use the object spread operator to add the mapped fields to your existing computed components:

```js
import { mapFields } from 'vee-validate'

export default {
  // ...
  computed: {
    ...mapFields(['name', 'email', 'scope.phone']),
    myProp() {
       // ....
    }
  },
 // ...
}
```

Additionally, in case you want to set the flags manually, you can use the `Validator.flag(fieldName, flagsObj)` method:

```js
// flag the field as valid and dirty.
this.$validator.flag('field', {
  valid: false,
  dirty: true
});

// set flags for scoped field.
this.$validator.flag('scoped.field', {
  touched: false,
  dirty: false
});
```

For custom components, in order for the flags to fully work reliably, you need to emit those events:

The input event, which you probably already emit, will set the dirty and pristine flags.

```js
this.$emit('input', value);

// The focus event which will set the touched and untouched flags.
this.$emit('focus');
```

Here is an example that displays those flags, intereact with the input and watch the flags change accordingly:

## Custom Rules

You can easily add custom rules to the validators, but your custom validation rules must adhere to a contract, or certain structure:

### Function Form

This is the most basic custom validator form, it consists of only a function that returns either a Boolean or a promise. However, it will have a default error message.

```js
const validator = (value, args) => {
  // Return a Boolean or a Promise that resolves to a boolean.
};
```

### Object Form

```js
const validator = {
  getMessage(field, args) {
    // will be added to default locale messages.
    // Returns a message.
  },
  validate(value, args) {
    // Returns a Boolean or a Promise that resolves to a boolean.
  }
};
```

This validator object must have a `validate` method, and can contain a `getMessage` method which will be merged into the current dictionary locale. For multiple languages, you should use the [localization API](localization.html).

::: tip
  Notice how the `getMessage` method receives the `field` which is the name of the field under validation as a first parameter. And how the `validate` method receives the value as a first parameter. And both receive the `args` array which contains the arguments that were configured with the validation rule. take a look at the [actual implementation of the min rule](https://github.com/logaretm/vee-validate/blob/master/src/rules/min.js) as an example.
:::

::: warning
  As you can see, a validation rule must implement one of the two forms discussed above. Not doing so will throw an exception with a suitable error message detailing what you were missing.
:::

### Reasoning

Additionally, you may want to provide a reason for failing the validation that may change the error message. For example, you may be using an external API and the error message is generated there.

To achieve this, you need to return an `Object` instead of a `Boolean` this object should always contain a `valid` property and an optional `data` property, the data property will be passed to the message generator function as the third parameter, then you should use the passed data property to modify the output message. The same thing applies to promises as you resolve the promise with an object containing those properties. Here is a custom rule that does just that:

```js
const myRule = {
  getMessage(field, params, data) {
      return (data && data.message) || 'Something went wrong';
  },
  validate(value) {
    return new Promise(resolve => {
      resolve({
        valid: value === 'trigger' ? false : !! value,
        data: value !== 'trigger' ? undefined : { message: 'Not this value' }
      });
    });
  }
};
```

After creating your custom rule, you can add it to the list of rules using `extend(name, validator)` method in the validator instance.

```js
import { Validator } from 'vee-validate';

Validator.extend('truthy', {
  getMessage: field => 'The ' + field + ' value is not truthy.',
  validate: value => !! value
});

let instance = new Validator({ trueField: 'truthy' });

// Also there is an instance 'extend' method for convience.
instance.extend('falsy', (value) => ! value);

instance.attach({
  name: 'falseField',
  rules: 'falsy'
});
```

::: tip
  Using any of the `extend` either on the class or on an instance will extend all validators with the new validation rule. Extending a new rule that has the same name as an existing rule will throw a `ValidatorException` with an error message.
:::
