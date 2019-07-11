# Styling UI

So far you've seen bland inputs without any styling. vee-validate provides a lot of convenient utilties to handle styling with ease.

## Classes

The `ValidationProvider` slot props expose a `classes` property which you can bind to your inputs:

<ValidationProvider rules="required" v-slot="{ classes }">
  <div>
    <input type="text" v-model="values.classes" :class="classes">
    <pre class="no-highlight">{{ classes }}</pre>
  </div>
</ValidationProvider>

```vue{3,7}
<template>
  <ValidationProvider
    rules="required"
    v-slot="{ classes }"
  >
    <div>
      <input type="text" v-model="value" :class="classes">
      <pre>{{ classes }}</pre>
    </div>
  </ValidationProvider>
</template>

<style>
input.invalid {
  border: solid 1px red;
}

input.valid {
  border: solid 1px green;
}
</style>
```

### Custom Classes

You can have your own classes instead of the default ones. For example you would match the classes with your CSS framework of choice to automatically generate the appropriate classes for your UI inputs.

To do that, use `configure` function to set your own defaults:

```js
import { configure } from 'vee-validate';

configure({
  classes: {
    valid: 'is-valid', // one class
    invalid: ['is-invalid', 'bad'] // multiple classes
  }
});
```

<script>
export default {
  data: () => ({ values: {} })
};
</script>

<style lang="css">
.theme-default-content pre.no-highlight {
  background: #fff
}

input.invalid {
  border: solid 1px red;
  background: red;
}

input.valid {
  border: solid 1px green;
  background: green;
}
</style>