# withValidation()

Creates a higher order component (HOC) from the given component, you can use this function to quickly wrap your input components with a validation provider. It passes the slot props from the `ValidationProvider` as props to the underlying component. For more information regarding the slot props, See [ValidationProvider slot props](./validation-provider.md#slot-scope-props)

Assuming you have a `TextField` component that may look like this:

```vue
<template>
  <div>
    <input type="text" v-model="innerValue" :value="value" />
    <span>{{ errors[0] }}</span>
  </div>
</template>

<script>
  export default {
    name: 'TextField',
    props: ['value', 'errors'],
    data: () => ({
      innerValue: ''
    }),
    watch: {
      innerValue (val) {
        this.$emit('input', val);
      }
    }
  };
</script>
```

This component does not have validation built-in, but it does have the UI to do so which is common in design systems and 3rd party input components.

The next step is to use the `withValidation` function to create a version of it but with validation enabled.

```js
import { withValidation } from 'vee-validate';
import TextField from './components/TextField';

const TextFieldWithValidation = withValidation(TextField);
```

The `TextFieldWithValidation` is an **enhanced component** that you can use. The resultant component accepts the same props as the `ValidationProvider` component, for more information about the available props, see [ValidationProvider props](./validation-provider.md#props)

The original `TextField` component will receive the slot scope props as props, but your base component doesn't have to be compatiable with the slot props as you can map the slot props to props by passing a function as a second argument:

```js
import { withValidation } from 'vee-validate';
import TextField from './components/TextField';

const TextFieldWithValidation = withValidation(TextField, ({ errors }) => {
  return {
    error-message: errors[0]
  };
});
```

The second argument is a function that transforms the validation scoped slot to props object to be passed to the wrapped component. In this case you want to pass the first item in the `errors` array as the `error-message` prop to the underlying `TextField` component.

:::danger
This approach has some cons, for example if the wrapped component accepts props that have the same name as the `ValidationProvider` component. While it will receive these props, they may be of different types, which could lead to conflict issues. The problem with HOCs are that you need to be aware of the underlying component's implementation. This can be problematic when working with 3rd party components, generally it is recommended to wrap your components with `ValidationProvider` manually.
:::
