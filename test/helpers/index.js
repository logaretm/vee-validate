export default {
  querySelector(el) {
      global.document.querySelector = () => el || null
  },
  vnode(shouldThrow, result, callback) {
      return {
          context: {
              $validator: this.validator(shouldThrow, result, callback),
              $nextTick: (callback) => {
                  callback();
              }
          },
          data: {
              directives: []
          }
      }
  },
  validator(shouldThrow = true, result = false, callback) {
    return {
        validate(name, value) {
            if (shouldThrow) {
                throw (value ? value : String(value));
            }
            return new Promise((resolve, reject) => {
                if (shouldThrow) {
                    reject(value ? value : String(value));
                    return;
                }
                resolve(result);
            }).then(result => {
                if(typeof callback === 'function') callback();
                return result;
            });
        },
        attach() {
            
        }
    }
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
