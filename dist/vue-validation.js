(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VueValidation"] = factory();
	else
		root["VueValidation"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ErrorBag = exports.Validator = undefined;

	var _validator = __webpack_require__(1);

	var _validator2 = _interopRequireDefault(_validator);

	var _debouncer = __webpack_require__(27);

	var _debouncer2 = _interopRequireDefault(_debouncer);

	var _errorBag = __webpack_require__(23);

	var _errorBag2 = _interopRequireDefault(_errorBag);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var DEFAULT_DELAY = 0;

	exports.default = function (Vue, options) {
	    var errorsBagName = options ? options.errorsBagName || 'errors' : 'errors';
	    Vue.mixin({
	        data: function data() {
	            return _defineProperty({}, errorsBagName, this.$validator.errorBag);
	        },
	        init: function init() {
	            this.$validator = _validator2.default.create();
	        }
	    });

	    Vue.directive('validate', {
	        params: ['rules', 'delay', 'reject'],
	        onInput: function onInput() {
	            this.vm.$validator.validate(this.fieldName, this.el.value);
	        },
	        onFileInput: function onFileInput() {
	            if (!this.vm.$validator.validate(this.fieldName, this.el.files) && this.params.reject) {
	                this.el.value = '';
	            }
	        },
	        attachValidator: function attachValidator() {
	            this.vm.$validator.attach(this.fieldName, this.params.rules);
	        },
	        bind: function bind() {
	            this.fieldName = this.el.name;
	            this.attachValidator();
	            var handler = this.el.type === 'file' ? this.onFileInput : this.onInput;
	            this.handles = this.el.type === 'file' ? 'change' : 'input';

	            var delay = this.params.delay || options && options.delay || DEFAULT_DELAY;
	            this.handler = delay ? (0, _debouncer2.default)(handler.bind(this), delay) : handler.bind(this);
	            this.el.addEventListener(this.handles, this.handler);
	        },
	        unbind: function unbind() {
	            this.vm.$validator.detach(this.fieldName);
	            this.el.removeEventListener(this.handles, this.handler);
	        }
	    });
	};

	exports.Validator = _validator2.default;
	exports.ErrorBag = _errorBag2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _rules = __webpack_require__(2);

	var _rules2 = _interopRequireDefault(_rules);

	var _errorBag = __webpack_require__(23);

	var _errorBag2 = _interopRequireDefault(_errorBag);

	var _validatorException = __webpack_require__(24);

	var _validatorException2 = _interopRequireDefault(_validatorException);

	var _messages = __webpack_require__(25);

	var _messages2 = _interopRequireDefault(_messages);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Validator = function () {
	    function Validator(validations) {
	        _classCallCheck(this, Validator);

	        this.locale = 'en';
	        this.validations = this.normalize(validations);
	        this.errorBag = new _errorBag2.default();
	    }

	    _createClass(Validator, [{
	        key: 'setLocale',
	        value: function setLocale(language) {
	            this.locale = language;
	        }
	    }, {
	        key: 'attach',
	        value: function attach(name, checks) {
	            var _this = this;

	            this.validations[name] = [];
	            this.errorBag.remove(name);

	            checks.split('|').forEach(function (rule) {
	                _this.validations[name].push(_this.normalizeRule(rule));
	            });
	        }
	    }, {
	        key: 'updateDictionary',
	        value: function updateDictionary(messages) {
	            Validator.updateDictionary(messages);
	        }
	    }, {
	        key: 'detach',
	        value: function detach(name) {
	            delete this.validations[name];
	        }
	    }, {
	        key: 'extend',
	        value: function extend(name, validator) {
	            Validator.extend(name, validator);
	        }
	    }, {
	        key: 'validateAll',
	        value: function validateAll(values) {
	            var _this2 = this;

	            var test = true;
	            this.errorBag.clear();
	            Object.keys(values).forEach(function (property) {
	                test = _this2.validate(property, values[property]);
	            });

	            return test;
	        }
	    }, {
	        key: 'validate',
	        value: function validate(name, value) {
	            var _this3 = this;

	            var test = true;
	            this.errorBag.remove(name);
	            this.validations[name].forEach(function (rule) {
	                test = _this3.test(name, value, rule);
	            });

	            return test;
	        }

	        /**
	         * Normalizes the validations object.
	         * @param  {object} validations
	         * @return {object} Normalized object.
	         */

	    }, {
	        key: 'normalize',
	        value: function normalize(validations) {
	            var _this4 = this;

	            if (!validations) {
	                return {};
	            }

	            var normalized = {};
	            Object.keys(validations).forEach(function (property) {
	                validations[property].split('|').forEach(function (rule) {
	                    if (!normalized[property]) {
	                        normalized[property] = [];
	                    }

	                    normalized[property].push(_this4.normalizeRule(rule));
	                });
	            });

	            return normalized;
	        }
	    }, {
	        key: 'normalizeRule',
	        value: function normalizeRule(rule) {
	            var params = null;
	            if (~rule.indexOf(':')) {
	                params = rule.split(':')[1].split(',');
	            }

	            return {
	                name: rule.split(':')[0],
	                params: params
	            };
	        }
	    }, {
	        key: 'formatErrorMessage',
	        value: function formatErrorMessage(field, rule) {
	            if (!_messages2.default[this.locale] || typeof _messages2.default[this.locale][rule.name] !== 'function') {
	                // Default to english message.
	                return _messages2.default.en[rule.name](field, rule.params);
	            }

	            return _messages2.default[this.locale][rule.name](field, rule.params);
	        }

	        /**
	         * test a single input value against a rule.
	         *
	         * @param  {*} name The name of the field.
	         * @param  {*} value  [description]
	         * @param  {object} rule the rule object.
	         * @return {boolean} Wether if it passes the check.
	         */

	    }, {
	        key: 'test',
	        value: function test(name, value, rule) {
	            var _this5 = this;

	            var validator = _rules2.default[rule.name];
	            var valid = validator(value, rule.params);

	            if (valid instanceof Promise) {
	                return valid.then(function (values) {
	                    var allValid = values.reduce(function (prev, curr) {
	                        return prev && curr.valid;
	                    }, true);

	                    if (!allValid) {
	                        _this5.errorBag.add(name, _this5.formatErrorMessage(name, rule));
	                    }

	                    return allValid;
	                });
	            }

	            if (!valid) {
	                this.errorBag.add(name, this.formatErrorMessage(name, rule));
	            }

	            return valid;
	        }

	        /**
	         * Gets the internal errorBag instance.
	         * @return {ErrorBag} The internal error bag object.
	         */

	    }, {
	        key: 'getErrors',
	        value: function getErrors() {
	            return this.errorBag;
	        }
	    }], [{
	        key: 'updateDictionary',
	        value: function updateDictionary(messages) {
	            Object.keys(messages).forEach(function (locale) {
	                if (!_messages2.default[locale]) {
	                    _messages2.default[locale] = {};
	                }

	                Object.keys(messages[locale]).forEach(function (name) {
	                    _messages2.default[locale][name] = messages[locale][name];
	                });
	            });
	        }
	    }, {
	        key: 'create',
	        value: function create(validations) {
	            return new Validator(validations);
	        }
	    }, {
	        key: 'extend',
	        value: function extend(name, validator) {
	            Validator.guardExtend(name, validator);

	            Validator.merge(name, validator);
	        }
	    }, {
	        key: 'merge',
	        value: function merge(name, validator) {
	            if (typeof validator === 'function') {
	                _rules2.default[name] = validator;
	                _messages2.default.en[name] = function (field) {
	                    return 'The ' + field + ' value is not valid.';
	                };
	                return;
	            }

	            _rules2.default[name] = validator.validate;

	            if (validator.getMessage && typeof validator.getMessage === 'function') {
	                _messages2.default.en[name] = validator.getMessage;
	            }

	            if (validator.messages) {
	                Object.keys(validator.messages).forEach(function (locale) {
	                    if (!_messages2.default[locale]) {
	                        _messages2.default[locale] = {};
	                    }

	                    _messages2.default[locale][name] = validator.messages[locale];
	                });
	            }
	        }

	        /**
	         * Guards from extnsion violations.
	         * @param  {string} name name of the validation rule.
	         * @param  {object} validator a validation rule object.
	         */

	    }, {
	        key: 'guardExtend',
	        value: function guardExtend(name, validator) {
	            if (_rules2.default[name]) {
	                throw new _validatorException2.default('Extension Error: There is an existing validator with the same name \'' + name + '\'.');
	            }

	            if (typeof validator === 'function') {
	                return;
	            }

	            if (typeof validator.validate !== 'function') {
	                throw new _validatorException2.default(
	                // eslint-disable-next-line
	                'Extension Error: The validator \'' + name + '\' must be a function or have a \'validate\' method.');
	            }

	            if (typeof validator.getMessage !== 'function' && _typeof(validator.messages) !== 'object') {
	                throw new _validatorException2.default(
	                // eslint-disable-next-line
	                'Extension Error: The validator \'' + name + '\' must have a \'getMessage\' method or have a \'messages\' object.');
	            }
	        }
	    }]);

	    return Validator;
	}();

	exports.default = Validator;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _email = __webpack_require__(3);

	var _email2 = _interopRequireDefault(_email);

	var _in = __webpack_require__(4);

	var _in2 = _interopRequireDefault(_in);

	var _required = __webpack_require__(5);

	var _required2 = _interopRequireDefault(_required);

	var _min = __webpack_require__(6);

	var _min2 = _interopRequireDefault(_min);

	var _max = __webpack_require__(7);

	var _max2 = _interopRequireDefault(_max);

	var _notIn = __webpack_require__(8);

	var _notIn2 = _interopRequireDefault(_notIn);

	var _alpha = __webpack_require__(9);

	var _alpha2 = _interopRequireDefault(_alpha);

	var _alpha_num = __webpack_require__(10);

	var _alpha_num2 = _interopRequireDefault(_alpha_num);

	var _alpha_dash = __webpack_require__(11);

	var _alpha_dash2 = _interopRequireDefault(_alpha_dash);

	var _numeric = __webpack_require__(12);

	var _numeric2 = _interopRequireDefault(_numeric);

	var _regex = __webpack_require__(13);

	var _regex2 = _interopRequireDefault(_regex);

	var _ip = __webpack_require__(14);

	var _ip2 = _interopRequireDefault(_ip);

	var _ext = __webpack_require__(15);

	var _ext2 = _interopRequireDefault(_ext);

	var _mimes = __webpack_require__(16);

	var _mimes2 = _interopRequireDefault(_mimes);

	var _size = __webpack_require__(17);

	var _size2 = _interopRequireDefault(_size);

	var _digits = __webpack_require__(18);

	var _digits2 = _interopRequireDefault(_digits);

	var _image = __webpack_require__(19);

	var _image2 = _interopRequireDefault(_image);

	var _dimensions = __webpack_require__(20);

	var _dimensions2 = _interopRequireDefault(_dimensions);

	var _between = __webpack_require__(21);

	var _between2 = _interopRequireDefault(_between);

	var _confirmed = __webpack_require__(22);

	var _confirmed2 = _interopRequireDefault(_confirmed);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// eslint-disable-line
	// eslint-disable-line
	// eslint-disable-line
	exports.default = {
	    email: _email2.default,
	    min: _min2.default,
	    max: _max2.default,
	    required: _required2.default,
	    in: _in2.default,
	    not_in: _notIn2.default,
	    alpha: _alpha2.default,
	    alpha_num: _alpha_num2.default,
	    alpha_dash: _alpha_dash2.default,
	    numeric: _numeric2.default,
	    regex: _regex2.default,
	    ip: _ip2.default,
	    ext: _ext2.default,
	    mimes: _mimes2.default,
	    size: _size2.default,
	    digits: _digits2.default,
	    image: _image2.default,
	    dimensions: _dimensions2.default,
	    between: _between2.default,
	    confirmed: _confirmed2.default
	}; // eslint-disable-line
	// eslint-disable-line

	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (value) {
	  return !!value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/);
	};

	module.exports = exports["default"];

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (value, options) {
	  return !!options.filter(function (option) {
	    return option == value;
	  }).length;
	}; // eslint-disable-line


	module.exports = exports["default"];

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (value) {
	    if (Array.isArray(value)) {
	        return !!value.length;
	    }

	    return !!String(value).length;
	};

	module.exports = exports["default"];

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	exports.default = function (value, _ref) {
	  var _ref2 = _slicedToArray(_ref, 1);

	  var length = _ref2[0];
	  return String(value).length >= length;
	};

	module.exports = exports["default"];

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	exports.default = function (value, _ref) {
	  var _ref2 = _slicedToArray(_ref, 1);

	  var length = _ref2[0];
	  return String(value).length <= length;
	};

	module.exports = exports["default"];

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (value, options) {
	  return !options.filter(function (option) {
	    return option == value;
	  }).length;
	}; // eslint-disable-line


	module.exports = exports["default"];

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (value) {
	  return !!value.match(/^[a-zA-Z ]*$/);
	};

	module.exports = exports["default"];

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (value) {
	  return !!value.match(/^[a-zA-Z0-9 ]*$/);
	};

	module.exports = exports["default"];

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (value) {
	  return !!value.match(/^[a-zA-Z0-9 _-]*$/);
	};

	module.exports = exports["default"];

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (value) {
	  return !!String(value).match(/^[0-9]*$/);
	};

	module.exports = exports["default"];

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

	exports.default = function (value, _ref) {
	  var _ref2 = _toArray(_ref);

	  var regex = _ref2[0];

	  var flags = _ref2.slice(1);

	  return !!String(value).match(new RegExp(regex, flags));
	};

	module.exports = exports["default"];

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	// TODO: Maybe add ipv6 flag?
	// eslint-disable-next-line
	exports.default = function (value) {
	  return !!value.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);
	};

	module.exports = exports["default"];

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (files, extensions) {
	    var regex = new RegExp('.(' + extensions.join('|') + ')$', 'i');
	    for (var i = 0; i < files.length; i++) {
	        if (!files[i].name.match(regex)) {
	            return false;
	        }
	    }

	    return true;
	};

	module.exports = exports['default'];

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (files, mimes) {
	    var regex = new RegExp(mimes.join('|').replace('*', '.+') + '$', 'i');
	    for (var i = 0; i < files.length; i++) {
	        if (!files[i].type.match(regex)) {
	            return false;
	        }
	    }

	    return true;
	};

	module.exports = exports['default'];

/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	exports.default = function (files, _ref) {
	    var _ref2 = _slicedToArray(_ref, 1);

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
	};

	module.exports = exports["default"];

/***/ },
/* 18 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	exports.default = function (value, _ref) {
	    var _ref2 = _slicedToArray(_ref, 1);

	    var length = _ref2[0];

	    var strVal = String(value);

	    return !!(strVal.match(/^[0-9]*$/) && strVal.length === Number(length));
	};

	module.exports = exports["default"];

/***/ },
/* 19 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (files) {
	    for (var i = 0; i < files.length; i++) {
	        if (!files[i].name.match(/\.(jpg|svg|jpeg|png|bmp|gif)$/i)) {
	            return false;
	        }
	    }

	    return true;
	};

	module.exports = exports["default"];

/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var validateImage = function validateImage(file, width, height) {
	    var URL = window.URL || window.webkitURL;
	    return new Promise(function (resolve) {
	        var image = new Image();
	        image.onerror = function () {
	            return resolve({ name: file.name, valid: false });
	        };

	        image.onload = function () {
	            var valid = true;

	            // Validate exact dimensions.
	            valid = image.width === Number(width) && image.height === Number(height);

	            resolve({
	                name: file.name,
	                valid: valid
	            });
	        };

	        image.src = URL.createObjectURL(file);
	    });
	};

	exports.default = function (files, _ref) {
	    var _ref2 = _slicedToArray(_ref, 2);

	    var width = _ref2[0];
	    var height = _ref2[1];

	    var list = [];
	    for (var i = 0; i < files.length; i++) {
	        // if file is not an image, reject.
	        if (!files[i].name.match(/\.(jpg|svg|jpeg|png|bmp|gif)$/i)) {
	            return false;
	        }

	        list.push(files[i]);
	    }

	    return Promise.all(list.map(function (file) {
	        return validateImage(file, width, height);
	    }));
	};

	module.exports = exports["default"];

/***/ },
/* 21 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	exports.default = function (value, _ref) {
	  var _ref2 = _slicedToArray(_ref, 2);

	  var min = _ref2[0];
	  var max = _ref2[1];
	  return Number(min) <= value && Number(max) >= value;
	};

	module.exports = exports["default"];

/***/ },
/* 22 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	exports.default = function (value, _ref) {
	    var _ref2 = _slicedToArray(_ref, 1);

	    var confirmedField = _ref2[0];

	    var field = document.querySelector("input[name='" + confirmedField + "']");

	    return !!(field && String(value) === field.value);
	};

	module.exports = exports["default"];

/***/ },
/* 23 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ErrorBag = function () {
	    function ErrorBag() {
	        _classCallCheck(this, ErrorBag);

	        this.errors = [];
	    }

	    _createClass(ErrorBag, [{
	        key: "add",
	        value: function add(field, msg) {
	            this.errors.push({
	                field: field,
	                msg: msg
	            });
	        }
	    }, {
	        key: "remove",
	        value: function remove(field) {
	            this.errors = this.errors.filter(function (e) {
	                return e.field !== field;
	            });
	        }
	    }, {
	        key: "has",
	        value: function has(field) {
	            for (var i = 0; i < this.errors.length; i++) {
	                if (this.errors[i].field === field) {
	                    return true;
	                }
	            }

	            return false;
	        }
	    }, {
	        key: "clear",
	        value: function clear() {
	            this.errors = [];
	        }
	    }, {
	        key: "first",
	        value: function first(field) {
	            for (var i = 0; i < this.errors.length; i++) {
	                if (this.errors[i].field === field) {
	                    return this.errors[i].msg;
	                }
	            }

	            return null;
	        }
	    }, {
	        key: "collect",
	        value: function collect(field) {
	            return this.errors.filter(function (e) {
	                return e.field === field;
	            }).map(function (e) {
	                return e.msg;
	            });
	        }
	    }, {
	        key: "all",
	        value: function all() {
	            return this.errors.map(function (e) {
	                return e.msg;
	            });
	        }
	    }, {
	        key: "count",
	        value: function count() {
	            return this.errors.length;
	        }
	    }]);

	    return ErrorBag;
	}();

	exports.default = ErrorBag;
	module.exports = exports["default"];

/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _class = function () {
	    function _class(msg) {
	        _classCallCheck(this, _class);

	        this.msg = msg;
	    }

	    _createClass(_class, [{
	        key: "toString",
	        value: function toString() {
	            return this.msg;
	        }
	    }]);

	    return _class;
	}();

	exports.default = _class;
	module.exports = exports["default"];

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _en = __webpack_require__(26);

	var _en2 = _interopRequireDefault(_en);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	    en: _en2.default
	};
	module.exports = exports['default'];

/***/ },
/* 26 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	exports.default = {
	    alpha_dash: function alpha_dash(field) {
	        return "The " + field + " may contain alpha-numeric characters well as spaces, dashes and underscores.";
	    },
	    alpha_num: function alpha_num(field) {
	        return "The " + field + " may only contain alpha-numeric characters and spaces.";
	    },
	    alpha: function alpha(field) {
	        return "The " + field + " may only contain alphabetic characters and spaces.";
	    },
	    between: function between(field, _ref) {
	        var _ref2 = _slicedToArray(_ref, 2);

	        var min = _ref2[0];
	        var max = _ref2[1];
	        return "The " + field + " must be between " + min + " and " + max + ".";
	    },
	    confirmed: function confirmed(field, _ref3) {
	        var _ref4 = _slicedToArray(_ref3, 1);

	        var confirmedField = _ref4[0];
	        return "The " + field + " does not match the " + confirmedField + ".";
	    },
	    digits: function digits(field, _ref5) {
	        var _ref6 = _slicedToArray(_ref5, 1);

	        var length = _ref6[0];
	        return "The " + field + " must be numeric and exactly contain " + length + " digits.";
	    },
	    dimensions: function dimensions(field, _ref7) {
	        var _ref8 = _slicedToArray(_ref7, 2);

	        var width = _ref8[0];
	        var height = _ref8[1];
	        return "The " + field + " must be " + width + " pixels by " + height + " pixels.";
	    },
	    email: function email(field) {
	        return "The " + field + " must be a valid email.";
	    },
	    ext: function ext(field) {
	        return "The " + field + " must be a valid file.";
	    },
	    image: function image(field) {
	        return "The " + field + " must be an image.";
	    },
	    in: function _in(field) {
	        return "The " + field + " must be a valid value.";
	    },
	    ip: function ip(field) {
	        return "The " + field + " must be a valid ip address.";
	    },
	    max: function max(field, _ref9) {
	        var _ref10 = _slicedToArray(_ref9, 1);

	        var length = _ref10[0];
	        return "The " + field + " may not be greater than " + length + " characters.";
	    },
	    mimes: function mimes(field) {
	        return "The " + field + " must have a valid file type.";
	    },
	    min: function min(field, _ref11) {
	        var _ref12 = _slicedToArray(_ref11, 1);

	        var length = _ref12[0];
	        return "The " + field + " must be at least " + length + " characters.";
	    },
	    not_in: function not_in(field) {
	        return "The " + field + " must be a valid value.";
	    },
	    numeric: function numeric(field) {
	        return "The " + field + " may only contain numeric characters.";
	    },
	    regex: function regex(field) {
	        return "The " + field + " format is invalid.";
	    },
	    required: function required(field) {
	        return "The " + field + " is required.";
	    },
	    size: function size(field, _ref13) {
	        var _ref14 = _slicedToArray(_ref13, 1);

	        var _size = _ref14[0];
	        return "The " + field + " must be less than " + _size + " KB.";
	    }
	};
	module.exports = exports["default"];

/***/ },
/* 27 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

	exports.default = function (func) {
	    var threshold = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];
	    var execAsap = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

	    var timeout = void 0;

	    return function debounced(_ref) {
	        var _ref2 = _toArray(_ref);

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
	            func.apply.apply(func, [obj].concat(_toConsumableArray(args)));
	        }

	        timeout = setTimeout(delayed, threshold || 100);
	    };
	};

	module.exports = exports["default"];

/***/ }
/******/ ])
});
;