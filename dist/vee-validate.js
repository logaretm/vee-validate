(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.VeeValidate = factory());
}(this, (function () { 'use strict';

var email$1 = (function (value) {
  return (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value)
  );
});

var In = (function (value, options) {
  return !!options.filter(function (option) {
    return option == value;
  }).length;
}); // eslint-disable-line

var required$1 = (function (value) {
    if (Array.isArray(value)) {
        return !!value.length;
    }

    if (value === undefined || value === null) {
        return false;
    }

    return !!String(value).length;
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();











var toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var min$1 = (function (value, _ref) {
    var _ref2 = slicedToArray(_ref, 1);

    var length = _ref2[0];

    if (value === undefined || value === null) {
        return false;
    }
    return String(value).length >= length;
});

var max$1 = (function (value, _ref) {
    var _ref2 = slicedToArray(_ref, 1);

    var length = _ref2[0];

    if (value === undefined || value === null) {
        return length >= 0;
    }

    return String(value).length <= length;
});

var not_in$1 = (function (value, options) {
  return !options.filter(function (option) {
    return option == value;
  }).length;
}); // eslint-disable-line

var alpha$1 = (function (value) {
  return !Array.isArray(value) && /^[a-zA-Z]*$/.test(value);
});

var alpha_num$1 = (function (value) {
  return !Array.isArray(value) && /^[a-zA-Z0-9]*$/.test(value);
});

var alpha_dash$1 = (function (value) {
  return !Array.isArray(value) && /^[a-zA-Z0-9_-]*$/.test(value);
});

var numeric$1 = (function (value) {
  return !Array.isArray(value) && /^[0-9]*$/.test(value);
});

var regex$1 = (function (value, _ref) {
  var _ref2 = toArray(_ref);

  var regex = _ref2[0];

  var flags = _ref2.slice(1);

  return new RegExp(regex, flags).test(String(value));
});

// TODO: Maybe add ipv6 flag?
var ip$1 = (function (value) {
  return (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value)
  );
});

var ext$1 = (function (files, extensions) {
    var regex = new RegExp('.(' + extensions.join('|') + ')$', 'i');
    for (var i = 0; i < files.length; i++) {
        if (!regex.test(files[i].name)) {
            return false;
        }
    }

    return true;
});

var mimes$1 = (function (files, mimes) {
    var regex = new RegExp(mimes.join('|').replace('*', '.+') + '$', 'i');
    for (var i = 0; i < files.length; i++) {
        if (!regex.test(files[i].type)) {
            return false;
        }
    }

    return true;
});

var size$1 = (function (files, _ref) {
    var _ref2 = slicedToArray(_ref, 1);

    var size = _ref2[0];

    if (isNaN(size)) {
        return false;
    }

    var nSize = Number(size) * 1024;
    for (var i = 0; i < files.length; i++) {
        if (files[i].size > nSize) {
            return false;
        }
    }

    return true;
});

var digits$1 = (function (value, _ref) {
    var _ref2 = slicedToArray(_ref, 1);

    var length = _ref2[0];

    var strVal = String(value);

    return (/^[0-9]*$/.test(strVal) && strVal.length === Number(length)
    );
});

var image$1 = (function (files) {
    for (var i = 0; i < files.length; i++) {
        if (!/\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(files[i].name)) {
            return false;
        }
    }

    return true;
});

var validateImage = function validateImage(file, width, height) {
    var URL = window.URL || window.webkitURL;
    return new Promise(function (resolve) {
        var image = new Image();
        image.onerror = function () {
            return resolve({ valid: false });
        };
        image.onload = function () {
            return resolve({
                valid: image.width === Number(width) && image.height === Number(height)
            });
        };

        image.src = URL.createObjectURL(file);
    });
};

var dimensions$1 = (function (files, _ref) {
    var _ref2 = slicedToArray(_ref, 2);

    var width = _ref2[0];
    var height = _ref2[1];

    var list = [];
    for (var i = 0; i < files.length; i++) {
        // if file is not an image, reject.
        if (!/\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(files[i].name)) {
            return false;
        }

        list.push(files[i]);
    }

    return Promise.all(list.map(function (file) {
        return validateImage(file, width, height);
    }));
});

var between$1 = (function (value, _ref) {
  var _ref2 = slicedToArray(_ref, 2);

  var min = _ref2[0];
  var max = _ref2[1];
  return Number(min) <= value && Number(max) >= value;
});

var confirmed$1 = (function (value, _ref) {
    var _ref2 = slicedToArray(_ref, 1);

    var confirmedField = _ref2[0];

    var field = document.querySelector("input[name='" + confirmedField + "']");

    return !!(field && String(value) === field.value);
});

var url$1 = (function (value, params) {
    var isUrl = /^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.\(\)%-]*)*\/?$/.test(value);

    var domain = params && params[0];

    if (domain && isUrl) {
        return new RegExp('^https?://(([da-z.-]+).)*(' + params[0].replace('.', '\\$&') + ')').test(value);
    }

    return isUrl;
});

var decimal$1 = (function (value) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? ['*'] : arguments[1];

    var _ref2 = slicedToArray(_ref, 1);

    var decimals = _ref2[0];

    if (Array.isArray(value)) {
        return false;
    }

    if (value === null || value === undefined || value === '') {
        return true;
    }

    var regexPart = decimals === '*' ? '*' : '{0,' + decimals + '}';
    var regex = new RegExp('^[0-9]*.?[0-9]' + regexPart + '$');

    if (!regex.test(value)) {
        return false;
    }

    return !Number.isNaN(parseFloat(value));
});

var Rules = {
    email: email$1,
    min: min$1,
    max: max$1,
    required: required$1,
    in: In,
    not_in: not_in$1,
    alpha: alpha$1,
    alpha_num: alpha_num$1,
    alpha_dash: alpha_dash$1,
    numeric: numeric$1,
    regex: regex$1,
    ip: ip$1,
    ext: ext$1,
    mimes: mimes$1,
    size: size$1,
    digits: digits$1,
    image: image$1,
    dimensions: dimensions$1,
    between: between$1,
    confirmed: confirmed$1,
    url: url$1,
    decimal: decimal$1
};

var ErrorBag = function () {
    function ErrorBag() {
        classCallCheck(this, ErrorBag);

        this.errors = [];
    }

    /**
     * Adds an error to the internal array.
     *
     * @param {string} field The field name.
     * @param {string} msg The error message.
     * @param {String} scope The Scope name, optional.
     */


    createClass(ErrorBag, [{
        key: "add",
        value: function add(field, msg, scope) {
            var error = {
                field: field,
                msg: msg
            };

            if (scope) {
                error.scope = scope;
            }

            this.errors.push(error);
        }

        /**
         * Gets all error messages from the internal array.
         *
         * @param {String} scope The Scope name, optional.
         * @return {Array} errors Array of all error messages.
         */

    }, {
        key: "all",
        value: function all(scope) {
            if (scope) {
                return this.errors.filter(function (e) {
                    return e.scope === scope;
                }).map(function (e) {
                    return e.msg;
                });
            }

            return this.errors.map(function (e) {
                return e.msg;
            });
        }

        /**
         * Checks if there is any errrors in the internal array.
         * @param {String} scope The Scope name, optional.
         * @return {boolean} result True if there was at least one error, false otherwise.
         */

    }, {
        key: "any",
        value: function any(scope) {
            if (scope) {
                return !!this.errors.filter(function (e) {
                    return e.scope === scope;
                }).length;
            }

            return !!this.errors.length;
        }

        /**
         * Removes all items from the internal array.
         * @param {String} scope The Scope name, optional.
         */

    }, {
        key: "clear",
        value: function clear(scope) {
            if (scope) {
                this.errors = this.errors.filter(function (e) {
                    return e.scope !== scope;
                });

                return;
            }

            this.errors = [];
        }

        /**
         * Collects errors into groups or for a specific field.
         *
         * @param  {string} field The field name.
         * @param  {string} scope The scope name.
         * @return {Array} errors The errors for the specified field.
         */

    }, {
        key: "collect",
        value: function collect(field, scope) {
            var _this = this;

            if (!field) {
                var _ret = function () {
                    var collection = {};
                    _this.errors.forEach(function (e) {
                        if (!collection[e.field]) {
                            collection[e.field] = [];
                        }

                        collection[e.field].push(e.msg);
                    });

                    return {
                        v: collection
                    };
                }();

                if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
            }

            if (scope) {
                return this.errors.filter(function (e) {
                    return e.field === field && e.scope === scope;
                }).map(function (e) {
                    return e.msg;
                });
            }

            return this.errors.filter(function (e) {
                return e.field === field;
            }).map(function (e) {
                return e.msg;
            });
        }
        /**
         * Gets the internal array length.
         *
         * @return {Number} length The internal array length.
         */

    }, {
        key: "count",
        value: function count() {
            return this.errors.length;
        }

        /**
         * Gets the first error message for a specific field.
         *
         * @param  {string} field The field name.
         * @return {string|null} message The error message.
         */

    }, {
        key: "first",
        value: function first(field, scope) {
            for (var i = 0; i < this.errors.length; i++) {
                if (this.errors[i].field === field) {
                    if (scope) {
                        if (this.errors[i].scope === scope) {
                            return this.errors[i].msg;
                        }
                    } else {
                        return this.errors[i].msg;
                    }
                }
            }

            return null;
        }

        /**
         * Checks if the internal array has at least one error for the specified field.
         *
         * @param  {string} field The specified field.
         * @return {Boolean} result True if at least one error is found, false otherwise.
         */

    }, {
        key: "has",
        value: function has(field, scope) {
            for (var i = 0; i < this.errors.length; i++) {
                if (this.errors[i].field === field) {
                    if (scope) {
                        if (this.errors[i].scope === scope) {
                            return true;
                        }
                    } else {
                        return true;
                    }
                }
            }

            return false;
        }

        /**
         * Removes all error messages assoicated with a specific field.
         *
         * @param  {string} field The field which messages are to be removed.
         * @param {String} scope The Scope name, optional.
         */

    }, {
        key: "remove",
        value: function remove(field, scope) {
            if (scope) {
                this.errors = this.errors.filter(function (e) {
                    return e.field !== field || e.scope !== scope;
                });

                return;
            }

            this.errors = this.errors.filter(function (e) {
                return e.field !== field;
            });
        }
    }]);
    return ErrorBag;
}();

var _class = function () {
    function _class(msg) {
        classCallCheck(this, _class);

        this.msg = msg;
    }

    createClass(_class, [{
        key: "toString",
        value: function toString() {
            return this.msg;
        }
    }]);
    return _class;
}();

/* eslint-disable prefer-rest-params */
var Dictionary = function () {
    function Dictionary() {
        var dictionary = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        classCallCheck(this, Dictionary);

        this.dictionary = {};
        this.merge(dictionary);
    }

    createClass(Dictionary, [{
        key: 'hasLocale',
        value: function hasLocale(locale) {
            return !!this.dictionary[locale];
        }
    }, {
        key: 'getMessage',
        value: function getMessage(locale, key) {
            var fallback = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

            if (!this.hasMessage(locale, key)) {
                return fallback;
            }

            return this.dictionary[locale].messages[key];
        }
    }, {
        key: 'getAttribute',
        value: function getAttribute(locale, key) {
            var fallback = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

            if (!this.hasAttribute(locale, key)) {
                return fallback;
            }

            return this.dictionary[locale].attributes[key];
        }
    }, {
        key: 'hasMessage',
        value: function hasMessage(locale, key) {
            return !!(this.hasLocale(locale) && this.dictionary[locale].messages && this.dictionary[locale].messages[key]);
        }
    }, {
        key: 'hasAttribute',
        value: function hasAttribute(locale, key) {
            return !!(this.hasLocale(locale) && this.dictionary[locale].attributes && this.dictionary[locale].attributes[key]);
        }
    }, {
        key: 'merge',
        value: function merge(dictionary) {
            this._merge(this.dictionary, dictionary);
        }
    }, {
        key: 'setMessage',
        value: function setMessage(locale, key, message) {
            if (!this.hasLocale(locale)) {
                this.dictionary[locale] = {
                    messages: {},
                    attributes: {}
                };
            }

            this.dictionary[locale].messages[key] = message;
        }
    }, {
        key: 'setAttribute',
        value: function setAttribute(locale, key, attribute) {
            if (!this.hasLocale(locale)) {
                this.dictionary[locale] = {
                    messages: {},
                    attributes: {}
                };
            }

            this.dictionary[locale].attributes[key] = attribute;
        }
    }, {
        key: '_isObject',
        value: function _isObject(object) {
            return object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && !Array.isArray(object) && object !== null;
        }
    }, {
        key: '_merge',
        value: function _merge(target, source) {
            var _this = this;

            if (!(this._isObject(target) && this._isObject(source))) {
                return target;
            }

            var assign = Object.assign || this._assign;

            Object.keys(source).forEach(function (key) {
                if (_this._isObject(source[key])) {
                    if (!target[key]) {
                        assign(target, defineProperty({}, key, {}));
                    }

                    _this._merge(target[key], source[key]);
                    return;
                }

                assign(target, defineProperty({}, key, source[key]));
            });

            return target;
        }
    }, {
        key: '_assign',
        value: function _assign(target) {
            var _arguments = arguments;

            var output = Object(target);

            var _loop = function _loop(index) {
                var source = _arguments[index];
                if (source !== undefined && source !== null) {
                    Object.keys(source).forEach(function (key) {
                        if ({}.hasOwnProperty.call(source, key)) {
                            output[key] = source[key];
                        }
                    });
                }
            };

            for (var index = 1; index < arguments.length; index++) {
                _loop(index);
            }

            return output;
        }
    }]);
    return Dictionary;
}();

/* istanbul ignore next */
/* eslint-disable max-len */
var messages = {
    alpha_dash: function alpha_dash(field) {
        return 'The ' + field + ' may contain alpha-numeric characters as well as dashes and underscores.';
    },
    alpha_num: function alpha_num(field) {
        return 'The ' + field + ' may only contain alpha-numeric characters.';
    },
    alpha: function alpha(field) {
        return 'The ' + field + ' may only contain alphabetic characters.';
    },
    between: function between(field, _ref) {
        var _ref2 = slicedToArray(_ref, 2);

        var min = _ref2[0];
        var max = _ref2[1];
        return 'The ' + field + ' must be between ' + min + ' and ' + max + '.';
    },
    confirmed: function confirmed(field, _ref3) {
        var _ref4 = slicedToArray(_ref3, 1);

        var confirmedField = _ref4[0];
        return 'The ' + field + ' does not match the ' + confirmedField + '.';
    },
    decimal: function decimal(field) {
        var _ref5 = arguments.length <= 1 || arguments[1] === undefined ? ['*'] : arguments[1];

        var _ref6 = slicedToArray(_ref5, 1);

        var decimals = _ref6[0];
        return 'The ' + field + ' must be numeric and may contain ' + (decimals === '*' ? '' : decimals) + ' decimal points.';
    },
    digits: function digits(field, _ref7) {
        var _ref8 = slicedToArray(_ref7, 1);

        var length = _ref8[0];
        return 'The ' + field + ' must be numeric and exactly contain ' + length + ' digits.';
    },
    dimensions: function dimensions(field, _ref9) {
        var _ref10 = slicedToArray(_ref9, 2);

        var width = _ref10[0];
        var height = _ref10[1];
        return 'The ' + field + ' must be ' + width + ' pixels by ' + height + ' pixels.';
    },
    email: function email(field) {
        return 'The ' + field + ' must be a valid email.';
    },
    ext: function ext(field) {
        return 'The ' + field + ' must be a valid file.';
    },
    image: function image(field) {
        return 'The ' + field + ' must be an image.';
    },
    in: function _in(field) {
        return 'The ' + field + ' must be a valid value.';
    },
    ip: function ip(field) {
        return 'The ' + field + ' must be a valid ip address.';
    },
    max: function max(field, _ref11) {
        var _ref12 = slicedToArray(_ref11, 1);

        var length = _ref12[0];
        return 'The ' + field + ' may not be greater than ' + length + ' characters.';
    },
    mimes: function mimes(field) {
        return 'The ' + field + ' must have a valid file type.';
    },
    min: function min(field, _ref13) {
        var _ref14 = slicedToArray(_ref13, 1);

        var length = _ref14[0];
        return 'The ' + field + ' must be at least ' + length + ' characters.';
    },
    not_in: function not_in(field) {
        return 'The ' + field + ' must be a valid value.';
    },
    numeric: function numeric(field) {
        return 'The ' + field + ' may only contain numeric characters.';
    },
    regex: function regex(field) {
        return 'The ' + field + ' format is invalid.';
    },
    required: function required(field) {
        return 'The ' + field + ' is required.';
    },
    size: function size(field, _ref15) {
        var _ref16 = slicedToArray(_ref15, 1);

        var _size = _ref16[0];
        return 'The ' + field + ' must be less than ' + _size + ' KB.';
    },
    url: function url(field) {
        return 'The ' + field + ' is not a valid URL.';
    }
};

/**
 * Determines the input field scope.
 */
var getScope = function getScope(el) {
    return el.dataset.scope || el.form && el.form.dataset.scope;
};

var debounce = function debounce(func) {
    var threshold = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];
    var execAsap = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    if (!threshold) {
        return func;
    }

    var timeout = void 0;

    return function debounced(_ref) {
        var _ref2 = toArray(_ref);

        var args = _ref2;

        var obj = this;

        function delayed() {
            if (!execAsap) {
                func.apply(obj, args);
            }
            timeout = null;
        }

        if (timeout) {
            clearTimeout(timeout);
        } else if (execAsap) {
            func.apply.apply(func, [obj].concat(toConsumableArray(args)));
        }

        timeout = setTimeout(delayed, threshold || 100);
    };
};

var warn = function warn(message) {
    if (!console) {
        return;
    }

    console.warn("vee-validate: " + message); // eslint-disable-line
};

var after$1 = (function (moment) {
    return function (value, _ref) {
        var _ref2 = slicedToArray(_ref, 2);

        var targetField = _ref2[0];
        var format = _ref2[1];

        var dateValue = moment(value, format, true);
        var field = document.querySelector("input[name='" + targetField + "']");

        if (!(dateValue.isValid() && field)) {
            return false;
        }

        var other = moment(field.value, format, true);

        if (!other.isValid()) {
            return false;
        }

        return dateValue.isAfter(other);
    };
});

var before$1 = (function (moment) {
    return function (value, _ref) {
        var _ref2 = slicedToArray(_ref, 2);

        var targetField = _ref2[0];
        var format = _ref2[1];

        var dateValue = moment(value, format, true);
        var field = document.querySelector("input[name='" + targetField + "']");

        if (!dateValue.isValid() || !field) {
            return false;
        }

        var other = moment(field.value, format, true);

        if (!other.isValid()) {
            return false;
        }

        return dateValue.isBefore(other);
    };
});

var date_format$1 = (function (moment) {
  return function (value, _ref) {
    var _ref2 = slicedToArray(_ref, 1);

    var format = _ref2[0];
    return moment(value, format, true).isValid();
  };
});

var date_between$1 = (function (moment) {
    return function (value, _ref) {
        var _ref2 = slicedToArray(_ref, 3);

        var min = _ref2[0];
        var max = _ref2[1];
        var format = _ref2[2];

        var minDate = moment(min, format, true);
        var maxDate = moment(max, format, true);
        var dateVal = moment(value, format, true);

        if (!(minDate.isValid() && maxDate.isValid() && dateVal.isValid())) {
            return false;
        }

        return dateVal.isBetween(minDate, maxDate);
    };
});

/* istanbul ignore next */
/* eslint-disable max-len */
var messages$1 = {
    after: function after(field, _ref) {
        var _ref2 = slicedToArray(_ref, 1);

        var target = _ref2[0];
        return "The " + field + " must be after " + target + ".";
    },
    before: function before(field, _ref3) {
        var _ref4 = slicedToArray(_ref3, 1);

        var target = _ref4[0];
        return "The " + field + " must be before " + target + ".";
    },
    date_between: function date_between(field, _ref5) {
        var _ref6 = slicedToArray(_ref5, 2);

        var min = _ref6[0];
        var max = _ref6[1];
        return "The " + field + " must be between " + min + " and " + max + ".";
    },
    date_format: function date_format(field, _ref7) {
        var _ref8 = slicedToArray(_ref7, 1);

        var format = _ref8[0];
        return "The " + field + " must be in the format " + format + ".";
    }
};

var date = {
    make: function make(moment) {
        return {
            date_format: date_format$1(moment),
            after: after$1(moment),
            before: before$1(moment),
            date_between: date_between$1(moment)
        };
    },
    messages: messages$1,
    installed: false
};

var EVENT_NAME = 'veeValidate';
var DEFAULT_LOCALE = 'en';
var STRICT_MODE = true;

var dictionary = new Dictionary({
    en: {
        messages: messages,
        attributes: {}
    }
});

var Validator = function () {
    function Validator(validations, $vm) {
        classCallCheck(this, Validator);

        this.locale = DEFAULT_LOCALE;
        this.strictMode = STRICT_MODE;
        this.$fields = {};
        this._createFields(validations);
        this.errorBag = new ErrorBag();
        this.$vm = $vm;

        // if momentjs is present, install the validators.
        if (typeof moment === 'function') {
            // eslint-disable-next-line
            this.installDateTimeValidators(moment);
        }
    }

    /**
     * Sets the default locale for all validators.
     *
     * @param {String} language The locale id.
     */


    createClass(Validator, [{
        key: 'installDateTimeValidators',


        /**
         * Just an alias to the static method for convienece.
         */
        value: function installDateTimeValidators(moment) {
            Validator.installDateTimeValidators(moment);
        }

        /**
         * Sets the operating mode for this validator.
         * strictMode = true: Values without a rule are invalid and cause failure.
         * strictMode = false: Values without a rule are valid and are skipped.
         * @param {Boolean} strictMode.
         */

    }, {
        key: 'setStrictMode',
        value: function setStrictMode() {
            var strictMode = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

            this.strictMode = strictMode;
        }

        /**
         * Updates the dicitionary, overwriting existing values and adding new ones.
         *
         * @param  {object} data The dictionary object.
        =     */

    }, {
        key: 'setLocale',


        /**
         * Sets the validator current langauge.
         *
         * @param {string} language locale or language id.
         */
        value: function setLocale(language) {
            /* istanbul ignore if */
            if (!dictionary.hasLocale(language)) {
                // eslint-disable-next-line
                warn('You are setting the validator locale to a locale that is not defined in the dicitionary. English messages may still be generated.');
            }

            this.locale = language;
        }

        /**
         * Registers a field to be validated.
         *
         * @param  {string} name The field name.
         * @param  {string} checks validations expression.
         * @param {string} prettyName Custom name to be used as field name in error messages.
         */

    }, {
        key: 'attach',
        value: function attach(name, checks) {
            var prettyName = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

            this.errorBag.remove(name);
            this._createField(name, checks);

            if (prettyName) {
                this.$fields[name].name = prettyName;
            }
        }

        /**
         * Updates the messages dicitionary, overwriting existing values and adding new ones.
         *
         * @param  {object} data The messages object.
         */

    }, {
        key: 'updateDictionary',
        value: function updateDictionary(data) {
            Validator.updateDictionary(data);
        }

        /**
         * Removes a field from the validator.
         *
         * @param  {string} name The name of the field.
         */

    }, {
        key: 'detach',
        value: function detach(name) {
            delete this.$fields[name];
        }

        /**
         * Adds a custom validator to the list of validation rules.
         *
         * @param  {string} name The name of the validator.
         * @param  {object|function} validator The validator object/function.
         */

    }, {
        key: 'extend',
        value: function extend(name, validator) {
            Validator.extend(name, validator);
        }

        /**
         * Validates each value against the corresponding field validations.
         * @param  {object} values The values to be validated.
         * @return {boolean|Promise|void} result Returns a boolean or a promise that will
         * resolve to a boolean.
         */

    }, {
        key: 'validateAll',
        value: function validateAll(values) {
            var _this = this;

            /* istanbul ignore if */
            if (this.$vm && (!values || typeof values === 'string')) {
                this.errorBag.clear(values);
                this.$vm.$emit(EVENT_NAME, values);

                return;
            }

            var test = true;
            var promises = [];
            this.errorBag.clear();
            Object.keys(values).forEach(function (property) {
                var result = _this.validate(property, values[property]);
                if (typeof result.then === 'function') {
                    promises.push(result);
                    return;
                }

                test = test && result;
            });

            if (promises.length) {
                // eslint-disable-next-line
                return Promise.all(promises).then(function (values) {
                    return values.every(function (t) {
                        return t;
                    }) && test;
                });
            }

            return test; // eslint-disable-line
        }

        /**
         * Validates a value against a registered field validations.
         *
         * @param  {string} name the field name.
         * @param  {*} value The value to be validated.
         * @return {boolean|Promise} result returns a boolean or a promise that will resolve to
         *  a boolean.
         */

    }, {
        key: 'validate',
        value: function validate(name, value, scope) {
            var _this2 = this;

            if (!this.$fields[name]) {
                if (!this.strictMode) {
                    return true;
                }
                warn('Trying to validate a non-existant field: "' + name + '". Use "attach()" first.');

                return false;
            }

            this.errorBag.remove(name, scope);
            // if its not required and is empty or null or undefined then it passes.
            if (!this.$fields[name].required && ~[null, undefined, ''].indexOf(value)) {
                return true;
            }

            var test = true;
            var promises = [];
            this.$fields[name].validations.forEach(function (rule) {
                var result = _this2._test(name, value, rule, scope);
                if (typeof result.then === 'function') {
                    promises.push(result);
                    return;
                }

                test = test && result;
            });

            if (promises.length) {
                return Promise.all(promises).then(function (values) {
                    return values.every(function (t) {
                        return t;
                    }) && test;
                });
            }

            return test;
        }

        /**
         * Creates the fields to be validated.
         *
         * @param  {object} validations
         * @return {object} Normalized object.
         */

    }, {
        key: '_createFields',
        value: function _createFields(validations) {
            var _this3 = this;

            if (!validations) {
                return;
            }

            Object.keys(validations).forEach(function (property) {
                _this3._createField(property, validations[property]);
            });
        }

        /**
         * Creates a field entry in the fields object.
         * @param {String} name.
         * @param {String} Checks.
         */

    }, {
        key: '_createField',
        value: function _createField(name, checks) {
            var _this4 = this;

            if (!this.$fields[name]) {
                this.$fields[name] = {};
            }

            this.$fields[name].validations = [];

            checks.split('|').forEach(function (rule) {
                var normalizedRule = _this4._normalizeRule(rule, _this4.$fields[name].validations);
                if (normalizedRule.name === 'required') {
                    _this4.$fields[name].required = true;
                }

                _this4.$fields[name].validations.push(normalizedRule);
            });
        }

        /**
         * Normalizes a single validation object.
         *
         * @param  {string} rule The rule to be normalized.
         * @return {object} rule The normalized rule.
         */

    }, {
        key: '_normalizeRule',
        value: function _normalizeRule(rule, validations) {
            var params = [];
            var name = rule.split(':')[0];
            if (~rule.indexOf(':')) {
                params = rule.split(':')[1].split(',');
            }

            // Those rules need the date format to parse and compare correctly.
            if (date.installed && ~['after', 'before', 'date_between'].indexOf(name)) {
                var dateFormat = validations.filter(function (v) {
                    return v.name === 'date_format';
                })[0];
                if (dateFormat) {
                    // pass it as the last param.
                    params.push(dateFormat.params[0]);
                }
            }

            return { name: name, params: params };
        }

        /**
         * Formats an error message for field and a rule.
         *
         * @param  {string} field The field name.
         * @param  {object} rule Normalized rule object.
         * @return {string} msg Formatted error message.
         */

    }, {
        key: '_formatErrorMessage',
        value: function _formatErrorMessage(field, rule) {
            if (!dictionary.hasLocale(this.locale) || typeof dictionary.getMessage(this.locale, rule.name) !== 'function') {
                // Default to english message.
                return dictionary.getMessage('en', rule.name)(field, rule.params);
            }

            return dictionary.getMessage(this.locale, rule.name)(field, rule.params);
        }

        /**
         * Resolves an appropiate display name, first checking 'data-as' or the registered 'prettyName'
         * Then the dictionary, then fallsback to field name.
         * @return {String} displayName The name to be used in the errors.
         */

    }, {
        key: '_getFieldDisplayName',
        value: function _getFieldDisplayName(field) {
            return this.$fields[field].name || dictionary.getAttribute(this.locale, field, field);
        }

        /**
         * Tests a single input value against a rule.
         *
         * @param  {*} name The name of the field.
         * @param  {*} value  [description]
         * @param  {object} rule the rule object.
         * @return {boolean} Wether if it passes the check.
         */

    }, {
        key: '_test',
        value: function _test(name, value, rule, scope) {
            var _this5 = this;

            var validator = Rules[rule.name];
            var valid = validator(value, rule.params);
            var displayName = this._getFieldDisplayName(name);

            if (typeof valid.then === 'function') {
                return valid.then(function (values) {
                    var allValid = Array.isArray(values) ? values.every(function (t) {
                        return t.valid;
                    }) : values.valid;

                    if (!allValid) {
                        _this5.errorBag.add(name, _this5._formatErrorMessage(displayName, rule), scope);
                    }

                    return allValid;
                });
            }

            if (!valid) {
                this.errorBag.add(name, this._formatErrorMessage(displayName, rule), scope);
            }

            return valid;
        }

        /**
         * Gets the internal errorBag instance.
         *
         * @return {ErrorBag} errorBag The internal error bag object.
         */

    }, {
        key: 'getErrors',
        value: function getErrors() {
            return this.errorBag;
        }
    }], [{
        key: 'setDefaultLocale',
        value: function setDefaultLocale() {
            var language = arguments.length <= 0 || arguments[0] === undefined ? 'en' : arguments[0];

            /* istanbul ignore if */
            if (!dictionary.hasLocale(language)) {
                // eslint-disable-next-line
                warn('You are setting the validator locale to a locale that is not defined in the dicitionary. English messages may still be generated.');
            }

            DEFAULT_LOCALE = language;
        }

        /**
         * Sets the operating mode for all newly created validators.
         * strictMode = true: Values without a rule are invalid and cause failure.
         * strictMode = false: Values without a rule are valid and are skipped.
         * @param {Boolean} strictMode.
         */

    }, {
        key: 'setStrictMode',
        value: function setStrictMode() {
            var strictMode = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

            STRICT_MODE = strictMode;
        }

        /**
         * Installs the datetime validators and the messages.
         */

    }, {
        key: 'installDateTimeValidators',
        value: function installDateTimeValidators(moment) {
            if (typeof moment !== 'function') {
                warn('To use the date-time validators you must provide moment reference.');

                return false;
            }

            if (date.installed) {
                return true;
            }

            var validators = date.make(moment);
            Object.keys(validators).forEach(function (name) {
                Validator.extend(name, validators[name]);
            });

            Validator.updateDictionary({
                en: {
                    messages: date.messages
                }
            });
            date.installed = true;

            return true;
        }
    }, {
        key: 'updateDictionary',
        value: function updateDictionary(data) {
            dictionary.merge(data);
        }

        /**
         * Static constructor.
         *
         * @param  {object} validations The validations object.
         * @return {Validator} validator A validator object.
         */

    }, {
        key: 'create',
        value: function create(validations, $vm) {
            return new Validator(validations, $vm);
        }

        /**
         * Adds a custom validator to the list of validation rules.
         *
         * @param  {string} name The name of the validator.
         * @param  {object|function} validator The validator object/function.
         */

    }, {
        key: 'extend',
        value: function extend(name, validator) {
            Validator._guardExtend(name, validator);
            Validator._merge(name, validator);
        }

        /**
         * Merges a validator object into the Rules and Messages.
         *
         * @param  {string} name The name of the validator.
         * @param  {function|object} validator The validator object.
         */

    }, {
        key: '_merge',
        value: function _merge(name, validator) {
            if (typeof validator === 'function') {
                Rules[name] = validator;
                dictionary.setMessage('en', name, function (field) {
                    return 'The ' + field + ' value is not valid.';
                });
                return;
            }

            Rules[name] = validator.validate;

            if (validator.getMessage && typeof validator.getMessage === 'function') {
                dictionary.setMessage('en', name, validator.getMessage);
            }

            if (validator.messages) {
                dictionary.merge(Object.keys(validator.messages).reduce(function (prev, curr) {
                    var dict = prev;
                    dict[curr] = {
                        messages: defineProperty({}, name, validator.messages[curr])
                    };

                    return dict;
                }, {}));
            }
        }

        /**
         * Guards from extnsion violations.
         *
         * @param  {string} name name of the validation rule.
         * @param  {object} validator a validation rule object.
         */

    }, {
        key: '_guardExtend',
        value: function _guardExtend(name, validator) {
            if (Rules[name]) {
                throw new _class('Extension Error: There is an existing validator with the same name \'' + name + '\'.');
            }

            if (typeof validator === 'function') {
                return;
            }

            if (typeof validator.validate !== 'function') {
                throw new _class(
                // eslint-disable-next-line
                'Extension Error: The validator \'' + name + '\' must be a function or have a \'validate\' method.');
            }

            if (typeof validator.getMessage !== 'function' && _typeof(validator.messages) !== 'object') {
                throw new _class(
                // eslint-disable-next-line
                'Extension Error: The validator \'' + name + '\' must have a \'getMessage\' method or have a \'messages\' object.');
            }
        }
    }]);
    return Validator;
}();

/**
 * Keeps track of $vm, $validator instances.
 * @type {Array}
 */
var instances = [];

/**
 * Finds a validator instance from the instances array.
 * @param  {[type]} $vm The Vue instance.
 * @return {object} pair the $vm,$validator pair.
 */
var find = function find($vm) {
    for (var i = 0; i < instances.length; i++) {
        if (instances[i].$vm === $vm) {
            return instances[i].$validator;
        }
    }

    return undefined;
};

/**
 * Registers a validator for a $vm instance.
 * @param  {*} $vm The Vue instance.
 * @return {Validator} $validator The validator instance.
 */
var register = function register($vm) {
    var instance = find($vm);
    if (!instance) {
        instance = Validator.create(undefined, $vm);

        instances.push({
            $vm: $vm,
            $validator: instance
        });
    }

    return instance;
};

var unregister = function unregister($vm) {
    for (var i = 0; i < instances.length; i++) {
        if (instances[i].$vm === $vm) {
            instances.splice(i, 1);

            return true;
        }
    }

    return false;
};

var mixin = (function (options) {
    return {
        data: function data() {
            return defineProperty({}, options.errorBagName, this.$validator.errorBag);
        },
        ready: function ready() {
            var _this = this;

            this.$nextTick(function () {
                _this.$emit('validatorReady');
            });
        },
        destroyed: function destroyed() {
            unregister(this);
        }
    };
});

var DEFAULT_EVENT_NAME = 'veeValidate';

var ListenerGenerator = function () {
    function ListenerGenerator(el, binding, context, options) {
        classCallCheck(this, ListenerGenerator);

        this.callbacks = [];
        this.el = el;
        this.binding = binding;
        this.vm = context;
        this.options = options;
        this.fieldName = binding.expression || el.name;
    }

    /**
     * Determines if the validation rule requires additional listeners on target fields.
     */


    createClass(ListenerGenerator, [{
        key: '_hasFieldDependency',
        value: function _hasFieldDependency(rules) {
            var results = rules.split('|').filter(function (r) {
                return !!r.match(/confirmed|after|before/);
            });
            if (!results.length) {
                return false;
            }

            return results[0].split(':')[1];
        }

        /**
         * Validates input value, triggered by 'input' event.
         */

    }, {
        key: '_inputListener',
        value: function _inputListener() {
            this.vm.$validator.validate(this.fieldName, this.el.value, getScope(this.el));
        }

        /**
         * Validates files, triggered by 'change' event.
         */

    }, {
        key: '_fileListener',
        value: function _fileListener() {
            var isValid = this.vm.$validator.validate(this.fieldName, this.el.files, getScope(this.el));
            if (!isValid && this.binding.modifiers.reject) {
                // eslint-disable-next-line
                el.value = '';
            }
        }

        /**
         * Validates radio buttons, triggered by 'change' event.
         */

    }, {
        key: '_radioListener',
        value: function _radioListener() {
            var checked = document.querySelector('input[name="' + this.el.name + '"]:checked');
            if (!checked) {
                this.vm.$validator.validate(this.fieldName, null, getScope(this.el));
                return;
            }

            this.vm.$validator.validate(this.fieldName, checked.value, getScope(this.el));
        }

        /**
         * Returns a scoped callback, only runs if the el scope is the same as the recieved scope
         * From the event.
         */

    }, {
        key: '_getScopedListener',
        value: function _getScopedListener(callback) {
            var _this = this;

            return function (scope) {
                if (!scope || scope === getScope(_this.el) || scope instanceof Event) {
                    callback();
                }
            };
        }

        /**
         * Attaches validator event-triggered validation.
         */

    }, {
        key: '_attachValidatorEvent',
        value: function _attachValidatorEvent() {
            var _this2 = this;

            var listener = this._getScopedListener(this.el.type === 'radio' ? this._radioListener.bind(this) : this._inputListener.bind(this));

            this.vm.$on(DEFAULT_EVENT_NAME, listener);
            this.callbacks.push({ event: DEFAULT_EVENT_NAME, listener: listener });

            var fieldName = this._hasFieldDependency(this.el.dataset.rules);
            if (fieldName) {
                // Wait for the validator ready triggered when vm is mounted because maybe
                // the element isn't mounted yet.
                this.vm.$once('validatorReady', function () {
                    var target = document.querySelector('input[name=\'' + fieldName + '\']');
                    if (!target) {
                        warn('Cannot find target field, no additional listeners were attached.');
                        return;
                    }

                    target.addEventListener('input', listener);
                    _this2.callbacks.push({ event: 'input', listener: listener, el: target });
                });
            }
        }

        /**
         * Determines a suitable listener for the element.
         */

    }, {
        key: '_getSuitableListener',
        value: function _getSuitableListener() {
            if (this.el.type === 'file') {
                return {
                    name: 'change',
                    listener: this._fileListener
                };
            }

            if (this.el.type === 'radio') {
                return {
                    name: 'change',
                    listener: this._radioListener
                };
            }

            return {
                name: 'input',
                listener: this._inputListener
            };
        }

        /**
         * Attachs a suitable listener for the input.
         */

    }, {
        key: '_attachFieldListeners',
        value: function _attachFieldListeners() {
            var _this3 = this;

            var handler = this._getSuitableListener();
            var listener = debounce(handler.listener.bind(this), this.el.dataset.delay || this.options.delay);

            if (this.el.type === 'radio') {
                this.vm.$once('validatorReady', function () {
                    [].concat(toConsumableArray(document.querySelectorAll('input[name="' + _this3.el.name + '"]'))).forEach(function (input) {
                        input.addEventListener(handler.name, listener);
                        _this3.callbacks.push({
                            event: handler.name,
                            callback: listener,
                            el: input
                        });
                    });
                });

                return;
            }

            this.el.addEventListener(handler.name, listener);
            this.callbacks.push({ event: handler.name, callback: listener, el: this.el });
        }

        /**
         * Attaches the Event Listeners.
         */

    }, {
        key: 'attach',
        value: function attach() {
            this.vm.$validator.attach(this.fieldName, this.el.dataset.rules, this.el.dataset.as);
            this._attachValidatorEvent();

            if (this.binding.expression) {
                return;
            }

            this._attachFieldListeners();
        }

        /**
         * Removes all attached event listeners.
         */

    }, {
        key: 'detach',
        value: function detach() {
            this.vm.$off(DEFAULT_EVENT_NAME, this.callbacks.filter(function (_ref) {
                var event = _ref.event;
                return event === DEFAULT_EVENT_NAME;
            })[0]);

            this.callbacks.filter(function (_ref2) {
                var event = _ref2.event;
                return event !== DEFAULT_EVENT_NAME;
            }).forEach(function (h) {
                h.el.removeEventListener(h.event, h.listener);
            });
        }
    }]);
    return ListenerGenerator;
}();

var listenersInstances = [];

var directive = (function (options) {
    return {
        bind: function bind() {
            var _this = this;

            this.vm.$nextTick(function () {
                _this.fieldName = _this.expression || _this.el.name;
                var binding = { expression: _this.expression, modifiers: _this.modifiers };
                var listener = new ListenerGenerator(_this.el, binding, _this.vm, options);
                listener.attach();
                listenersInstances.push({ vm: _this.vm, el: _this.el, instance: listener });
            });
        },
        update: function update(value) {
            var _this2 = this;

            if (!this.expression) {
                return;
            }

            if (this.modifiers.initial) {
                this.modifiers.initial = false;

                return;
            }

            // might be not ready yet.
            if (!this.fieldName) {
                this.vm.$nextTick(function () {
                    _this2.vm.$validator.validate(_this2.fieldName, value, getScope(_this2.el));
                });

                return;
            }

            this.vm.$validator.validate(this.fieldName, value, getScope(this.el));
        },
        unbind: function unbind() {
            var _this3 = this;

            var holder = listenersInstances.filter(function (l) {
                return l.vm === _this3.vm && l.el === _this3.el;
            })[0];
            holder.instance.detach();
            listenersInstances.splice(listenersInstances.indexOf(holder), 1);
        }
    };
});

// eslint-disable-next-line
var install = function install(Vue) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$locale = _ref.locale;
    var locale = _ref$locale === undefined ? 'en' : _ref$locale;
    var _ref$delay = _ref.delay;
    var delay = _ref$delay === undefined ? 0 : _ref$delay;
    var _ref$errorBagName = _ref.errorBagName;
    var errorBagName = _ref$errorBagName === undefined ? 'errors' : _ref$errorBagName;
    var _ref$dictionary = _ref.dictionary;
    var dictionary = _ref$dictionary === undefined ? null : _ref$dictionary;
    var _ref$strict = _ref.strict;
    var strict = _ref$strict === undefined ? true : _ref$strict;

    if (dictionary) {
        Validator.updateDictionary(dictionary);
    }

    Validator.setDefaultLocale(locale);
    Validator.setStrictMode(strict);

    var options = {
        locale: locale,
        delay: delay,
        dictionary: dictionary,
        errorBagName: errorBagName
    };

    Object.defineProperties(Vue.prototype, {
        $validator: {
            get: function get() {
                return register(this);
            }
        }
    });

    Vue.mixin(mixin(options)); // Install Mixin.
    Vue.directive('validate', directive(options)); // Install directive.
};

var index = { install: install, Validator: Validator, ErrorBag: ErrorBag };

return index;

})));
