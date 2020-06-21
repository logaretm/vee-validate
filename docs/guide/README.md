---
title: Overview
description: Getting started with VeeValidate
meta:
  - name: og:title
    content: Getting Started
  - name: og:description
    content: Getting started with VeeValidate
---

# Overview

Form validation is one of the most difficult subjects in frontend, not only you have to deal with ensuring correct values are submitted, you must also make sure to provide a suitable UX for your users. And we also have to deal with accessability and making sure our forms are inclusive and usable for all types of our users, doing form validation by hand is painful and is a lot of work and you won't probably cover localization and cross-field validation! **The time you spend working on a custom form validation solution is better spent building your application logic**.

Most validation libraries will save you a lot of time, but `vee-validate` tackles the major pain points of form validation and addresses them in a very flexible way:

- Define validation rules declaratively or imperatively
- Cross Field validation
- Schema (form-level) Validation
- Built-in helpers to enhance your forms accessability and styling
- Localization and message generation support
- A package of the most common rules is available

## Getting Started

### Installation

#### yarn

```bash
yarn add vee-validate
```

#### npm

```bash
npm install vee-validate --save
```

#### CDN

```html
<!-- jsdelivr cdn -->
<script src="https://cdn.jsdelivr.net/npm/vee-validate@latest/dist/vee-validate.js"></script>

<!-- unpkg -->
<script src="https://unpkg.com/vee-validate@latest"></script>
```

### Usage

#### via script tag

include the script directly

<!-- TODO: Script tag tutorial -->

:::tip
All Examples from now on will use the ES2015 syntax, make sure to brush up on ES2015 if you haven't already.
:::

<!-- TODO: Add basic example of entire form and a gist -->
