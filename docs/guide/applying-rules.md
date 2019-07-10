# Using Validation

After adding your rules, you can start to validate your input fields.

```vue{2}
<ValidationProvider
  rules="required|email"
  v-slot="{ errors }"
>
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

The string `required|email` is one of the two ways we can specify validation rules to our fields.

## String Format

This is the simplest format, you add rules names separated by **pipes (`|`)**. So in the previous example we applied both the `required` and `email` rules on our input.

### Rules with parameters

Some rules can take parameters like the `min` rule, to pass parameters in the string format you add a `:` followed the params values.

The following code checks if the field value is at least 3 characters long.

```vue{2}
<ValidationProvider
  rules="required|min:3"
  v-slot="{ errors }"
>
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

Other parameters can be added with `,` separating them, the following example checks if the field is a number between `3` and `10`.

```vue{2}
<ValidationProvider
  rules="required|between:3,10"
  v-slot="{ errors }"
>
  <input v-model="value" type="number">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

Some rules take infinite number of parameters like `oneOf`. The following example checks if the field text is one of the provided parameters, one of those selections is invalid.

<RuleDemo
type="select"
rule="required|oneOf:coffee,tea,beer,milk"
:options="[{ text: 'Coffee', value: 'coffee' }, { text: 'Tea', value: 'tea' }, { text: 'Beer', value: 'beer' }, { text: 'Milk', value: 'milk' }, { text: 'Juice', value: 'juice' }]"></RuleDemo>

```vue{3}
<ValidationProvider
  rules="required|oneOf:coffee,tea,beer,milk"
  v-slot="{ errors }"
>
  <select v-model="value">
    <option value="coffee">Coffee</option>
    <option value="tea">Tea</option>
    <option value="beer">Beer</option>
    <option value="milk">Milk</option>
    <option value="juice">Juice</option>
  </select>
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

## Object Format

The string format works perfectly most of the time, however there are some situations where it falls short, for example the `regex` rule could commonly contain `|`, `:` or `,` characters which would conflict with rules parsed in the string format.

To remedy this, you can pass rules as an object:

```vue{2}
<ValidationProvider
  :rules="{ required: true, email: true }"
  v-slot="{ errors }"
>
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

### Rules with parameters

To pass parameters to your rules, you pass an object:

```vue{2}
<ValidationProvider
  :rules="{ required: true, min: { length: 3 } }"
  v-slot="{ errors }"
>
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

```vue{2}
<ValidationProvider
  :rules="{ required: true, between: { min: 3, max: 10 } }"
  v-slot="{ errors }"
>
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

You can omit the object if the rule accepts one parameter:

```vue{2}
<ValidationProvider
  :rules="{ required: true, min: 3 }"
  v-slot="{ errors }"
>
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

Rules take infinite number of parameters like `oneOf` can take parameters as an array.

```vue{2}
<ValidationProvider
  :rules="{ required: true, oneOf: ['coffee', 'tea', 'juice', 'beer', 'milk'] }"
  v-slot="{ errors }"
>
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

## Dynamic Rules

As you saw with the object format, `rules` prop can be bound to an expression using `v-bind:rules` or the shorthand `:rules`. Which means you can assign rules conditionally or dynamically:

For example you can conditionally require a field

In **string format:**

```vue{2}
<ValidationProvider
  :rules="isRequired ? 'required' : ''"
  v-slot="{ errors }"
>
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

And in **object format** it is even easier:

```vue{2}
<ValidationProvider
  :rules="{ required: isRequired }"
  v-slot="{ errors }"
>
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

---

Now you can easily assign rules to fields both statically and dynamically. Let's get to displaying errors.

<script>
export default {
  data: () => ({ values: {} })
};
</script>
