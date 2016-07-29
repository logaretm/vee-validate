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

	var _validator = __webpack_require__(1);

	var _validator2 = _interopRequireDefault(_validator);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (Vue) {
	    // eslint-disable-next-line no-param-reassign
	    Vue.prototype.$validator = _validator2.default.create();

	    Vue.mixin({
	        data: function data() {
	            return {
	                errors: []
	            };
	        },
	        created: function created() {
	            this.$set('errors', this.$validator.errors);
	        }
	    });

	    Vue.directive('validate', {
	        params: ['rules'],
	        onKeydown: function onKeydown() {
	            this.vm.$validator.validate(this.fieldName, this.el.value);
	        },
	        attachValidator: function attachValidator() {
	            this.vm.$validator.attach(this.fieldName, this.params.rules);
	        },
	        bind: function bind() {
	            this.fieldName = this.el.name;
	            this.attachValidator();
	            this.onKeydownRef = this.onKeydown.bind(this);
	            this.el.addEventListener('keydown', this.onKeydownRef);
	        },
	        unbind: function unbind() {
	            this.vm.$validator.detach(this.fieldName);
	            this.el.removeEventListener('keydown', this.onKeydownRef);
	        }
	    });
	};

	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _rules = __webpack_require__(2);

	var _rules2 = _interopRequireDefault(_rules);

	var _errorBag = __webpack_require__(8);

	var _errorBag2 = _interopRequireDefault(_errorBag);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Validator = function () {
	    function Validator(validations) {
	        _classCallCheck(this, Validator);

	        this.validations = this.normalize(validations);
	        this.errors = new _errorBag2.default();
	        this.rules = _rules2.default;
	    }

	    _createClass(Validator, [{
	        key: 'attach',
	        value: function attach(name, checks) {
	            var _this = this;

	            checks.split('|').forEach(function (rule) {
	                if (!_this.validations[name]) {
	                    _this.validations[name] = [];
	                }

	                _this.validations[name].push(_this.normalizeRule(rule));
	            });
	        }
	    }, {
	        key: 'detach',
	        value: function detach(name) {
	            delete this.validations[name];
	        }
	    }, {
	        key: 'validateAll',
	        value: function validateAll(values) {
	            var _this2 = this;

	            var test = true;
	            this.errors.clear();
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
	            this.errors.remove(name);
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
	            var validator = this.rules[rule.name];
	            var valid = validator.validate(value, rule.params);

	            if (!valid) {
	                this.errors.add(name, validator.msg(name, rule.params));
	            }

	            return valid;
	        }
	    }], [{
	        key: 'create',
	        value: function create(validations) {
	            return new Validator(validations);
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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	    email: _email2.default,
	    min: _min2.default,
	    max: _max2.default,
	    required: _required2.default,
	    in: _in2.default
	};
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    msg: function msg(name) {
	        return "The " + name + " must be a valid email.";
	    },
	    validate: function validate(value) {
	        return !!value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/);
	    }
	};
	module.exports = exports["default"];

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    msg: function msg(name) {
	        return "The " + name + " must be a valid value.";
	    },
	    validate: function validate(value, options) {
	        return !!options.filter(function (option) {
	            return option == value;
	        }).length;
	    }
	};
	module.exports = exports["default"];

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    msg: function msg(name) {
	        return "The " + name + " is required.";
	    },
	    validate: function validate(value) {
	        if (Array.isArray(value)) {
	            return !!value.length;
	        }

	        return !!String(value).length;
	    }
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

	exports.default = {
	    msg: function msg(name, _ref) {
	        var _ref2 = _slicedToArray(_ref, 1);

	        var length = _ref2[0];

	        return "The " + name + " must be at least " + length + " characters.";
	    },
	    validate: function validate(value, _ref3) {
	        var _ref4 = _slicedToArray(_ref3, 1);

	        var length = _ref4[0];

	        return String(value).length >= length;
	    }
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

	exports.default = {
	    msg: function msg(name, _ref) {
	        var _ref2 = _slicedToArray(_ref, 1);

	        var length = _ref2[0];

	        return "The " + name + " may not be greater than " + length + " characters.";
	    },
	    validate: function validate(value, _ref3) {
	        var _ref4 = _slicedToArray(_ref3, 1);

	        var length = _ref4[0];

	        return String(value).length <= length;
	    }
	};
	module.exports = exports["default"];

/***/ },
/* 8 */
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
	            });
	        }
	    }, {
	        key: "all",
	        value: function all() {
	            return this.errors;
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

/***/ }
/******/ ])
});
;