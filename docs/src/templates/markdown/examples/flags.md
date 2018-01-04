## [Flags](#flags-example)

vee-validate includes few flags that could help you improve your user experience, each field under validation has its own set of flags which are:


- `touched`: indicates that the field has been touched or focused.
- `untouched`: indicates that the field has not been touched nor focused.
- `dirty`: indicates that the field has been manipluated.
- `pristine`: indicates that the field has not been manipluated.
- `valid`: indicates that the field has been validated at least once and that it passed the validation.
- `invalid`: indicates that the field has been validated at least once and that it failed the validation.


The flags are reactive objects, so you can build computed properties based on them. For example here is how you can tell if a form has been manipulated, say maybe to disable/enable a button.

```js
export default {
  // ...
  computed: {
    isFormDirty() {
      return Object.keys(this.fields).some(key => this.fields[key].dirty);
    }
  },
  //...
}
```

The global fields flags are accessed via objects like this:

```js
// Is the 'name' field dirty? 
this.fields.name.dirty;
```

However, for the scoped fields the **FieldBag** will group those fields in an property name that is prefixed by a `$` to indicate that it is a scope object:

```js
// Is the 'name' field dirty? 
this.fields.$myScope.name.dirty;

// Is the 'name' field clean? 
this.fields.$myScope.name.pristine; 
```


Here is what it would look like:

```html
<div class="form-input">
  <input type="text" name="email" v-validate="'required|email'" placeholder="Email">
  <span v-show="errors.has('field')">{{ errors.first('field') }}</span>
  <span v-show="fields.email && fields.email.dirty">I'm Dirty</span>
  <span v-show="fields.email && fields.email.touched">I'm touched</span>
  <span v-show="fields.email && fields.email.valid">I'm valid</span>
</div>
```

```html
<div class="form-input">
  <input data-vv-scope="scope" type="text" name="email" v-validate="'required|email'" placeholder="Email">
  <span v-show="errors.has('scope.field')">{{ errors.first('scope.field') }}</span>
  <span v-show="fields.$scope && fields.$scope.email && fields.$scope.email.dirty">I'm Dirty</span>
</div>
```

Notice the additional checks before the actual flag check, this is because the flags aren't actually available until the `mounted()` life cycle event, so to avoid `created()` life cycle errors we need to add those checks.

This can become quite tedious if you are referencing multiple flags, so It might be useful to use the `mapFields` helper, which is similair to Vuex's `mapGetters` and `mapActions` as it maps a field object to a computed property.

```js
import { mapFields } from 'vee-validate'

export default {
  // ...
  computed: mapFields(['name', 'email', 'scope.email']),
 // ...
}
```

You can also provide an object to rename the mapped props:

```js
import { mapFields } from 'vee-validate'

export default {
  // ...
  computed: mapFields({
    fullname: 'name',
    phone: 'scope.phone'
  }),
 // ...
}
```

Note that scoped fields names in the array from is mapped to a non-nested name. and you can use the object spread operator to add the mapped fields to your existing computed components:

```js
import { mapFields } from 'vee-validate'

export default {
  // ...
  computed: {
    ...mapFields(['name', 'email', 'scope.phone']),
    myProp() {
       // ....
    }
  },
 // ...
}
```

Additionally, In case you want to set the flags manually, you can use the `Validator.flag(fieldName, flagsObj)` method:

```js
// flag the field as valid and dirty.
this.$validator.flag('field', {
  valid: false,
  dirty: true
});

// set flags for scoped field.
this.$validator.flag('scoped.field', {
  touched: false,
  dirty: false
});
```

For custom components, in order for the flags to fully work reliably, you need to emit those events:

The input event, which you probably already emit, will set the dirty and pristine flags.

```js
this.$emit('input', value); 

// The focus event which will set the touched and untouched flags.
this.$emit('focus'); 
```
Here is an example that displays those flags, intereact with the input and watch the flags change accordingly:

