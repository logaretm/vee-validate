# Validation Rules

The following are the validation rules available for you, **remember that they are not installed by default** and you need to import and install them yourself, this allows you to only import what you need while keeping the bundle size for your application to minimum.

## Importing The Rules

Validation rules are available as an ES6 exports at `vee-validate/dist/rules`, if you are using an IDE or VSCode you should have a small peek on what rules are available when you are importing them, here is how to import some common rules like `required` and `min`.

```js
import { extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';

// No message specified.
extend('email', email);

// Override the default message.
extend('required', {
  ...required,
  message: 'This field is required'
});
```

And then you can use those rules immediately:

```vue
<ValidationProvider name="email" rules="required|email" v-slot="{ errors }">
  <input v-model="email" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

## Installing All Rules

This is not recommended, but you need to have all of the vee-validate rules pre-configured, you can do that in two ways:

You can install all of vee-validate rules by looping over the entire set of rules using `Object.keys` like this:

```js
import { extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';

Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule]);
});
```

One downside of the previous snippet is that you lose the ability to define error messages as you no longer know which rule is in the iteration. Luckily vee-validate includes messages for all of those rules in 40+ locales that you can import, and they map nicely to rule names, let's define messages in our previous sample:

```js{3,6-9}
import { extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import { messages } from 'vee-validate/dist/locale/en.json';

Object.keys(rules).forEach(rule => {
  extend(rule, {
    ...rules[rule], // copies rule configuration
    message: messages[rule] // assign message
  });
});
```

### Full Bundle

Another way of doing that is to import vee-validate's full bundle instead of the default one, which comes pre-installed with all the validation rules and their English messages.

```js
import { ValidationProvider } from 'vee-validate/dist/vee-validate.full.esm';
```

:::tip
  Make sure to reference `vee-validate` from the full bundle path if you are going to use it, aliasing it in your webpack config is a good idea since you don't want to endup with two vee-validate installations in your app.
:::

## Available Rules

:::warning

Rules marked with <Badge text="inferred"></Badge> can be automatically inferred from the HTML5 input attributes without providing `rules` prop. This does not work for custom components.

:::

VeeValidate offers common validators that will cover most apps needs:

<ul class="Rules">
  <li><a href="#alpha">alpha</a></li>
  <li><a href="#alpha-dash">alpha_dash</a></li>
  <li><a href="#alpha-num">alpha_num</a></li>
  <li><a href="#alpha-spaces">alpha_spaces</a></li>
  <li><a href="#between">between</a></li>
  <li><a href="#confirmed">confirmed</a></li>
  <li><a href="#digits">digits</a></li>
  <li><a href="#dimensions">dimensions</a></li>
  <li><a href="#email">email <Badge text="Inferred" type="tip"/></a></li>
  <li><a href="#ext">ext</a></li>
  <li><a href="#image">image</a></li>
  <li><a href="#oneOf">oneOf</a></li>
  <li><a href="#integer">integer</a></li>
  <li><a href="#is">is</a></li>
  <li><a href="#is-not">is_not</a></li>
  <li><a href="#length">length</a></li>
  <li><a href="#max">max <Badge text="Inferred" type="tip"/></a></li>
  <li><a href="#max-value">max_value <Badge text="Inferred" type="tip"/></a></li>
  <li><a href="#mimes">mimes</a></li>
  <li><a href="#min">min <Badge text="Inferred" type="tip"/></a></li>
  <li><a href="#min-value">min_value <Badge text="Inferred" type="tip"/></a></li>
  <li><a href="#excluded">excluded</a></li>
  <li><a href="#numeric">numeric</a></li>
  <li><a href="#regex">regex <Badge text="Inferred" type="tip"/></a></li>
  <li><a href="#required">required <Badge text="Inferred" type="tip"/></a></li>
  <li><a href="#required-if">required_if</a></li>
  <li><a href="#size">size</a></li>
</ul>

### alpha

The field under validation may only contain alphabetic characters.

<RuleDemo rule="alpha" />

```vue
<ValidationProvider rules="alpha" v-slot="{ errors }">
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

### alpha_dash

The field under validation may contain alphabetic characters, numbers, dashes or underscores.

<RuleDemo rule="alpha_dash" />

```vue
<ValidationProvider rules="alpha_dash" v-slot="{ errors }">
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

### alpha_num

The field under validation may contain alphabetic characters or numbers.

<RuleDemo rule="alpha_num" />

```vue
<ValidationProvider rules="alpha_num" v-slot="{ errors }">
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

### alpha_spaces

The field under validation may contain alphabetic characters or spaces.

<RuleDemo rule="alpha_spaces" />

```vue
<ValidationProvider rules="alpha_spaces" v-slot="{ errors }">
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

### between

The field under validation must have a numeric value bounded by a minimum value and a maximum value.

<RuleDemo rule="between:1,11" />

```vue
<ValidationProvider rules="between:1,11" v-slot="{ errors }">
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

| Param Name | Required? | Default | Description        |
| ---------- | --------- | ------- | ------------------ |
| `min`      | **yes**   |         | The minimum value. |
| `max`      | **yes**   |         | The maximum value. |

### confirmed

The field under validation must have the same value as the confirmation field.

<ValidationObserver>
  <RuleDemo rule="confirmed:confirmation" />

  <RuleDemo vid="confirmation" />
</ValidationObserver>

```vue
<ValidationObserver>
  <ValidationProvider rules="confirmed:confirmation" v-slot="{ errors }">
    <input v-model="value" type="text">
    <span>{{ errors[0] }}</span>
  </ValidationProvider>

  <ValidationProvider v-slot="{ errors }" vid="confirmation">
    <input v-model="confirmation" type="text">
    <span>{{ errors[0] }}</span>
  </ValidationProvider>
</ValidationObserver>
```

| Param Name | Required? | Default | Description                    |
| ---------- | --------- | ------- | ------------------------------ |
| `target`   | **yes**   |         | The other field's `vid` value. |

### digits

The field under validation must be numeric and have the specified number of digits.

<RuleDemo rule="digits:3" />

```vue
<ValidationProvider rules="digits:3" v-slot="{ errors }">
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

| Param Name | Required? | Default | Description                   |
| ---------- | --------- | ------- | ----------------------------- |
| `length`   | **yes**   |         | The number of digits allowed. |

### dimensions

The file added to the field under validation must be an image (jpg,svg,jpeg,png,bmp,gif) having the exact specified dimension.

<RuleDemo rule="dimensions:120,120" type="file" />

```vue
<ValidationProvider rules="dimensions:120,120" v-slot="{ errors, validate }">
  <input type="file" @change="validate">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

| Param Name | Required? | Default | Description           |
| ---------- | --------- | ------- | --------------------- |
| `width`    | **yes**   |         | The width in pixels.  |
| `height`   | **yes**   |         | The height in pixels. |

### email <Badge text="Inferred" type="tip"/>

The field under validation must be a valid email.

<RuleDemo rule="email" />

```vue
<ValidationProvider rules="email" v-slot="{ errors }">
  <input type="text" v-model="value">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

:::tip Inference
This rule is automatically inferred if the `input` type is `email`, it also detects if the `multiple` attribute is set.
:::

### ext

The file added to the field under validation must have one of the extensions specified.

<RuleDemo rule="ext:jpg,png" type="file" />

```vue
<ValidationProvider rules="ext:jpg,png" v-slot="{ errors, validate }">
  <input type="file" @change="validate">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

`ext` takes an infinite number of arguments representing extensions. ex: `ext:jpg,png,bmp,svg`.

### image

The file added to the field under validation must have an image mime type (image/\*).

<RuleDemo rule="image" type="file" />

```vue
<ValidationProvider rules="image" v-slot="{ errors, validate }">
  <input type="file" @change="validate">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

### oneOf

The field under validation must have a value that is in the specified list. **Uses double equals** for checks.

<RuleDemo
rule="oneOf:1,2,3"
type="select"
:options="[{ text: 'One', value: 1 }, { text: 'Two', value: 2 }, { text: 'Three', value: 3 }, { text: 'Four', value: 4 }]"

> </RuleDemo>

```vue
<ValidationProvider rules="oneOf:1,2,3" v-slot="{ errors }">
  <select v-model="value">
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
    <option value="4">Invalid</option>
  </select>
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

`oneOf` takes an infinite number of params, each is a value that is allowed.

### is

The field under validation must be equal to the first argument passed, uses `===` for equality checks. This rule is useful for confirming passwords when used in object form. Note that using the string format will cause any arguments to be parsed as strings, so use the object format when using this rule.

<RuleDemo rule="is:hello" />

```vue
<ValidationProvider rules="is:hello" v-slot="{ errors }">
  <input type="text" v-model="value">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

| Param Name | Required? | Default | Description                                                 |
| ---------- | --------- | ------- | ----------------------------------------------------------- |
| `value`    | **yes**   |         | A value of any type to be compared against the field value. |

### max <Badge text="Inferred" type="tip"/>

The field under validation length may not exceed the specified length.

<RuleDemo rule="max:4" />

```vue
<ValidationProvider rules="max:4" v-slot="{ errors }">
  <input type="text" v-model="value">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

| Param Name | Required? | Default | Description                                                    |
| ---------- | --------- | ------- | -------------------------------------------------------------- |
| `length`   | **yes**   |         | A numeric value representing the maximum number of characters. |

:::tip Inference
This rule is inferred when the field type is `text` and when `maxlength` attribute is set.
:::

### max_value <Badge text="Inferred" type="tip"/>

The field under validation must be a numeric value and must not be greater than the specified value.

<RuleDemo rule="max_value:4" />

```vue
<ValidationProvider rules="max_value:4" v-slot="{ errors }">
  <input type="text" v-model="value">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

| Param Name | Required? | Default | Description                                              |
| ---------- | --------- | ------- | -------------------------------------------------------- |
| `max`      | **yes**   |         | A numeric value representing the greatest value allowed. |

:::tip Inference
This rule is inferred when the field type is `number` and when `max` attribute is set.
:::

### mimes

The file type added to the field under validation should have one of the specified mime types.

<RuleDemo rule="mimes:image/*" type="file" />

```vue
<ValidationProvider rules="mimes:image/*" v-slot="{ errors, validate }">
  <input type="file" @change="validate">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

`mimes` take an infinite number of arguments that are formatted as file types. EG: `mimes:image/jpeg,image/png`.

:::tip Wild-card Types
You can use '_' to specify a wild card, something like `mimes:image/_` will accept all image types.
:::

### min <Badge text="Inferred" type="tip"/>

The field under validation length should not be less than the specified length.

<RuleDemo rule="min:4" />

```vue
<ValidationProvider rules="min:4" v-slot="{ errors }">
  <input type="text" v-model="value">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

| Param Name | Required? | Default | Description                                                    |
| ---------- | --------- | ------- | -------------------------------------------------------------- |
| `length`   | **yes**   |         | A numeric value representing the minimum number of characters. |

:::tip Inference
This rule is inferred when the field type is `text` and when the `minlength` attribute is set.
:::

### min_value <Badge text="Inferred" type="tip"/>

<RuleDemo rule="min_value:4" />

```vue
<ValidationProvider rules="min_value:4" v-slot="{ errors }">
  <input type="text" v-model="value">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

The field under validation must be a numeric value and must not be less than the specified value.

| Param Name | Required? | Default | Description                                              |
| ---------- | --------- | ------- | -------------------------------------------------------- |
| `min`      | **yes**   |         | A numeric value representing the smallest value allowed. |

:::tip Inference
This rule is inferred when the field type is `number` and when `min` attribute is set.
:::

### numeric

The field under validation must only consist of numbers.

<RuleDemo rule="numeric" />

```vue
<ValidationProvider rules="numeric" v-slot="{ errors }">
  <input type="text" v-model="value">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

### regex <Badge text="Inferred" type="tip"/>

The field under validation must match the specified regular expression.

<RuleDemo :rule="{ regex: /^[0-9]+$/ }" />

```vue
<ValidationProvider :rules="{ regex: /^[0-9]+$/ }" v-slot="{ errors }">
  <input type="text" v-model="value">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

| Param Name | Required? | Default | Description                                               |
| ---------- | --------- | ------- | --------------------------------------------------------- |
| `pattern`  | **yes**   |         | A regular expression instance or string representing one. |

:::warning Heads up!
You should not use the pipe '|' or commas ',' within your regular expression when using the string rules format as it will cause a conflict with how validators parsing works. You should use the object format of the rules instead.
:::

:::warning The `g` flag
When using the `regex` rule, using the `g` flag may result in unexpected falsy validations. This is because vee-validate uses the same instance across validation attempts.
:::

:::tip Inference
This rule is inferred when the field type is `text` and `pattern` attribute is set.
:::

### required <Badge text="Inferred" type="tip"/>

The field under validation must have a non-empty value. By default, all validators pass the validation if they have "empty values" unless they are required. Those empty values are: empty strings, `undefined`, `null`, empty arrays.

<RuleDemo rule="required" />

```vue
<ValidationProvider rules="required" v-slot="{ errors }">
  <input type="text" v-model="value">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

| Param Name   | Required? | Default | Description                                     |
| ------------ | --------- | ------- | ----------------------------------------------- |
| `allowFalse` | no        | `true`  | Boolean to prevent `false` from being accepted. |

:::tip Inference
This rule is inferred when the field type is marked with `required` attribute.
:::

:::tip Required and `false`

Checkboxes by default emit `true` or `false` depending on wether they are checked or not. The required rule allows the `false` value by default, to disable this you may need to use the object syntax to configure the rule.

```vue
<ValidationProvider :rules="{ required: { allowFalse: false } }" v-slot="{ errors }">
  <!-- Your Field -->
</ValidationProvider>
```

:::

### required_if

The field under validation must have a non-empty value **only if** the target field (first argument) is set to one of the specified values (other arguments).

<ValidationObserver>
  <RuleDemo vid="country" type="select" :options="[{ text: 'EG', value: 'EG' }, { text: 'US', value: 'US' }]" />

  <RuleDemo name="state" rule="required_if:country,US" />
</ValidationObserver>

```vue
<ValidationProvider rules="" vid="country" v-slot="x">
  <select v-model="country">
    <option value="US">United States</option>
    <option value="OTHER">Other country</option>
  </select>
</ValidationProvider>

<ValidationProvider rules="required_if:country,US" v-slot="{ errors }">
  <input type="text" placeholder="state" v-model="state" />
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

| Param Name  | Required? | Default | Description                                                                                                                             |
| ----------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `target`    | **yes**   |         | The `vid` of the target field.                                                                                                          |
| `...values` | **no**    |         | The values that will make the field required. If empty or not provided it will make the field required if the target field has a value. |

### size

The file size added to the field under validation must not exceed the specified size in kilobytes.

<RuleDemo rule="size:100" type="file" />

```vue
<ValidationProvider rules="size:100" v-slot="{ errors, validate }">
  <input type="file" @change="validate">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

| Param Name | Required? | Default | Description                         |
| ---------- | --------- | ------- | ----------------------------------- |
| `size`     | **yes**   |         | The maximum file size in kilobytes. |

<style lang="stylus">
.Rules
  column-count: 1

@media (min-width: 721px)
  .Rules
    column-count: 3

</style>
