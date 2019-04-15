# Testing

## Asynchronous Behavior

When writing tests for apps that are using VeeValidate, there are a couple of things to keep in mind:

- [Vue DOM updates are asynchronous.](https://vuejs.org/v2/guide/reactivity.html#Async-Update-Queue)
- VeeValidate validations and state changes are also asynchronous.

Consider this simple assertion:

```js
test('my test', () => {
  vm.$validator.validate();

  expect(vm.$validator.errors.any()).toBe(true);
});
```

This assertion might fail because the `validate` method runs the validators asynchronously, meaning by the time the code moves on to the assertion, the validations might have not yet executed, causing the assertion to fail.

You can fix this using `async/await`, something like this:

```js
test('my test', async () => {
  await vm.$validator.validate();

  expect(vm.$validator.errors.any()).toBe(true);
});
```

::: tip
  While `vue-test-utils` do sport a `sync` rendering mode to make assertions easier for you, it is not recommended to use it for vee-validate and there are also plans to deprecate it from the test-utils. So you should treat all your tests as close to the real world as possible.

  You can disable it with `sync: false` when mounting your components.
:::

## Flushing the Update Queue

Since both the Vue rendering and the validation are async, it can prove a difficult task to `await` all the async changes, for example:

```js
test('my test', () => {
  vm.myValue = 'newVal';

  expect(vm.$validator.errors.any()).toBe(true);
});
```

This will not work, since the model updates [do not happen immediately](https://vuejs.org/v2/guide/reactivity.html#Async-Update-Queue) and the validations triggered are also async. But you can't wait for either since the validation and the DOM updates all happen under the hood.

Here we would like to be able to __wait__ for all async operations to finish, which can be done using the `flush-promises` package:

```bash
yarn add flush-promises --dev

# or

npm i flush-promises -D
```

Our example will then be updated to look like this:

```js
import flushPromises from 'flush-promises';

test('my test', async () => {
  vm.myValue = 'newVal';
  await flushPromises(); // wait for all async stuff to finish up.

  expect(vm.$validator.errors.any()).toBe(true);
});
```

## Testing Example

Here is a full test written using vue-test-utils. We test the basic validation functionality for both the directive and the ValidationProvider component.

<iframe src="https://codesandbox.io/embed/k5v3y5rjoo?fontsize=14&previewwindow=tests" title="Vue Template" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

[![Edit Vue Template](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/k5v3y5rjoo?fontsize=14&previewwindow=tests)
