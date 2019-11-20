# Refactoring Forms

## Extracting Input Fields

You've only used `ValidationProvider` and `ValidationObserver` to build forms so far, but building forms like that can get tedious and time consuming especially for very large forms.

For example you might have a form that looks like this:

@[example](large-form-unrefactored)

Refactoring vee-validate is no different than refactoring regular Vue.js components, by inspecting the template of the last example you should notice that all the inputs look exactly the same, they are all wrapped by `ValidationProvider` and all of them have an element to display the error.

```vue{1,3,4}
<ValidationProvider rules="required" name="Last Name" v-slot="{ errors }">
  <input v-model="lname" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

The only dynamic parts are the `rules`, `name` and the `type` of the input.

You can refactor the last sample to build your own `TextInput` component, this is a basic implementation of such a component:

@[example](text-input)

Such a component would be used to handle all the text-based inputs in your app in. For other types of inputs, it might be worth it to implement custom wrappers around them just like this one.

Check out the large form from earlier but when the fields are swapped by the `TextInput` component you've implemented just now:

@[example](large-form-refactored)

Not only it looks much cleaner, but also due to the nature of template-based validation, It is declarative and it is clear what each field requirements are without having to skim through the JavaScript.

## Advanced Input Fields

You've only touched the surface of refactoring the `ValidationProvider`, if you want, you could use the rich state provided by the `ValidationProvider` to build an accessible, pleasant `TextInput` component. this is a real example from an app that employed this technique to build a versatile `TextInput` component:

// TODO: Example for a text field from dashboard
