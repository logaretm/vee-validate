# Validating Initial Values

If you are using server-side rendering and you want to populate the inputs values during the rendering phase, for example when editing a record, you can use the `immediate` modifier on the `v-validate` directive to validate the field immediately. Make sure to read the note below the example.

<iframe src="https://codesandbox.io/embed/y3504yr0l1?initialpath=%2F%23%2Finitial&module=%2Fsrc%2Fcomponents%2FInitial.vue&view=preview" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

[![Edit VeeValidate Examples](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/y3504yr0l1?initialpath=%2F%23%2Finitial&module=%2Fsrc%2Fcomponents%2FInitial.vue)

## Input locking and :value binding

::: danger
  You could be tempted to use `:value` binding to populate your fields' initial values, but that would cause the inputs to be "locked", seemingly accepting no input from the user. This happens because as of Vue 2.0 the component template is like a function, it is run whenever the component updates, causing the input to revert to the bound value.

  To get around this issue, you could use `refs` to populate the values. You can read more about that [here](https://github.com/vuejs/vue/issues/3924).
:::
