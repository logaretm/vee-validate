---
title: Devtools Plugin
description: Using the vee-validate Vue.js devtools plugin
order: 7
next: guide/testing
new: true
---

# Devtools Plugin <DocBadge title="v4.5" />

vee-validate ships with a Vue.js devtools plugin that allows you to inspect your forms. The terms "devtools plugin" or "plugin" in this page will refer to vee-validate's devtools plugin from now on.

The devtools plugin is useful for debugging and inspecting your forms. A common situation is not having any clues on why a form isn't submitting, the devtools plugin exposes to you all of the validation state giving you insight for your forms behavior.

Since vee-validate doesn't require any app configuration, the devtools plugin is auto installed when you use `useField` or `useForm` or their component counterpart `<Field />` and `<Form />`.

<doc-tip type="warn">    
  Note that the plugin won't be installed in the following cases:

- You are using the umd builds via CDN
- Your `process.env.NODE_ENV` is set to `production` or `test`

That means the plugin is only available to the workflows that employ either webpack or vite where `process.env.NODE_ENV` is available.

</doc-tip>

## The Inspector

The devtools plugin adds a new "vee-validate" inspector that allows you to view your form state, at the moment all the properties are read only.

To use the vee-validate inspector, switch from the `components` inspector to the `vee-validate` inspector:

<video src="/video/inspector.mp4" autoplay muted loop loading="lazy"></video>

## Disabling the plugin

If the plugin is causing you issues, you can disable it explicitly from the vue-devtools plugin page.

Also please don't forget to report the issue [here](https://github.com/logaretm/vee-validate/issues/new?assignees=&labels=&template=bug_report.yaml).

This short video shows how to disable the vee-validate devtools plugin:

<video src="/video/disable-plugin.mp4" autoplay muted loop loading="lazy"></video>
