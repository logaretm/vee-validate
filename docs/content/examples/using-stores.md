---
title: State Stores
description: using vee-validate with state stores
order: 8
new: true
---

# Stores

If you want to integrate vee-validate with state management solutions you can do that with the composition API.

## Pinia

[Pinia](https://pinia.esm.dev/) is a data store for Vue.js and it is the recommended solution to your Vue.js state management.

The example integrates a form state into the store by syncing it using `watch`. It also integrates the `registerUser` action to be used as a submit handler for the form.

<code-sandbox id="vee-validate-pinia-3mebq" title="vee-validate pinia example"></code-sandbox>
