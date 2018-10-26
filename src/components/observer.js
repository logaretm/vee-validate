// TODO.
const flagMergingStrategy = {
  pristine: 'every',
  dirty: 'some',
  touched: 'some',
  untouched: 'every',
  valid: 'every',
  invalid: 'some',
  pending: 'some',
  validated: 'every'
};

export const ValidationObserver = {
  name: 'ValidationObserver',
  provide () {
    return {
      $_veeObserver: this
    };
  },
  data: () => ({
    refs: {}
  }),
  methods: {
    $subscribe (provider) {
      this.refs = Object.assign({}, this.refs, { [provider.vid]: provider });
    },
    $unsubscribe (provider) {
      delete this.refs[provider.vid];
      this.refs = Object.assign({}, this.refs);
    },
    validate () {
      return Promise.all(Object.keys(this.refs).map(ref => {
        return this.refs[ref].validate().then(result => {
          this.refs[ref].applyResult(result);

          return result;
        });
      }));
    }
  },
  computed: {
    ctx () {
      return Object.keys(flagMergingStrategy).reduce((acc, flag) => {
        const strategy = flagMergingStrategy[flag];
        acc[flag] = Object.keys(this.refs)[strategy](p => this.refs[p].flags[flag]);

        return acc;
      }, {});
    }
  },
  render (h) {
    return h('div', this.$scopedSlots.default(this.ctx));
  }
};
