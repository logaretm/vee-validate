## [Component Injections](#injection)

The default behavior for the plugin is to forcebly inject a validator instaance for each component, which means each component has its own validator scope, that made sharing error messages between components relatively hard depending on your case.

You can turn the default inject false by providing `inject` option set to false in the plugin installation:

```js
import Vue from 'vue';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate, { inject: false });
```

This will make the plugin stop instantiating a new validator for each component instance, and will instead rely on Vue's [Provide/Inject API](https://vuejs.org/v2/api/#provide-inject), here is how it works:

By default the root Vue instance will be the only one to have a `Validator` instance, child components can further choose to either inject the parent's validator or request a new one.

Here is how to request the parent's validator instance:

```js
export default {
  inject: ['$validator'],
  // ...
};

export default {
  inject: {
    $validator: '$validator'
  },
  // ...
};
```

> If the first parent isn't able to provide a validator instance, the API will traverse the tree upwards looking for a parent that can.

Here is how to request a new validator instance for the component by setting a `$validates` property on the component constructor options:

```js
export default {
  $validates: true,
  // ...
};
```

The `errorBag` and the `fields` objects will be also shared along with the validator, they will not be injected if the component does not have a validator instance.
