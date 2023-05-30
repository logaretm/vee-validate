<script setup lang="ts">
import { watchEffect } from 'vue';
import '@vue/repl/style.css';
import { Repl, ReplStore } from '@vue/repl';

const props = defineProps<{
  files: Record<string, string>;
}>();

const store = new ReplStore({
  serializedState: btoa(JSON.stringify(props.files)),
});

// persist state to URL hash
// watchEffect(() => console.log(store.serialize()));

// pre-set import map
store.setImportMap({
  imports: {
    'vee-validate': 'https://unpkg.com/vee-validate@4.9.5/dist/vee-validate.esm.js',
    '@vee-validate/zod': 'https://unpkg.com/@vee-validate/zod@4.9.5/dist/vee-validate-zod.esm.js',
    '@vee-validate/yup': 'https://unpkg.com/@vee-validate/yup@4.9.5/dist/vee-validate-yup.esm.js',
    '@vee-validate/i18n': 'https://unpkg.com/@vee-validate/i18n@4.9.5/dist/vee-validate-i18n.esm.js',
    '@vee-validate/rules': 'https://unpkg.com/@vee-validate/rules@4.9.5/dist/vee-validate-rules.esm.js',
    // yup: 'https://unpkg.com/yup@1.2.0/index.esm.js',
    zod: 'https://unpkg.com/zod@3.21.4/lib/index.mjs',
    '@vue/devtools-api': 'https://unpkg.com/@vue/devtools-api@6.5.0/lib/esm/index.js',
  },
});

// use a specific version of Vue
store.setVueVersion('3.3.4');
</script>

<template>
  <Repl :store="store" :showCompileOutput="false" :ssr="false" :showImportMap="false" />
</template>
