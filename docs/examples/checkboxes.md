# Validating Checkboxes

vee-validate also supports validating checkboxes. However, like radio buttons, the extent of the support is limited by the input nature itself, but all rules work regardless. Like for radio buttons, you only have to attach the validator directive and attributes on the checkbox under validation. If there are multiple checkboxes (group), you only have to add the directive on one of them.

If multiple values are selected, the validator will apply the validations on each checkbox.

In the following example, the most basic use of checkboxes validation is the terms and conditions agreement that nobody reads.

<iframe src="https://codesandbox.io/embed/y3504yr0l1?initialpath=%2F%23%2Fcheckboxes&module=%2Fsrc%2Fcomponents%2FCheckbox.vue&view=preview" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

[![Edit VeeValidate Examples](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/y3504yr0l1?initialpath=%2F%23%2Fcheckboxes&module=%2Fsrc%2Fcomponents%2FCheckbox.vue)
