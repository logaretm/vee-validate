expect.extend({
  toHaveElement (wrapper, selector) {
    return {
      pass: wrapper.find(selector).exists() === !this.isNot,
      message: () => `The element ${!this.isNot ? 'does not' : 'does'} exist.`
    };
  }
});
