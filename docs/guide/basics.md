# Validation Basics

These are the core concepts you need to know about vee-validate and its approach to form validation.

VeeValidate is a validation framework built specifically for Vue.js and as such it makes some assumptions and enforces "best-practices" for your forms while being versatile and customizable.

VeeValidate is a collection of function-based APIs and Vue components, the main things we will cover is how to add rules and use them on your fields and error messages.

## Adding Rules

VeeValidate doesn't come installed with any validation rule by default, this is to keep the bundle size lean and as small as possible. The first of the function APIs is the `extend` function.

Adding new rules with `extend` is straight forward, in its simplest form it looks like this:

```js
import { extend } from 'vee-validate';

extend('positive', value => {
  return value >= 0
});
```

The `extend` function accepts the name of the rule and the **validator function** to use for that rule.

We can use our defined `positive` rule like this:

```vue
<ValidationProvider rules="positive" v-slot="{ errors }">
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

Let's add more rules to our field, let's define a rule that ensures that the field value must be an even number:

```js
import { extend } from 'vee-validate';

extend('odd', value => {
  return value % 2 !== 0;
});
```

Now let's append this rule to our field to make sure it's positive and also an odd number:

```vue
<ValidationProvider rules="positive|odd" v-slot="{ errors }">
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

Notice that we have a `|` pipe character separating the rules, this is inspired by Laravel's validation syntax, You can add as many rules as you want on your input:

```vue
<ValidationProvider rules="positive|odd|prime|fib" v-slot="{ errors }">
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

The string we send to our `rules` prop is called a **string expression**, there is another expression that you can use but we will discuss this later in the docs.

## Rule Arguments

Let's say you want to create a rule that checks the minimum the number of characters, it is clear that such a rule requires some sort of configuration. Ideally you should be able to re-use such a rule. Let's say we need to make sure the minimum number of characters is 3:

```js
import { extend } from 'vee-validate';

extend('min', (value) => {
  return value.length >= 3;
});
```

While this may serve your purpose, it is not useful for other fields. What if you want to check if the minimum is `4` instead?

VeeValidate rules can receive arguments that each field can specify, for example here is what a `min` rule with a configurable argument called `length`:

```js{4,5,7}
import { extend } from 'vee-validate';

extend('min', {
  validate (value, args) {
    return value.length >= args.length;
  },
  params: ['length']
});
```

Note that the second parameter `args` sent to the `validate` method is an object containing keys that were specified in the `params` array.

To configure the rule, we use a Laravel-like syntax, simply append a colon `:` after the rule. Here is an example of two fields using the same rule but with different `length` for each of them:

```vue{2,10}
<ValidationProvider
  rules="min:3"
  v-slot="{ errors }"
>
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>

<ValidationProvider
  rules="min:6"
  v-slot="{ errors }"
>
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

### Multiple Arguments

Rules arguments are one of the most versatile aspects of vee-validate, to drive this point home, let's create a slightly more complex rule. Let's call it `minmax` that will make sure the field value length is between a `min` and a `max`.

This rule will require two parameters, the first called `min` and the second called `max`, let's define the rule:

```js
import { extend } from 'vee-validate';

extend('minmax', {
  validate (value, args) {
    const length = value.length;

    return length >= args.min && length <= args.max;
  },
  params: ['min', 'max']
});
```

We can make things simpler by destructing the args object:

```js
extend('minmax', {
  validate (value, { min, max }) {
    return value.length >= min && value.length <= max;
  },
  params: ['min', 'max']
});
```

To use this rule, we do the same thing we did with the `min` rule, but we supply the arguments as a **comma separated list**:

```vue
<ValidationProvider
  rules="minmax:3,8"
  v-slot="{ errors }"
>
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

Now our field will be valid when the value is a string having a length between 3 and 8.

:::tip
  Note how the parameters **must follow** the same order they were defined in.
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
<ValidationProvider
  rules="one_of:1,2,3,4,5,6,7,8,9"
  v-slot="{ errors }"
>
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

vee-validate will then pass an array containing: `[1, 2, 3, 4, 5, 6, 7, 8, 9]` to your rule.

## Messages

VeeValidate generates error messages for your fields, the last examples all had this `This field is invalid` message which is the default message configured for all rules, let's take the last examples rules and define messages for them, we can do that by returning strings in the validation function:

```js
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

### Field Name Placeholder

Sometimes we want our messages to have the following format:

```icu
The {fieldName} must be a valid...
```

Our validator function doesn't accept the field name anywhere, so we need to use an extended signature of the `extend` function, instead of passing a validator function as the second argument, we instead send an object like this:

```js
import { extend } from 'vee-validate';

extend('positive', {
  validate (value) {
    return value >= 0;
  },
  message: 'This field must be a positive number'
});
```

This equivalent to the last example, but we still don't have the field name. When using the extended signature, vee-validate employs a simple interpolation that is compatible with ICU format messages, all we need to do is place placeholders within our string and vee-validate will interpolate it.

The placeholder for the field name is called `_field_`, so our last example will now look like this:

```js
import { extend } from 'vee-validate';

extend('positive', {
  validate (value) {
    return value >= 0;
  },
  message: 'The {_field_} must be a positive number'
});
```

:::tip
  Notice that placeholders **need to be enclosed within `{` `}`.
:::

Now to display the field name we need to set `name` prop on the validation provider:

```vue
<ValidationProvider name="age" rules="positive" v-slot="{ errors }">
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

### Arguments Placeholders

Since we managed to display the field name for such simple rules, what about rules with parameters? We can't really have the `min` rule message to be "this field is invalid", this is not only confusing to the user, they have no knowledge on how to fix them.

Client-side validation is all about UX, so vee-validate interpolation can parse placeholders that have the same names as the rule parameters, so to define such a message for our `min` rule we can do this:

```js
import { extend } from 'vee-validate';

extend('min', {
  validate (value, { length }) {
    return value.length >= length;
  },
  params: ['length'],
  message: 'The {_field_} field must have at least {length} characters'
});
```

There are a couple of things to note, firstly The parameter placeholder must match the parameter definition in the `params` array.

Secondly, The parameter placeholder doesn't have underscores `_` around it. This is a convention of vee-validate as there are special set of placeholders like the `_field_`  that have underscores around them. This is to prevent collisions and to make them distinct from rule parameters.

To drive this point home, let's define a message for our `minmax` rule:

```js
extend('minmax', {
  validate (value, { min, max }) {
    return value.length >= min && value.length <= max;
  },
  params: ['min', 'max'],
  message: 'The {_field_} field must have at least {min} characters and {max} characters at most'
});
```

### Multiple Messages

VeeValidate by default follows a **fast-exit** or **bails** whenever a rule fails and stops the validation pipeline for other rules, this is done to maximize performance and provide feedback to your users as fast as possible.

You could then be wondering why `errors` is an array when vee-validate only generates one message at a time per field, this is because you can configure vee-validate to run all the validation rules specified for the field, there is two ways you can do this.

First you could tell the `ValidationProvider` component to run all the rules by passing `bails` prop equal to `false` like this:

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

Notice that we used `v-for` to loop over the multiple messages we've generated, remember that `errors` is a regular JavaScript array.

---

It can be annoying to define rules and messages for your application time and time again, vee-validate implemented the most common rules you will use in your application and they can be imported and used directly, In the next section you will learn about the validation rules that come bundled with vee-validate and how to use them.
