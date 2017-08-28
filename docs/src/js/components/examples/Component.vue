<template>
    <div class="columns is-multiline">
        <div class="column is-12">
            <custom-input v-validate="'required|email'" data-vv-value-path="innerValue" data-vv-name="custom" label="Email" :has-error="errors.has('custom')">
            </custom-input>
            <span v-show="errors.has('custom')" class="help is-danger">{{ errors.first('custom') }}</span>
            <button @click="validate" type="button" class="button is-primary">Validate All</button>
        </div>
    </div>
</template>

<script>
import CustomInput from '../CustomInput.vue';

export default {
  name: 'component-example',
  components: {
    CustomInput
  },
  methods: {
    validate() {
      this.$validator.validateAll().then((result) => {
        // eslint-disable-next-line
        alert(`Validation Result: ${result}`);
      });
    }
  }
};
</script>
