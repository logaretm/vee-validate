import Config from './config';
import Validator from './core/validator';
import { createFlags, find, toArray, assign } from './utils';

let $validator = null;

function hasModel (vnode) {
  return !!(vnode.data && vnode.data.directives && find(vnode.data.directives, d => d.name === 'model'));
}

function getModel (vnode) {
  return find(vnode.data.directives, d => d.name === 'model');
}

function findModelNode (vnode) {
  if (hasModel(vnode)) {
    return vnode;
  }

  if (vnode.children && vnode.children.length) {
    return toArray(vnode.children).reduce((candidate, node) => {
      if (candidate) {
        return candidate;
      }

      return findModelNode(node);
    }, null);
  }

  return null;
}

export const ValidationProvider = {
  props: {
    name: {
      type: String
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
    flags: createFlags(),
    hooked: false
  }),
  computed: {
    classes () {
      const names = Config.current.classNames;
      return Object.keys(this.flags).reduce((classes, flag) => {
        const className = (names && names[flag]) || flag;
        if (className) {
          classes[className] = this.flags[flag];
        }

        return classes;
      }, {});
    }
  },
  render (h) {
    if (!$validator) {
      $validator = new Validator(null);
    }

    const ctx = {
      errors: this.errors,
      flags: this.flags,
      classes: this.classes
    };

    const render = h('div', [this.$scopedSlots.default(ctx)]);
    if (!this.hooked) {
      const nodeWithModel = findModelNode(render);
      const model = getModel(nodeWithModel);
      this.$parent.$watch(model.expression, (val) => {
        $validator.verify(val, this.rules).then(({ errors }) => {
          this.errors = errors;

          // TODO: Set ALL FLAGS
          this.flags = assign({}, this.flags, {
            valid: !errors.length,
            invalid: !!errors.length
          });
        });
      });
      this.hooked = true;
    }

    return render;
  }
};
