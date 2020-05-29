# Rules Object Expression

You've learned that you can use string expressions to express validation rules, i.e: `required|email`. A hint was made at an alternate expression.

This **rules object expression** like the name suggests, uses JavaScript/JSON objects to define validation rules and generally is much more powerful than string expressions due to the expressive nature of JavaScript objects.

## Defining Rules

You can define rules by supplying an object whose keys match rule names.

This will enable both the `required` and `email` rules:

```js
const ruleObject = { required: true, email: true };
```

As you may have noticed, keys must have a single value. Using `true` lets vee-validate turn the rule on for that field and supplies it with the default configured parameters if they exist.

Here is a simple example:

@[example](object-rules-definition)

Supplying `false` on the other hand will **disable the rule**, treating it as if it doesn't exist in the object. This will come in handy later in the [dynamic rules section](./dynamic-rules.md).

## Supplying Arguments

There are multiple ways to supply arguments to your rules, let's start by the more formal approach which is to pass an object containing your parameters keyed by their configured names:

```js
const ruleObject = { min: { length: 3 }, max: { length: 10 } };
```

This can be verbose, for rules that only have a single parameter, you can omit the nested objects and pass the singular argument directly:

```js
const ruleObject = { min: 3, max: 10 };
```

For rules that have multiple parameters, you can supply its arguments using either the formal approach mentioned earlier:

```js
const ruleObject = { between: { min: 1, max: 20 } };
```

Or you can use a simpler expression that uses arrays:

```js
const ruleObject = { between: [1, 20] };
```

:::warning Argument Order
  Like the **string expression**, when using arrays to pass your arguments you must preserve the order of the arguments. The order must match the parameters defined in the rule.
:::

For rules with infinite parameters, you **must send** an array containing your set of arguments:

```js
const ruleObject = { one_of: [1, 2, 3, 4, 5, 6, 7, 8, 9] };
```

## Conditionally Applying Rules

There may be times where you need to conditionally apply rules depending on a condition in your application. This can easily be done using the JavaScript ternary operator.

```js
const enforceLengthCheck = true; // Some condition that determines whether the rule should be applied.
const ruleObject = { required: true,  length: enforceLengthCheck ? { length: 10 } : false };
```

## Cross Field Validation
It is also possible to use the **rule object expression** when you need to apply validation rules across fields.

Consider that you might have the following custom rule, that accepts a fieldname to be cross validated, and additional parameters. The rule is designed to make sure that the difference between two numbers is within the given maximum allowed

```js
extend("maxDifference", {
  params: ["otherValue", "maxDifference"],
  validate: (value, { otherValue, maxDifference }) => {
    if (maxDifference === null || maxDifference === 0 || maxDifference >= Math.abs(value - otherValue)) {
      return true;
    }
    return false;
  },
  message:
    "The difference between the two numbers is too great. The maximum allowed is difference is {maxDifference}."
});
```

To call this rule using the **rule object expression**, you could use the following syntax:
```js
<ValidationObserver>
    <ValidationProvider vid="firstValue" rules="required" v-slot="{ errors }">
      <input type="number" v-model.number="firstValue">
      <span>{{ errors[0] }}</span>
    </ValidationProvider>
    <ValidationProvider :rules="{ required: true, maxDifference: { otherValue: '@firstValue', maxDifference: maxDifference } }" v-slot="{ errors }">
      <input type="number" v-model.number="secondValue">
      <span>{{ errors[0] }}</span>
    </ValidationProvider>
    <ValidationProvider rules="required" v-slot="{ errors }">
      <input type="number" v-model.number="maxDifference">
      <span>{{ errors[0] }}</span>
    </ValidationProvider>
  </ValidationObserver>
```

@[example](object-rules-definition-cross-field)

You could also write the above example in a slightly more brief way:
```js
<ValidationProvider :rules="{ required: true, maxDifference: ['@firstValue', maxDifference] }" v-slot="{ errors }">
  <input type="number" v-model.number="secondValue">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

