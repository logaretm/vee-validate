---
title: Value formatting and Masks
description: using vee-validate with masked and formatted inputs
order: 9
new: true
---

# Value Formatting and Masks

Some inputs may have a mask applied to them, that is their value is displayed in a different way than the actual value to make it more friendly towards the user.

For example, a currency input could insert a thousand separator to make it easier for the user to enter and read large numbers.

```sh
# hard to read
10000000

# Much easier
10,000,000
```

It can be confusing as to how would you run your numeric validation rules on such inputs. The following examples show you how to handle such inputs by separating the "display value" from the actual value.

## Currency Format Example

The following example integrates [`vue-currency-input`](https://github.com/dm4t2/vue-currency-input) using the composition API. While it is still possible to do it with the `<Field />` component, it is significantly easier to work with the composition API in this case.

The main key to getting this right is to sync the value in multiple formats, the formatted one, and the non-formatted value.

Ideally, vee-validate should be synced with the non-formatted one, you can do this by updating the value manually using `setValue` or `handleChange`.

<live-example id="vee-validate-v4-input-masks"></live-example>
