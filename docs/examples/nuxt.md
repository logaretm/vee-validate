# Integrating with Nuxt

## Create a vee-validate plugin

In VeeValidate 2.x releases, there was a few gotchas to keep in mind when using [Nuxt.js](https://nuxtjs.org/). This is no longer the case and you can directly integrate vee-validate by importing its components.

You still need to setup the rules you need in your project, we will do this by using a Nuxt.js "plugin".

This is a basic snippet for a `~/plugins/vee-validate` file:

```js
import { extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

// install the 'required' rule.
extend('required', {
  ...required,
  message: 'This field is required'
});
```

:::danger
Depending on your Nuxt config, You might get this error "Unexpected token **export**". This is because the `node_modules` folder is excluded from transpilation.

We will need to [add an exception](https://nuxtjs.org/api/configuration-build/#transpile) for the `vee-validate/dist/rules.js` file inside the `build` block in the `nuxt.config.js`:

```js
  build: {
    // Add exception
    transpile: [
      "vee-validate/dist/rules"
    ],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
```

:::

This is a live example:

<iframe src="https://codesandbox.io/embed/codesandbox-nuxt-irht2?fontsize=14" title="VeeValidate 3.0 - Nuxt Example" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Integrating with nuxt-i18n module

Using the `nuxt-i18n` module is a very common case, here is an example on how to integrate the module's localization with vee-validate:

<iframe
  src="https://codesandbox.io/embed/veevalidate-30-nuxt-example-opr6s?fontsize=14"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="VeeValidate 3.0 - Nuxt Example"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>
