import Config from './config';
import { createFlags } from './core/utils';

let $validator = null;

export const ValidationProvider = {
  props: {
    name: {
      type: String,
      required: true,
    },
    alias: {
      type: String
    },
    events: {
      type: [Array, String]
    },
    rules: {
      type: [Object, String]
    }
  },
  data: () => ({
    errors: [],
    flags: createFlags()
  }),
  computed: {
    classes () {
      const names = Config.current.classNames;
      return Object.keys(this.flags).reduce((flag, classes) => {
        if (names[flag]) {
          classes[names[flag]] = this.flags[flag];
        }

        return classes;
      }, {});
    }
  },
  render () {
    if (!$validator) {
      $validator = Config.dependency('validator');
    }

    const ctx = {
      errors: this.errors,
      flags: this.flags,
      classes: this.classes
    };

    const vnode = this.$scopedSlots.default(ctx);
    console.log(vnode);

    return vnode;
  }
};
