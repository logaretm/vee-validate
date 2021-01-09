---
title: Multi-step Form Wizard
description: a multi-step form wizard
order: 7
---

# Multi-step Form Wizard

These examples showcases a simple multi-step form (form wizard), with `next` and `previous` step navigation.

## Higher Order Components

This example uses the higher-order components only, and uses the `v-model` to assign initial values to the steps during `next/previous` cycle.

<code-sandbox id="vee-validate-multi-step-form-52l9n" title="vee-validate multi-step form wizard"></code-sandbox>

## Composition API

This example uses the composition API for the form itself, and thus doesn't need to use `v-model` to persist the steps values.

<code-sandbox id="smoosh-bush-184bd" title="vee-validate multi-step form wizard"></code-sandbox>
