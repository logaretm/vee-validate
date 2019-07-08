# Backend Validation

You can integrate your backend validation with vee-validate in a couple of ways.

## Async Rule

Because `vee-validate` assumes all rules are asynchronous, you create a rule where it sends the field value to a remote/backend service and validate the field there if it cannot be validated on the client side.

A `unique` rule is an example of rules that cannot be validated on the client side since a database access is required.

A rule that uses that endpoint could look like this:

```js
// use axios or fetch
import axios from 'axios';
import { extend } from 'vee-validate';

extend('uniqueEmail', {
  async validate(value) {
    const { data } = await axios.post('/api/isEmailUnique', { value });

    if (data.valid) {
      return true;
    }

    return {
      valid: false,
      // the data object contents can be used in the message template
      data: {
        error: data.error
      }
    };
  },
  message: `{error}` // will display the server error message.
});
```

Here is the example in action:

TODO: PUT THE CODESANDBOX CODE HERE.

:::tip Tip
The previous example is suitable for rules that are meant to be re-usable and will be used regularly in your app. For more flexibility check the next section for adding error messages manually.
:::

## Adding Errors Manually

You can add errors manually using either `ValidationProvider.setErrors` or `ValidationObserver.setErrors` method, let's assume you are submitting a form and you are filling the errors after the server response so we will use the observer's `setErrors` to set errors all the providers.

The `setErrors` method on the observer instance takes an Object shaped like this:

```json
{
  "field1": ["array of errors"],
  "field2": ["array of errors"]
}
```

A quick example would look like this:

```vue{4}
<template>
  <ValidationObserver ref="observer">
    <form @submit.prevent="onSubmit">
      <ValidationProvider vid="field1" v-slot="{ errors }">
        <!-- Input -->
      </ValidationProvider>

      <ValidationProvider vid="field2" v-slot="{ errors }">
        <!-- Input -->
      </ValidationProvider>
    </form>
  </ValidationObserver>
</template>

<script>
export default {
  methods: {
    onSubmit() {
      // send the data to your backend service.
      const { data } = await axios.post('/api/posts', {
        // form data
      });

      if (data.valid) {
        // yay!
        return;
      }

      // Add the errors for each field.
      // Each field must have a `vid` value same as the fields in the response.
      this.$refs.observer.setErrors(data.errors);
    }
  }
};
</script>
```
