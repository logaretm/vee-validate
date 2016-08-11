(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VeeValidate"] = factory();
	else
		root["VeeValidate"] = factory();
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
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 30);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ErrorBag = function () {
    function ErrorBag() {
        _classCallCheck(this, ErrorBag);

        this.errors = [];
    }

    /**
     * Adds an error to the internal array.
     *
     * @param {string} field The field name.
     * @param {string} msg The error message.
     */


    _createClass(ErrorBag, [{
        key: "add",
        value: function add(field, msg) {
            this.errors.push({
                field: field,
                msg: msg
            });
        }

        /**
         * Gets all error messages from the internal array.
         *
         * @return {Array} errors Array of all error messages.
         */

    }, {
        key: "all",
        value: function all() {
            return this.errors.map(function (e) {
                return e.msg;
            });
        }

        /**
         * Checks if there is any errrors in the internal array.
         *
         * @return {boolean} result True if there was at least one error, false otherwise.
         */

    }, {
        key: "any",
        value: function any() {
            return !!this.errors.length;
        }

        /**
         * Removes all items from the internal array.
         */

    }, {
        key: "clear",
        value: function clear() {
            this.errors = [];
        }

        /**
         * Groups the errors for a specific field into a single array.
         *
         * @param  {string} field The field name.
         * @return {Array} errors The errors for the specified field.
         */

    }, {
        key: "collect",
        value: function collect(field) {
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
        value: function first(field) {
            for (var i = 0; i < this.errors.length; i++) {
                if (this.errors[i].field === field) {
                    return this.errors[i].msg;
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
        value: function has(field) {
            for (var i = 0; i < this.errors.length; i++) {
                if (this.errors[i].field === field) {
                    return true;
                }
            }

            return false;
        }

        /**
         * Removes all error messages assoicated with a specific field.
         *
         * @param  {string} field The field which messages are to be removed.
         */

    }, {
        key: "remove",
        value: function remove(field) {
            this.errors = this.errors.filter(function (e) {
                return e.field !== field;
            });
        }
    }]);

    return ErrorBag;
}();

/* harmony default export */ exports["a"] = ErrorBag;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__rules__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__errorBag__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__exceptions_validatorException__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__messages__ = __webpack_require__(6);

/* harmony export */ __webpack_require__.d(exports, "b", function() { return register; });
/* harmony export */ __webpack_require__.d(exports, "a", function() { return unregister; });var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }






var Validator = function () {
    function Validator(validations, $vm, eventName) {
        _classCallCheck(this, Validator);

        this.locale = 'en';
        this.validations = this.normalize(validations);
        this.errorBag = new __WEBPACK_IMPORTED_MODULE_1__errorBag__["a" /* default */]();
        this.$vm = $vm;
        this.event = eventName;
    }

    /**
     * Sets the validator current langauge.
     *
     * @param {string} language locale or language id.
     */


    _createClass(Validator, [{
        key: 'setLocale',
        value: function setLocale(language) {
            this.locale = language;
        }

        /**
         * Registers a field to be validated.
         *
         * @param  {string} name The field name.
         * @param  {string} checks validations expression.
         */

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

        /**
         * Updates the messages dicitionary, overwriting existing values and adding new ones.
         *
         * @param  {object} messages The messages object.
        =     */

    }, {
        key: 'updateDictionary',


        /**
         * Updates the messages dicitionary, overwriting existing values and adding new ones.
         *
         * @param  {object} messages The messages object.
         */
        value: function updateDictionary(messages) {
            Validator.updateDictionary(messages);
        }

        /**
         * Removes a field from the validator.
         *
         * @param  {string} name The name of the field.
         */

    }, {
        key: 'detach',
        value: function detach(name) {
            delete this.validations[name];
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
            var _this2 = this;

            this.errorBag.clear();
            /* istanbul ignore next */
            if (this.$vm && !this.values) {
                this.$vm.$emit(this.event);

                return;
            }

            var test = true;
            Object.keys(values).forEach(function (property) {
                test = _this2.validate(property, values[property]);
            });
            // eslint-disable-next-line
            return test;
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
         *
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

        /**
         * Normalizes a single validation object.
         *
         * @param  {string} rule The rule to be normalized.
         * @return {object} rule The normalized rule.
         */

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
         * Formats an error message for field and a rule.
         *
         * @param  {string} field The field name.
         * @param  {object} rule Normalized rule object.
         * @return {string} msg Formatted error message.
         */

    }, {
        key: 'formatErrorMessage',
        value: function formatErrorMessage(field, rule) {
            if (!__WEBPACK_IMPORTED_MODULE_3__messages__["a" /* default */][this.locale] || typeof __WEBPACK_IMPORTED_MODULE_3__messages__["a" /* default */][this.locale][rule.name] !== 'function') {
                // Default to english message.
                return __WEBPACK_IMPORTED_MODULE_3__messages__["a" /* default */].en[rule.name](field, rule.params);
            }

            return __WEBPACK_IMPORTED_MODULE_3__messages__["a" /* default */][this.locale][rule.name](field, rule.params);
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
        key: 'test',
        value: function test(name, value, rule) {
            var _this5 = this;

            var validator = __WEBPACK_IMPORTED_MODULE_0__rules__["a" /* default */][rule.name];
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
         *
         * @return {ErrorBag} errorBag The internal error bag object.
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
                if (!__WEBPACK_IMPORTED_MODULE_3__messages__["a" /* default */][locale]) {
                    __WEBPACK_IMPORTED_MODULE_3__messages__["a" /* default */][locale] = {};
                }

                Object.keys(messages[locale]).forEach(function (name) {
                    __WEBPACK_IMPORTED_MODULE_3__messages__["a" /* default */][locale][name] = messages[locale][name];
                });
            });
        }

        /**
         * Static constructor.
         *
         * @param  {object} validations The validations object.
         * @return {Validator} validator A validator object.
         */

    }, {
        key: 'create',
        value: function create(validations, $vm, eventName) {
            return new Validator(validations, $vm, eventName);
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
            Validator.guardExtend(name, validator);

            Validator.merge(name, validator);
        }

        /**
         * Merges a validator object into the Rules and Messages.
         *
         * @param  {string} name The name of the validator.
         * @param  {function|object} validator The validator object.
         */

    }, {
        key: 'merge',
        value: function merge(name, validator) {
            if (typeof validator === 'function') {
                __WEBPACK_IMPORTED_MODULE_0__rules__["a" /* default */][name] = validator;
                __WEBPACK_IMPORTED_MODULE_3__messages__["a" /* default */].en[name] = function (field) {
                    return 'The ' + field + ' value is not valid.';
                };
                return;
            }

            __WEBPACK_IMPORTED_MODULE_0__rules__["a" /* default */][name] = validator.validate;

            if (validator.getMessage && typeof validator.getMessage === 'function') {
                __WEBPACK_IMPORTED_MODULE_3__messages__["a" /* default */].en[name] = validator.getMessage;
            }

            if (validator.messages) {
                Object.keys(validator.messages).forEach(function (locale) {
                    if (!__WEBPACK_IMPORTED_MODULE_3__messages__["a" /* default */][locale]) {
                        __WEBPACK_IMPORTED_MODULE_3__messages__["a" /* default */][locale] = {};
                    }

                    __WEBPACK_IMPORTED_MODULE_3__messages__["a" /* default */][locale][name] = validator.messages[locale];
                });
            }
        }

        /**
         * Guards from extnsion violations.
         *
         * @param  {string} name name of the validation rule.
         * @param  {object} validator a validation rule object.
         */

    }, {
        key: 'guardExtend',
        value: function guardExtend(name, validator) {
            if (__WEBPACK_IMPORTED_MODULE_0__rules__["a" /* default */][name]) {
                throw new __WEBPACK_IMPORTED_MODULE_2__exceptions_validatorException__["a" /* default */]('Extension Error: There is an existing validator with the same name \'' + name + '\'.');
            }

            if (typeof validator === 'function') {
                return;
            }

            if (typeof validator.validate !== 'function') {
                throw new __WEBPACK_IMPORTED_MODULE_2__exceptions_validatorException__["a" /* default */](
                // eslint-disable-next-line
                'Extension Error: The validator \'' + name + '\' must be a function or have a \'validate\' method.');
            }

            if (typeof validator.getMessage !== 'function' && _typeof(validator.messages) !== 'object') {
                throw new __WEBPACK_IMPORTED_MODULE_2__exceptions_validatorException__["a" /* default */](
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


/* harmony default export */ exports["c"] = Validator;
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
var register = function register($vm, eventName) {
    var instance = find($vm);
    if (!instance) {
        instance = Validator.create(undefined, $vm, eventName);

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



/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_debouncer_js__ = __webpack_require__(29);


var DEFAULT_DELAY = 0;
var DEFAULT_EVENT_NAME = 'validate';

/* harmony default export */ exports["a"] = function (options) {
    return {
        params: ['rules', 'delay', 'reject', 'initial'],
        onInput: function onInput() {
            this.vm.$validator.validate(this.fieldName, this.el.value);
        },
        onFileInput: function onFileInput() {
            if (!this.vm.$validator.validate(this.fieldName, this.el.files) && this.params.reject) {
                this.el.value = '';
            }
        },
        attachValidatorEvent: function attachValidatorEvent() {
            var _this = this;

            this.validateCallback = this.expression ? function () {
                _this.vm.$validator.validate(_this.fieldName, _this.value);
            } : function () {
                _this.handler();
            };

            this.vm.$on(options && options.eventName || DEFAULT_EVENT_NAME, this.validateCallback);
        },
        bind: function bind() {
            this.fieldName = this.expression || this.el.name;
            this.vm.$validator.attach(this.fieldName, this.params.rules);

            if (this.expression) {
                this.attachValidatorEvent();

                return;
            }

            var handler = this.el.type === 'file' ? this.onFileInput : this.onInput;
            this.handles = this.el.type === 'file' ? 'change' : 'input';

            var delay = this.params.delay || options && options.delay || DEFAULT_DELAY;
            this.handler = delay ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_debouncer_js__["a" /* default */])(handler.bind(this), delay) : handler.bind(this);
            this.el.addEventListener(this.handles, this.handler);

            this.attachValidatorEvent();
        },
        update: function update(value) {
            if (!this.expression) {
                return;
            }

            if (this.params.initial) {
                this.params.initial = false;

                return;
            }

            this.vm.$validator.validate(this.fieldName, value);
        },
        unbind: function unbind() {
            if (this.handler) {
                this.el.removeEventListener(this.handles, this.handler);
            }

            this.vm.$validator.detach(this.fieldName);
            this.vm.$off(options && options.eventName || DEFAULT_EVENT_NAME, this.validateCallback);
        }
    };
};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__validator__ = __webpack_require__(1);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var DEFAULT_BAG_NAME = 'errors';

/* harmony default export */ exports["a"] = function (options) {
    var errorBagName = options && options.errorBagName || DEFAULT_BAG_NAME;

    return {
        data: function data() {
            return _defineProperty({}, errorBagName, this.$validator.errorBag);
        },
        destroyed: function destroyed() {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__validator__["a" /* unregister */])(this);
        }
    };
};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
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

/* harmony default export */ exports["a"] = _class;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* harmony default export */ exports["a"] = {
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
    },
    url: function url(field) {
        return "The " + field + " is not a valid URL.";
    }
};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__en__ = __webpack_require__(5);


/* harmony default export */ exports["a"] = {
    en: __WEBPACK_IMPORTED_MODULE_0__en__["a" /* default */]
};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (value) {
  return (/^[a-zA-Z ]*$/.test(value)
  );
};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (value) {
  return (/^[a-zA-Z0-9 _-]*$/.test(value)
  );
};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (value) {
  return (/^[a-zA-Z0-9 ]*$/.test(value)
  );
};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* harmony default export */ exports["a"] = function (value, _ref) {
  var _ref2 = _slicedToArray(_ref, 2);

  var min = _ref2[0];
  var max = _ref2[1];
  return Number(min) <= value && Number(max) >= value;
};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* harmony default export */ exports["a"] = function (value, _ref) {
    var _ref2 = _slicedToArray(_ref, 1);

    var confirmedField = _ref2[0];

    var field = document.querySelector("input[name='" + confirmedField + "']");

    return !!(field && String(value) === field.value);
};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* harmony default export */ exports["a"] = function (value, _ref) {
    var _ref2 = _slicedToArray(_ref, 1);

    var length = _ref2[0];

    var strVal = String(value);

    return (/^[0-9]*$/.test(strVal) && strVal.length === Number(length)
    );
};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
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

/* harmony default export */ exports["a"] = function (files, _ref) {
    var _ref2 = _slicedToArray(_ref, 2);

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
};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (value) {
  return (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value)
  );
};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (files, extensions) {
    var regex = new RegExp('.(' + extensions.join('|') + ')$', 'i');
    for (var i = 0; i < files.length; i++) {
        if (!regex.test(files[i].name)) {
            return false;
        }
    }

    return true;
};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (files) {
    for (var i = 0; i < files.length; i++) {
        if (!/\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(files[i].name)) {
            return false;
        }
    }

    return true;
};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (value, options) {
  return !!options.filter(function (option) {
    return option == value;
  }).length;
}; // eslint-disable-line

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__email__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__in__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__required__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__min__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__max__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__notIn__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__alpha__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__alpha_num__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__alpha_dash__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__numeric__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__regex__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ip__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ext__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__mimes__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__size__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__digits__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__image__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__dimensions__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__between__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__confirmed__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__url__ = __webpack_require__(28);





 // eslint-disable-line
 // eslint-disable-line
 // eslint-disable-line
 // eslint-disable-line
 // eslint-disable-line












/* harmony default export */ exports["a"] = {
    email: __WEBPACK_IMPORTED_MODULE_0__email__["a" /* default */],
    min: __WEBPACK_IMPORTED_MODULE_3__min__["a" /* default */],
    max: __WEBPACK_IMPORTED_MODULE_4__max__["a" /* default */],
    required: __WEBPACK_IMPORTED_MODULE_2__required__["a" /* default */],
    in: __WEBPACK_IMPORTED_MODULE_1__in__["a" /* default */],
    not_in: __WEBPACK_IMPORTED_MODULE_5__notIn__["a" /* default */],
    alpha: __WEBPACK_IMPORTED_MODULE_6__alpha__["a" /* default */],
    alpha_num: __WEBPACK_IMPORTED_MODULE_7__alpha_num__["a" /* default */],
    alpha_dash: __WEBPACK_IMPORTED_MODULE_8__alpha_dash__["a" /* default */],
    numeric: __WEBPACK_IMPORTED_MODULE_9__numeric__["a" /* default */],
    regex: __WEBPACK_IMPORTED_MODULE_10__regex__["a" /* default */],
    ip: __WEBPACK_IMPORTED_MODULE_11__ip__["a" /* default */],
    ext: __WEBPACK_IMPORTED_MODULE_12__ext__["a" /* default */],
    mimes: __WEBPACK_IMPORTED_MODULE_13__mimes__["a" /* default */],
    size: __WEBPACK_IMPORTED_MODULE_14__size__["a" /* default */],
    digits: __WEBPACK_IMPORTED_MODULE_15__digits__["a" /* default */],
    image: __WEBPACK_IMPORTED_MODULE_16__image__["a" /* default */],
    dimensions: __WEBPACK_IMPORTED_MODULE_17__dimensions__["a" /* default */],
    between: __WEBPACK_IMPORTED_MODULE_18__between__["a" /* default */],
    confirmed: __WEBPACK_IMPORTED_MODULE_19__confirmed__["a" /* default */],
    url: __WEBPACK_IMPORTED_MODULE_20__url__["a" /* default */]
};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
// TODO: Maybe add ipv6 flag?
/* harmony default export */ exports["a"] = function (value) {
  return (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value)
  );
};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* harmony default export */ exports["a"] = function (value, _ref) {
  var _ref2 = _slicedToArray(_ref, 1);

  var length = _ref2[0];
  return String(value).length <= length;
};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (files, mimes) {
    var regex = new RegExp(mimes.join('|').replace('*', '.+') + '$', 'i');
    for (var i = 0; i < files.length; i++) {
        if (!regex.test(files[i].type)) {
            return false;
        }
    }

    return true;
};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* harmony default export */ exports["a"] = function (value, _ref) {
  var _ref2 = _slicedToArray(_ref, 1);

  var length = _ref2[0];
  return String(value).length >= length;
};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (value, options) {
  return !options.filter(function (option) {
    return option == value;
  }).length;
}; // eslint-disable-line

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (value) {
  return !!String(value).match(/^[0-9]*$/);
};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

/* harmony default export */ exports["a"] = function (value, _ref) {
  var _ref2 = _toArray(_ref);

  var regex = _ref2[0];

  var flags = _ref2.slice(1);

  return new RegExp(regex, flags).test(String(value));
};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (value) {
    if (Array.isArray(value)) {
        return !!value.length;
    }

    if (value === undefined || value === null) {
        return false;
    }

    return !!String(value).length;
};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* harmony default export */ exports["a"] = function (files, _ref) {
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

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (value, params) {
    var isUrl = /^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.\(\)%-]*)*\/?$/.test(value);

    var domain = params && params[0];

    if (domain && isUrl) {
        return new RegExp('^https?://(([da-z.-]+).)*(' + params[0].replace('.', '\\$&') + ')').test(value);
    }

    return isUrl;
};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

/* harmony default export */ exports["a"] = function (func) {
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

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__validator__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixin__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__directive__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__errorBag__ = __webpack_require__(0);

/* harmony export */ __webpack_require__.d(exports, "install", function() { return install; });




var DEFAULT_EVENT_NAME = 'validate';

/**
 * Installs the plugin.
 */
var install = function install(Vue, options) {
    Object.defineProperties(Vue.prototype, {
        $validator: {
            get: function get() {
                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__validator__["b" /* register */])(this, options && options.eventName || DEFAULT_EVENT_NAME);
            }
        }
    });

    Vue.mixin(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__mixin__["a" /* default */])(options)); // Install Mixin.
    Vue.directive('validate', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__directive__["a" /* default */])(options)); // Install directive.
};

/* harmony reexport */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_0__validator__, "c")) __webpack_require__.d(exports, "Validator", function() { return __WEBPACK_IMPORTED_MODULE_0__validator__["c"]; });
/* harmony reexport */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_3__errorBag__, "a")) __webpack_require__.d(exports, "ErrorBag", function() { return __WEBPACK_IMPORTED_MODULE_3__errorBag__["a"]; });


/***/ }
/******/ ])
});
;