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

<code-sandbox id="vee-validate-v4-with-quasar-framework-1lx81" title="vee-validate quasar framework example"></code-sandbox>

## Element Plus

> [Element Plus](https://element-plus.org/#/en-US), a Vue 3.0 based component library for developers, designers and product managers

<code-sandbox id="stupefied-goldberg-8l0zi" title="vee-validate element plus example"></code-sandbox>

## Headless UI

> [Headless UI](https://headlessui.dev/): Completely unstyled, fully accessible UI components, designed to integrate beautifully with Tailwind CSS.

<code-sandbox id="vee-validate-headless-ui-example-9jz9h" title="vee-validate headless ui example"></code-sandbox>

## Ionic Framework

> [Ionic Framework](https://ionicframework.com/): An open source mobile toolkit for building high quality, cross-platform native and web app experiences.

This example is originally forked from another example created by [Aaron Saunders](https://twitter.com/aaronksaunders).

<code-sandbox id="vee-validate-ionic-example-yynyp" title="vee-validate ionic example"></code-sandbox>

## Request a UI library

Can't find your favorite UI library here? You can request adding an example for it by creating an [issue here](https://github.com/logaretm/vee-validate/issues/new/choose) and we will consider adding it here.
