# Validating Vuex State

Validating vuex states can be tricky, since in order for the state to change you have to trigger a mutation. Your first try may look like this:

```html
<input type="text" @input="updateMessage" v-validate="'required'">
```

```js
// ...
computed: {
  ...mapState({
    message: state => state.obj.message
  })
},
methods: {
  updateMessage (e) {
    this.$store.commit('updateMessage', e.target.value)
  }
}
```

But that doesn't work very well for `input` events. This is because the handlers for validator and the `updateMessage` method don't sync up. To fix this issue we need to enable [two way binding for Vuex state](https://vuex.vuejs.org/en/forms.html) which is easy to achieve using [setters for computed properties](https://vuejs.org/v2/guide/computed.html#Computed-Setter) and allows us to use `v-model` on our inputs.

So our code will look like this:

```html
<input name="message" v-model="message" v-validate="'required|min:5'" type="text" placeholder="Your Message">
```

```js
// ...
computed: {
  message: {
    get () {
      return this.$store.state.message;
    },
    set (val) {
      this.$store.commit('UPDATE_MESSAGE', val);
    }
  }
}
```

## Demo

<iframe src="https://codesandbox.io/embed/y3504yr0l1?initialpath=%2F%23%2Fvuex&module=%2Fsrc%2Fcomponents%2FVuex.vue&view=preview" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

[![Edit VeeValidate Examples](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/y3504yr0l1?initialpath=%2F%23%2Fvuex&module=%2Fsrc%2Fcomponents%2FVuex.vue)
