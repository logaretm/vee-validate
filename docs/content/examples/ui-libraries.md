---
title: Popular UI Libraries
description: Validating popular Vue.js UI libraries with examples
order: 8
---

# Validating UI Libraries Examples

Most popular Vue.js UI libraries come with their own built-in validation logic in their form components. If you find yourself not satisfied with said library's validation logic, you can use vee-validate to validate those components.

vee-validate is UI-agnostic, it doesn't offer any special treatment for the elements/components under validation as long as they emit the right events.

Integrating vee-validate can be different for each UI library, it mostly depends on the library's ability to outsource the validation logic to 3rd party logic and how it tracks the form field values.

In the next few examples you will find examples on how to do that in various ways with the most popular Vue.js libraries in no particular order.

## Quasar

[Quasar framework](https://next.quasar.dev/) aims to:

> Effortlessly build high-performance & high-quality Vue 3 user interfaces in record time

<iframe src="https://codesandbox.io/embed/vee-validate-v4-with-quasar-framework-1lx81?fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.vue&theme=dark"
  style="width:100%; height:700px; border:0; border-radius: 4px; overflow:hidden;"
  title="vee-validate v4 with Quasar framework"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  loading="lazy"
></iframe>

## Element Plus

> [Element Plus](https://element-plus.org/#/en-US), a Vue 3.0 based component library for developers, designers and product managers

<iframe src="https://codesandbox.io/embed/stupefied-goldberg-8l0zi?fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.vue&theme=dark"
  style="width:100%; height:700px; border:0; border-radius: 4px; overflow:hidden;"
  title="vee-validate v4 with element plus framework"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  loading="lazy"
></iframe>

## Request a UI library

Can't find your favorite UI library here? You can request adding an example for it by creating an [issue here](https://github.com/logaretm/vee-validate/issues/new/choose) and we will consider adding it here.
