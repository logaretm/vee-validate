# Validating Models

The `v-validate` directive detects if the input has `v-model` bound to the same input, and watches for that value and validates it when it changes. which is on `input` event by default. If `.lazy` modifier is applied on the model, it will validate on `change` instead respecting the v-model modifier.

<iframe src="https://codesandbox.io/embed/y3504yr0l1?initialpath=%2F%23%2Fmodels&module=%2Fsrc%2Fcomponents%2FModels.vue&view=preview" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

[![Edit VeeValidate Examples](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/y3504yr0l1?initialpath=%2F%23%2Fmodels&module=%2Fsrc%2Fcomponents%2FModels.vue)