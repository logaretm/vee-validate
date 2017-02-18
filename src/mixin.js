import Validator from './validator';

export default (Vue, options) => ({
  computed: {
    [options.errorBagName]: {
      get() {
        return this.$validator.errorBag;
      }
    },
    [options.fieldsBagName]: {
      get() {
        return this.$validator.fieldBag;
      }
    }
  },
  beforeCreate() {
    this.$validator = new Validator(null, { init: false });
    Vue.util.defineReactive(this.$validator, 'errorBag', this.$validator.errorBag);
    Vue.util.defineReactive(this.$validator, 'fieldBag', this.$validator.fieldBag);
  },
  mounted() {
    this.$validator.init();
  }
});
