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
    // Probably should do the same to the fields prop ...
    Vue.util.defineReactive(this.$validator, 'errorBag', this.$validator.errorBag);
  },
  mounted() {
    this.$validator.init();
  }
});
