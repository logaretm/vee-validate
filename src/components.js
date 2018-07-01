export const ValidationProvider = {
  data: () => ({
    name: '',

  }),
  beforeCreate () {
    // TODO: Initialize the field and attach it to the validator here.
  },
  render () {
    const field = this.$validator.fields.find({ name: this.name });

    return this.$scopedSlots.default({
      errors: this.$validator.errors.collect(this.name),
      flags: field ? field.flags : {}
    });
  }
};
