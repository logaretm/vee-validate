## [Checkbox Example](#checkbox-example)

vee-validate also supports validating checkboxes, however like radio buttons the extent of the support is limited by the input nature itself, but all rules work regardless. like the radio buttons you only have attach the validator directive and attributes on the checkbox under validation if there are multiple checkboxes (group) you only have to add the directive on one of them.  
If multiple values are selected, the validator will apply the validations on each checkbox.  

In the following example, the most basic use of checkboxes validation is the terms and conditions agreement that nobody reads.