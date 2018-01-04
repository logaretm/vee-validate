## [Radio Buttons](#radio-buttons-example)

vee-validate also supports validating radio buttons, you can use whatever rules you want on them but only few rules makes sense, like `required`. One thing to note in this example is that you only need to use the directive on one of the radio buttons, you don't need to attach it on every one, they all must share the same name though.

In the following example, the third value is not included using the rule `in:1,2`