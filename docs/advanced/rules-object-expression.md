# Rules Object Expression

You've learned that we can do `required|email` to specify validation rules for our fields, that was called the **rules string expression** and we hinted at an alternate expression.

This **rules object expression** like the name suggests, uses JavaScript/JSON objects to define validation rules and generally is much more powerful than string expressions due to the expressive nature of JavaScript objects.

## Defining Rules

You can define rules by supplying an object whose keys match rule names.

This will enable both the `required` and `email` rules:

```js
const ruleObject = { required: true, email: true };
```

As you noticed they keys must have a single value at least, using `true` let's vee-validate turn the rule on for that field and supplies it with the default configured parameters if they exist.

Here is a simple example:

@[example](object-rules-definition)

Supplying `false` on the other hand will **disable the rule**, meaning as if it doesn't exist in the object. This will come in handy later in the [dynamic rules section](./dynamic-rules.md).

## Supplying Arguments

There are multiple ways to supply arguments to your rules, let's start by the more formal approach which is to pass an object containing your parameters keyed by their configured names:

```js
const ruleObject = { min: { length: 3 }, max: { length: 10 } };
```

This can be verbose, for rules that only have 1 parameter we can omit the nested objects and pass the singular argument directly:

```js
const ruleObject = { min: 3, max: 10 };
```

For rules that have multiple parameters, we can supply its arguments using either the formal approach mentioned earlier:

```js
const ruleObject = { between: { min: 1, max: 20 } };
```

Or we can use a simpler expression that uses arrays:

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
