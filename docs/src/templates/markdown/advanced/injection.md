## [Component Injections](#injection)

The default behavior for the plugin is to forcibly inject a validator instance for each component, which means each component has its own validator scope, that made sharing error messages between components relatively hard depending on your case.

You can rely on Vue's [Provide/Inject API](https://vuejs.org/v2/api/#provide-inject) for this case, here is how it works:

By default the root Vue instance will be the only one to have a `Validator` instance, child components can further choose to either inject the parents tree validator or request a new one.

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


Here is how to request a new validator instance for the component by setting a `validator` property on the component's VeeValidate constructor options:

```js
export default {
  // ...
  $_veeValidate: {
    validator: 'new' // give me a new validator each time.
  },
  // ...
};
```

You may also want to stop all automatic injections, and control when a components gets the ability to validate:

```js
import Vue from 'vue';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate, { inject: false });
```

This will make the plugin stop instantiating a new validator for each component instance, excluding the root instance.

The `errorBag` and the `fields` objects will be also shared along with the validator, they will not be injected if the component does not have a validator instance.
