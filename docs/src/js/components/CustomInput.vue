<template>
    <div class="column is-12">
        <label class="label">{{ label }}</label>
        <p class="control">
            <input v-model="innerValue" :class="{ 'input': 'true', 'is-danger': hasError }" type="text" placeholder="Enter an email">
        </p>
    </div>
</template>

<script>
  export default {
    props: {
      label: String,
      hasError: Boolean
    },
    data: () => ({
      innerValue: null
    }),
    watch: {
      innerValue(value) {
        this.$emit('input', value);
      }
    }
  };
</script>
