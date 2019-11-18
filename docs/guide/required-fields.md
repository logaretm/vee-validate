# Required Fields

You might've noticed that the previous examples avoided implementing the most common validation rule, the `required` rule. This topic requires its own guide as it involves intent more than actual logic.

## What makes a field required

A field is required when your form absolutely needs that field's value **to be present**, which brings you to another question, **what does it mean for a value to be present?**

From vee-validate's perspective, there are a set of **empty values** which are not the same as **falsy values**. These values are:

- `undefined`.
- `null`.
- Empty Strings.
- Empty Arrays.

Notice that empty arrays `[]` are considered an empty value, this is an assumption made by vee-validate based on common use-cases. Meanwhile `0` is a valid **present** value, and `false` is also a **present** value.

For the number `0`, while it is a falsy value, it is still a perfectly valid value to be provided by the user.

For the boolean `false`, this is tricky because you could argue that `false` is the **unchecked** value of a checkbox. A counter argument is you could have a radio button with **Yes/No** options and `false` would be a valid **checked** value. As you could tell this subject is based on assumptions and intent, this is just a design decision for vee-validate.

## Optional Fields

Assume you apply a **min:3** rule to an optional field, wouldn't that invalidate the field as it is empty?

As you noticed from the examples presented earlier, **vee-validate doesn't validate optional fields when they are empty**. Which makes sense, if the user didn't input any value in an optional field, it is valid. Until they've entered a non-empty value, rules won't be run.

## Creating a required rule

Now that you learned the design decisions for this topic, you know that `required` is a special rule, as it needs to report more than the validity of the value, it needs to also report the `required` state of that value as well.

To create a `required` rule, you need to add a `computesRequired` key to the `extend` function rule options:

```js{6}
extend('required', {
  validate () {
    // ...
  },
  // This rule reports the `required` state of the field.
  computesRequired: true
});
```

Then you need to actually report said state, this is done inside the `validate` function:

```js{4,5}
extend('required', {
  validate (value) {
    return {
      required: true,
      valid: ['', null, undefined].indexOf(value) === -1
    };
  },
  computesRequired: true
});
```

Note that the return type of the `validate` function is now an `object` containing:

- A `valid` key which reports the validity of the field.
- A `required` key which reports if the field is required or not.

For the classic `required` rule, the `required` key will always be `true`. However, having the power to dynamically set the `required` state for the field allows you to create really powerful and interesting rules. For an example of such a rule, see [`required_if` implementation](https://github.com/logaretm/vee-validate/blob/master/src/rules/required_if.ts).
