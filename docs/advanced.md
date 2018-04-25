---
sidebar: auto
---

# Advanced

These are some tips for advanced VeeValidate usage.

## Component Injections

The default behavior for the plugin is to forcibly inject a validator instance for each component, which means each component has its own validator scope, that made sharing error messages between components relatively hard depending on your case.

You can rely on Vue's [Provide/Inject API](https://vuejs.org/v2/api/#provide-inject) for this case, here is how it works:

By default the root Vue instance will be the only one to have a `Validator` instance, child components can further choose to either inject the parents tree validator or request a new one.

Here is how to request the parent's validator instance:

```js{2,9-11}
export default {
  inject: ['$validator'],
  // ...
};

// OR use object synatx

export default {
  inject: {
    $validator: '$validator'
  },
  // ...
};
```

::: tip
  If the first parent isn't able to provide a validator instance, the API will traverse the tree upwards looking for a parent that can.
:::

Here is how to request a new validator instance for the component by setting a `validator` property on the component's VeeValidate constructor options:

```js{4}
export default {
  // ...
  $_veeValidate: {
    validator: 'new' // give me a new validator each time.
  },
  // ...
};
```

You may also want to stop all automatic injections, and control when a component gets the ability to validate:

```js
import Vue from 'vue';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate, { inject: false });
```

This will make the plugin stop instantiating a new validator for each component instance, excluding the root instance.

The `errorBag` and the `fields` objects will be also shared along with the validator, they will not be injected if the component does not have a validator instance.

::: warning
    With SSR Frameworks like Nuxt, it is recommended to disable automatic injection since it may cause memory leaks due to all the validator instances being created for every component, which will slow down your site.
:::

## Component Constructor Options

For your custom components that act as inputs you could customize the way the validator intereacts with your components, reducing greatly the number of needed attributes to make your component validatable.

You can use it by defining a `$_veeValidate` field in your component options definition:

```js{3-8}
export default {
  // ...
  $_veeValidate: {
    // fetch the current value from the innerValue defined in the component data.
    value () {
      return this.innerValue;
    }
  },
  data: () => ({
    innerValue: 'initial'
    // ...
  })
}
```

Aside from defining the `value` getter you can also define the following:

| Property      | Type          | Default Value | Description |
| ------------- |:-------------:|:-------------:|:------------------- |
| name          | `() => string`  | `undefined`     | A function that returns the component name to be registered as in the validator, cannot be an arrow function because its context will be the component itself |
| value         | `() => any`     | `undefined`     |  A function that returns the component current value, will be used by the validator when it needs to resolve the field value, like calling `validate` without passing a value.|
| rejectsFalse  | `boolean`       |  `false`        | Defines `false` as an invalid value when the component is validated against the `required` rule. |
| events        | `string`        |  `input|blur`   | Pipe separated list of event names to validate when triggered. |
| validator     | `string`        |  `inherit|new`   |         Determines how the component get its validator instance, 'new' means it will always instantiate its own validator instance, 'inherit' means it will be injected by its parent using Provide/Inject API, the default is it will instantiate an instance unless it requests a `$validator` injection. |

These options allow you to configure your custom components behavior with vee-validate, check these examples here:

<iframe src="https://codesandbox.io/embed/2wyrp5z000" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Backend Validation

You might need to also use your Laravel/Express or whatever back-end as your validation provider for numerous reasons, like checking if an email is unique since it is hard to implement on the client-side, we can achieve this using a custom rule and the `reasoning` feature:

```js
import axios from 'axios'; // great ajax library.
import { Validator } from 'vee-validate';

const isUnique = (value) => {
  return axios.post('/api/validate/email', { email: value }).then((response) => {
    // Notice that we return an object containing both a valid property and a data property.
    return {
      valid: response.data.valid,
      data: {
        message: response.data.message
      }
    };
  });
};

// The messages getter may also accept a third parameter that includes the data we returned earlier.
Validator.extend('unique', {
  validate: isUnique,
  getMessage: (field, params, data) => {
    return data.message;
  }
});
```

The following demo shows how it would work in action, note that it will only trigger if the user entered a valid email since the validator early exits upon first failure.

Since there is no real DB in this example, it's being simulated by a dynamic array.
