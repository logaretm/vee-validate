# Backend and Remote Validation

You can integrate your backend validation with vee-validate in a couple of ways.

## Server-side Rules

Because `vee-validate` assumes all rules are asynchronous, you create a rule where it sends the field value to a remote/backend service and validate the field there if it cannot be validated on the client side.

A `unique` rule is an example of rules that cannot be validated on the client side since a database access is required.

A rule that uses that endpoint could look like this:

```js
// use axios or fetch
import axios from 'axios';
import { extend } from 'vee-validate';

extend('uniqueEmail', {
  async validate(value) {
    // You might want to check if its a valid email
    // before sending to server...
    const { data } = await axios.post('/api/isEmailUnique', { value });

    // server response
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

<iframe src="https://codesandbox.io/embed/vue-template-c5s7m?fontsize=14&module=%2Fsrc%2Fcomponents%2FExample.vue" title="VeeValidate 3.0 - Async Rule Example" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

The previous example is suitable for rules that are meant to be re-usable and will be used regularly in your app. But most of the time your backend validates a request body as a whole and returns errors for the entire form. Check the next section.

## Adding Errors From API Response

You can add errors manually using either `ValidationProvider.setErrors` or `ValidationObserver.setErrors` method, let's assume you are submitting a form and you are filling the errors after the server response so we will use the observer's `setErrors` to set errors all the providers.

The `setErrors` method on the observer instance takes an Object shaped like this:

```json
{
  "field1": ["array of errors"],
  "field2": ["array of errors"]
}
```

The keys of the error object should be either the provider's `name` or `vid` prop. The `setErrors` method on the **Provider's** instance accepts an array of strings instead of an object.

A quick example would look like this:

```vue{4}
<template>
  <ValidationObserver ref="observer">
    <form @submit.prevent="onSubmit">
      <ValidationProvider ref="field1Provider name="field1" v-slot="{ errors }">
        <!-- Input -->
      </ValidationProvider>

      <ValidationProvider name="field2" v-slot="{ errors }">
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
      this.$refs.observer.setErrors(data.errors);

      // Set the errors for a single field.
      this.$refs.field1Provider.setErrors(data.errors.field1);
    }
  }
};
</script>
```

Here is a live example:

<iframe src="https://codesandbox.io/embed/vue-template-k05rn?fontsize=14&module=%2Fsrc%2Fcomponents%2FExample.vue" title="Vue Template" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
