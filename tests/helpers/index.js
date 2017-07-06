export default {
  querySelector(el) {
    global.document.querySelector = () => el || null;
  },
  binding() {
    return {
      modifiers: {},
      expression: 'exp',
      value: 'someval'
    };
  },
  vnode(shouldThrow, result, callback) {
    return {
      context: {
        $validator: this.validator(shouldThrow, result, callback),
        $nextTick: (cb) => {
          cb();
        }
      },
      data: {
        directives: []
      }
    };
  },
  validator(shouldThrow = true, result = false, callback) {
    return {
      validate(name, value) {
        if (shouldThrow) {
          throw (String(value));
        }
        return new Promise((resolve, reject) => {
          if (shouldThrow) {
            reject(String(value));
            return;
          }
          resolve(result);
        }).then(something => {
          if (typeof callback === 'function') callback();
          return something;
        });
      },
      attach() {

      }
    };
  },
  file: (name, type, size = 1) => ({
    name,
    type,
    size: size * 1024
  }),
  dimensionsTest: (dimensions, fails = false) => {
    global.window.URL = {
      createObjectURL() {
        return 'data:image/png;base64,AAAAAAA';
      }
    };

    global.Image = class Image {
          // eslint-disable-next-line
          set src(value) {
            this.width = dimensions.width;
            this.height = dimensions.height;

            this[fails ? 'onerror' : 'onload']();
          }
      };
  }
};
