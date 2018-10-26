# Component Injections

Each component has its own __Validator Scope__ which prevents fields from one component to be accessed from another one, you may need to be able to share the fields across components to communicate errors or display a UI state.

## Injecting Parent Validator

You can rely on Vue's [Provide/Inject API](https://vuejs.org/v2/api/#provide-inject) for this case, here is how it works:

```js{2,9-11}
export default {
  inject: ['$validator'],
  // ...
};

// OR use object syntax

export default {
  inject: {
    $validator: '$validator'
  },
  // ...
};
```

This will make the component inherit it's parent's validator scope, thus sharing all errors and validation state. Meaning it has access to the same `errors` and `fields` computed properties as well.

::: tip
  If the direct parent isn't able to provide a validator scope, the API will traverse the tree upwards looking for a parent that can.
:::

## Disabling Automatic Injection

You may also want to stop all automatic injections to reduce the memory footprint of the plugin.

```js
import Vue from 'vue';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate, { inject: false });
```

This will make the plugin stop instantiating a new validator scope for each component instance, excluding the root instance. But you would need to manage how a component gets its validator instance if it needs it. So it can inject it from a parent or [request an isolated validator scope](#requesting-a-new-validator-scope).

:::tip
  Injecting the parent validator with the `Inject API` will work the same regardless of automatic injection state. The component will always get its validator instance from the first parent that can provide it.
:::

### Requesting a new validator scope

By setting a `validator` property on the component's VeeValidate constructor options:

```js{4}
export default {
  // ...
  $_veeValidate: {
    validator: 'new' // give me my own validator scope.
  },
  // ...
};
```

Typically a component would need a new validator scope for various reasons; common examples are if it is a `vue-router` route component or a `nuxt` page component. Requesting a new validator scope will make the component the only provider for validator instances to its children.

::: warning
  With SSR Frameworks like Nuxt, it is recommended to disable automatic injection since it may cause memory leaks due to all the validator instances being created for every component, which is not needed and may slow down your site.
:::
