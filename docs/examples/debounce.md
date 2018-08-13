# Debounced (Delayed) Validation

You can specify a delay to debounce the input event, a case scenario that you may want to wait for the user to stop typing then validate the field to limit the validation firing frequency.

This can be achieved by adding a `data-vv-delay` attribute on the field being validated, and assign it the number of milliseconds you want to wait for.

<iframe src="https://codesandbox.io/embed/y3504yr0l1?initialpath=%2F%23%2Fdebounce&module=%2Fsrc%2Fcomponents%2FDelay.vue" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

[![Edit VeeValidate Examples](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/y3504yr0l1?initialpath=%2F%23%2Fdelay&module=%2Fsrc%2Fcomponents%2FDelay.vue)
