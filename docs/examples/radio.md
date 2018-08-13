# Validating Radio Buttons

vee-validate also supports validating radio buttons You can use whatever rules you want on them but only few rules make sense, like `required`. One thing to note in this example is that you only need to use the directive on one of the radio buttons, you don't need to attach it on every one. They all must share the same name though.

In the following example, the third value is not included using the rule `in:1,2`

<iframe src="https://codesandbox.io/embed/y3504yr0l1?initialpath=%2F%23%2Fradio&module=%2Fsrc%2Fcomponents%2FRadio.vue&view=preview" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

[![Edit VeeValidate Examples](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/y3504yr0l1?initialpath=%2F%23%2Fradio&module=%2Fsrc%2Fcomponents%2FRadio.vue)
