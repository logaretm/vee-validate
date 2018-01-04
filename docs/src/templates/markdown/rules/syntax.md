## [Syntax](#syntax)

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

> In object form, rules keys accepts a single value if the rule accepts a single argument, if multiple arguments are passed you should pass them as an array in the same order.
