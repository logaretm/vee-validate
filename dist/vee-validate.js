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
/******/ 	return __webpack_require__(__webpack_require__.s = 53);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = assertString;
function assertString(input) {
  if (typeof input !== 'string') {
    throw new TypeError('This library (validator.js) validates strings only');
  }
}
module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "c", function() { return getDataAttribute; });
/* harmony export (binding) */ __webpack_require__.d(exports, "d", function() { return getScope; });
/* harmony export (binding) */ __webpack_require__.d(exports, "e", function() { return debounce; });
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return warn; });
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return isObject; });
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

/**
 * Gets the data attribute. the name must be kebab-case.
 */
var getDataAttribute = function getDataAttribute(el, name) {
    return el.getAttribute('data-vv-' + name);
};

/**
 * Determines the input field scope.
 */
var getScope = function getScope(el) {
    var scope = getDataAttribute(el, 'scope');
    if (!scope && el.form) {
        scope = getDataAttribute(el.form, 'scope');
    }

    return scope;
};

/**
 * Debounces a function.
 */
var debounce = function debounce(func) {
    var threshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
    var execAsap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (!threshold) {
        return func;
    }

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

/**
 * Emits a warning to the console.
 */
var warn = function warn(message) {
    if (!console) {
        return;
    }

    console.warn('[vee-validate]: ' + message); // eslint-disable-line
};

/**
 * Checks if the value is an object.
 */
// eslint-disable-next-line
var isObject = function isObject(object) {
    return object !== null && object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && !Array.isArray(object);
};

/***/ },
/* 2 */
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = merge;
function merge() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var defaults = arguments[1];

  for (var key in defaults) {
    if (typeof obj[key] === 'undefined') {
      obj[key] = defaults[key];
    }
  }
  return obj;
}
module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
     * @param {String} rule The rule that is responsible for the error.
     * @param {String} scope The Scope name, optional.
     */


    _createClass(ErrorBag, [{
        key: 'add',
        value: function add(field, msg, rule) {
            var scope = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

            this.errors.push({ field: field, msg: msg, rule: rule, scope: scope });
        }

        /**
         * Gets all error messages from the internal array.
         *
         * @param {String} scope The Scope name, optional.
         * @return {Array} errors Array of all error messages.
         */

    }, {
        key: 'all',
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
         * Checks if there are any errors in the internal array.
         * @param {String} scope The Scope name, optional.
         * @return {boolean} result True if there was at least one error, false otherwise.
         */

    }, {
        key: 'any',
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
         *
         * @param {String} scope The Scope name, optional.
         */

    }, {
        key: 'clear',
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
         * @param {Boolean} map If it should map the errors to strings instead of objects.
         * @return {Array} errors The errors for the specified field.
         */

    }, {
        key: 'collect',
        value: function collect(field, scope) {
            var _this = this;

            var map = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            if (!field) {
                var _ret = function () {
                    var collection = {};
                    _this.errors.forEach(function (e) {
                        if (!collection[e.field]) {
                            collection[e.field] = [];
                        }

                        collection[e.field].push(map ? e.msg : e);
                    });

                    return {
                        v: collection
                    };
                }();

                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            }

            if (scope) {
                return this.errors.filter(function (e) {
                    return e.field === field && e.scope === scope;
                }).map(function (e) {
                    return map ? e.msg : e;
                });
            }

            return this.errors.filter(function (e) {
                return e.field === field;
            }).map(function (e) {
                return map ? e.msg : e;
            });
        }
        /**
         * Gets the internal array length.
         *
         * @return {Number} length The internal array length.
         */

    }, {
        key: 'count',
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
        key: 'first',
        value: function first(field, scope) {
            var selector = this.selector(field);

            if (selector) {
                return this.firstByRule(selector.name, selector.rule, scope);
            }

            for (var i = 0; i < this.errors.length; i++) {
                if (this.errors[i].field === field && (!scope || this.errors[i].scope === scope)) {
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
        key: 'has',
        value: function has(field, scope) {
            return !!this.first(field, scope);
        }

        /**
         * Gets the first error message for a specific field and a rule.
         * @param {String} name The name of the field.
         * @param {String} rule The name of the rule.
         * @param {String} scope The name of the scope (optional).
         */

    }, {
        key: 'firstByRule',
        value: function firstByRule(name, rule, scope) {
            var error = this.collect(name, scope, false).filter(function (e) {
                return e.rule === rule;
            })[0];

            return error && error.msg || null;
        }

        /**
         * Removes all error messages associated with a specific field.
         *
         * @param  {string} field The field which messages are to be removed.
         * @param {String} scope The Scope name, optional.
         */

    }, {
        key: 'remove',
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

        /**
         * Get the field attributes if there's a rule selector.
         *
         * @param  {string} field The specified field.
         * @return {Object|null}
         */

    }, {
        key: 'selector',
        value: function selector(field) {
            if (field.indexOf(':') > -1) {
                var _field$split = field.split(':');

                var _field$split2 = _slicedToArray(_field$split, 2);

                var name = _field$split2[0];
                var rule = _field$split2[1];


                return { name: name, rule: rule };
            }

            return null;
        }
    }]);

    return ErrorBag;
}();

/* harmony default export */ exports["a"] = ErrorBag;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__validator__ = __webpack_require__(5);
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return register; });
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return unregister; });
/* unused harmony export find */


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
        instance = __WEBPACK_IMPORTED_MODULE_0__validator__["a" /* default */].create(undefined, $vm);

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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__rules__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__errorBag__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__exceptions_validatorException__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__dictionary__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__messages__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_helpers__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__plugins_date__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__fieldBag__ = __webpack_require__(12);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }










var LOCALE = 'en';
var STRICT_MODE = true;
var dictionary = new __WEBPACK_IMPORTED_MODULE_3__dictionary__["a" /* default */]({
    en: {
        messages: __WEBPACK_IMPORTED_MODULE_4__messages__["a" /* default */],
        attributes: {}
    }
});

var Validator = function () {
    function Validator(validations, $vm) {
        _classCallCheck(this, Validator);

        this.strictMode = STRICT_MODE;
        this.$fields = {};
        this.fieldBag = new __WEBPACK_IMPORTED_MODULE_7__fieldBag__["a" /* default */]();
        this._createFields(validations);
        this.errorBag = new __WEBPACK_IMPORTED_MODULE_1__errorBag__["a" /* default */]();
        this.$vm = $vm;

        // if momentjs is present, install the validators.
        if (typeof moment === 'function') {
            // eslint-disable-next-line
            this.installDateTimeValidators(moment);
        }
    }

    /**
     * Merges a validator object into the Rules and Messages.
     *
     * @param  {string} name The name of the validator.
     * @param  {function|object} validator The validator object.
     */


    _createClass(Validator, [{
        key: '_resolveValuesFromGetters',


        /**
         * Resolves the field values from the getter functions.
         */
        value: function _resolveValuesFromGetters(scope) {
            var _this = this;

            var values = {};
            Object.keys(this.$fields).forEach(function (field) {
                var getter = _this.$fields[field].getter;
                var context = _this.$fields[field].context;
                var fieldScope = typeof _this.$fields[field].scope === 'function' ? _this.$fields[field].scope() : undefined;

                if (getter && context && (!scope || fieldScope === scope)) {
                    values[field] = {
                        value: getter(context()),
                        scope: fieldScope
                    };
                }
            });

            return values;
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
            var _this2 = this;

            if (!validations) {
                return;
            }

            Object.keys(validations).forEach(function (field) {
                _this2._createField(field, validations[field]);
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
            var _this3 = this;

            if (!this.$fields[name]) {
                this.$fields[name] = {};
            }

            this.fieldBag._add(name);
            this.$fields[name].validations = [];

            if (Array.isArray(checks)) {
                this.$fields[name].validations = checks;

                return;
            }

            checks.split('|').forEach(function (rule) {
                var normalizedRule = _this3._normalizeRule(rule, _this3.$fields[name].validations);
                if (!normalizedRule.name) {
                    return;
                }

                if (normalizedRule.name === 'required') {
                    _this3.$fields[name].required = true;
                }

                _this3.$fields[name].validations.push(normalizedRule);
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
                params = rule.split(':').slice(1).join(':').split(',');
            }

            // Those rules need the date format to parse and compare correctly.
            if (__WEBPACK_IMPORTED_MODULE_6__plugins_date__["a" /* default */].installed && ~['after', 'before', 'date_between'].indexOf(name)) {
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
         * @param {object} data Additional Information about the validation result.
         * @return {string} msg Formatted error message.
         */

    }, {
        key: '_formatErrorMessage',
        value: function _formatErrorMessage(field, rule) {
            var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            var name = this._getFieldDisplayName(field);
            var params = this._getLocalizedParams(rule);

            if (!dictionary.hasLocale(LOCALE) || typeof dictionary.getMessage(LOCALE, rule.name) !== 'function') {
                // Default to english message.
                return dictionary.getMessage('en', rule.name)(name, params, data);
            }

            return dictionary.getMessage(LOCALE, rule.name)(name, params, data);
        }

        /**
         * Translates the parameters passed to the rule (mainly for target fields).
         */

    }, {
        key: '_getLocalizedParams',
        value: function _getLocalizedParams(rule) {
            if (~['after', 'before', 'confirmed'].indexOf(rule.name) && rule.params && rule.params[0]) {
                return [dictionary.getAttribute(LOCALE, rule.params[0], rule.params[0])];
            }

            return rule.params;
        }

        /**
         * Resolves an appropiate display name, first checking 'data-as' or the registered 'prettyName'
         * Then the dictionary, then fallsback to field name.
         * @return {String} displayName The name to be used in the errors.
         */

    }, {
        key: '_getFieldDisplayName',
        value: function _getFieldDisplayName(field) {
            return this.$fields[field].name || dictionary.getAttribute(LOCALE, field, field);
        }

        /**
         * Tests a single input value against a rule.
         *
         * @param  {*} name The name of the field.
         * @param  {*} value  [description]
         * @param  {object} rule the rule object.
         * @return {boolean} Whether it passes the check.
         */

    }, {
        key: '_test',
        value: function _test(name, value, rule, scope) {
            var _this4 = this;

            var validator = __WEBPACK_IMPORTED_MODULE_0__rules__["a" /* default */][rule.name];
            if (!validator || typeof validator !== 'function') {
                throw new __WEBPACK_IMPORTED_MODULE_2__exceptions_validatorException__["a" /* default */]('No such validator \'' + rule.name + '\' exists.');
            }

            var result = validator(value, rule.params, name);

            // If it is a promise.
            if (typeof result.then === 'function') {
                return result.then(function (values) {
                    var allValid = true;
                    var data = {};
                    if (Array.isArray(values)) {
                        allValid = values.every(function (t) {
                            return t.valid;
                        });
                    } else {
                        // Is a single object.
                        allValid = values.valid;
                        data = values.data;
                    }

                    if (!allValid) {
                        _this4.errorBag.add(name, _this4._formatErrorMessage(name, rule, data), rule.name, scope);
                    }

                    return allValid;
                });
            }

            if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__utils_helpers__["a" /* isObject */])(result)) {
                result = { valid: result, data: {} };
            }

            if (!result.valid) {
                this.errorBag.add(name, this._formatErrorMessage(name, rule, result.data), rule.name, scope);
            }

            return result.valid;
        }

        /**
         * Registers a field to be validated.
         *
         * @param  {string} name The field name.
         * @param  {string} checks validations expression.
         * @param {string} prettyName Custom name to be used as field name in error messages.
         * @param {Function} getter A function used to retrive a fresh value for the field.
         */

    }, {
        key: 'attach',
        value: function attach(name, checks) {
            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            this.errorBag.remove(name);
            this._createField(name, checks);
            this.$fields[name].scope = options.scope;
            this.$fields[name].name = options.prettyName;
            this.$fields[name].getter = options.getter;
            this.$fields[name].context = options.context;
            this.$fields[name].listeners = options.listeners || {
                detach: function detach() {}
            };
        }

        /**
         * Removes a field from the validator.
         *
         * @param  {String} name The name of the field.
         * @param {String} scope The name of the field scope.
         */

    }, {
        key: 'detach',
        value: function detach(name, scope) {
            // No such field.
            if (!this.$fields[name]) {
                return;
            }

            /* istanbul ignore if */
            if (this.$vm && typeof this.$vm.$emit === 'function') {
                this.$fields[name].listeners.detach();
            }

            this.errorBag.remove(name, scope);
            this.fieldBag._remove(name);
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
         * Gets the internal errorBag instance.
         *
         * @return {ErrorBag} errorBag The internal error bag object.
         */

    }, {
        key: 'getErrors',
        value: function getErrors() {
            return this.errorBag;
        }

        /**
         * Gets the currently active locale.
         *
         * @return {String} Locale identifier.
         */

    }, {
        key: 'getLocale',
        value: function getLocale() {
            return LOCALE;
        }

        /**
         * Just an alias to the static method for convienece.
         */

    }, {
        key: 'installDateTimeValidators',
        value: function installDateTimeValidators(moment) {
            Validator.installDateTimeValidators(moment);
        }

        /**
         * Removes a rule from the list of validators.
         * @param {String} name The name of the validator/rule.
         */

    }, {
        key: 'remove',
        value: function remove(name) {
            Validator.remove(name);
        }

        /**
         * Sets the validator current langauge.
         *
         * @param {string} language locale or language id.
         */

    }, {
        key: 'setLocale',
        value: function setLocale(language) {
            /* istanbul ignore if */
            if (!dictionary.hasLocale(language)) {
                // eslint-disable-next-line
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__utils_helpers__["b" /* warn */])('You are setting the validator locale to a locale that is not defined in the dicitionary. English messages may still be generated.');
            }

            LOCALE = language;
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
            var strictMode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            this.strictMode = strictMode;
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
            var _this5 = this;

            if (!this.$fields[name]) {
                if (!this.strictMode) {
                    return true;
                }
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__utils_helpers__["b" /* warn */])('Trying to validate a non-existant field: "' + name + '". Use "attach()" first.');

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
                var result = _this5._test(name, value, rule, scope);
                if (typeof result.then === 'function') {
                    promises.push(result);
                    return;
                }

                test = test && result;
            });

            if (promises.length) {
                return Promise.all(promises).then(function (values) {
                    var valid = values.every(function (t) {
                        return t;
                    }) && test;
                    _this5.fieldBag._setFlags(name, { valid: valid, dirty: true });

                    return valid;
                });
            }

            this.fieldBag._setFlags(name, { valid: test, dirty: true });

            return test;
        }

        /**
         * Validates each value against the corresponding field validations.
         * @param  {object} values The values to be validated.
         * @return {Promise} Returns a promise with the validation result.
         */

    }, {
        key: 'validateAll',
        value: function validateAll(values) {
            var _this6 = this;

            var normalizedValues = void 0;
            if (!values) {
                normalizedValues = this._resolveValuesFromGetters();
                this.errorBag.clear();
            } else if (typeof values === 'string') {
                this.errorBag.clear(values);
                normalizedValues = this._resolveValuesFromGetters(values);
            } else {
                normalizedValues = {};
                Object.keys(values).forEach(function (key) {
                    normalizedValues[key] = {
                        value: values[key]
                    };
                });
            }

            var test = true;
            var promises = [];
            Object.keys(normalizedValues).forEach(function (property) {
                var result = _this6.validate(property, normalizedValues[property].value, normalizedValues[property].scope);
                if (typeof result.then === 'function') {
                    promises.push(result);
                    return;
                }

                test = test && result;
            });

            return Promise.all(promises).then(function (vals) {
                var valid = vals.every(function (t) {
                    return t;
                }) && test;

                return valid;
            });
        }
    }], [{
        key: '_merge',
        value: function _merge(name, validator) {
            if (typeof validator === 'function') {
                __WEBPACK_IMPORTED_MODULE_0__rules__["a" /* default */][name] = validator;
                dictionary.setMessage('en', name, function (field) {
                    return 'The ' + field + ' value is not valid.';
                });
                return;
            }

            __WEBPACK_IMPORTED_MODULE_0__rules__["a" /* default */][name] = validator.validate;

            if (validator.getMessage && typeof validator.getMessage === 'function') {
                dictionary.setMessage('en', name, validator.getMessage);
            }

            if (validator.messages) {
                dictionary.merge(Object.keys(validator.messages).reduce(function (prev, curr) {
                    var dict = prev;
                    dict[curr] = {
                        messages: _defineProperty({}, name, validator.messages[curr])
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
         * Installs the datetime validators and the messages.
         */

    }, {
        key: 'installDateTimeValidators',
        value: function installDateTimeValidators(moment) {
            if (typeof moment !== 'function') {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__utils_helpers__["b" /* warn */])('To use the date-time validators you must provide moment reference.');

                return false;
            }

            if (__WEBPACK_IMPORTED_MODULE_6__plugins_date__["a" /* default */].installed) {
                return true;
            }

            var validators = __WEBPACK_IMPORTED_MODULE_6__plugins_date__["a" /* default */].make(moment);
            Object.keys(validators).forEach(function (name) {
                Validator.extend(name, validators[name]);
            });

            Validator.updateDictionary({
                en: {
                    messages: __WEBPACK_IMPORTED_MODULE_6__plugins_date__["a" /* default */].messages
                }
            });
            __WEBPACK_IMPORTED_MODULE_6__plugins_date__["a" /* default */].installed = true;

            return true;
        }

        /**
         * Removes a rule from the list of validators.
         * @param {String} name The name of the validator/rule.
         */

    }, {
        key: 'remove',
        value: function remove(name) {
            delete __WEBPACK_IMPORTED_MODULE_0__rules__["a" /* default */][name];
        }

        /**
         * Sets the default locale for all validators.
         *
         * @param {String} language The locale id.
         */

    }, {
        key: 'setLocale',
        value: function setLocale() {
            var language = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'en';

            /* istanbul ignore if */
            if (!dictionary.hasLocale(language)) {
                // eslint-disable-next-line
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__utils_helpers__["b" /* warn */])('You are setting the validator locale to a locale that is not defined in the dicitionary. English messages may still be generated.');
            }

            LOCALE = language;
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
            var strictMode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            STRICT_MODE = strictMode;
        }

        /**
         * Updates the dicitionary, overwriting existing values and adding new ones.
         *
         * @param  {object} data The dictionary object.
         */

    }, {
        key: 'updateDictionary',
        value: function updateDictionary(data) {
            dictionary.merge(data);
        }
    }]);

    return Validator;
}();

/* harmony default export */ exports["a"] = Validator;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isFDQN;

var _assertString = __webpack_require__(0);

var _assertString2 = _interopRequireDefault(_assertString);

var _merge = __webpack_require__(2);

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_fqdn_options = {
  require_tld: true,
  allow_underscores: false,
  allow_trailing_dot: false
};

function isFDQN(str, options) {
  (0, _assertString2.default)(str);
  options = (0, _merge2.default)(options, default_fqdn_options);

  /* Remove the optional trailing dot before checking validity */
  if (options.allow_trailing_dot && str[str.length - 1] === '.') {
    str = str.substring(0, str.length - 1);
  }
  var parts = str.split('.');
  if (options.require_tld) {
    var tld = parts.pop();
    if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
      return false;
    }
  }
  for (var part, i = 0; i < parts.length; i++) {
    part = parts[i];
    if (options.allow_underscores) {
      part = part.replace(/_/g, '');
    }
    if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
      return false;
    }
    if (/[\uff01-\uff5e]/.test(part)) {
      // disallow full-width chars
      return false;
    }
    if (part[0] === '-' || part[part.length - 1] === '-') {
      return false;
    }
  }
  return true;
}
module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isIP;

var _assertString = __webpack_require__(0);

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ipv4Maybe = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
var ipv6Block = /^[0-9A-F]{1,4}$/i;

function isIP(str) {
  var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  (0, _assertString2.default)(str);
  version = String(version);
  if (!version) {
    return isIP(str, 4) || isIP(str, 6);
  } else if (version === '4') {
    if (!ipv4Maybe.test(str)) {
      return false;
    }
    var parts = str.split('.').sort(function (a, b) {
      return a - b;
    });
    return parts[3] <= 255;
  } else if (version === '6') {
    var blocks = str.split(':');
    var foundOmissionBlock = false; // marker to indicate ::

    // At least some OS accept the last 32 bits of an IPv6 address
    // (i.e. 2 of the blocks) in IPv4 notation, and RFC 3493 says
    // that '::ffff:a.b.c.d' is valid for IPv4-mapped IPv6 addresses,
    // and '::a.b.c.d' is deprecated, but also valid.
    var foundIPv4TransitionBlock = isIP(blocks[blocks.length - 1], 4);
    var expectedNumberOfBlocks = foundIPv4TransitionBlock ? 7 : 8;

    if (blocks.length > expectedNumberOfBlocks) {
      return false;
    }
    // initial or final ::
    if (str === '::') {
      return true;
    } else if (str.substr(0, 2) === '::') {
      blocks.shift();
      blocks.shift();
      foundOmissionBlock = true;
    } else if (str.substr(str.length - 2) === '::') {
      blocks.pop();
      blocks.pop();
      foundOmissionBlock = true;
    }

    for (var i = 0; i < blocks.length; ++i) {
      // test for a :: which can not be at the string start/end
      // since those cases have been handled above
      if (blocks[i] === '' && i > 0 && i < blocks.length - 1) {
        if (foundOmissionBlock) {
          return false; // multiple :: in address
        }
        foundOmissionBlock = true;
      } else if (foundIPv4TransitionBlock && i === blocks.length - 1) {
        // it has been checked before that the last
        // block is a valid IPv4 address
      } else if (!ipv6Block.test(blocks[i])) {
        return false;
      }
    }
    if (foundOmissionBlock) {
      return blocks.length >= 1;
    }
    return blocks.length === expectedNumberOfBlocks;
  }
  return false;
}
module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__listeners__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_helpers__ = __webpack_require__(1);



var listenersInstances = [];

/* harmony default export */ exports["a"] = function (options) {
    return {
        bind: function bind(el, binding, vnode) {
            var listener = new __WEBPACK_IMPORTED_MODULE_0__listeners__["a" /* default */](el, binding, vnode, options);
            listener.attach();
            listenersInstances.push({ vm: vnode.context, el: el, instance: listener });
        },
        update: function update(el, _ref, _ref2) {
            var expression = _ref.expression;
            var value = _ref.value;
            var modifiers = _ref.modifiers;
            var oldValue = _ref.oldValue;
            var context = _ref2.context;

            if (!expression || value === oldValue) {
                return;
            }

            context.$validator.validate(expression || el.name, value, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils_helpers__["d" /* getScope */])(el));
        },
        unbind: function unbind(el, binding, _ref3) {
            var context = _ref3.context;

            var holder = listenersInstances.filter(function (l) {
                return l.vm === context && l.el === el;
            })[0];
            holder.instance.detach();
            listenersInstances.splice(listenersInstances.indexOf(holder), 1);
        }
    };
};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_maps__ = __webpack_require__(4);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



/* harmony default export */ exports["a"] = function (options) {
    return {
        data: function data() {
            return _defineProperty({}, options.errorBagName, this.$validator.errorBag);
        },

        computed: _defineProperty({}, options.fieldsBagName, {
            get: function get() {
                return this.$validator.fieldBag;
            }
        }),
        mounted: function mounted() {
            this.$emit('validatorReady');
        },
        destroyed: function destroyed() {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_maps__["a" /* unregister */])(this);
        }
    };
};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_helpers__ = __webpack_require__(1);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable prefer-rest-params */


var Dictionary = function () {
    function Dictionary() {
        var dictionary = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Dictionary);

        this.dictionary = {};
        this.merge(dictionary);
    }

    _createClass(Dictionary, [{
        key: 'hasLocale',
        value: function hasLocale(locale) {
            return !!this.dictionary[locale];
        }
    }, {
        key: 'getMessage',
        value: function getMessage(locale, key) {
            var fallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

            if (!this.hasMessage(locale, key)) {
                return fallback;
            }

            return this.dictionary[locale].messages[key];
        }
    }, {
        key: 'getAttribute',
        value: function getAttribute(locale, key) {
            var fallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

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
        key: '_merge',
        value: function _merge(target, source) {
            var _this = this;

            if (!(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_helpers__["a" /* isObject */])(target) && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_helpers__["a" /* isObject */])(source))) {
                return target;
            }

            Object.keys(source).forEach(function (key) {
                if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_helpers__["a" /* isObject */])(source[key])) {
                    if (!target[key]) {
                        _extends(target, _defineProperty({}, key, {}));
                    }

                    _this._merge(target[key], source[key]);
                    return;
                }

                _extends(target, _defineProperty({}, key, source[key]));
            });

            return target;
        }
    }]);

    return Dictionary;
}();

/* harmony default export */ exports["a"] = Dictionary;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(msg) {
        _classCallCheck(this, _class);

        this.msg = "[vee-validate]: " + msg;
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FieldBag = function () {
    function FieldBag() {
        _classCallCheck(this, FieldBag);

        this.fields = {};
    }

    /**
     * Initializes and adds a new field to the bag.
     */


    _createClass(FieldBag, [{
        key: '_add',
        value: function _add(name) {
            this.fields[name] = {};
            this._setFlags(name, { dirty: false, valid: false }, true);
        }

        /**
         * Remooves a field from the bag.
         */

    }, {
        key: '_remove',
        value: function _remove(name) {
            delete this.fields[name];
        }

        /**
         * Resets the flags state for a specified field or all fields.
         */

    }, {
        key: 'reset',
        value: function reset(name) {
            var _this = this;

            if (!name) {
                Object.keys(this.fields).forEach(function (field) {
                    _this._setFlags(field, { dirty: false, valid: false }, true);
                });

                return;
            }

            this._setFlags(name, { dirty: false, valid: false }, true);
        }

        /**
         * Sets the flags for a specified field.
         */

    }, {
        key: '_setFlags',
        value: function _setFlags(name, flags) {
            var _this2 = this;

            var initial = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            return Object.keys(flags).every(function (flag) {
                return _this2._setFlag(name, flag, flags[flag], initial);
            });
        }

        /**
         * Sets a flag for a specified field.
         */

    }, {
        key: '_setFlag',
        value: function _setFlag(name, flag, value) {
            var initial = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            var method = 'set' + flag.charAt(0).toUpperCase() + flag.slice(1);
            if (typeof this[method] !== 'function') {
                return false;
            }

            this[method](name, value, initial);

            return true;
        }

        /**
         * Sets the dirty flag along with dependant flags.
         */

    }, {
        key: 'setDirty',
        value: function setDirty(name, value) {
            var initial = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            this.fields[name].dirty = value;
            this.fields[name].clean = initial || !value;
            this.fields[name].passed = this.fields[name].valid && value;
            this.fields[name].failed = !this.fields[name].valid && value;
        }

        /**
         * Sets the valid flag along with dependant flags.
         */

    }, {
        key: 'setValid',
        value: function setValid(name, value) {
            this.fields[name].valid = value;
            this.fields[name].passed = this.fields[name].dirty && value;
            this.fields[name].failed = this.fields[name].dirty && !value;
        }

        /**
         * Gets a field flag value.
         */

    }, {
        key: '_getFieldFlag',
        value: function _getFieldFlag(name, flag) {
            if (this.fields[name]) {
                return this.fields[name][flag];
            }

            return false;
        }
    }, {
        key: 'dirty',
        value: function dirty(name) {
            var _this3 = this;

            if (!name) {
                return Object.keys(this.fields).some(function (field) {
                    return _this3.fields[field].dirty;
                });
            }

            return this._getFieldFlag(name, 'dirty');
        }
    }, {
        key: 'valid',
        value: function valid(name) {
            var _this4 = this;

            if (!name) {
                return Object.keys(this.fields).every(function (field) {
                    return _this4.fields[field].valid;
                });
            }

            return this._getFieldFlag(name, 'valid');
        }
    }, {
        key: 'passed',
        value: function passed(name) {
            var _this5 = this;

            if (!name) {
                return Object.keys(this.fields).every(function (field) {
                    return _this5.fields[field].passed;
                });
            }

            return this._getFieldFlag(name, 'passed');
        }
    }, {
        key: 'failed',
        value: function failed(name) {
            var _this6 = this;

            if (!name) {
                return Object.keys(this.fields).some(function (field) {
                    return _this6.fields[field].failed;
                });
            }

            return this._getFieldFlag(name, 'failed');
        }
    }, {
        key: 'clean',
        value: function clean(name) {
            if (!name) {
                return !this.dirty();
            }

            return this._getFieldFlag(name, 'clean');
        }
    }]);

    return FieldBag;
}();

/* harmony default export */ exports["a"] = FieldBag;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_helpers__ = __webpack_require__(1);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var ListenerGenerator = function () {
    function ListenerGenerator(el, binding, vnode, options) {
        _classCallCheck(this, ListenerGenerator);

        this.callbacks = [];
        this.el = el;
        this.binding = binding;
        this.vm = vnode.context;
        this.component = vnode.child;
        this.options = options;
        this.fieldName = this._resolveFieldName();
    }

    /**
     * Resolves the field name to trigger validations.
     * @return {String} The field name.
     */


    _createClass(ListenerGenerator, [{
        key: '_resolveFieldName',
        value: function _resolveFieldName() {
            if (this.component) {
                return this.component.name || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_helpers__["c" /* getDataAttribute */])(this.el, 'name');
            }

            return this.binding.expression || this.el.name || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_helpers__["c" /* getDataAttribute */])(this.el, 'name');
        }

        /**
         * Determines if the validation rule requires additional listeners on target fields.
         */

    }, {
        key: '_hasFieldDependency',
        value: function _hasFieldDependency(rules) {
            var _this = this;

            var fieldName = false;
            rules.split('|').every(function (r) {
                if (/\b(confirmed|after|before):/.test(r)) {
                    fieldName = r.split(':')[1];
                    return false;
                }

                if (/\b(confirmed)/.test(r)) {
                    fieldName = _this.fieldName + '_confirmation';
                    return false;
                }

                return true;
            });

            return fieldName;
        }

        /**
         * Validates input value, triggered by 'input' event.
         */

    }, {
        key: '_inputListener',
        value: function _inputListener() {
            this._validate(this.el.value);
        }

        /**
         * Validates files, triggered by 'change' event.
         */

    }, {
        key: '_fileListener',
        value: function _fileListener() {
            var isValid = this._validate(this.el.files);

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
            this._validate(checked ? checked.value : null);
        }

        /**
         * Validates checkboxes, triggered by change event.
         */

    }, {
        key: '_checkboxListener',
        value: function _checkboxListener() {
            var _this2 = this;

            var checkedBoxes = document.querySelectorAll('input[name="' + this.el.name + '"]:checked');
            if (!checkedBoxes || !checkedBoxes.length) {
                this._validate(null);
                return;
            }

            [].concat(_toConsumableArray(checkedBoxes)).forEach(function (box) {
                _this2._validate(box.value);
            });
        }

        /**
         * Trigger the validation for a specific value.
         */

    }, {
        key: '_validate',
        value: function _validate(value) {
            return this.vm.$validator.validate(this.fieldName, value, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_helpers__["d" /* getScope */])(this.el));
        }

        /**
         * Returns a scoped callback, only runs if the el scope is the same as the recieved scope
         * From the event.
         */

    }, {
        key: '_getScopedListener',
        value: function _getScopedListener(callback) {
            var _this3 = this;

            return function (scope) {
                if (!scope || scope === __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_helpers__["d" /* getScope */])(_this3.el) || scope instanceof Event) {
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
            var _this4 = this;

            var listener = this._getScopedListener(this._getSuitableListener().listener.bind(this));
            var fieldName = this._hasFieldDependency(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_helpers__["c" /* getDataAttribute */])(this.el, 'rules'));
            if (fieldName) {
                // Wait for the validator ready triggered when vm is mounted because maybe
                // the element isn't mounted yet.
                this.vm.$once('validatorReady', function () {
                    var target = document.querySelector('input[name=\'' + fieldName + '\']');
                    if (!target) {
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_helpers__["b" /* warn */])('Cannot find target field, no additional listeners were attached.');
                        return;
                    }

                    target.addEventListener('input', listener);
                    _this4.callbacks.push({ name: 'input', listener: listener, el: target });
                });
            }
        }

        /**
         * Determines a suitable listener for the element.
         */

    }, {
        key: '_getSuitableListener',
        value: function _getSuitableListener() {
            var listener = void 0;

            // determine the suitable listener and events to handle
            switch (this.el.type) {
                case 'file':
                    listener = {
                        names: ['change'],
                        listener: this._fileListener
                    };
                    break;

                case 'radio':
                    listener = {
                        names: ['change'],
                        listener: this._radioListener
                    };
                    break;

                case 'checkbox':
                    listener = {
                        names: ['change'],
                        listener: this._checkboxListener
                    };
                    break;

                default:
                    listener = {
                        names: ['input', 'blur'],
                        listener: this._inputListener
                    };
                    break;
            }

            // users are able to specify which events they want to validate on
            // pipe separated list of handler names to use
            var events = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_helpers__["c" /* getDataAttribute */])(this.el, 'validate-on');
            if (events) {
                listener.names = events.split('|');
            }

            return listener;
        }

        /**
         * Attaches neccessary validation events for the component.
         */

    }, {
        key: '_attachComponentListeners',
        value: function _attachComponentListeners() {
            var _this5 = this;

            this.component.$on('input', function (value) {
                _this5.vm.$validator.validate(_this5.fieldName, value);
            });
        }

        /**
         * Attachs a suitable listener for the input.
         */

    }, {
        key: '_attachFieldListeners',
        value: function _attachFieldListeners() {
            var _this6 = this;

            // If it is a component, use vue events instead.
            if (this.component) {
                this._attachComponentListeners();

                return;
            }

            var handler = this._getSuitableListener();
            var listener = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_helpers__["e" /* debounce */])(handler.listener.bind(this), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_helpers__["c" /* getDataAttribute */])(this.el, 'delay') || this.options.delay);

            if (~['radio', 'checkbox'].indexOf(this.el.type)) {
                this.vm.$once('validatorReady', function () {
                    [].concat(_toConsumableArray(document.querySelectorAll('input[name="' + _this6.el.name + '"]'))).forEach(function (input) {
                        handler.names.forEach(function (handlerName) {
                            input.addEventListener(handlerName, listener);
                            _this6.callbacks.push({ name: handlerName, listener: listener, el: input });
                        });
                    });
                });

                return;
            }

            handler.names.forEach(function (handlerName) {
                _this6.el.addEventListener(handlerName, listener);
                _this6.callbacks.push({ name: handlerName, listener: listener, el: _this6.el });
            });
        }

        /**
         * Returns a context, getter factory pairs for each input type.
         */

    }, {
        key: '_resolveValueGetter',
        value: function _resolveValueGetter() {
            var _this7 = this;

            if (this.component) {
                return {
                    context: function context() {
                        return _this7.component;
                    },
                    getter: function getter(context) {
                        return context[__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_helpers__["c" /* getDataAttribute */])(context.$el, 'value-path')] || context.value;
                    }
                };
            }

            switch (this.el.type) {
                case 'checkbox':
                    return {
                        context: function context() {
                            return document.querySelectorAll('input[name="' + _this7.el.name + '"]:checked');
                        },
                        getter: function getter(context) {
                            if (!context || !context.length) {
                                return null;
                            }

                            return [].concat(_toConsumableArray(context)).map(function (checkbox) {
                                return checkbox.value;
                            });
                        }
                    };
                case 'radio':
                    return {
                        context: function context() {
                            return document.querySelector('input[name="' + _this7.el.name + '"]:checked');
                        },
                        getter: function getter(context) {
                            return context && context.value;
                        }
                    };
                case 'file':
                    return {
                        context: function context() {
                            return _this7.el;
                        },
                        getter: function getter(context) {
                            return context.files;
                        }
                    };

                default:
                    return {
                        context: function context() {
                            return _this7.el;
                        },
                        getter: function getter(context) {
                            return context.value;
                        }
                    };
            }
        }

        /**
         * Attaches the Event Listeners.
         */

    }, {
        key: 'attach',
        value: function attach() {
            var _this8 = this;

            var _resolveValueGetter2 = this._resolveValueGetter();

            var context = _resolveValueGetter2.context;
            var getter = _resolveValueGetter2.getter;

            this.vm.$validator.attach(this.fieldName, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_helpers__["c" /* getDataAttribute */])(this.el, 'rules'), {
                scope: function scope() {
                    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_helpers__["d" /* getScope */])(_this8.el);
                },
                prettyName: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_helpers__["c" /* getDataAttribute */])(this.el, 'as'),
                context: context,
                getter: getter,
                listeners: this
            });

            this._attachValidatorEvent();
            if (this.binding.expression) {
                // if its bound, validate it. (since update doesn't trigger after bind).
                if (!this.binding.modifiers.initial) {
                    this.vm.$validator.validate(this.binding.expression, this.binding.value, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_helpers__["d" /* getScope */])(this.el));
                }

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
            this.callbacks.forEach(function (h) {
                h.el.removeEventListener(h.name, h.listener);
            });
        }
    }]);

    return ListenerGenerator;
}();

/* harmony default export */ exports["a"] = ListenerGenerator;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* istanbul ignore next */
/* eslint-disable max-len */
/* harmony default export */ exports["a"] = {
    alpha_dash: function alpha_dash(field) {
        return 'The ' + field + ' may contain alpha-numeric characters as well as dashes and underscores.';
    },
    alpha_num: function alpha_num(field) {
        return 'The ' + field + ' may only contain alpha-numeric characters.';
    },
    alpha_spaces: function alpha_spaces(field) {
        return 'The ' + field + ' may only contain alphabetic characters as well as spaces.';
    },
    alpha: function alpha(field) {
        return 'The ' + field + ' may only contain alphabetic characters.';
    },
    between: function between(field, _ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var min = _ref2[0];
        var max = _ref2[1];
        return 'The ' + field + ' must be between ' + min + ' and ' + max + '.';
    },
    confirmed: function confirmed(field) {
        return 'The ' + field + ' confirmation does not match.';
    },
    credit_card: function credit_card(field) {
        return 'The ' + field + ' is invalid.';
    },
    decimal: function decimal(field) {
        var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['*'];

        var _ref4 = _slicedToArray(_ref3, 1);

        var decimals = _ref4[0];
        return 'The ' + field + ' must be numeric and may contain ' + (decimals === '*' ? '' : decimals) + ' decimal points.';
    },
    digits: function digits(field, _ref5) {
        var _ref6 = _slicedToArray(_ref5, 1);

        var length = _ref6[0];
        return 'The ' + field + ' must be numeric and exactly contain ' + length + ' digits.';
    },
    dimensions: function dimensions(field, _ref7) {
        var _ref8 = _slicedToArray(_ref7, 2);

        var width = _ref8[0];
        var height = _ref8[1];
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
    max: function max(field, _ref9) {
        var _ref10 = _slicedToArray(_ref9, 1);

        var length = _ref10[0];
        return 'The ' + field + ' may not be greater than ' + length + ' characters.';
    },
    max_value: function max_value(field, _ref11) {
        var _ref12 = _slicedToArray(_ref11, 1);

        var max = _ref12[0];
        return 'The ' + field + ' must be ' + max + ' or less.';
    },
    mimes: function mimes(field) {
        return 'The ' + field + ' must have a valid file type.';
    },
    min: function min(field, _ref13) {
        var _ref14 = _slicedToArray(_ref13, 1);

        var length = _ref14[0];
        return 'The ' + field + ' must be at least ' + length + ' characters.';
    },
    min_value: function min_value(field, _ref15) {
        var _ref16 = _slicedToArray(_ref15, 1);

        var min = _ref16[0];
        return 'The ' + field + ' must be ' + min + ' or more.';
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
    size: function size(field, _ref17) {
        var _ref18 = _slicedToArray(_ref17, 1);

        var _size = _ref18[0];
        return 'The ' + field + ' must be less than ' + _size + ' KB.';
    },
    url: function url(field) {
        return 'The ' + field + ' is not a valid URL.';
    }
};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* harmony default export */ exports["a"] = function (moment) {
    return function (value, _ref) {
        var _ref2 = _slicedToArray(_ref, 2);

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
};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* harmony default export */ exports["a"] = function (moment) {
    return function (value, _ref) {
        var _ref2 = _slicedToArray(_ref, 2);

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
};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* harmony default export */ exports["a"] = function (moment) {
    return function (value, _ref) {
        var _ref2 = _slicedToArray(_ref, 3);

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
};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* harmony default export */ exports["a"] = function (moment) {
  return function (value, _ref) {
    var _ref2 = _slicedToArray(_ref, 1);

    var format = _ref2[0];
    return moment(value, format, true).isValid();
  };
};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__after__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__before__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__date_format__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__date_between__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__messages__ = __webpack_require__(20);


 // eslint-disable-line
 // eslint-disable-line


/* harmony default export */ exports["a"] = {
    make: function make(moment) {
        return {
            date_format: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__date_format__["a" /* default */])(moment),
            after: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__after__["a" /* default */])(moment),
            before: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__before__["a" /* default */])(moment),
            date_between: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__date_between__["a" /* default */])(moment)
        };
    },
    messages: __WEBPACK_IMPORTED_MODULE_4__messages__["a" /* default */],
    installed: false
};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* istanbul ignore next */
/* eslint-disable max-len */
/* harmony default export */ exports["a"] = {
    after: function after(field, _ref) {
        var _ref2 = _slicedToArray(_ref, 1);

        var target = _ref2[0];
        return "The " + field + " must be after " + target + ".";
    },
    before: function before(field, _ref3) {
        var _ref4 = _slicedToArray(_ref3, 1);

        var target = _ref4[0];
        return "The " + field + " must be before " + target + ".";
    },
    date_between: function date_between(field, _ref5) {
        var _ref6 = _slicedToArray(_ref5, 2);

        var min = _ref6[0];
        var max = _ref6[1];
        return "The " + field + " must be between " + min + " and " + max + ".";
    },
    date_format: function date_format(field, _ref7) {
        var _ref8 = _slicedToArray(_ref7, 1);

        var format = _ref8[0];
        return "The " + field + " must be in the format " + format + ".";
    }
};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (value) {
  return (/^[a-zA-Z]*$/.test(value)
  );
};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (value) {
  return (/^[a-zA-Z0-9_-]*$/.test(value)
  );
};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (value) {
  return (/^[a-zA-Z0-9]*$/.test(value)
  );
};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (value) {
  return (/^[a-zA-Z\s]*$/.test(value)
  );
};

/***/ },
/* 25 */
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
/* 26 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* harmony default export */ exports["a"] = function (value, _ref, validatingField) {
    var _ref2 = _slicedToArray(_ref, 1);

    var confirmedField = _ref2[0];

    var field = confirmedField ? document.querySelector("input[name='" + confirmedField + "']") : document.querySelector("input[name='" + validatingField + "_confirmation']");

    return !!(field && String(value) === field.value);
};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_validator_lib_isCreditCard__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_validator_lib_isCreditCard___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_validator_lib_isCreditCard__);


/* harmony default export */ exports["a"] = function (value) {
  return __WEBPACK_IMPORTED_MODULE_0_validator_lib_isCreditCard___default()(String(value));
};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* harmony default export */ exports["a"] = function (value) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['*'];

    var _ref2 = _slicedToArray(_ref, 1);

    var decimals = _ref2[0];

    if (Array.isArray(value)) {
        return false;
    }

    if (value === null || value === undefined || value === '') {
        return true;
    }

    // if is 0.
    if (Number(decimals) === 0) {
        return (/^-?\d*$/.test(value)
        );
    }

    var regexPart = decimals === '*' ? '+' : '{1,' + decimals + '}';
    var regex = new RegExp('^-?\\d*(\\.\\d' + regexPart + ')?$');

    if (!regex.test(value)) {
        return false;
    }

    return !Number.isNaN(parseFloat(value));
};

/***/ },
/* 29 */
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
/* 30 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
/* 31 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_validator_lib_isEmail__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_validator_lib_isEmail___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_validator_lib_isEmail__);


/* harmony default export */ exports["a"] = function (value) {
  return __WEBPACK_IMPORTED_MODULE_0_validator_lib_isEmail___default()(String(value));
};

/***/ },
/* 32 */
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
/* 33 */
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
/* 34 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (value, options) {
  return !!options.filter(function (option) {
    return option == value;
  }).length;
}; // eslint-disable-line

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__alpha__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__alpha_dash__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__alpha_num__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__alpha_spaces__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__between__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__confirmed__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__credit_card__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__decimal__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__digits__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__dimensions__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__email__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ext__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__image__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__in__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ip__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__max__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__max_value__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__mimes__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__min__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__min_value__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__notIn__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__numeric__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__regex__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__required__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__size__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__url__ = __webpack_require__(47);
/* eslint-disable camelcase */



























/* harmony default export */ exports["a"] = {
    alpha_dash: __WEBPACK_IMPORTED_MODULE_1__alpha_dash__["a" /* default */],
    alpha_num: __WEBPACK_IMPORTED_MODULE_2__alpha_num__["a" /* default */],
    alpha_spaces: __WEBPACK_IMPORTED_MODULE_3__alpha_spaces__["a" /* default */],
    alpha: __WEBPACK_IMPORTED_MODULE_0__alpha__["a" /* default */],
    between: __WEBPACK_IMPORTED_MODULE_4__between__["a" /* default */],
    confirmed: __WEBPACK_IMPORTED_MODULE_5__confirmed__["a" /* default */],
    credit_card: __WEBPACK_IMPORTED_MODULE_6__credit_card__["a" /* default */],
    decimal: __WEBPACK_IMPORTED_MODULE_7__decimal__["a" /* default */],
    digits: __WEBPACK_IMPORTED_MODULE_8__digits__["a" /* default */],
    dimensions: __WEBPACK_IMPORTED_MODULE_9__dimensions__["a" /* default */],
    email: __WEBPACK_IMPORTED_MODULE_10__email__["a" /* default */],
    ext: __WEBPACK_IMPORTED_MODULE_11__ext__["a" /* default */],
    image: __WEBPACK_IMPORTED_MODULE_12__image__["a" /* default */],
    in: __WEBPACK_IMPORTED_MODULE_13__in__["a" /* default */],
    ip: __WEBPACK_IMPORTED_MODULE_14__ip__["a" /* default */],
    max: __WEBPACK_IMPORTED_MODULE_15__max__["a" /* default */],
    max_value: __WEBPACK_IMPORTED_MODULE_16__max_value__["a" /* default */],
    mimes: __WEBPACK_IMPORTED_MODULE_17__mimes__["a" /* default */],
    min: __WEBPACK_IMPORTED_MODULE_18__min__["a" /* default */],
    min_value: __WEBPACK_IMPORTED_MODULE_19__min_value__["a" /* default */],
    not_in: __WEBPACK_IMPORTED_MODULE_20__notIn__["a" /* default */],
    numeric: __WEBPACK_IMPORTED_MODULE_21__numeric__["a" /* default */],
    regex: __WEBPACK_IMPORTED_MODULE_22__regex__["a" /* default */],
    required: __WEBPACK_IMPORTED_MODULE_23__required__["a" /* default */],
    size: __WEBPACK_IMPORTED_MODULE_24__size__["a" /* default */],
    url: __WEBPACK_IMPORTED_MODULE_25__url__["a" /* default */]
};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_validator_lib_isIP__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_validator_lib_isIP___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_validator_lib_isIP__);
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();



/* harmony default export */ exports["a"] = function (value) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [4];

  var _ref2 = _slicedToArray(_ref, 1);

  var version = _ref2[0];
  return __WEBPACK_IMPORTED_MODULE_0_validator_lib_isIP___default()(value, version);
};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* harmony default export */ exports["a"] = function (value, _ref) {
    var _ref2 = _slicedToArray(_ref, 1);

    var length = _ref2[0];

    if (value === undefined || value === null) {
        return length >= 0;
    }

    return String(value).length <= length;
};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* harmony default export */ exports["a"] = function (value, _ref) {
    var _ref2 = _slicedToArray(_ref, 1);

    var max = _ref2[0];

    if (Array.isArray(value) || value === null || value === undefined || value === '') {
        return false;
    }

    return Number(value) <= max;
};

/***/ },
/* 39 */
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
/* 40 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* harmony default export */ exports["a"] = function (value, _ref) {
    var _ref2 = _slicedToArray(_ref, 1);

    var length = _ref2[0];

    if (value === undefined || value === null) {
        return false;
    }
    return String(value).length >= length;
};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* harmony default export */ exports["a"] = function (value, _ref) {
    var _ref2 = _slicedToArray(_ref, 1);

    var min = _ref2[0];

    if (Array.isArray(value) || value === null || value === undefined || value === '') {
        return false;
    }

    return Number(value) >= min;
};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (value, options) {
  return !options.filter(function (option) {
    return option == value;
  }).length;
}; // eslint-disable-line

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_validator_lib_isNumeric__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_validator_lib_isNumeric___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_validator_lib_isNumeric__);


/* harmony default export */ exports["a"] = function (value) {
  return __WEBPACK_IMPORTED_MODULE_0_validator_lib_isNumeric___default()(String(value));
};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

/* harmony default export */ exports["a"] = function (value, _ref) {
    var _ref2 = _toArray(_ref);

    var regex = _ref2[0];

    var flags = _ref2.slice(1);

    if (regex instanceof RegExp) {
        return regex.test(value);
    }

    return new RegExp(regex, flags).test(String(value));
};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (value) {
    if (Array.isArray(value)) {
        return !!value.length;
    }

    if (value === undefined || value === null) {
        return false;
    }

    return !!String(value).trim().length;
};

/***/ },
/* 46 */
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
/* 47 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_validator_lib_isURL__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_validator_lib_isURL___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_validator_lib_isURL__);
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();



/* harmony default export */ exports["a"] = function (value) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [undefined];

    var _ref2 = _slicedToArray(_ref, 1);

    var domain = _ref2[0];
    return __WEBPACK_IMPORTED_MODULE_0_validator_lib_isURL___default()(value, { host_whitelist: domain ? [domain] : undefined });
};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = isByteLength;

var _assertString = __webpack_require__(0);

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable prefer-rest-params */
function isByteLength(str, options) {
  (0, _assertString2.default)(str);
  var min = void 0;
  var max = void 0;
  if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
    min = options.min || 0;
    max = options.max;
  } else {
    // backwards compatibility: isByteLength(str, min [, max])
    min = arguments[1];
    max = arguments[2];
  }
  var len = encodeURI(str).split(/%..|./).length - 1;
  return len >= min && (typeof max === 'undefined' || len <= max);
}
module.exports = exports['default'];

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isCreditCard;

var _assertString = __webpack_require__(0);

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable max-len */
var creditCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})|62[0-9]{14}$/;
/* eslint-enable max-len */

function isCreditCard(str) {
  (0, _assertString2.default)(str);
  var sanitized = str.replace(/[^0-9]+/g, '');
  if (!creditCard.test(sanitized)) {
    return false;
  }
  var sum = 0;
  var digit = void 0;
  var tmpNum = void 0;
  var shouldDouble = void 0;
  for (var i = sanitized.length - 1; i >= 0; i--) {
    digit = sanitized.substring(i, i + 1);
    tmpNum = parseInt(digit, 10);
    if (shouldDouble) {
      tmpNum *= 2;
      if (tmpNum >= 10) {
        sum += tmpNum % 10 + 1;
      } else {
        sum += tmpNum;
      }
    } else {
      sum += tmpNum;
    }
    shouldDouble = !shouldDouble;
  }
  return !!(sum % 10 === 0 ? sanitized : false);
}
module.exports = exports['default'];

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isEmail;

var _assertString = __webpack_require__(0);

var _assertString2 = _interopRequireDefault(_assertString);

var _merge = __webpack_require__(2);

var _merge2 = _interopRequireDefault(_merge);

var _isByteLength = __webpack_require__(48);

var _isByteLength2 = _interopRequireDefault(_isByteLength);

var _isFQDN = __webpack_require__(6);

var _isFQDN2 = _interopRequireDefault(_isFQDN);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_email_options = {
  allow_display_name: false,
  allow_utf8_local_part: true,
  require_tld: true
};

/* eslint-disable max-len */
/* eslint-disable no-control-regex */
var displayName = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*<(.+)>$/i;
var emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;
var quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;
var emailUserUtf8Part = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
var quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;
/* eslint-enable max-len */
/* eslint-enable no-control-regex */

function isEmail(str, options) {
  (0, _assertString2.default)(str);
  options = (0, _merge2.default)(options, default_email_options);

  if (options.allow_display_name) {
    var display_email = str.match(displayName);
    if (display_email) {
      str = display_email[1];
    }
  }

  var parts = str.split('@');
  var domain = parts.pop();
  var user = parts.join('@');

  var lower_domain = domain.toLowerCase();
  if (lower_domain === 'gmail.com' || lower_domain === 'googlemail.com') {
    user = user.replace(/\./g, '').toLowerCase();
  }

  if (!(0, _isByteLength2.default)(user, { max: 64 }) || !(0, _isByteLength2.default)(domain, { max: 256 })) {
    return false;
  }

  if (!(0, _isFQDN2.default)(domain, { require_tld: options.require_tld })) {
    return false;
  }

  if (user[0] === '"') {
    user = user.slice(1, user.length - 1);
    return options.allow_utf8_local_part ? quotedEmailUserUtf8.test(user) : quotedEmailUser.test(user);
  }

  var pattern = options.allow_utf8_local_part ? emailUserUtf8Part : emailUserPart;

  var user_parts = user.split('.');
  for (var i = 0; i < user_parts.length; i++) {
    if (!pattern.test(user_parts[i])) {
      return false;
    }
  }

  return true;
}
module.exports = exports['default'];

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isNumeric;

var _assertString = __webpack_require__(0);

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var numeric = /^[-+]?[0-9]+$/;

function isNumeric(str) {
  (0, _assertString2.default)(str);
  return numeric.test(str);
}
module.exports = exports['default'];

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isURL;

var _assertString = __webpack_require__(0);

var _assertString2 = _interopRequireDefault(_assertString);

var _isFQDN = __webpack_require__(6);

var _isFQDN2 = _interopRequireDefault(_isFQDN);

var _isIP = __webpack_require__(7);

var _isIP2 = _interopRequireDefault(_isIP);

var _merge = __webpack_require__(2);

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_url_options = {
  protocols: ['http', 'https', 'ftp'],
  require_tld: true,
  require_protocol: false,
  require_host: true,
  require_valid_protocol: true,
  allow_underscores: false,
  allow_trailing_dot: false,
  allow_protocol_relative_urls: false
};

var wrapped_ipv6 = /^\[([^\]]+)\](?::([0-9]+))?$/;

function isRegExp(obj) {
  return Object.prototype.toString.call(obj) === '[object RegExp]';
}

function checkHost(host, matches) {
  for (var i = 0; i < matches.length; i++) {
    var match = matches[i];
    if (host === match || isRegExp(match) && match.test(host)) {
      return true;
    }
  }
  return false;
}

function isURL(url, options) {
  (0, _assertString2.default)(url);
  if (!url || url.length >= 2083 || /\s/.test(url)) {
    return false;
  }
  if (url.indexOf('mailto:') === 0) {
    return false;
  }
  options = (0, _merge2.default)(options, default_url_options);
  var protocol = void 0,
      auth = void 0,
      host = void 0,
      hostname = void 0,
      port = void 0,
      port_str = void 0,
      split = void 0,
      ipv6 = void 0;

  split = url.split('#');
  url = split.shift();

  split = url.split('?');
  url = split.shift();

  split = url.split('://');
  if (split.length > 1) {
    protocol = split.shift();
    if (options.require_valid_protocol && options.protocols.indexOf(protocol) === -1) {
      return false;
    }
  } else if (options.require_protocol) {
    return false;
  } else if (options.allow_protocol_relative_urls && url.substr(0, 2) === '//') {
    split[0] = url.substr(2);
  }
  url = split.join('://');

  split = url.split('/');
  url = split.shift();

  if (url === '' && !options.require_host) {
    return true;
  }

  split = url.split('@');
  if (split.length > 1) {
    auth = split.shift();
    if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
      return false;
    }
  }
  hostname = split.join('@');

  port_str = ipv6 = null;
  var ipv6_match = hostname.match(wrapped_ipv6);
  if (ipv6_match) {
    host = '';
    ipv6 = ipv6_match[1];
    port_str = ipv6_match[2] || null;
  } else {
    split = hostname.split(':');
    host = split.shift();
    if (split.length) {
      port_str = split.join(':');
    }
  }

  if (port_str !== null) {
    port = parseInt(port_str, 10);
    if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
      return false;
    }
  }

  if (!(0, _isIP2.default)(host) && !(0, _isFQDN2.default)(host, options) && (!ipv6 || !(0, _isIP2.default)(ipv6, 6)) && host !== 'localhost') {
    return false;
  }

  host = host || ipv6;

  if (options.host_whitelist && !checkHost(host, options.host_whitelist)) {
    return false;
  }
  if (options.host_blacklist && checkHost(host, options.host_blacklist)) {
    return false;
  }

  return true;
}
module.exports = exports['default'];

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__validator__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_maps__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mixin__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__directive__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__errorBag__ = __webpack_require__(3);
/* harmony export (binding) */ __webpack_require__.d(exports, "install", function() { return install; });






// eslint-disable-next-line
var install = function install(Vue) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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
    var _ref$fieldsBagName = _ref.fieldsBagName;
    var fieldsBagName = _ref$fieldsBagName === undefined ? 'fields' : _ref$fieldsBagName;

    if (dictionary) {
        __WEBPACK_IMPORTED_MODULE_0__validator__["a" /* default */].updateDictionary(dictionary);
    }

    __WEBPACK_IMPORTED_MODULE_0__validator__["a" /* default */].setLocale(locale);
    __WEBPACK_IMPORTED_MODULE_0__validator__["a" /* default */].setStrictMode(strict);

    var options = {
        locale: locale,
        delay: delay,
        dictionary: dictionary,
        errorBagName: errorBagName,
        fieldsBagName: fieldsBagName
    };

    Object.defineProperties(Vue.prototype, {
        $validator: {
            get: function get() {
                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils_maps__["b" /* register */])(this);
            }
        }
    });

    Vue.mixin(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__mixin__["a" /* default */])(options)); // Install Mixin.
    Vue.directive('validate', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__directive__["a" /* default */])(options)); // Install directive.
};

/* harmony reexport (binding) */ __webpack_require__.d(exports, "Validator", function() { return __WEBPACK_IMPORTED_MODULE_0__validator__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "ErrorBag", function() { return __WEBPACK_IMPORTED_MODULE_4__errorBag__["a"]; });


/***/ }
/******/ ])
});
;