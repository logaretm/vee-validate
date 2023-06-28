<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';

const limit = ref(5);

const { errors, defineInputBinds } = useForm({
  validationSchema: toTypedSchema(
    yup.lazy(() =>
      yup.object({
        content: yup.string().max(limit.value),
      })
    )
  ),
});

const content = defineInputBinds('content');
</script>

<template>
  <input v-model.number="limit" />

  <input v-bind="content" />
  <div>{{ errors.content }}</div>
</template>
