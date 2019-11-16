# Validation Basics

These are the core concepts you need to know about vee-validate and its approach to form validation.

VeeValidate is a validation framework built specifically for Vue.js and as such it makes some assumptions and enforces "best-practices" for your forms while being versatile and customizable.

VeeValidate is a collection of function-based APIs and Vue components, the main things that will be covered is how to add rules and use them on your fields and error messages.

## Validation Provider

First you need to register the `ValidationProvider` component which acts as a validator for your fields, it works via [scoped-slots](https://vuejs.org/v2/guide/components-slots.html) to provide validation errors to your template.

## Registering the Validation Provider

To register the `ValidationProvider` component you can do that either locally within components (recommended):

```js
import { ValidationProvider } from 'vee-validate';

export default {
  components: {
    ValidationProvider
  }
};
```

Or globally using `Vue.component`:

```js
import { ValidationProvider } from 'vee-validate';

Vue.component('ValidationProvider', ValidationProvider);
// ...
```

If you are not using a bundler and using vee-validate in the browser or from a CDN:

```html
<script>
  // ...
  Vue.component('validation-provider', VeeValidate.ValidationProvider);
  // ...
</script>
```

After that you can use it in your components templates, typically you **wrap your inputs** with the `ValidationProvider`:

```vue
<ValidationProvider v-slot="v">
  <input v-model="value" type="text">
</ValidationProvider>
```

The `input` field or the component acting as an input **MUST** have a `v-model` attached to it, this is because the `ValidationProvider` searches its own children for inputs. So the `v-model` acts as a hint for the `ValidationProvider`.

If you are using a CDN with vee-validate you may to use the `kebab` case as HTML is case insensitive, so you need to reference the `ValidationProvider` as `validation-provider`.

```vue
<validation-provider v-slot="v">
  <input v-model="value" type="text">
</validation-provider>
```

Now that you have the field rendering correctly, you can display the field errors, You can use any HTML for that matter, like a simple `span` tag:

```vue
<ValidationProvider v-slot="v">
  <input v-model="value" type="text">
  <span>{{ v.errors[0] }}</span>
</ValidationProvider>
```

The `v` identifier is called **slot props** which lets components like the `ValidationProvider` to send information to the slot, you can use ES6's object destructing to make things a little less verbose:

```vue
<ValidationProvider v-slot="{ errors }">
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

So far you only rendered the slot without any validation of any kind, the next section will walk you through adding validation rules and executing them.

## Adding Rules

VeeValidate doesn't come installed with any validation rule by default, this is to keep the bundle size lean and as small as possible. The first of the function APIs is the `extend` function.

Adding new rules with `extend` is straight forward, in its simplest form it looks like this:

```js
import { extend } from 'vee-validate';

extend('positive', value => {
  return value >= 0;
});
```

That last snippet can be placed any where in our app, typically you should define your rules before you use them in your template, so your entry file or a dedicated `validation.js` file is a great place to start.

The `extend` function accepts the name of the rule and the **validator function** to use for that rule.

You can use the newly defined `positive` rule like this:

```vue{1}
<ValidationProvider rules="positive" v-slot="{ errors }">
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

You can add more rules to your field. To do that, define a rule that ensures that the field value must be an even number:

```js
import { extend } from 'vee-validate';

extend('odd', value => {
  return value % 2 !== 0;
});
```

To make sure our field is validated by both rules, you append the `odd` rule to the field to make sure it's positive and also an odd number:

```vue{1}
<ValidationProvider rules="positive|odd" v-slot="{ errors }">
  <input v-model="value" type="number">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

Notice that the `|` pipe character separates the rules, this is inspired by Laravel's validation syntax, You can add as many rules as you want on your input:

```vue{1}
<ValidationProvider rules="positive|odd|prime|fib" v-slot="{ errors }">
  <input v-model="value" type="number">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

The string you sent to the `rules` prop is called a **string expression**.

:::tip
  There is another advanced expression that you can express your rules with. See [Rules Object Expression](../advanced/rules-object-expression.md).
:::

The last snippet used a function as the validation rule, there is a more **extended form of rules** that uses objects to include more metadata. The last snippet can also be re-written as:

```js{4-6}
import { extend } from 'vee-validate';

extend('odd', {
  validate: value => {
    return value % 2 !== 0;
  }
});
```

## Rule Arguments

Assuming you want to create a rule that checks the minimum the number of characters, it is clear that such a rule requires some sort of configuration. Ideally you should be able to re-use such a rule. For example you need to make sure the minimum number of characters is 3:

```js
import { extend } from 'vee-validate';

extend('min', value => {
  return value.length >= 3;
});
```

While this may serve your purpose, it is not useful for other fields. What if you want to check if the minimum is `4` instead?

Rules can receive arguments that each field can specify. To do that you use the **extended form** of validation rules and define the `params` property that contains the argument names, this is what a `min` rule with a configurable argument called `length`:

```js{4,5,7}
import { extend } from 'vee-validate';

extend('min', {
  validate(value, args) {
    return value.length >= args.length;
  },
  params: ['length']
});
```

Note that the second parameter `args` sent to the `validate` method is an object containing keys that were specified in the `params` array.

To configure the rule, use a Laravel-like syntax by appending a colon `:` after the rule. This is an example of two fields using the same rule but with different `length` for each of them:

```vue{1,6}
<ValidationProvider rules="min:3" v-slot="{ errors }">
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>

<ValidationProvider rules="min:6" v-slot="{ errors }">
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

### Multiple Arguments

Rules arguments are one of the most versatile aspects of vee-validate, try something slightly complex. Create a rule and call it `minmax` that will make sure the field value length is between a `min` and a `max`.

This rule will require two parameters, the first called `min` and the second called `max`. Start by defining the rule with `extend`:

```js{4,9}
import { extend } from 'vee-validate';

extend('minmax', {
  validate(value, args) {
    const length = value.length;

    return length >= args.min && length <= args.max;
  },
  params: ['min', 'max']
});
```

You can make things less verbose by destructing the args object:

```js{2}
extend('minmax', {
  validate(value, { min, max }) {
    return value.length >= min && value.length <= max;
  },
  params: ['min', 'max']
});
```

To use this rule, you pass the `minmax` rule to the `rules` prop of the `ValidationProvider` and you supply the arguments as a **comma separated list**:

```vue{2}
<ValidationProvider
  rules="minmax:3,8"
  v-slot="{ errors }"
>
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

Now the field will be valid when the value is a string having a length between 3 and 8.

:::tip
  Arguments **must follow** the same order they were defined in as in the `params` array.
:::

### Infinite Arguments

Some rules accept an infinite number of arguments, consider a `one_of` rule that checks if the specified value in within a defined set, it looks like this:

```js
import { extend } from 'vee-validate';

extend('one_of', (value, values) => {
  return values.indexOf(value) !== -1;
});
```

For such rules you are not required to define a `params` key, as vee-validate will automatically pass whatever specified in the `ValidationProvider` rules prop to your rule, and it will maintain the same order.

```vue
<ValidationProvider rules="one_of:1,2,3,4,5,6,7,8,9" v-slot="{ errors }">
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

vee-validate will then pass an array containing: `[1, 2, 3, 4, 5, 6, 7, 8, 9]` to your rule.

## Messages

VeeValidate generates error messages for your fields, the last examples had `This field is invalid` message which is the default message configured for all rules.

You can change that by returning strings in the validation function itself:

```js{8,16}
import { extend } from 'vee-validate';

extend('positive', value => {
  if (value >= 0) {
    return true;
  }

  return 'This field must be a positive number';
});

extend('odd', value => {
  if (value % 2 !== 0) {
    return true;
  }

  return 'This field must be an odd number';
});
```

You can also leave out messages from the `validator` function and instead use the **extended format** to pass a dedicated `message` property:

```js{5}
extend('odd', {
  validator: value => {
    return value % 2 !== 0;
  },
  message: 'This field must be an odd number'
});
```

This allows your `validator` functions to be much clearer.

### Field Name Placeholder

Sometimes you want your messages to have the following format:

```icu
The {fieldName} must be a valid...
```

The validator function doesn't accept the field name anywhere, but vee-validate offers simple interpolation mechanism for returned messages, you can use the `{_field_}` placeholder in your string and it will be replaced with your field name automatically:

```js{6}
extend('positive', value => {
  if (value >= 0) {
    return true;
  }

  return 'The {_field_} field must be a positive number';
});
```

To display the field name, you set the `name` prop on the validation provider:

```vue{2}
<ValidationProvider
  name="age"
  rules="positive"
  v-slot="{ errors }"
>
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

### Arguments Placeholders

You can't really have the `min` rule message to be "this field is invalid", this is not only confusing to the user, they will have no knowledge on how to fix them.

Client-side validation is all about UX, so vee-validate interpolation can parse **placeholders that match the rule parameters**, so to define such a message for the `min` rule you can use a `{length}` placeholder in the error message like this:

```js{6}
extend('min', {
  validate(value, { length }) {
    return value.length >= length;
  },
  params: ['length'],
  message: 'The {_field_} field must have at least {length} characters'
});
```

One thing to note is that the parameter placeholder doesn't have underscores `_` around it unlike the `{_field_}` placeholder. This is a convention of vee-validate as there are special set of placeholders that have underscores around them. This is to prevent collisions and to make them distinct from rule parameters.

To solidify this concept, define a message for the `minmax` rule:

```js{6}
extend('minmax', {
  validate(value, { min, max }) {
    return value.length >= min && value.length <= max;
  },
  params: ['min', 'max'],
  message: 'The {_field_} field must have at least {min} characters and {max} characters at most'
});
```

### Messages as Functions

If using interpolated strings is not flexible enough for you, using functions is also allowed. When using a function as your message, it has to return a `string`. Function messages receive the field name and an object containing the placeholders mentioned earlier.

This is the previous example but with a function as our message:

```js{6-8}
extend('minmax', {
  validate(value, { min, max }) {
    return value.length >= min && value.length <= max;
  },
  params: ['min', 'max'],
  message: (fieldName, placeholders) => {
    return `The ${fieldName} field must have at least ${min} characters and ${max} characters at most`
  }
});
```

This allows you to manually interpolate or generate messages depending on your needs, this will come in handy when implementing localization using popular plugins like `vue-i18n`. See [The Localization Guide](./localization.md).

For reference these are the contents of the `placeholders` object:

| Prop      |Description                                 |
|-----------|--------------------------------------------|
| `_field_` | The field name.                            |
| `_value_` | The field value that was validated.        |
| `_rule_`  | The rule name that triggered this message. |

Along side any parameters configured in the `params` array.

### Multiple Messages

VeeValidate by default follows a **fast-exit** or **bails** whenever a rule fails and stops the validation pipeline for other rules, this is done to maximize performance and provide feedback to your users as fast as possible.

You could then be wondering why `errors` is an array when vee-validate only generates one message at a time per field, this is because you can configure vee-validate to run all the validation rules specified for the field.

You could configure the `ValidationProvider` component to run all the rules by setting the `bails` prop to `false`:

```vue{3}
<ValidationProvider
  rules="positive|odd|prime|fib"
  :bails="false"
  v-slot="{ errors }"
>
  <input v-model="value" type="text">
  <ul>
    <li v-for="error in errors">{{ error }}</li>
  </ul>
</ValidationProvider>
```

Because `errors` slot prop is a native JavaScript array, you can use `v-for` directly to display the error messages generated for that field.

---

It can be annoying to define rules and messages for your application time and time again, vee-validate implemented the most common rules you will use in your application and they can be imported and used directly, In the next section you will learn about the validation rules that come bundled with vee-validate and how to use them.
