# Validating Dynamically Displayed Inputs

A common case is to use `v-if` to display a field or two based on some sort of criteria, for example you could display a _state_ field if the user is from USA and hide it if its not applicable. or generate a list of inputs from JSON data using `v-for`. This is completely supported by vee-validate but there is a caveat to look out for.

A little bit of background, here is a quote from Vue docs on the input being reused:

> Vue tries to render elements as efficiently as possible, often re-using them instead of rendering from scratch. Beyond helping make Vue very fast, this can have some useful advantages.

The official example uses the following template:

```html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address">
</template>
```

## Handling v-if

When attempting to validate those inputs, it would seem that vee-validate thinks they are the same one depending on who got rendered initially. This is due to Vue actually re-using the input, so to `vee-validate` and due to some limitation in the `directive` API, vee-validate doesn't know that the input got switched. So you need to help it a little bit by using `key` attribute on the inputs which forces Vue to render those elements independently.

```html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username" key="username-input">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address" key="email-input">
</template>
```

Validating those fields now will behave as expected, just remember that the key attribute should be unique to its respective field.

## Handling v-for

Using indexes in `v-for` as the key is not sufficient as adding/removing items will make some fields assume others' keys. So the following wouldn't work in a scenario where fields are added/removed by the user interaction.

```html
  <div v-for="(input, idx) in inputs" :key="idx">
    <label>Username</label>
    <input placeholder="Enter your username" key="username-input">
  </div>
```

To fix this, try to generate a unique id for each key in the loop:

```html
  <div v-for="input in inputs" :key="input.id">
    <label>Username</label>
    <input placeholder="Enter your username" key="username-input">
  </div>
```

Where a basic id generator would look like this:

```js
let id = 0;

export default {
  data: () => ({
    inputs: []
  }),
  methods: {
    addInput () {
      this.inputs.push({
        id: id,
        value: null
      });
      // increment the id for the next input that will be created.
      id++;
    }
  }
};
```

This ensures each created field is completely separate and Vue shouldn't try to re-use them.

::: tip
  You may actually want Vue to re-use the inputs, make sure you are handling the `key` attribute value correctly for your case.
:::
