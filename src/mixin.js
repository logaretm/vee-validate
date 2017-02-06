import Validator from './validator';

export default (options) => ({
  data() {
    return {
      [options.errorBagName]: this.$validator.errorBag,
    };
  },
  computed: {
    [options.fieldsBagName]: {
      get() {
        return this.$validator.fieldBag;
      }
    }
  },
  beforeCreate() {
    this.$validator = new Validator(null, { init: false });
  },
  mounted() {
    this.$validator.init();
  }
});
