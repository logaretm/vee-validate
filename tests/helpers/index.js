export default {
  querySelector (el) {
    global.document.querySelector = () => el || null;
  },
  binding () {
    return {
      modifiers: {},
      expression: 'exp',
      value: 'someval'
    };
  },
  vnode (shouldThrow, result, callback) {
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
  validator (shouldThrow = true, result = false, callback) {
    return {
      validate (name, value) {
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
      attach () {

      }
    };
  },
  file: (name, type, size = 1) => new File([new ArrayBuffer(size * 1024)], name, { type }),
  fileList: (files) => ({
    length: files.length,
    item: (index) => files[index],
    ...files
  })
};
