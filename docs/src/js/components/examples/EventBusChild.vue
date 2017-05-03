<template>
    <div class="columns is-multiline">
        <div class="column is-12">
            <label class="label">Name</label>
            <p class="control has-icon has-icon-right">
                <input name="name" v-validate="'required|alpha'" :class="{'input': true, 'is-danger': errors.has('name') }" type="text" placeholder="Name">
                <i v-show="errors.has('name')" class="fa fa-warning"></i>
                <span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>
            </p>
        </div>
    </div>
</template>

<script>
  import bus from './bus';

  export default {
    name: 'child-component',
    methods: {
      onValidate() {
        this.$validator.validateAll();
      },
      onClear() {
        this.errors.clear();
      }
    },
    created() {
      bus.$on('validate', this.onValidate);
      bus.$on('clear', this.onClear);
      this.$watch(() => this.errors.errors, (value) => {
        bus.$emit('errors-changed', value);
      });
    },
    beforeDestroy() {
      bus.$off('validate', this.onValidate);
      bus.$off('clear', this.onClear);
    }
  };
</script>
