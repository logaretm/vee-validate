/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 66);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function webpackUniversalModuleDefinition(root, factory) {
    if (( false ? 'undefined' : _typeof2(exports)) === 'object' && ( false ? 'undefined' : _typeof2(module)) === 'object') module.exports = factory();else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if ((typeof exports === 'undefined' ? 'undefined' : _typeof2(exports)) === 'object') exports["VeeValidate"] = factory();else root["VeeValidate"] = factory();
})(this, function () {
    return (/******/function (modules) {
            // webpackBootstrap
            /******/ // The module cache
            /******/var installedModules = {};

            /******/ // The require function
            /******/function __webpack_require__(moduleId) {

                /******/ // Check if module is in cache
                /******/if (installedModules[moduleId])
                    /******/return installedModules[moduleId].exports;

                /******/ // Create a new module (and put it into the cache)
                /******/var module = installedModules[moduleId] = {
                    /******/i: moduleId,
                    /******/l: false,
                    /******/exports: {}
                    /******/ };

                /******/ // Execute the module function
                /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

                /******/ // Flag the module as loaded
                /******/module.l = true;

                /******/ // Return the exports of the module
                /******/return module.exports;
                /******/
            }

            /******/ // expose the modules object (__webpack_modules__)
            /******/__webpack_require__.m = modules;

            /******/ // expose the module cache
            /******/__webpack_require__.c = installedModules;

            /******/ // identity function for calling harmory imports with the correct context
            /******/__webpack_require__.i = function (value) {
                return value;
            };

            /******/ // define getter function for harmory exports
            /******/__webpack_require__.d = function (exports, name, getter) {
                /******/Object.defineProperty(exports, name, {
                    /******/configurable: false,
                    /******/enumerable: true,
                    /******/get: getter
                    /******/ });
                /******/
            };

            /******/ // getDefaultExport function for compatibility with non-harmony modules
            /******/__webpack_require__.n = function (module) {
                /******/var getter = module && module.__esModule ?
                /******/function getDefault() {
                    return module['default'];
                } :
                /******/function getModuleExports() {
                    return module;
                };
                /******/__webpack_require__.d(getter, 'a', getter);
                /******/return getter;
                /******/
            };

            /******/ // Object.prototype.hasOwnProperty.call
            /******/__webpack_require__.o = function (object, property) {
                return Object.prototype.hasOwnProperty.call(object, property);
            };

            /******/ // __webpack_public_path__
            /******/__webpack_require__.p = "";

            /******/ // Load entry module and return exports
            /******/return __webpack_require__(__webpack_require__.s = 33);
            /******/
        }(
        /************************************************************************/
        /******/[
        /* 0 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
                return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
            } : function (obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
            };

            var _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
                };
            }();

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

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
                     * Collects errors into groups or for a specific field.
                     *
                     * @param  {string} field The field name.
                     * @return {Array} errors The errors for the specified field.
                     */

                }, {
                    key: "collect",
                    value: function collect(field) {
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

            /* harmony default export */exports["a"] = ErrorBag;

            /***/
        },
        /* 1 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";
            /* harmony import */
            var __WEBPACK_IMPORTED_MODULE_0__validator__ = __webpack_require__(2);

            /* harmony export */__webpack_require__.d(exports, "b", function () {
                return register;
            });
            /* harmony export */__webpack_require__.d(exports, "a", function () {
                return unregister;
            }); /* unused harmony export find */

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

            /***/
        },
        /* 2 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";
            /* harmony import */
            var __WEBPACK_IMPORTED_MODULE_0__rules__ = __webpack_require__(20);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__errorBag__ = __webpack_require__(0);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_2__exceptions_validatorException__ = __webpack_require__(5);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_3__messages__ = __webpack_require__(7);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_4__utils_warn__ = __webpack_require__(32);
            var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
                return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
            } : function (obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
            };

            var _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
                };
            }();

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            var EVENT_NAME = 'veeValidate';
            var DEFAULT_LOCALE = 'en';

            /* eslint-disable no-underscore-dangle */

            var Validator = function () {
                function Validator(validations, $vm) {
                    _classCallCheck(this, Validator);

                    this.locale = DEFAULT_LOCALE;
                    this.$fields = this._normalize(validations);
                    this.errorBag = new __WEBPACK_IMPORTED_MODULE_1__errorBag__["a" /* default */]();
                    this.$vm = $vm;
                }

                /**
                 * Sets the default locale for all validators.
                 *
                 * @param {String} language The locale id.
                 */

                _createClass(Validator, [{
                    key: 'setLocale',

                    /**
                     * Sets the validator current langauge.
                     *
                     * @param {string} language locale or language id.
                     */
                    value: function setLocale(language) {
                        /* istanbul ignore if */
                        if (!__WEBPACK_IMPORTED_MODULE_3__messages__["a" /* default */][language]) {
                            // eslint-disable-next-line
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__utils_warn__["a" /* default */])('You are setting the validator locale to a locale that is not defined in the dicitionary. English messages may still be generated.');
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
                        var _this = this;

                        var prettyName = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

                        if (!this.$fields[name]) {
                            this.$fields[name] = {};
                        }

                        this.$fields[name].validations = [];
                        this.errorBag.remove(name);

                        checks.split('|').forEach(function (rule) {
                            _this.$fields[name].validations.push(_this._normalizeRule(rule));
                        });

                        if (prettyName) {
                            this.$fields[name].name = prettyName;
                        }
                    }

                    /**
                     * Updates the messages dicitionary, overwriting existing values and adding new ones.
                     *
                     * @param  {object} messages The messages object.
                     */

                }, {
                    key: 'updateDictionary',
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
                        var _this2 = this;

                        this.errorBag.clear();
                        /* istanbul ignore if */
                        if (this.$vm && !this.values) {
                            this.$vm.$emit(EVENT_NAME);

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

                        if (!this.$fields[name]) {
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__utils_warn__["a" /* default */])('You are trying to validate a non-existant field. Use "attach()" first.');

                            return false;
                        }

                        var test = true;
                        this.errorBag.remove(name);
                        this.$fields[name].validations.forEach(function (rule) {
                            test = _this3._test(name, value, rule);
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
                    key: '_normalize',
                    value: function _normalize(validations) {
                        var _this4 = this;

                        if (!validations) {
                            return {};
                        }

                        var normalized = {};
                        Object.keys(validations).forEach(function (property) {
                            validations[property].split('|').forEach(function (rule) {
                                if (!normalized[property]) {
                                    normalized[property] = { validations: [] };
                                }

                                normalized[property].validations.push(_this4._normalizeRule(rule));
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
                    key: '_normalizeRule',
                    value: function _normalizeRule(rule) {
                        var params = [];
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
                    key: '_formatErrorMessage',
                    value: function _formatErrorMessage(field, rule) {
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
                    key: '_test',
                    value: function _test(name, value, rule) {
                        var _this5 = this;

                        var validator = __WEBPACK_IMPORTED_MODULE_0__rules__["a" /* default */][rule.name];
                        var valid = validator(value, rule.params);
                        var displayName = this.$fields[name].name || name;

                        if (valid instanceof Promise) {
                            return valid.then(function (values) {
                                var allValid = values.reduce(function (prev, curr) {
                                    return prev && curr.valid;
                                }, true);

                                if (!allValid) {
                                    _this5.errorBag.add(name, _this5._formatErrorMessage(displayName, rule));
                                }

                                return allValid;
                            });
                        }

                        if (!valid) {
                            this.errorBag.add(name, this._formatErrorMessage(displayName, rule));
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
                        if (!__WEBPACK_IMPORTED_MODULE_3__messages__["a" /* default */][language]) {
                            // eslint-disable-next-line
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__utils_warn__["a" /* default */])('You are setting the validator locale to a locale that is not defined in the dicitionary. English messages may still be generated.');
                        }

                        DEFAULT_LOCALE = language;
                    }

                    /**
                     * Updates the messages dicitionary, overwriting existing values and adding new ones.
                     *
                     * @param  {object} messages The messages object.
                    =     */

                }, {
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
                }]);

                return Validator;
            }();

            /* harmony default export */exports["a"] = Validator;

            /***/
        },
        /* 3 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";
            /* harmony import */
            var __WEBPACK_IMPORTED_MODULE_0__utils_debouncer_js__ = __webpack_require__(31);

            var callbackMaps = [];

            var DEFAULT_EVENT_NAME = 'veeValidate';

            var onInput = function onInput(el, _ref, _ref2) {
                var expression = _ref.expression;
                var context = _ref2.context;
                return function () {
                    context.$validator.validate(expression || el.name, el.value);
                };
            };

            var onFileInput = function onFileInput(el, _ref3, _ref4) {
                var modifiers = _ref3.modifiers;
                var expression = _ref3.expression;
                var context = _ref4.context;
                return function () {
                    if (!context.$validator.validate(expression || el.name, el.files) && modifiers.reject) {
                        // eslint-disable-next-line
                        el.value = '';
                    }
                };
            };

            var attachValidatorEvent = function attachValidatorEvent(el, _ref5, _ref6) {
                var expression = _ref5.expression;
                var value = _ref5.value;
                var context = _ref6.context;

                var callback = void 0;
                if (expression) {
                    callback = onInput(el, { expression: expression }, { context: context });
                } else {
                    callback = function callback() {
                        return context.$validator.validate(expression || el.name, value);
                    };
                }

                callbackMaps.push({ vm: context, event: 'validatorEvent', callback: callback, el: el });
                context.$on(DEFAULT_EVENT_NAME, callback);
            };

            /* harmony default export */exports["a"] = function (options) {
                return {
                    bind: function bind(el, binding, _ref7) {
                        var context = _ref7.context;

                        context.$validator.attach(binding.expression || el.name, el.dataset.rules, el.dataset.as);
                        attachValidatorEvent(el, binding, { context: context });

                        if (binding.expression && !binding.modifiers.initial) {
                            // if its bound, validate it. (since update doesn't trigger after bind).
                            context.$validator.validate(binding.expression, binding.value);

                            return;
                        }

                        var handler = el.type === 'file' ? onFileInput(el, binding, { context: context }) : onInput(el, {}, { context: context });

                        var delay = el.dataset.delay || options.delay;
                        handler = delay ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_debouncer_js__["a" /* default */])(handler, delay) : handler;
                        var event = el.type === 'file' ? 'change' : 'input';
                        el.addEventListener(event, handler);
                        callbackMaps.push({ vm: context, event: event, callback: handler, el: el });

                        // confirmed requires another listener on the target field.
                        // TODO: Clean this up.
                        if (el.dataset.rules && ~el.dataset.rules.indexOf('confirmed')) {
                            (function () {
                                var fieldName = el.dataset.rules.split('|').filter(function (r) {
                                    return !!~r.indexOf('confirmed');
                                })[0].split(':')[1];

                                context.$once('validatorReady', function () {
                                    document.querySelector('input[name=\'' + fieldName + '\']').addEventListener('input', handler);
                                });
                            })();
                        }
                    },
                    update: function update(el, _ref8, _ref9) {
                        var expression = _ref8.expression;
                        var value = _ref8.value;
                        var modifiers = _ref8.modifiers;
                        var oldValue = _ref8.oldValue;
                        var context = _ref9.context;

                        if (!expression || value === oldValue) {
                            return;
                        }

                        context.$validator.validate(expression || el.name, value);
                    },
                    unbind: function unbind(el, binding, _ref10) {
                        var context = _ref10.context;

                        var handlers = callbackMaps.filter(function (h) {
                            return h.vm === context && h.el === el;
                        });
                        context.$off(DEFAULT_EVENT_NAME, handlers.filter(function (_ref11) {
                            var event = _ref11.event;
                            return event === 'validatorEvent';
                        })[0]);

                        handlers.filter(function (_ref12) {
                            var event = _ref12.event;
                            return event !== 'validatorEvent';
                        }).forEach(function (h) {
                            el.removeEventListener(h.event, h.callback);
                        });
                    }
                };
            };

            /***/
        },
        /* 4 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";
            /* harmony import */
            var __WEBPACK_IMPORTED_MODULE_0__utils_maps__ = __webpack_require__(1);
            function _defineProperty(obj, key, value) {
                if (key in obj) {
                    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
                } else {
                    obj[key] = value;
                }return obj;
            }

            /* harmony default export */exports["a"] = function (options) {
                return {
                    data: function data() {
                        return _defineProperty({}, options.errorBagName, this.$validator.errorBag);
                    },
                    mounted: function mounted() {
                        this.$emit('validatorReady');
                    },
                    destroyed: function destroyed() {
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_maps__["a" /* unregister */])(this);
                    }
                };
            };

            /***/
        },
        /* 5 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            var _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
                };
            }();

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

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

            /* harmony default export */exports["a"] = _class;

            /***/
        },
        /* 6 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            var _slicedToArray = function () {
                function sliceIterator(arr, i) {
                    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
                        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                            _arr.push(_s.value);if (i && _arr.length === i) break;
                        }
                    } catch (err) {
                        _d = true;_e = err;
                    } finally {
                        try {
                            if (!_n && _i["return"]) _i["return"]();
                        } finally {
                            if (_d) throw _e;
                        }
                    }return _arr;
                }return function (arr, i) {
                    if (Array.isArray(arr)) {
                        return arr;
                    } else if (Symbol.iterator in Object(arr)) {
                        return sliceIterator(arr, i);
                    } else {
                        throw new TypeError("Invalid attempt to destructure non-iterable instance");
                    }
                };
            }();

            /* istanbul ignore next */
            /* eslint-disable max-len */
            /* harmony default export */exports["a"] = {
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
                    var _ref2 = _slicedToArray(_ref, 2);

                    var min = _ref2[0];
                    var max = _ref2[1];
                    return 'The ' + field + ' must be between ' + min + ' and ' + max + '.';
                },
                confirmed: function confirmed(field, _ref3) {
                    var _ref4 = _slicedToArray(_ref3, 1);

                    var confirmedField = _ref4[0];
                    return 'The ' + field + ' does not match the ' + confirmedField + '.';
                },
                decimal: function decimal(field) {
                    var _ref5 = arguments.length <= 1 || arguments[1] === undefined ? ['*'] : arguments[1];

                    var _ref6 = _slicedToArray(_ref5, 1);

                    var decimals = _ref6[0];
                    return 'The ' + field + ' must be numeric and may contain ' + (decimals === '*' ? '' : decimals) + ' decmial points.';
                },
                digits: function digits(field, _ref7) {
                    var _ref8 = _slicedToArray(_ref7, 1);

                    var length = _ref8[0];
                    return 'The ' + field + ' must be numeric and exactly contain ' + length + ' digits.';
                },
                dimensions: function dimensions(field, _ref9) {
                    var _ref10 = _slicedToArray(_ref9, 2);

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
                    var _ref12 = _slicedToArray(_ref11, 1);

                    var length = _ref12[0];
                    return 'The ' + field + ' may not be greater than ' + length + ' characters.';
                },
                mimes: function mimes(field) {
                    return 'The ' + field + ' must have a valid file type.';
                },
                min: function min(field, _ref13) {
                    var _ref14 = _slicedToArray(_ref13, 1);

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
                    var _ref16 = _slicedToArray(_ref15, 1);

                    var _size = _ref16[0];
                    return 'The ' + field + ' must be less than ' + _size + ' KB.';
                },
                url: function url(field) {
                    return 'The ' + field + ' is not a valid URL.';
                }
            };

            /***/
        },
        /* 7 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";
            /* harmony import */
            var __WEBPACK_IMPORTED_MODULE_0__en__ = __webpack_require__(6);

            /* harmony default export */exports["a"] = {
                en: __WEBPACK_IMPORTED_MODULE_0__en__["a" /* default */]
            };

            /***/
        },
        /* 8 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";
            /* harmony default export */
            exports["a"] = function (value) {
                return !Array.isArray(value) && /^[a-zA-Z]*$/.test(value);
            };

            /***/
        },
        /* 9 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";
            /* harmony default export */
            exports["a"] = function (value) {
                return !Array.isArray(value) && /^[a-zA-Z0-9_-]*$/.test(value);
            };

            /***/
        },
        /* 10 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";
            /* harmony default export */
            exports["a"] = function (value) {
                return !Array.isArray(value) && /^[a-zA-Z0-9]*$/.test(value);
            };

            /***/
        },
        /* 11 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            var _slicedToArray = function () {
                function sliceIterator(arr, i) {
                    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
                        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                            _arr.push(_s.value);if (i && _arr.length === i) break;
                        }
                    } catch (err) {
                        _d = true;_e = err;
                    } finally {
                        try {
                            if (!_n && _i["return"]) _i["return"]();
                        } finally {
                            if (_d) throw _e;
                        }
                    }return _arr;
                }return function (arr, i) {
                    if (Array.isArray(arr)) {
                        return arr;
                    } else if (Symbol.iterator in Object(arr)) {
                        return sliceIterator(arr, i);
                    } else {
                        throw new TypeError("Invalid attempt to destructure non-iterable instance");
                    }
                };
            }();

            /* harmony default export */exports["a"] = function (value, _ref) {
                var _ref2 = _slicedToArray(_ref, 2);

                var min = _ref2[0];
                var max = _ref2[1];
                return Number(min) <= value && Number(max) >= value;
            };

            /***/
        },
        /* 12 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            var _slicedToArray = function () {
                function sliceIterator(arr, i) {
                    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
                        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                            _arr.push(_s.value);if (i && _arr.length === i) break;
                        }
                    } catch (err) {
                        _d = true;_e = err;
                    } finally {
                        try {
                            if (!_n && _i["return"]) _i["return"]();
                        } finally {
                            if (_d) throw _e;
                        }
                    }return _arr;
                }return function (arr, i) {
                    if (Array.isArray(arr)) {
                        return arr;
                    } else if (Symbol.iterator in Object(arr)) {
                        return sliceIterator(arr, i);
                    } else {
                        throw new TypeError("Invalid attempt to destructure non-iterable instance");
                    }
                };
            }();

            /* harmony default export */exports["a"] = function (value, _ref) {
                var _ref2 = _slicedToArray(_ref, 1);

                var confirmedField = _ref2[0];

                var field = document.querySelector("input[name='" + confirmedField + "']");

                return !!(field && String(value) === field.value);
            };

            /***/
        },
        /* 13 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            var _slicedToArray = function () {
                function sliceIterator(arr, i) {
                    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
                        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                            _arr.push(_s.value);if (i && _arr.length === i) break;
                        }
                    } catch (err) {
                        _d = true;_e = err;
                    } finally {
                        try {
                            if (!_n && _i["return"]) _i["return"]();
                        } finally {
                            if (_d) throw _e;
                        }
                    }return _arr;
                }return function (arr, i) {
                    if (Array.isArray(arr)) {
                        return arr;
                    } else if (Symbol.iterator in Object(arr)) {
                        return sliceIterator(arr, i);
                    } else {
                        throw new TypeError("Invalid attempt to destructure non-iterable instance");
                    }
                };
            }();

            /* harmony default export */exports["a"] = function (value) {
                var _ref = arguments.length <= 1 || arguments[1] === undefined ? ['*'] : arguments[1];

                var _ref2 = _slicedToArray(_ref, 1);

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
            };

            /***/
        },
        /* 14 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            var _slicedToArray = function () {
                function sliceIterator(arr, i) {
                    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
                        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                            _arr.push(_s.value);if (i && _arr.length === i) break;
                        }
                    } catch (err) {
                        _d = true;_e = err;
                    } finally {
                        try {
                            if (!_n && _i["return"]) _i["return"]();
                        } finally {
                            if (_d) throw _e;
                        }
                    }return _arr;
                }return function (arr, i) {
                    if (Array.isArray(arr)) {
                        return arr;
                    } else if (Symbol.iterator in Object(arr)) {
                        return sliceIterator(arr, i);
                    } else {
                        throw new TypeError("Invalid attempt to destructure non-iterable instance");
                    }
                };
            }();

            /* harmony default export */exports["a"] = function (value, _ref) {
                var _ref2 = _slicedToArray(_ref, 1);

                var length = _ref2[0];

                var strVal = String(value);

                return (/^[0-9]*$/.test(strVal) && strVal.length === Number(length)
                );
            };

            /***/
        },
        /* 15 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            var _slicedToArray = function () {
                function sliceIterator(arr, i) {
                    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
                        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                            _arr.push(_s.value);if (i && _arr.length === i) break;
                        }
                    } catch (err) {
                        _d = true;_e = err;
                    } finally {
                        try {
                            if (!_n && _i["return"]) _i["return"]();
                        } finally {
                            if (_d) throw _e;
                        }
                    }return _arr;
                }return function (arr, i) {
                    if (Array.isArray(arr)) {
                        return arr;
                    } else if (Symbol.iterator in Object(arr)) {
                        return sliceIterator(arr, i);
                    } else {
                        throw new TypeError("Invalid attempt to destructure non-iterable instance");
                    }
                };
            }();

            var validateImage = function validateImage(file, width, height) {
                var URL = window.URL || window.webkitURL;
                return new Promise(function (resolve) {
                    var image = new Image();
                    image.onerror = function () {
                        return resolve({ name: file.name, valid: false });
                    };

                    image.onload = function () {
                        // Validate exact dimensions.
                        var valid = image.width === Number(width) && image.height === Number(height);

                        resolve({
                            name: file.name,
                            valid: valid
                        });
                    };

                    image.src = URL.createObjectURL(file);
                });
            };

            /* harmony default export */exports["a"] = function (files, _ref) {
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

            /***/
        },
        /* 16 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";
            /* harmony default export */
            exports["a"] = function (value) {
                return (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value)
                );
            };

            /***/
        },
        /* 17 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";
            /* harmony default export */
            exports["a"] = function (files, extensions) {
                var regex = new RegExp('.(' + extensions.join('|') + ')$', 'i');
                for (var i = 0; i < files.length; i++) {
                    if (!regex.test(files[i].name)) {
                        return false;
                    }
                }

                return true;
            };

            /***/
        },
        /* 18 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";
            /* harmony default export */
            exports["a"] = function (files) {
                for (var i = 0; i < files.length; i++) {
                    if (!/\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(files[i].name)) {
                        return false;
                    }
                }

                return true;
            };

            /***/
        },
        /* 19 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";
            /* harmony default export */
            exports["a"] = function (value, options) {
                return !!options.filter(function (option) {
                    return option == value;
                }).length;
            }; // eslint-disable-line

            /***/
        },
        /* 20 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";
            /* harmony import */
            var __WEBPACK_IMPORTED_MODULE_0__email__ = __webpack_require__(16);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__in__ = __webpack_require__(19);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_2__required__ = __webpack_require__(28);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_3__min__ = __webpack_require__(24);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_4__max__ = __webpack_require__(22);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_5__notIn__ = __webpack_require__(25);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_6__alpha__ = __webpack_require__(8);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_7__alpha_num__ = __webpack_require__(10);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_8__alpha_dash__ = __webpack_require__(9);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_9__numeric__ = __webpack_require__(26);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_10__regex__ = __webpack_require__(27);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_11__ip__ = __webpack_require__(21);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_12__ext__ = __webpack_require__(17);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_13__mimes__ = __webpack_require__(23);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_14__size__ = __webpack_require__(29);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_15__digits__ = __webpack_require__(14);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_16__image__ = __webpack_require__(18);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_17__dimensions__ = __webpack_require__(15);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_18__between__ = __webpack_require__(11);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_19__confirmed__ = __webpack_require__(12);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_20__url__ = __webpack_require__(30);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_21__decimal__ = __webpack_require__(13);

            // eslint-disable-line
            // eslint-disable-line
            // eslint-disable-line
            // eslint-disable-line
            // eslint-disable-line


            /* harmony default export */exports["a"] = {
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
                url: __WEBPACK_IMPORTED_MODULE_20__url__["a" /* default */],
                decimal: __WEBPACK_IMPORTED_MODULE_21__decimal__["a" /* default */]
            };

            /***/
        },
        /* 21 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";
            // TODO: Maybe add ipv6 flag?
            /* harmony default export */
            exports["a"] = function (value) {
                return (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value)
                );
            };

            /***/
        },
        /* 22 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            var _slicedToArray = function () {
                function sliceIterator(arr, i) {
                    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
                        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                            _arr.push(_s.value);if (i && _arr.length === i) break;
                        }
                    } catch (err) {
                        _d = true;_e = err;
                    } finally {
                        try {
                            if (!_n && _i["return"]) _i["return"]();
                        } finally {
                            if (_d) throw _e;
                        }
                    }return _arr;
                }return function (arr, i) {
                    if (Array.isArray(arr)) {
                        return arr;
                    } else if (Symbol.iterator in Object(arr)) {
                        return sliceIterator(arr, i);
                    } else {
                        throw new TypeError("Invalid attempt to destructure non-iterable instance");
                    }
                };
            }();

            /* harmony default export */exports["a"] = function (value, _ref) {
                var _ref2 = _slicedToArray(_ref, 1);

                var length = _ref2[0];

                if (value === undefined || value === null) {
                    return length >= 0;
                }

                return String(value).length <= length;
            };

            /***/
        },
        /* 23 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";
            /* harmony default export */
            exports["a"] = function (files, mimes) {
                var regex = new RegExp(mimes.join('|').replace('*', '.+') + '$', 'i');
                for (var i = 0; i < files.length; i++) {
                    if (!regex.test(files[i].type)) {
                        return false;
                    }
                }

                return true;
            };

            /***/
        },
        /* 24 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            var _slicedToArray = function () {
                function sliceIterator(arr, i) {
                    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
                        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                            _arr.push(_s.value);if (i && _arr.length === i) break;
                        }
                    } catch (err) {
                        _d = true;_e = err;
                    } finally {
                        try {
                            if (!_n && _i["return"]) _i["return"]();
                        } finally {
                            if (_d) throw _e;
                        }
                    }return _arr;
                }return function (arr, i) {
                    if (Array.isArray(arr)) {
                        return arr;
                    } else if (Symbol.iterator in Object(arr)) {
                        return sliceIterator(arr, i);
                    } else {
                        throw new TypeError("Invalid attempt to destructure non-iterable instance");
                    }
                };
            }();

            /* harmony default export */exports["a"] = function (value, _ref) {
                var _ref2 = _slicedToArray(_ref, 1);

                var length = _ref2[0];

                if (value === undefined || value === null) {
                    return false;
                }

                return String(value).length >= length;
            };

            /***/
        },
        /* 25 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";
            /* harmony default export */
            exports["a"] = function (value, options) {
                return !options.filter(function (option) {
                    return option == value;
                }).length;
            }; // eslint-disable-line

            /***/
        },
        /* 26 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";
            /* harmony default export */
            exports["a"] = function (value) {
                return !Array.isArray(value) && /^[0-9]*$/.test(value);
            };

            /***/
        },
        /* 27 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            function _toArray(arr) {
                return Array.isArray(arr) ? arr : Array.from(arr);
            }

            /* harmony default export */exports["a"] = function (value, _ref) {
                var _ref2 = _toArray(_ref);

                var regex = _ref2[0];

                var flags = _ref2.slice(1);

                return new RegExp(regex, flags).test(String(value));
            };

            /***/
        },
        /* 28 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";
            /* harmony default export */
            exports["a"] = function (value) {
                if (Array.isArray(value)) {
                    return !!value.length;
                }

                if (value === undefined || value === null) {
                    return false;
                }

                return !!String(value).length;
            };

            /***/
        },
        /* 29 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            var _slicedToArray = function () {
                function sliceIterator(arr, i) {
                    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
                        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                            _arr.push(_s.value);if (i && _arr.length === i) break;
                        }
                    } catch (err) {
                        _d = true;_e = err;
                    } finally {
                        try {
                            if (!_n && _i["return"]) _i["return"]();
                        } finally {
                            if (_d) throw _e;
                        }
                    }return _arr;
                }return function (arr, i) {
                    if (Array.isArray(arr)) {
                        return arr;
                    } else if (Symbol.iterator in Object(arr)) {
                        return sliceIterator(arr, i);
                    } else {
                        throw new TypeError("Invalid attempt to destructure non-iterable instance");
                    }
                };
            }();

            /* harmony default export */exports["a"] = function (files, _ref) {
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

            /***/
        },
        /* 30 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";
            /* harmony default export */
            exports["a"] = function (value, params) {
                var isUrl = /^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.\(\)%-]*)*\/?$/.test(value);

                var domain = params && params[0];

                if (domain && isUrl) {
                    return new RegExp('^https?://(([da-z.-]+).)*(' + params[0].replace('.', '\\$&') + ')').test(value);
                }

                return isUrl;
            };

            /***/
        },
        /* 31 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";

            function _toConsumableArray(arr) {
                if (Array.isArray(arr)) {
                    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                        arr2[i] = arr[i];
                    }return arr2;
                } else {
                    return Array.from(arr);
                }
            }

            function _toArray(arr) {
                return Array.isArray(arr) ? arr : Array.from(arr);
            }

            /* harmony default export */exports["a"] = function (func) {
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

            /***/
        },
        /* 32 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";
            /* istanbul ignore next */
            /* harmony default export */
            exports["a"] = function (message) {
                if (!console) {
                    return;
                }

                console.warn("vee-validate: " + message); // eslint-disable-line
            };

            /***/
        },
        /* 33 */
        /***/function (module, exports, __webpack_require__) {

            "use strict";
            /* harmony import */
            var __WEBPACK_IMPORTED_MODULE_0__validator__ = __webpack_require__(2);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__utils_maps__ = __webpack_require__(1);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_2__mixin__ = __webpack_require__(4);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_3__directive__ = __webpack_require__(3);
            /* harmony import */var __WEBPACK_IMPORTED_MODULE_4__errorBag__ = __webpack_require__(0);

            /* harmony export */__webpack_require__.d(exports, "install", function () {
                return install;
            });

            /**
             * Installs the plugin.
             */
            var install = function install(Vue) {
                var _ref = arguments.length <= 1 || arguments[1] === undefined ? {
                    locale: 'en',
                    delay: 0,
                    errorBagName: 'errors',
                    messages: null
                } : arguments[1];

                var locale = _ref.locale;
                var delay = _ref.delay;
                var errorBagName = _ref.errorBagName;
                var messages = _ref.messages;

                if (messages) {
                    __WEBPACK_IMPORTED_MODULE_0__validator__["a" /* default */].updateDictionary(messages);
                }

                __WEBPACK_IMPORTED_MODULE_0__validator__["a" /* default */].setDefaultLocale(locale);

                var options = {
                    locale: locale,
                    delay: delay,
                    messages: messages,
                    errorBagName: errorBagName
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

            /* harmony reexport */if (__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_0__validator__, "a")) __webpack_require__.d(exports, "Validator", function () {
                return __WEBPACK_IMPORTED_MODULE_0__validator__["a"];
            });
            /* harmony reexport */if (__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_4__errorBag__, "a")) __webpack_require__.d(exports, "ErrorBag", function () {
                return __WEBPACK_IMPORTED_MODULE_4__errorBag__["a"];
            });

            /***/
        }
        /******/])
    );
});
;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 1 */
/***/ function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ },
/* 2 */
/***/ function(module, exports) {

module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			configurable: false,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			configurable: false,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function webpackUniversalModuleDefinition(root, factory) {
	if (( false ? 'undefined' : _typeof(exports)) === 'object' && ( false ? 'undefined' : _typeof(module)) === 'object') module.exports = factory();else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') exports["Collection"] = factory();else root["Collection"] = factory();
})(this, function () {
	return (/******/function (modules) {
			// webpackBootstrap
			/******/ // The module cache
			/******/var installedModules = {};

			/******/ // The require function
			/******/function __webpack_require__(moduleId) {

				/******/ // Check if module is in cache
				/******/if (installedModules[moduleId])
					/******/return installedModules[moduleId].exports;

				/******/ // Create a new module (and put it into the cache)
				/******/var module = installedModules[moduleId] = {
					/******/exports: {},
					/******/id: moduleId,
					/******/loaded: false
					/******/ };

				/******/ // Execute the module function
				/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

				/******/ // Flag the module as loaded
				/******/module.loaded = true;

				/******/ // Return the exports of the module
				/******/return module.exports;
				/******/
			}

			/******/ // expose the modules object (__webpack_modules__)
			/******/__webpack_require__.m = modules;

			/******/ // expose the module cache
			/******/__webpack_require__.c = installedModules;

			/******/ // __webpack_public_path__
			/******/__webpack_require__.p = "";

			/******/ // Load entry module and return exports
			/******/return __webpack_require__(0);
			/******/
		}(
		/************************************************************************/
		/******/[
		/* 0 */
		/***/function (module, exports) {

			eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol ? \"symbol\" : typeof obj; };\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n/**\n * The Collection object.\n *\n * @example\n * let collection = new Collection([1, 2, 3]);\n */\n\nvar Collection = function () {\n    /**\n     * The collection constructor.\n     *\n     * @param  {Array} [items=[]] the array to collect.\n     * @return {Collection} A Collection object.\n     */\n\n    function Collection() {\n        var items = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];\n\n        _classCallCheck(this, Collection);\n\n        /**\n         * The internal array.\n         * @type {Array|Object}\n         */\n        this.items = items;\n    }\n\n    /**\n     * Adds an item to the collection.\n     *\n     * @param {*} item the item to be added.\n     * @return {Collection} the collection object.\n     * @example\n     * const collection = new Collection();\n     * collection.add('Arya');\n     * console.log(collection.first()); //outputs 'Arya'\n     */\n\n\n    _createClass(Collection, [{\n        key: 'add',\n        value: function add(item) {\n            this.items.push(item);\n\n            return this;\n        }\n\n        /**\n         * Gets the collected elements in an array.\n         *\n         * @return {Array} the internal array.\n         * @example\n         * const collection = new Collection([1, 2, 3]);\n         * console.log(collection.all()); // [1, 2, 3]\n         */\n\n    }, {\n        key: 'all',\n        value: function all() {\n            return this.items;\n        }\n\n        /**\n         * Gets the average value of the array or a property or a callback return value.\n         * If no property is provided: it will calculate the average value of the array (Numeric array).\n         * If property is a string: it will calculate the average value of that property for all\n         *  objects in the array.\n         * If Property is a callback: the the averaging will use the value returned instead.\n         *\n         * @param  {function|string} [property=null] The property name or the callback function.\n         * defaults to null.\n         * @return {number} The average value.\n         * @example <caption>Averaging elements</caption>\n         * const collection = new Collection([1, 2, 3]);\n         * console.log(collection.average()); // 2\n         * @example <caption>Averaging a property</caption>\n         * const collection = new Collection([\n         *     { name: 'Arya Stark', age: 9 },\n         *     { name: 'Bran Stark', age: 7 },\n         *     { name: 'Jon Snow', age: 14 }\n         * ]);\n         * console.log(collection.average('age')); // 10\n         * @example <caption>Averaging using a callback</caption>\n         * const collection = new Collection([\n         *     { name: 'Arya Stark', age: 9 },\n         *     { name: 'Bran Stark', age: 7 },\n         *     { name: 'Jon Snow', age: 14 }\n         * ]);\n         * console.log(collection.average(i => i.age)); // 10\n         */\n\n    }, {\n        key: 'average',\n        value: function average() {\n            var property = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];\n\n            return this.sum(property) / this.count();\n        }\n\n        /**\n         * Chunks the collection into a new collection with equal length arrays as its items.\n         *\n         * @param  {number} size the size of each chunk.\n         * @return {Collection} the new collection.\n         * @example\n         * const collection = new Collection([1, 2, 3, 4, 5]).chunk(2);\n         * console.log(collection.all()); // [[1, 2], [3, 4], [5]]\n         */\n\n    }, {\n        key: 'chunk',\n        value: function chunk(size) {\n            if (size <= 0) {\n                return new Collection();\n            }\n\n            var items = [];\n\n            for (var i = 0; i < this.count(); i += size) {\n                items.push(this.items.slice(i, i + size));\n            }\n\n            return new Collection(items);\n        }\n\n        /**\n         * Static constructor.\n         * cool if you don't like using the 'new' keyword.\n         *\n         * @param  {Array} collectable the array or the string to wrapped in a collection.\n         * @return {Collection} A collection that wraps the collectable items.\n         * @example\n         * const collection = Collection.collect([1, 2, 3]);\n         * console.log(collection.all()); // [1, 2, 3]\n         */\n\n    }, {\n        key: 'concat',\n\n\n        /**\n         * Concatnates the collection with an array or another collection.\n         *\n         * @param {Array|Collection} collection the array or the collection to be concatenated with.\n         * @return {Collection} concatenated collection.\n         * @example\n         * const collection = new Collection([1, 2, 3]);\n         * const array = [4, 5, 6]; // or another collection.\n         * const newCollection = collection.concat(array);\n         * console.log(newCollection.all()); // [1, 2, 3, 4, 5, 6]\n         */\n        value: function concat(collection) {\n            if (Array.isArray(collection)) {\n                return new Collection(this.items.concat(collection));\n            }\n\n            return new Collection(this.items.concat(collection.all()));\n        }\n\n        /**\n         * Checks if there is at least one occurance of an element using a closure.\n         * @param  {function} closure The closure the be used on each element.\n         * @return {boolean} true if at least one occurance exist, false otherwise.\n         * @example\n         * const collection = new Collection([\n         *     { name: 'John Snow', age: 14 },\n         *     { name: 'Bran Stark', age: 7 },\n         *     { name: 'Arya Stark', age: 9 }\n         * ]);\n         *\n         * collection.contains(stark => stark.name === 'John Snow'); // true\n         * collection.contains(stark => stark.name === 'Eddard Stark'); // false\n         */\n\n    }, {\n        key: 'contains',\n        value: function contains(closure) {\n            return !!this.first(closure);\n        }\n\n        /**\n         * Gets the number of items in the collection.\n         *\n         * @return {number} Number of items in the collection.\n         * @example\n         * const collection = new Collection([1, 2, 3]);\n         * console.log(collection.count()); // 3\n         */\n\n    }, {\n        key: 'count',\n        value: function count() {\n            return this.items.length;\n        }\n\n        /**\n         * Executes a callback for each element in the collection.\n         *\n         * @param  {function} callback the callback to be excuted for each item.\n         * @return {Collection} The collection object.\n         * @example\n         * const collection = new Collection(['this', 'is', 'collectionjs']);\n         * collection.each(t => console.log(t)); // this is collectionjs\n         */\n\n    }, {\n        key: 'each',\n        value: function each(callback) {\n            this.items.forEach(callback);\n\n            return this;\n        }\n\n        /**\n         * Filters the collection using a predicate (callback that returns a boolean).\n         *\n         * @param  {function} callback A function that returns a boolean expression.\n         * @return {Collection} Filtered collection.\n         * @example\n         * const collection = new Collection([\n         *     { name: 'Arya Stark', age: 9 },\n         *     { name: 'Bran Stark', age: 7 },\n         *     { name: 'Jon Snow', age: 14 }\n         * ]).filter(stark => stark.age === 14);\n         * console.log(collection.all()); // [{ name: 'Jon Snow', age: 14 }]\n         */\n\n    }, {\n        key: 'filter',\n        value: function filter(callback) {\n            return new Collection(this.items.filter(callback));\n        }\n\n        /**\n         * Returns the index of an element.\n         *\n         * @param  {*} item The item to be searched.\n         * @return {number} The index of the item. -1 means it wasn't found.\n         * @example\n         * const collection = new Collection(['jon', 'arya', 'bran']);\n         * console.log(collection.find('bran')); // 2\n         * console.log(collection.find('ed')); // -1\n         */\n\n    }, {\n        key: 'find',\n        value: function find(item) {\n            return this.items.indexOf(item);\n        }\n\n        /**\n         * Gets the first element satisfying a critera.\n         *\n         * @param  {function} [callback=null] the predicate (callback) that will be applied on items.\n         * @return {*} the first item to satisfy the critera.\n         * @example <caption>Using a callback</caption>\n         * const first = new Collection([\n         *     { name: 'Bran Stark', age: 7 },\n         *     { name: 'Arya Stark', age: 9 },\n         *     { name: 'Jon Snow', age: 14 }\n         * ]).first(item => item.age > 7);\n         *\n         * console.log(first); // { name: 'Arya Stark', age: 9 }\n         * @example <caption>No Arguments</caption>\n         * const first = new Collection([\n         *     { name: 'Bran Stark', age: 7 },\n         *     { name: 'Arya Stark', age: 9 },\n         *     { name: 'Jon Snow', age: 14 }\n         * ]).first();\n         *\n         * console.log(first); // { name: 'Bran Stark', age: 7 }\n         */\n\n    }, {\n        key: 'first',\n        value: function first() {\n            var callback = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];\n\n            if (!this.count()) {\n                return null;\n            }\n\n            if (callback && typeof callback === 'function') {\n                for (var i = 0; i < this.count(); i++) {\n                    if (callback(this.items[i])) {\n                        return this.items[i];\n                    }\n                }\n\n                return null;\n            }\n\n            return this.items[0];\n        }\n\n        /**\n         * Flattens the collection elements.\n         *\n         * @param  {Boolean} [deep=false] recursively flatten the items (multi-level).\n         * @return {Collection} the flattened collection.\n         * @example <caption>Just one level</caption>\n         * const collection = new Collection([1, [2, [3, [4]], 5]]).flatten();\n         * console.log(collection.all()); // [1, 2, [3, [4]], 5]\n         *\n         * @example <caption>Deep</caption>\n         * const collection = new Collection([1, [2, [3, [4]], 5]]).flatten(true);\n         * console.log(collection.all()); // [1, 2, 3, 4, 5]\n         */\n\n    }, {\n        key: 'flatten',\n        value: function flatten() {\n            var _ref;\n\n            var deep = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];\n\n            var flattened = new Collection((_ref = []).concat.apply(_ref, _toConsumableArray(this.items)));\n\n            if (!deep || !flattened.contains(Array.isArray)) {\n                return flattened;\n            }\n\n            return flattened.flatten(true);\n        }\n\n        /**\n         * Gets an element at a specified index.\n         *\n         * @param  {number} index the index of the item.\n         * @return {*} the item at that index.\n         * @example\n         * const collection = new Collection([1, 2, 3]);\n         * console.log(collection.get(2)); // 3\n         */\n\n    }, {\n        key: 'get',\n        value: function get(index) {\n            return this.items[index];\n        }\n\n        /**\n         * Checks if a collection has a specific item.\n         *\n         * @param  {*}  item The item to be searched.\n         * @return {boolean} true if exists, false otherwise.\n         * @example\n         * const collection = new Collection([1, 2, 3, 4]);\n         *\n         * console.log(collection.has(2)); // true\n         * console.log(collection.has(5)); // false\n         */\n\n    }, {\n        key: 'has',\n        value: function has(item) {\n            return !!~this.find(item);\n        }\n\n        /**\n         * Joins the collection elements into a string.\n         *\n         * @param  {string} [seperator=','] The seperator between each element and the next.\n         * @return {string} The joined string.\n         *\n         * @example\n         * const collection = new Collection(['Wind', 'Rain', 'Fire']);\n         * console.log(collection.join()); // 'Wind,Rain,Fire'\n         * console.log(collection.join(', ')); 'Wind, Rain, Fire'\n         */\n\n    }, {\n        key: 'join',\n        value: function join() {\n            var seperator = arguments.length <= 0 || arguments[0] === undefined ? ',' : arguments[0];\n\n            return this.items.join(seperator);\n        }\n\n        /**\n         * Gets the collection elements keys in a new collection.\n         *\n         * @return {Collection} The keys collection.\n         * @example <caption>Objects</caption>\n         * const keys = new Collection({\n         *     arya: 10,\n         *     john: 20,\n         *     potato: 30\n         * }).keys();\n         * console.log(keys); // ['arya', 'john', 'potato']\n         *\n         * @example <caption>Regular Array</caption>\n         * const keys = new Collection(['arya', 'john', 'potato']).keys();\n         * console.log(keys); // ['0', '1', '2']\n         */\n\n    }, {\n        key: 'keys',\n        value: function keys() {\n            return new Collection(Object.keys(this.items));\n        }\n\n        /**\n         * Gets the last element to satisfy a callback.\n         *\n         * @param  {function} [callback=null] the predicate to be checked on all elements.\n         * @return {*} The last element in the collection that satisfies the predicate.\n         * @example <caption>Using a callback</caption>\n         * const last = new Collection([\n         *     { name: 'Bran Stark', age: 7 },\n         *     { name: 'Arya Stark', age: 9 },\n         *     { name: 'Jon Snow', age: 14 }\n         * ]).last(item => item.age > 7);\n         *\n         * console.log(last); // { name: 'Jon Snow', age: 14 }\n         * @example <caption>No Arguments</caption>\n         * const last = new Collection([\n         *     { name: 'Bran Stark', age: 7 },\n         *     { name: 'Arya Stark', age: 9 },\n         *     { name: 'Jon Snow', age: 14 }\n         * ]).last();\n         *\n         * console.log(last); // { name: 'Jon Snow', age: 14 }\n         */\n\n    }, {\n        key: 'last',\n        value: function last() {\n            var callback = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];\n\n            if (!this.count()) {\n                return null;\n            }\n\n            if (callback && typeof callback === 'function') {\n                return this.filter(callback).last();\n            }\n\n            return this.items[this.count() - 1];\n        }\n\n        /**\n         * Maps each element using a mapping function and collects the mapped items.\n         * @param  {function} callback the mapping function.\n         * @return {Collection} collection containing the mapped items.\n         * @example\n         * const collection = new Collection([\n         *     { name: 'Bran Stark', age: 7 },\n         *     { name: 'Arya Stark', age: 9 },\n         *     { name: 'Jon Snow', age: 14 }\n         * ]).map(stark => stark.name);\n         * console.log(collection.all()); ['Bran Stark', 'Arya Stark', 'Jon Snow']\n         */\n\n    }, {\n        key: 'map',\n        value: function map(callback) {\n            return new Collection(this.items.map(callback));\n        }\n\n        /**\n         * Extracts a property from the objects in the collection.\n         *\n         * @param  {string} property the name of the property to be extracted.\n         * @return {Collection} A collection with the extracted items.\n         * @example\n         * const collection = new Collection([\n         *     { name: 'Bran Stark', age: 7 },\n         *     { name: 'Arya Stark', age: 9 },\n         *     { name: 'Jon Snow', age: 14 }\n         * ]).pluck('name');\n         * console.log(collection.all()); ['Bran Stark', 'Arya Stark', 'Jon Snow']\n         */\n\n    }, {\n        key: 'pluck',\n        value: function pluck(property) {\n            return this.map(function (item) {\n                return item[property];\n            });\n        }\n\n        /**\n         * Adds an element to the collection.\n         *\n         * @param  {*} item the item to be added.\n         * @return {Collection} The collection object.\n         * @example\n         * const collection = new Collection().push('First');\n         * console.log(collection.first()); // \"First\"\n         */\n\n    }, {\n        key: 'push',\n        value: function push(item) {\n            return this.add(item);\n        }\n\n        /**\n         * Reduces the collection to a single value using a reducing function.\n         *\n         * @param  {function} callback the reducing function.\n         * @param  {*} initial  initial value.\n         * @return {*} The reduced results.\n         * @example\n         * const value = new Collection([1, 2, 3]).reduce(\n         *     (previous, current) => previous + current,\n         *      0\n         *  );\n         *  console.log(value); // 6\n         */\n\n    }, {\n        key: 'reduce',\n        value: function reduce(callback, initial) {\n            return this.items.reduce(callback, initial);\n        }\n\n        /**\n         * Removes the elements that do not satisfy the predicate.\n         *\n         * @param  {function} callback the predicate used on each item.\n         * @return {Collection} A collection without the rejected elements.\n         * @example\n         * const collection = new Collection([\n         *     { name: 'Arya Stark', age: 9 },\n         *     { name: 'Bran Stark', age: 7 },\n         *     { name: 'Jon Snow', age: 14 }\n         * ]).reject(stark => stark.age < 14);\n         * console.log(collection.all()); // [{ name: 'Jon Snow', age: 14 }]\n         */\n\n    }, {\n        key: 'reject',\n        value: function reject(callback) {\n            var items = [];\n            this.items.forEach(function (item) {\n                if (!callback(item)) {\n                    items.push(item);\n                }\n            });\n\n            return new Collection(items);\n        }\n\n        /**\n         * Removes an item from the collection.\n         *\n         * @param  {*} item the item to be searched and removed, first occurance will be removed.\n         * @return {boolean} True if the element was removed, false otherwise.\n         * @example\n         * const collection = new Collection(['john', 'arya', 'bran']);\n         * collection.remove('john');\n         * console.log(collection.all()); // ['arya', 'bran']\n         */\n\n    }, {\n        key: 'remove',\n        value: function remove(item) {\n            var index = this.find(item);\n            if (~index) {\n                this.items.splice(index, 1);\n\n                return true;\n            }\n\n            return false;\n        }\n\n        /**\n         * Reverses the collection order.\n         *\n         * @return {Collection} A new collection with the reversed order.\n         * @example\n         * const collection = new Collection(['one', 'two', 'three']).reverse();\n         * console.log(collection.all()); // ['three', 'two', 'one']\n         */\n\n    }, {\n        key: 'reverse',\n        value: function reverse() {\n            return new Collection(this.items.reverse());\n        }\n\n        /**\n         * Skips a specified number of elements.\n         *\n         * @param  {number} count the number of items to be skipped.\n         * @return {Collection} A collection without the skipped items.\n         * @example\n         * const collection = new Collection(['John', 'Arya', 'Bran', 'Sansa']).skip(2);\n         * console.log(collection.all()); // ['Bran', 'Sansa']\n         */\n\n    }, {\n        key: 'skip',\n        value: function skip(count) {\n            return this.slice(count);\n        }\n\n        /**\n         * Slices the collection starting from a specific index and ending at a specified index.\n         *\n         * @param  {number} start The zero-based starting index.\n         * @param  {number} [end=length] The zero-based ending index.\n         * @return {Collection} A collection with the sliced items.\n         * @example <caption>start and end are specified</caption>\n         * const collection = new Collection([0, 1, 2, 3, 4, 5, 6]).slice(2, 4);\n         * console.log(collection.all()); // [2, 3]\n         *\n         * @example <caption>only start is specified</caption>\n         * const collection = new Collection([0, 1, 2, 3, 4, 5, 6]).slice(2);\n         * console.log(collection.all()); // [2, 3, 4, 5, 6]\n         */\n\n    }, {\n        key: 'slice',\n        value: function slice(start) {\n            var end = arguments.length <= 1 || arguments[1] === undefined ? this.items.length : arguments[1];\n\n            return new Collection(this.items.slice(start, end));\n        }\n\n        /**\n         * Sorts the elements of a collection and returns a new sorted collection.\n         * note that it doesn't change the orignal collection and it creates a\n         * shallow copy.\n         *\n         * @param  {function} [compare=undefined] the compare function.\n         * @return {Collection} A new collection with the sorted items.\n         *\n         * @example\n         * const collection = new Collection([5, 3, 4, 1, 2]);\n         * const sorted = collection.sort();\n         * // original collection is intact.\n         * console.log(collection.all()); // [5, 3, 4, 1, 2]\n         * console.log(sorted.all()); // [1, 2, 3, 4, 5]\n         */\n\n    }, {\n        key: 'sort',\n        value: function sort() {\n            var compare = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];\n\n            return new Collection(this.items.slice().sort(compare));\n        }\n\n        /**\n         * Sorts the collection by key value comaprison, given that the items are objects.\n         * It creates a shallow copy and retains the order of the orignal collection.\n         *\n         * @param  {string} property the key or the property to be compared.\n         * @param  {string} [order='asc'] The sorting order.\n         * use 'asc' for ascending or 'desc' for descending, case insensitive.\n         * @return {Collection} A new Collection with the sorted items.\n         *\n         * @example\n         * const collection = new Collection([\n         *     { name: 'Jon Snow', age: 14 },\n         *     { name: 'Arya Stark', age: 9 },\n         *     { name: 'Bran Stark', age: 7 },\n         * ]).sortBy('age');\n         *\n         * console.log(collection.pluck('name').all()); // ['Brand Stark', 'Arya Stark', 'Jon Snow']\n         */\n\n    }, {\n        key: 'sortBy',\n        value: function sortBy(property) {\n            var order = arguments.length <= 1 || arguments[1] === undefined ? 'asc' : arguments[1];\n\n            var isAscending = order.toLowerCase() === 'asc';\n\n            return this.sort(function (a, b) {\n                if (a[property] > b[property]) {\n                    return isAscending ? 1 : -1;\n                }\n\n                if (a[property] < b[property]) {\n                    return isAscending ? -1 : 1;\n                }\n\n                return 0;\n            });\n        }\n\n        /**\n         * {stringifies the collection using JSON.stringify API.\n         *\n         * @return {string} The stringified value.\n         * @example\n         * const collection = new Collection([1, 2, 3]);\n         * console.log(collection.stringify()); // \"[1,2,3]\"\n         */\n\n    }, {\n        key: 'stringify',\n        value: function stringify() {\n            return JSON.stringify(this.items);\n        }\n\n        /**\n         * Sums the values of the array, or the properties, or the result of the callback.\n         *\n         * @param  {undefined|string|function} [property=null] the property to be summed.\n         * @return {*} The sum of values used in the summation.\n         * @example <caption>Summing elements</caption>\n         * const collection = new Collection([1, 2, 3]);\n         * console.log(collection.sum()); // 6\n         *\n         * @example <caption>Summing a property</caption>\n         * const collection = new Collection([\n         *     { name: 'Arya Stark', age: 9 },\n         *     { name: 'Bran Stark', age: 7 },\n         *     { name: 'Jon Snow', age: 14 }\n         * ]);\n         * console.log(collection.sum('age')); // 30\n         *\n         * @example <caption>Summing using a callback</caption>\n         * const collection = new Collection([\n         *     { name: 'Arya Stark', age: 9 },\n         *     { name: 'Bran Stark', age: 7 },\n         *     { name: 'Jon Snow', age: 14 }\n         * ]);\n         * console.log(collection.sum(i => i.age + 1)); // 33\n         */\n\n    }, {\n        key: 'sum',\n        value: function sum() {\n            var property = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];\n\n            if (typeof property === 'string') {\n                return this.reduce(function (previous, current) {\n                    return previous + current[property];\n                }, 0);\n            }\n\n            if (typeof property === 'function') {\n                return this.reduce(function (previous, current) {\n                    return previous + property(current);\n                }, 0);\n            }\n\n            return this.reduce(function (previous, current) {\n                return previous + current;\n            }, 0);\n        }\n\n        /**\n         * Gets a new collection with the number of specified items from the begining or the end.\n         *\n         * @param  {number} count the number of items to take. Takes from end if negative.\n         * @return {Collection} A collection with the taken items.\n         * @example <caption>From the beginning</caption>\n         * const collection = new Collection([1, 2, 3, 4, 5]).take(3);\n         * console.log(collection.all()); // [1, 2, 3]\n         *\n         * @example <caption>From the end</caption>\n         * const collection = new Collection([1, 2, 3, 4, 5]).take(-3);\n         * console.log(collection.all()); // [5, 4 ,3]\n         */\n\n    }, {\n        key: 'take',\n        value: function take(count) {\n            if (!count) {\n                return new Collection([]);\n            }\n\n            if (count < 0) {\n                return new Collection(this.items.reverse()).take(-count);\n            }\n\n            return new Collection(this.items.slice(0, count));\n        }\n\n        /**\n         * Registers a new method on the collection prototype for future use.\n         * The closure gets the collection object passed as the first parameter then\n         * other parameters gets passed after.\n         *\n         * @param  {string} name The name of the macro function.\n         * @param  {function} callback A closure containing the behavior of the macro.\n         * @return {*} returns your callback result.\n         *\n         * @example\n         * Collection.macro('addToMembers', (collection, n) => collection.map(item => item + n));\n         * const col2 = new Collection([1, 2, 3, 4]).addToMembers(3);\n         * console.log(col2.all()); // [4, 5, 6, 7]\n         */\n\n    }, {\n        key: 'unique',\n\n\n        /**\n         * Remove duplicate values from the collection.\n         *\n         * @param {function|string} [callback=null] The predicate that returns a value\n         * which will be checked for uniqueness, or a string that has the name of the property.\n         * @return {Collection} A collection containing ue values.\n         * @example <caption>No Arguments</caption>\n         * const unique = new Collection([2, 1, 2, 3, 3, 4, 5, 1, 2]).unique();\n         * console.log(unique); // [2, 1, 3, 4, 5]\n         * @example <caption>Property Name</caption>\n         * const students = new Collection([\n         * \t\t{ name: 'Rick', grade: 'A'},\n         * \t\t{ name: 'Mick', grade: 'B'},\n         * \t\t{ name: 'Richard', grade: 'A'},\n         * ]);\n         * // Students with unique grades.\n         * students.unique('grade'); // [{ name: 'Rick', grade: 'A'}, { name: 'Mick', grade: 'B'}]\n         * @example <caption>With Callback</caption>\n         * const students = new Collection([\n         * \t\t{ name: 'Rick', grade: 'A'},\n         * \t\t{ name: 'Mick', grade: 'B'},\n         * \t\t{ name: 'Richard', grade: 'A'},\n         * ]);\n         * // Students with unique grades.\n         * students.unique(s => s.grade); // [{ name: 'Rick', grade: 'A'}, { name: 'Mick', grade: 'B'}]\n         */\n        value: function unique() {\n            var _this = this;\n\n            var callback = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];\n\n            if (typeof callback === 'string') {\n                return this.unique(function (item) {\n                    return item[callback];\n                });\n            }\n\n            if (callback) {\n                var _ret = function () {\n                    var mappedCollection = new Collection();\n\n                    return {\n                        v: _this.reduce(function (collection, item) {\n                            var mappedItem = callback(item);\n                            if (!mappedCollection.has(mappedItem)) {\n                                collection.add(item);\n                                mappedCollection.add(mappedItem);\n                            }\n\n                            return collection;\n                        }, new Collection())\n                    };\n                }();\n\n                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === \"object\") return _ret.v;\n            }\n\n            return this.reduce(function (collection, item) {\n                if (!collection.has(item)) {\n                    collection.add(item);\n                }\n\n                return collection;\n            }, new Collection());\n        }\n\n        /**\n         * Gets the values without preserving the keys.\n         *\n         * @return {Collection} A Collection containing the values.\n         * @example\n         * const collection = new Collection({\n         *     1: 2,\n         *     2: 3,\n         *     4: 5\n         * }).values();\n         *\n         * console.log(collection.all()); / /[2, 3, 5]\n         */\n\n    }, {\n        key: 'values',\n        value: function values() {\n            var _this2 = this;\n\n            return this.keys().map(function (key) {\n                return _this2.items[key];\n            });\n        }\n\n        /**\n         * Filters the collection using a callback or equality comparison to a property in each item.\n         *\n         * @param  {function|string} callback The callback to be used to filter the collection.\n         * @param  {*} [value=null] The value to be compared.\n         * @return {Collection} A collection with the filtered items.\n         * @example <caption>Using a property name</caption>\n         * const collection = new Collection([\n         *     { name: 'Arya Stark', age: 9 },\n         *     { name: 'Bran Stark', age: 7 },\n         *     { name: 'Jon Snow', age: 14 }\n         * ]).where('age', 14);\n         * console.log(collection.all()); // [{ name: 'Jon Snow', age: 14 }]\n         *\n         * @example <caption>Using a callback</caption>\n         * const collection = new Collection([\n         *     { name: 'Arya Stark', age: 9 },\n         *     { name: 'Bran Stark', age: 7 },\n         *     { name: 'Jon Snow', age: 14 }\n         * ]).where(stark => stark.age === 14);\n         * console.log(collection.all()); // [{ name: 'Jon Snow', age: 14 }]\n         */\n\n    }, {\n        key: 'where',\n        value: function where(callback) {\n            var value = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];\n\n            if (typeof callback === 'string') {\n                return this.filter(function (item) {\n                    return item[callback] === value;\n                });\n            }\n\n            return this.filter(callback);\n        }\n\n        /**\n         * Pairs each item in the collection with another array item in the same index.\n         *\n         * @param  {Array|Collection} array the array to be paired with.\n         * @return {Collection} A collection with the paired items.\n         * @example\n         * const array = ['a', 'b', 'c']; // or a collection.\n         * const collection = new Collection([1, 2, 3]).zip(array);\n         * console.log(collection.all()); // [[1, 'a'], [2, 'b'], [3, 'c']]\n         */\n\n    }, {\n        key: 'zip',\n        value: function zip(array) {\n            if (array instanceof Collection) {\n                return this.map(function (item, index) {\n                    return [item, array.get(index)];\n                });\n            }\n\n            return this.map(function (item, index) {\n                return [item, array[index]];\n            });\n        }\n    }], [{\n        key: 'collect',\n        value: function collect(collectable) {\n            return new Collection(collectable);\n        }\n    }, {\n        key: 'macro',\n        value: function macro(name, callback) {\n            if (Collection.prototype[name] !== undefined) {\n                throw new Error('Collection.macro(): This macro name is already defined.');\n            }\n\n            Collection.prototype[name] = function collectionMacroWrapper() {\n                var collection = this;\n\n                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {\n                    args[_key] = arguments[_key];\n                }\n\n                return callback.apply(undefined, [collection].concat(args));\n            };\n        }\n    }]);\n\n    return Collection;\n}();\n\nexports.default = Collection;\nmodule.exports = exports['default'];\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/collection.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/collection.js?");

			/***/
		}
		/******/])
	);
});
;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj;};/*!
 * Vue.js v2.0.0-rc.3
 * (c) 2014-2016 Evan You
 * Released under the MIT License.
 */(function(global,factory){( false?'undefined':_typeof(exports))==='object'&&typeof module!=='undefined'?module.exports=factory(): true?!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):global.Vue=factory();})(this,function(){'use strict';/**
   * Convert a value to a string that is actually rendered.
   */function _toString(val){return val==null?'':(typeof val==='undefined'?'undefined':_typeof(val))==='object'?JSON.stringify(val,null,2):String(val);}/**
   * Convert a input value to a number for persistence.
   * If the conversion fails, return original string.
   */function toNumber(val){var n=parseFloat(val,10);return n||n===0?n:val;}/**
   * Make a map and return a function for checking if a key
   * is in that map.
   */function makeMap(str,expectsLowerCase){var map=Object.create(null);var list=str.split(',');for(var i=0;i<list.length;i++){map[list[i]]=true;}return expectsLowerCase?function(val){return map[val.toLowerCase()];}:function(val){return map[val];};}/**
   * Check if a tag is a built-in tag.
   */var isBuiltInTag=makeMap('slot,component',true);/**
   * Remove an item from an array
   */function remove(arr,item){if(arr.length){var index=arr.indexOf(item);if(index>-1){return arr.splice(index,1);}}}/**
   * Check whether the object has the property.
   */var hasOwnProperty=Object.prototype.hasOwnProperty;function hasOwn(obj,key){return hasOwnProperty.call(obj,key);}/**
   * Check if value is primitive
   */function isPrimitive(value){return typeof value==='string'||typeof value==='number';}/**
   * Create a cached version of a pure function.
   */function cached(fn){var cache=Object.create(null);return function cachedFn(str){var hit=cache[str];return hit||(cache[str]=fn(str));};}/**
   * Camelize a hyphen-delmited string.
   */var camelizeRE=/-(\w)/g;var camelize=cached(function(str){return str.replace(camelizeRE,function(_,c){return c?c.toUpperCase():'';});});/**
   * Capitalize a string.
   */var capitalize=cached(function(str){return str.charAt(0).toUpperCase()+str.slice(1);});/**
   * Hyphenate a camelCase string.
   */var hyphenateRE=/([^-])([A-Z])/g;var hyphenate=cached(function(str){return str.replace(hyphenateRE,'$1-$2').replace(hyphenateRE,'$1-$2').toLowerCase();});/**
   * Simple bind, faster than native
   */function bind(fn,ctx){function boundFn(a){var l=arguments.length;return l?l>1?fn.apply(ctx,arguments):fn.call(ctx,a):fn.call(ctx);}// record original fn length
boundFn._length=fn.length;return boundFn;}/**
   * Convert an Array-like object to a real Array.
   */function toArray(list,start){start=start||0;var i=list.length-start;var ret=new Array(i);while(i--){ret[i]=list[i+start];}return ret;}/**
   * Mix properties into target object.
   */function extend(to,_from){for(var _key in _from){to[_key]=_from[_key];}return to;}/**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   */function isObject(obj){return obj!==null&&(typeof obj==='undefined'?'undefined':_typeof(obj))==='object';}/**
   * Strict object type check. Only returns true
   * for plain JavaScript objects.
   */var toString=Object.prototype.toString;var OBJECT_STRING='[object Object]';function isPlainObject(obj){return toString.call(obj)===OBJECT_STRING;}/**
   * Merge an Array of Objects into a single Object.
   */function toObject(arr){var res=arr[0]||{};for(var i=1;i<arr.length;i++){if(arr[i]){extend(res,arr[i]);}}return res;}/**
   * Perform no operation.
   */function noop(){}/**
   * Always return false.
   */var no=function no(){return false;};/**
   * Generate a static keys string from compiler modules.
   */function genStaticKeys(modules){return modules.reduce(function(keys,m){return keys.concat(m.staticKeys||[]);},[]).join(',');}var config={/**
     * Option merge strategies (used in core/util/options)
     */optionMergeStrategies:Object.create(null),/**
     * Whether to suppress warnings.
     */silent:false,/**
     * Whether to enable devtools
     */devtools:"development"!=='production',/**
     * Error handler for watcher errors
     */errorHandler:null,/**
     * Ignore certain custom elements
     */ignoredElements:null,/**
     * Custom user key aliases for v-on
     */keyCodes:Object.create(null),/**
     * Check if a tag is reserved so that it cannot be registered as a
     * component. This is platform-dependent and may be overwritten.
     */isReservedTag:no,/**
     * Check if a tag is an unknown element.
     * Platform-dependent.
     */isUnknownElement:no,/**
     * Get the namespace of an element
     */getTagNamespace:noop,/**
     * Check if an attribute must be bound using property, e.g. value
     * Platform-dependent.
     */mustUseProp:no,/**
     * List of asset types that a component can own.
     */_assetTypes:['component','directive','filter'],/**
     * List of lifecycle hooks.
     */_lifecycleHooks:['beforeCreate','created','beforeMount','mounted','beforeUpdate','updated','beforeDestroy','destroyed','activated','deactivated'],/**
     * Max circular updates allowed in a scheduler flush cycle.
     */_maxUpdateCount:100,/**
     * Server rendering?
     */_isServer:"client"==='server'};/**
   * Check if a string starts with $ or _
   */function isReserved(str){var c=(str+'').charCodeAt(0);return c===0x24||c===0x5F;}/**
   * Define a property.
   */function def(obj,key,val,enumerable){Object.defineProperty(obj,key,{value:val,enumerable:!!enumerable,writable:true,configurable:true});}/**
   * Parse simple path.
   */var bailRE=/[^\w\.\$]/;function parsePath(path){if(bailRE.test(path)){return;}else{var _ret=function(){var segments=path.split('.');return{v:function v(obj){for(var i=0;i<segments.length;i++){if(!obj)return;obj=obj[segments[i]];}return obj;}};}();if((typeof _ret==='undefined'?'undefined':_typeof(_ret))==="object")return _ret.v;}}/* global MutationObserver */// can we use __proto__?
var hasProto='__proto__'in{};// Browser environment sniffing
var inBrowser=typeof window!=='undefined'&&Object.prototype.toString.call(window)!=='[object Object]';// detect devtools
var devtools=inBrowser&&window.__VUE_DEVTOOLS_GLOBAL_HOOK__;// UA sniffing for working around browser-specific quirks
var UA=inBrowser&&window.navigator.userAgent.toLowerCase();var isIos=UA&&/(iphone|ipad|ipod|ios)/i.test(UA);var iosVersionMatch=UA&&isIos&&UA.match(/os ([\d_]+)/);var iosVersion=iosVersionMatch&&iosVersionMatch[1].split('_');// MutationObserver is unreliable in iOS 9.3 UIWebView
// detecting it by checking presence of IndexedDB
// ref #3027
var hasMutationObserverBug=iosVersion&&Number(iosVersion[0])>=9&&Number(iosVersion[1])>=3&&!window.indexedDB;/**
   * Defer a task to execute it asynchronously. Ideally this
   * should be executed as a microtask, so we leverage
   * MutationObserver if it's available, and fallback to
   * setTimeout(0).
   *
   * @param {Function} cb
   * @param {Object} ctx
   */var nextTick=function(){var callbacks=[];var pending=false;var timerFunc=void 0;function nextTickHandler(){pending=false;var copies=callbacks.slice(0);callbacks=[];for(var i=0;i<copies.length;i++){copies[i]();}}/* istanbul ignore else */if(typeof MutationObserver!=='undefined'&&!hasMutationObserverBug){var counter=1;var observer=new MutationObserver(nextTickHandler);var textNode=document.createTextNode(String(counter));observer.observe(textNode,{characterData:true});timerFunc=function timerFunc(){counter=(counter+1)%2;textNode.data=String(counter);};}else{// webpack attempts to inject a shim for setImmediate
// if it is used as a global, so we have to work around that to
// avoid bundling unnecessary code.
var context=inBrowser?window:typeof global!=='undefined'?global:{};timerFunc=context.setImmediate||setTimeout;}return function(cb,ctx){var func=ctx?function(){cb.call(ctx);}:cb;callbacks.push(func);if(pending)return;pending=true;timerFunc(nextTickHandler,0);};}();var _Set=void 0;/* istanbul ignore if */if(typeof Set!=='undefined'&&/native code/.test(Set.toString())){// use native Set when available.
_Set=Set;}else{// a non-standard Set polyfill that only works with primitive keys.
_Set=function(){function Set(){this.set=Object.create(null);}Set.prototype.has=function has(key){return this.set[key]!==undefined;};Set.prototype.add=function add(key){this.set[key]=1;};Set.prototype.clear=function clear(){this.set=Object.create(null);};return Set;}();}var hasProxy=void 0;var proxyHandlers=void 0;var initProxy=void 0;if(true){(function(){var allowedGlobals=makeMap('Infinity,undefined,NaN,isFinite,isNaN,'+'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,'+'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,'+'require'// for Webpack/Browserify
);hasProxy=typeof Proxy!=='undefined'&&Proxy.toString().match(/native code/);proxyHandlers={has:function has(target,key){var has=key in target;var isAllowed=allowedGlobals(key)||key.charAt(0)==='_';if(!has&&!isAllowed){warn('Property or method "'+key+'" is not defined on the instance but '+'referenced during render. Make sure to declare reactive data '+'properties in the data option.',target);}return has||!isAllowed;}};initProxy=function initProxy(vm){if(hasProxy){vm._renderProxy=new Proxy(vm,proxyHandlers);}else{vm._renderProxy=vm;}};})();}var uid$2=0;/**
   * A dep is an observable that can have multiple
   * directives subscribing to it.
   */var Dep=function(){function Dep(){this.id=uid$2++;this.subs=[];}Dep.prototype.addSub=function addSub(sub){this.subs.push(sub);};Dep.prototype.removeSub=function removeSub(sub){remove(this.subs,sub);};Dep.prototype.depend=function depend(){if(Dep.target){Dep.target.addDep(this);}};Dep.prototype.notify=function notify(){// stablize the subscriber list first
var subs=this.subs.slice();for(var i=0,l=subs.length;i<l;i++){subs[i].update();}};return Dep;}();Dep.target=null;var targetStack=[];function pushTarget(_target){if(Dep.target)targetStack.push(Dep.target);Dep.target=_target;}function popTarget(){Dep.target=targetStack.pop();}var queue=[];var has={};var circular={};var waiting=false;var flushing=false;var index=0;/**
   * Reset the scheduler's state.
   */function resetSchedulerState(){queue.length=0;has={};if(true){circular={};}waiting=flushing=false;}/**
   * Flush both queues and run the watchers.
   */function flushSchedulerQueue(){flushing=true;// Sort queue before flush.
// This ensures that:
// 1. Components are updated from parent to child. (because parent is always
//    created before the child)
// 2. A component's user watchers are run before its render watcher (because
//    user watchers are created before the render watcher)
// 3. If a component is destroyed during a parent component's watcher run,
//    its watchers can be skipped.
queue.sort(function(a,b){return a.id-b.id;});// do not cache length because more watchers might be pushed
// as we run existing watchers
for(index=0;index<queue.length;index++){var watcher=queue[index];var id=watcher.id;has[id]=null;watcher.run();// in dev build, check and stop circular updates.
if("development"!=='production'&&has[id]!=null){circular[id]=(circular[id]||0)+1;if(circular[id]>config._maxUpdateCount){warn('You may have an infinite update loop '+(watcher.user?'in watcher with expression "'+watcher.expression+'"':'in a component render function.'),watcher.vm);break;}}}// devtool hook
/* istanbul ignore if */if(devtools&&config.devtools){devtools.emit('flush');}resetSchedulerState();}/**
   * Push a watcher into the watcher queue.
   * Jobs with duplicate IDs will be skipped unless it's
   * pushed when the queue is being flushed.
   */function queueWatcher(watcher){var id=watcher.id;if(has[id]==null){has[id]=true;if(!flushing){queue.push(watcher);}else{// if already flushing, splice the watcher based on its id
// if already past its id, it will be run next immediately.
var i=queue.length-1;while(i>=0&&queue[i].id>watcher.id){i--;}queue.splice(Math.max(i,index)+1,0,watcher);}// queue the flush
if(!waiting){waiting=true;nextTick(flushSchedulerQueue);}}}var uid$1=0;/**
   * A watcher parses an expression, collects dependencies,
   * and fires callback when the expression value changes.
   * This is used for both the $watch() api and directives.
   */var Watcher=function(){function Watcher(vm,expOrFn,cb){var options=arguments.length<=3||arguments[3]===undefined?{}:arguments[3];this.vm=vm;vm._watchers.push(this);// options
this.deep=!!options.deep;this.user=!!options.user;this.lazy=!!options.lazy;this.sync=!!options.sync;this.expression=expOrFn.toString();this.cb=cb;this.id=++uid$1;// uid for batching
this.active=true;this.dirty=this.lazy;// for lazy watchers
this.deps=[];this.newDeps=[];this.depIds=new _Set();this.newDepIds=new _Set();// parse expression for getter
if(typeof expOrFn==='function'){this.getter=expOrFn;}else{this.getter=parsePath(expOrFn);if(!this.getter){this.getter=function(){};"development"!=='production'&&warn('Failed watching path: "'+expOrFn+'" '+'Watcher only accepts simple dot-delimited paths. '+'For full control, use a function instead.',vm);}}this.value=this.lazy?undefined:this.get();}/**
     * Evaluate the getter, and re-collect dependencies.
     */Watcher.prototype.get=function get(){pushTarget(this);var value=this.getter.call(this.vm,this.vm);// "touch" every property so they are all tracked as
// dependencies for deep watching
if(this.deep){traverse(value);}popTarget();this.cleanupDeps();return value;};/**
     * Add a dependency to this directive.
     */Watcher.prototype.addDep=function addDep(dep){var id=dep.id;if(!this.newDepIds.has(id)){this.newDepIds.add(id);this.newDeps.push(dep);if(!this.depIds.has(id)){dep.addSub(this);}}};/**
     * Clean up for dependency collection.
     */Watcher.prototype.cleanupDeps=function cleanupDeps(){var i=this.deps.length;while(i--){var dep=this.deps[i];if(!this.newDepIds.has(dep.id)){dep.removeSub(this);}}var tmp=this.depIds;this.depIds=this.newDepIds;this.newDepIds=tmp;this.newDepIds.clear();tmp=this.deps;this.deps=this.newDeps;this.newDeps=tmp;this.newDeps.length=0;};/**
     * Subscriber interface.
     * Will be called when a dependency changes.
     */Watcher.prototype.update=function update(){/* istanbul ignore else */if(this.lazy){this.dirty=true;}else if(this.sync){this.run();}else{queueWatcher(this);}};/**
     * Scheduler job interface.
     * Will be called by the scheduler.
     */Watcher.prototype.run=function run(){if(this.active){var value=this.get();if(value!==this.value||// Deep watchers and watchers on Object/Arrays should fire even
// when the value is the same, because the value may
// have mutated.
isObject(value)||this.deep){// set new value
var oldValue=this.value;this.value=value;if(this.user){try{this.cb.call(this.vm,value,oldValue);}catch(e){"development"!=='production'&&warn('Error in watcher "'+this.expression+'"',this.vm);/* istanbul ignore else */if(config.errorHandler){config.errorHandler.call(null,e,this.vm);}else{throw e;}}}else{this.cb.call(this.vm,value,oldValue);}}}};/**
     * Evaluate the value of the watcher.
     * This only gets called for lazy watchers.
     */Watcher.prototype.evaluate=function evaluate(){this.value=this.get();this.dirty=false;};/**
     * Depend on all deps collected by this watcher.
     */Watcher.prototype.depend=function depend(){var i=this.deps.length;while(i--){this.deps[i].depend();}};/**
     * Remove self from all dependencies' subcriber list.
     */Watcher.prototype.teardown=function teardown(){if(this.active){// remove self from vm's watcher list
// this is a somewhat expensive operation so we skip it
// if the vm is being destroyed or is performing a v-for
// re-render (the watcher list is then filtered by v-for).
if(!this.vm._isBeingDestroyed&&!this.vm._vForRemoving){remove(this.vm._watchers,this);}var i=this.deps.length;while(i--){this.deps[i].removeSub(this);}this.active=false;}};return Watcher;}();var seenObjects=new _Set();function traverse(val,seen){var i=void 0,keys=void 0;if(!seen){seen=seenObjects;seen.clear();}var isA=Array.isArray(val);var isO=isObject(val);if((isA||isO)&&Object.isExtensible(val)){if(val.__ob__){var depId=val.__ob__.dep.id;if(seen.has(depId)){return;}else{seen.add(depId);}}if(isA){i=val.length;while(i--){traverse(val[i],seen);}}else if(isO){keys=Object.keys(val);i=keys.length;while(i--){traverse(val[keys[i]],seen);}}}}var arrayProto=Array.prototype;var arrayMethods=Object.create(arrayProto)/**
   * Intercept mutating methods and emit events
   */;['push','pop','shift','unshift','splice','sort','reverse'].forEach(function(method){// cache original method
var original=arrayProto[method];def(arrayMethods,method,function mutator(){// avoid leaking arguments:
// http://jsperf.com/closure-with-arguments
var i=arguments.length;var args=new Array(i);while(i--){args[i]=arguments[i];}var result=original.apply(this,args);var ob=this.__ob__;var inserted=void 0;switch(method){case'push':inserted=args;break;case'unshift':inserted=args;break;case'splice':inserted=args.slice(2);break;}if(inserted)ob.observeArray(inserted);// notify change
ob.dep.notify();return result;});});var arrayKeys=Object.getOwnPropertyNames(arrayMethods);/**
   * By default, when a reactive property is set, the new value is
   * also converted to become reactive. However when passing down props,
   * we don't want to force conversion because the value may be a nested value
   * under a frozen data structure. Converting it would defeat the optimization.
   */var observerState={shouldConvert:true,isSettingProps:false};/**
   * Observer class that are attached to each observed
   * object. Once attached, the observer converts target
   * object's property keys into getter/setters that
   * collect dependencies and dispatches updates.
   */var Observer=function(){// number of vms that has this object as root $data
function Observer(value){this.value=value;this.dep=new Dep();this.vmCount=0;def(value,'__ob__',this);if(Array.isArray(value)){var augment=hasProto?protoAugment:copyAugment;augment(value,arrayMethods,arrayKeys);this.observeArray(value);}else{this.walk(value);}}/**
     * Walk through each property and convert them into
     * getter/setters. This method should only be called when
     * value type is Object.
     */Observer.prototype.walk=function walk(obj){var val=this.value;for(var key in obj){defineReactive(val,key,obj[key]);}};/**
     * Observe a list of Array items.
     */Observer.prototype.observeArray=function observeArray(items){for(var i=0,l=items.length;i<l;i++){observe(items[i]);}};return Observer;}();// helpers
/**
   * Augment an target Object or Array by intercepting
   * the prototype chain using __proto__
   */function protoAugment(target,src){/* eslint-disable no-proto */target.__proto__=src;/* eslint-enable no-proto */}/**
   * Augment an target Object or Array by defining
   * hidden properties.
   *
   * istanbul ignore next
   */function copyAugment(target,src,keys){for(var i=0,l=keys.length;i<l;i++){var key=keys[i];def(target,key,src[key]);}}/**
   * Attempt to create an observer instance for a value,
   * returns the new observer if successfully observed,
   * or the existing observer if the value already has one.
   */function observe(value){if(!isObject(value)){return;}var ob=void 0;if(hasOwn(value,'__ob__')&&value.__ob__ instanceof Observer){ob=value.__ob__;}else if(observerState.shouldConvert&&!config._isServer&&(Array.isArray(value)||isPlainObject(value))&&Object.isExtensible(value)&&!value._isVue){ob=new Observer(value);}return ob;}/**
   * Define a reactive property on an Object.
   */function defineReactive(obj,key,val,customSetter){var dep=new Dep();var property=Object.getOwnPropertyDescriptor(obj,key);if(property&&property.configurable===false){return;}// cater for pre-defined getter/setters
var getter=property&&property.get;var setter=property&&property.set;var childOb=observe(val);Object.defineProperty(obj,key,{enumerable:true,configurable:true,get:function reactiveGetter(){var value=getter?getter.call(obj):val;if(Dep.target){dep.depend();if(childOb){childOb.dep.depend();}if(Array.isArray(value)){for(var e,i=0,l=value.length;i<l;i++){e=value[i];e&&e.__ob__&&e.__ob__.dep.depend();}}}return value;},set:function reactiveSetter(newVal){var value=getter?getter.call(obj):val;if(newVal===value){return;}if("development"!=='production'&&customSetter){customSetter();}if(setter){setter.call(obj,newVal);}else{val=newVal;}childOb=observe(newVal);dep.notify();}});}/**
   * Set a property on an object. Adds the new property and
   * triggers change notification if the property doesn't
   * already exist.
   */function set(obj,key,val){if(Array.isArray(obj)){obj.splice(key,1,val);return val;}if(hasOwn(obj,key)){obj[key]=val;return;}var ob=obj.__ob__;if(obj._isVue||ob&&ob.vmCount){"development"!=='production'&&warn('Avoid adding reactive properties to a Vue instance or its root $data '+'at runtime - delcare it upfront in the data option.');return;}if(!ob){obj[key]=val;return;}defineReactive(ob.value,key,val);ob.dep.notify();return val;}/**
   * Delete a property and trigger change if necessary.
   */function del(obj,key){var ob=obj.__ob__;if(obj._isVue||ob&&ob.vmCount){"development"!=='production'&&warn('Avoid deleting properties on a Vue instance or its root $data '+'- just set it to null.');return;}if(!hasOwn(obj,key)){return;}delete obj[key];if(!ob){return;}ob.dep.notify();}function initState(vm){vm._watchers=[];initProps(vm);initData(vm);initComputed(vm);initMethods(vm);initWatch(vm);}function initProps(vm){var props=vm.$options.props;var propsData=vm.$options.propsData;if(props){var keys=vm.$options._propKeys=Object.keys(props);var isRoot=!vm.$parent;// root instance props should be converted
observerState.shouldConvert=isRoot;var _loop=function _loop(i){var key=keys[i];/* istanbul ignore else */if(true){defineReactive(vm,key,validateProp(key,props,propsData,vm),function(){if(vm.$parent&&!observerState.isSettingProps){warn('Avoid mutating a prop directly since the value will be '+'overwritten whenever the parent component re-renders. '+'Instead, use a data or computed property based on the prop\'s '+('value. Prop being mutated: "'+key+'"'),vm);}});}else{}};for(var i=0;i<keys.length;i++){_loop(i);}observerState.shouldConvert=true;}}function initData(vm){var data=vm.$options.data;data=vm._data=typeof data==='function'?data.call(vm):data||{};if(!isPlainObject(data)){data={};"development"!=='production'&&warn('data functions should return an object.',vm);}// proxy data on instance
var keys=Object.keys(data);var props=vm.$options.props;var i=keys.length;while(i--){if(props&&hasOwn(props,keys[i])){"development"!=='production'&&warn('The data property "'+keys[i]+'" is already declared as a prop. '+'Use prop default value instead.',vm);}else{proxy(vm,keys[i]);}}// observe data
observe(data);data.__ob__&&data.__ob__.vmCount++;}var computedSharedDefinition={enumerable:true,configurable:true,get:noop,set:noop};function initComputed(vm){var computed=vm.$options.computed;if(computed){for(var _key in computed){var userDef=computed[_key];if(typeof userDef==='function'){computedSharedDefinition.get=makeComputedGetter(userDef,vm);computedSharedDefinition.set=noop;}else{computedSharedDefinition.get=userDef.get?userDef.cache!==false?makeComputedGetter(userDef.get,vm):bind(userDef.get,vm):noop;computedSharedDefinition.set=userDef.set?bind(userDef.set,vm):noop;}Object.defineProperty(vm,_key,computedSharedDefinition);}}}function makeComputedGetter(getter,owner){var watcher=new Watcher(owner,getter,noop,{lazy:true});return function computedGetter(){if(watcher.dirty){watcher.evaluate();}if(Dep.target){watcher.depend();}return watcher.value;};}function initMethods(vm){var methods=vm.$options.methods;if(methods){for(var _key2 in methods){vm[_key2]=bind(methods[_key2],vm);}}}function initWatch(vm){var watch=vm.$options.watch;if(watch){for(var _key3 in watch){var handler=watch[_key3];if(Array.isArray(handler)){for(var i=0;i<handler.length;i++){createWatcher(vm,_key3,handler[i]);}}else{createWatcher(vm,_key3,handler);}}}}function createWatcher(vm,key,handler){var options=void 0;if(isPlainObject(handler)){options=handler;handler=handler.handler;}if(typeof handler==='string'){handler=vm[handler];}vm.$watch(key,handler,options);}function stateMixin(Vue){// flow somehow has problems with directly declared definition object
// when using Object.defineProperty, so we have to procedurally build up
// the object here.
var dataDef={};dataDef.get=function(){return this._data;};if(true){dataDef.set=function(newData){warn('Avoid replacing instance root $data. '+'Use nested data properties instead.',this);};}Object.defineProperty(Vue.prototype,'$data',dataDef);Vue.prototype.$set=set;Vue.prototype.$delete=del;Vue.prototype.$watch=function(expOrFn,cb,options){var vm=this;options=options||{};options.user=true;var watcher=new Watcher(vm,expOrFn,cb,options);if(options.immediate){cb.call(vm,watcher.value);}return function unwatchFn(){watcher.teardown();};};}function proxy(vm,key){if(!isReserved(key)){Object.defineProperty(vm,key,{configurable:true,enumerable:true,get:function proxyGetter(){return vm._data[key];},set:function proxySetter(val){vm._data[key]=val;}});}}var VNode=// hoisted static node
// compoennt placeholder node
// rendered in this component's scope
function VNode(tag,data,children,text,elm,ns,context,componentOptions){this.tag=tag;this.data=data;this.children=children;this.text=text;this.elm=elm;this.ns=ns;this.context=context;this.key=data&&data.key;this.componentOptions=componentOptions;this.child=undefined;this.parent=undefined;this.raw=false;this.isStatic=false;this.isRootInsert=true;this.isComment=false;// apply construct hook.
// this is applied during render, before patch happens.
// unlike other hooks, this is applied on both client and server.
var constructHook=data&&data.hook&&data.hook.construct;if(constructHook){constructHook(this);}}// necessary for enter transition check
// contains raw HTML
// component instance
;var emptyVNode=function emptyVNode(){var node=new VNode();node.text='';node.isComment=true;return node;};function normalizeChildren(children,ns){if(isPrimitive(children)){return[createTextVNode(children)];}if(Array.isArray(children)){var res=[];for(var i=0,l=children.length;i<l;i++){var c=children[i];var last=res[res.length-1];//  nested
if(Array.isArray(c)){res.push.apply(res,normalizeChildren(c,ns));}else if(isPrimitive(c)){if(last&&last.text){last.text+=String(c);}else if(c!==''){// convert primitive to vnode
res.push(createTextVNode(c));}}else if(c instanceof VNode){if(c.text&&last&&last.text){last.text+=c.text;}else{// inherit parent namespace
if(ns){applyNS(c,ns);}res.push(c);}}}return res;}}function createTextVNode(val){return new VNode(undefined,undefined,undefined,String(val));}function applyNS(vnode,ns){if(vnode.tag&&!vnode.ns){vnode.ns=ns;if(vnode.children){for(var i=0,l=vnode.children.length;i<l;i++){applyNS(vnode.children[i],ns);}}}}function getFirstComponentChild(children){return children&&children.filter(function(c){return c&&c.componentOptions;})[0];}function mergeVNodeHook(def,key,hook){var oldHook=def[key];if(oldHook){def[key]=function(){oldHook.apply(this,arguments);hook.apply(this,arguments);};}else{def[key]=hook;}}function updateListeners(on,oldOn,add,remove){var name=void 0,cur=void 0,old=void 0,fn=void 0,event=void 0,capture=void 0;for(name in on){cur=on[name];old=oldOn[name];if(!cur){"development"!=='production'&&warn('Handler for event "'+name+'" is undefined.');}else if(!old){capture=name.charAt(0)==='!';event=capture?name.slice(1):name;if(Array.isArray(cur)){add(event,cur.invoker=arrInvoker(cur),capture);}else{fn=cur;cur=on[name]={};cur.fn=fn;add(event,cur.invoker=fnInvoker(cur),capture);}}else if(Array.isArray(old)){old.length=cur.length;for(var i=0;i<old.length;i++){old[i]=cur[i];}on[name]=old;}else{old.fn=cur;on[name]=old;}}for(name in oldOn){if(!on[name]){event=name.charAt(0)==='!'?name.slice(1):name;remove(event,oldOn[name].invoker);}}}function arrInvoker(arr){return function(ev){var single=arguments.length===1;for(var i=0;i<arr.length;i++){single?arr[i](ev):arr[i].apply(null,arguments);}};}function fnInvoker(o){return function(ev){var single=arguments.length===1;single?o.fn(ev):o.fn.apply(null,arguments);};}var activeInstance=null;function initLifecycle(vm){var options=vm.$options;// locate first non-abstract parent
var parent=options.parent;if(parent&&!options.abstract){while(parent.$options.abstract&&parent.$parent){parent=parent.$parent;}parent.$children.push(vm);}vm.$parent=parent;vm.$root=parent?parent.$root:vm;vm.$children=[];vm.$refs={};vm._watcher=null;vm._inactive=false;vm._isMounted=false;vm._isDestroyed=false;vm._isBeingDestroyed=false;}function lifecycleMixin(Vue){Vue.prototype._mount=function(el,hydrating){var vm=this;vm.$el=el;if(!vm.$options.render){vm.$options.render=emptyVNode;if(true){/* istanbul ignore if */if(vm.$options.template){warn('You are using the runtime-only build of Vue where the template '+'option is not available. Either pre-compile the templates into '+'render functions, or use the compiler-included build.',vm);}else{warn('Failed to mount component: template or render function not defined.',vm);}}}callHook(vm,'beforeMount');vm._watcher=new Watcher(vm,function(){vm._update(vm._render(),hydrating);},noop);hydrating=false;// root instance, call mounted on self
// mounted is called for child components in its inserted hook
if(vm.$root===vm){vm._isMounted=true;callHook(vm,'mounted');}return vm;};Vue.prototype._update=function(vnode,hydrating){var vm=this;if(vm._isMounted){callHook(vm,'beforeUpdate');}var prevEl=vm.$el;var prevActiveInstance=activeInstance;activeInstance=vm;var prevVnode=vm._vnode;vm._vnode=vnode;if(!prevVnode){// Vue.prototype.__patch__ is injected in entry points
// based on the rendering backend used.
vm.$el=vm.__patch__(vm.$el,vnode,hydrating);}else{vm.$el=vm.__patch__(prevVnode,vnode);}activeInstance=prevActiveInstance;// update __vue__ reference
if(prevEl){prevEl.__vue__=null;}if(vm.$el){vm.$el.__vue__=vm;}// if parent is an HOC, update its $el as well
if(vm.$vnode&&vm.$parent&&vm.$vnode===vm.$parent._vnode){vm.$parent.$el=vm.$el;}if(vm._isMounted){callHook(vm,'updated');}};Vue.prototype._updateFromParent=function(propsData,listeners,parentVnode,renderChildren){var vm=this;var hasChildren=!!(vm.$options._renderChildren||renderChildren);vm.$options._parentVnode=parentVnode;vm.$options._renderChildren=renderChildren;// update props
if(propsData&&vm.$options.props){observerState.shouldConvert=false;if(true){observerState.isSettingProps=true;}var propKeys=vm.$options._propKeys||[];for(var i=0;i<propKeys.length;i++){var key=propKeys[i];vm[key]=validateProp(key,vm.$options.props,propsData,vm);}observerState.shouldConvert=true;if(true){observerState.isSettingProps=false;}}// update listeners
if(listeners){var oldListeners=vm.$options._parentListeners;vm.$options._parentListeners=listeners;vm._updateListeners(listeners,oldListeners);}// resolve slots + force update if has children
if(hasChildren){vm.$slots=resolveSlots(renderChildren);vm.$forceUpdate();}};Vue.prototype.$forceUpdate=function(){var vm=this;if(vm._watcher){vm._watcher.update();}};Vue.prototype.$destroy=function(){var vm=this;if(vm._isBeingDestroyed){return;}callHook(vm,'beforeDestroy');vm._isBeingDestroyed=true;// remove self from parent
var parent=vm.$parent;if(parent&&!parent._isBeingDestroyed&&!vm.$options.abstract){remove(parent.$children,vm);}// teardown watchers
if(vm._watcher){vm._watcher.teardown();}var i=vm._watchers.length;while(i--){vm._watchers[i].teardown();}// remove reference from data ob
// frozen object may not have observer.
if(vm._data.__ob__){vm._data.__ob__.vmCount--;}// call the last hook...
vm._isDestroyed=true;callHook(vm,'destroyed');// turn off all instance listeners.
vm.$off();// remove __vue__ reference
if(vm.$el){vm.$el.__vue__=null;}};}function callHook(vm,hook){var handlers=vm.$options[hook];if(handlers){for(var i=0,j=handlers.length;i<j;i++){handlers[i].call(vm);}}vm.$emit('hook:'+hook);}var hooks={init:init,prepatch:prepatch,insert:insert,destroy:destroy};var hooksToMerge=Object.keys(hooks);function createComponent(Ctor,data,context,children,tag){if(!Ctor){return;}if(isObject(Ctor)){Ctor=Vue.extend(Ctor);}if(typeof Ctor!=='function'){if(true){warn('Invalid Component definition: '+Ctor,context);}return;}// async component
if(!Ctor.cid){if(Ctor.resolved){Ctor=Ctor.resolved;}else{Ctor=resolveAsyncComponent(Ctor,function(){// it's ok to queue this on every render because
// $forceUpdate is buffered by the scheduler.
context.$forceUpdate();});if(!Ctor){// return nothing if this is indeed an async component
// wait for the callback to trigger parent update.
return;}}}data=data||{};// extract props
var propsData=extractProps(data,Ctor);// functional component
if(Ctor.options.functional){return createFunctionalComponent(Ctor,propsData,data,context,children);}// extract listeners, since these needs to be treated as
// child component listeners instead of DOM listeners
var listeners=data.on;// replace with listeners with .native modifier
data.on=data.nativeOn;if(Ctor.options.abstract){// abstract components do not keep anything
// other than props & listeners
data={};}// merge component management hooks onto the placeholder node
mergeHooks(data);// return a placeholder vnode
var name=Ctor.options.name||tag;var vnode=new VNode('vue-component-'+Ctor.cid+(name?'-'+name:''),data,undefined,undefined,undefined,undefined,context,{Ctor:Ctor,propsData:propsData,listeners:listeners,tag:tag,children:children});return vnode;}function createFunctionalComponent(Ctor,propsData,data,context,children){var props={};var propOptions=Ctor.options.props;if(propOptions){for(var key in propOptions){props[key]=validateProp(key,propOptions,propsData);}}return Ctor.options.render.call(null,context.$createElement,{props:props,data:data,parent:context,children:normalizeChildren(children),slots:function slots(){return resolveSlots(children);}});}function createComponentInstanceForVnode(vnode,// we know it's MountedComponentVNode but flow doesn't
parent// activeInstance in lifecycle state
){var vnodeComponentOptions=vnode.componentOptions;var options={_isComponent:true,parent:parent,propsData:vnodeComponentOptions.propsData,_componentTag:vnodeComponentOptions.tag,_parentVnode:vnode,_parentListeners:vnodeComponentOptions.listeners,_renderChildren:vnodeComponentOptions.children};// check inline-template render functions
var inlineTemplate=vnode.data.inlineTemplate;if(inlineTemplate){options.render=inlineTemplate.render;options.staticRenderFns=inlineTemplate.staticRenderFns;}return new vnodeComponentOptions.Ctor(options);}function init(vnode,hydrating){if(!vnode.child||vnode.child._isDestroyed){var child=vnode.child=createComponentInstanceForVnode(vnode,activeInstance);child.$mount(hydrating?vnode.elm:undefined,hydrating);}}function prepatch(oldVnode,vnode){var options=vnode.componentOptions;var child=vnode.child=oldVnode.child;child._updateFromParent(options.propsData,// updated props
options.listeners,// updated listeners
vnode,// new parent vnode
options.children// new children
);}function insert(vnode){if(!vnode.child._isMounted){vnode.child._isMounted=true;callHook(vnode.child,'mounted');}if(vnode.data.keepAlive){vnode.child._inactive=false;callHook(vnode.child,'activated');}}function destroy(vnode){if(!vnode.child._isDestroyed){if(!vnode.data.keepAlive){vnode.child.$destroy();}else{vnode.child._inactive=true;callHook(vnode.child,'deactivated');}}}function resolveAsyncComponent(factory,cb){if(factory.requested){// pool callbacks
factory.pendingCallbacks.push(cb);}else{var _ret=function(){factory.requested=true;var cbs=factory.pendingCallbacks=[cb];var sync=true;factory(// resolve
function(res){if(isObject(res)){res=Vue.extend(res);}// cache resolved
factory.resolved=res;// invoke callbacks only if this is not a synchronous resolve
// (async resolves are shimmed as synchronous during SSR)
if(!sync){for(var i=0,l=cbs.length;i<l;i++){cbs[i](res);}}},// reject
function(reason){"development"!=='production'&&warn('Failed to resolve async component: '+factory+(reason?'\nReason: '+reason:''));});sync=false;// return in case resolved synchronously
return{v:factory.resolved};}();if((typeof _ret==='undefined'?'undefined':_typeof(_ret))==="object")return _ret.v;}}function extractProps(data,Ctor){// we are only extrating raw values here.
// validation and default values are handled in the child
// component itself.
var propOptions=Ctor.options.props;if(!propOptions){return;}var res={};var attrs=data.attrs;var props=data.props;var domProps=data.domProps;if(attrs||props||domProps){for(var key in propOptions){var altKey=hyphenate(key);checkProp(res,props,key,altKey,true)||checkProp(res,attrs,key,altKey)||checkProp(res,domProps,key,altKey);}}return res;}function checkProp(res,hash,key,altKey,preserve){if(hash){if(hasOwn(hash,key)){res[key]=hash[key];if(!preserve){delete hash[key];}return true;}else if(hasOwn(hash,altKey)){res[key]=hash[altKey];if(!preserve){delete hash[altKey];}return true;}}return false;}function mergeHooks(data){if(!data.hook){data.hook={};}for(var i=0;i<hooksToMerge.length;i++){var key=hooksToMerge[i];var fromParent=data.hook[key];var ours=hooks[key];data.hook[key]=fromParent?mergeHook$1(ours,fromParent):ours;}}function mergeHook$1(a,b){// since all hooks have at most two args, use fixed args
// to avoid having to use fn.apply().
return function(_,__){a(_,__);b(_,__);};}// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement(tag,data,children){if(data&&(Array.isArray(data)||(typeof data==='undefined'?'undefined':_typeof(data))!=='object')){children=data;data=undefined;}// make sure to use real instance instead of proxy as context
return _createElement(this._self,tag,data,children);}function _createElement(context,tag,data,children){if(data&&data.__ob__){"development"!=='production'&&warn('Avoid using observed data object as vnode data: '+JSON.stringify(data)+'\n'+'Always create fresh vnode data objects in each render!',context);return;}if(!tag){// in case of component :is set to falsy value
return emptyVNode();}if(typeof tag==='string'){var Ctor=void 0;var ns=config.getTagNamespace(tag);if(config.isReservedTag(tag)){// platform built-in elements
return new VNode(tag,data,normalizeChildren(children,ns),undefined,undefined,ns,context);}else if(Ctor=resolveAsset(context.$options,'components',tag)){// component
return createComponent(Ctor,data,context,children,tag);}else{// unknown or unlisted namespaced elements
// check at runtime because it may get assigned a namespace when its
// parent normalizes children
return new VNode(tag,data,normalizeChildren(children,ns),undefined,undefined,ns,context);}}else{// direct component options / constructor
return createComponent(tag,data,context,children);}}function initRender(vm){vm.$vnode=null;// the placeholder node in parent tree
vm._vnode=null;// the root of the child tree
vm._staticTrees=null;vm.$slots=resolveSlots(vm.$options._renderChildren);// bind the public createElement fn to this instance
// so that we get proper render context inside it.
vm.$createElement=bind(createElement,vm);if(vm.$options.el){vm.$mount(vm.$options.el);}}function renderMixin(Vue){Vue.prototype.$nextTick=function(fn){nextTick(fn,this);};Vue.prototype._render=function(){var vm=this;var _vm$$options=vm.$options;var render=_vm$$options.render;var staticRenderFns=_vm$$options.staticRenderFns;var _parentVnode=_vm$$options._parentVnode;if(staticRenderFns&&!vm._staticTrees){vm._staticTrees=[];}// set parent vnode. this allows render functions to have access
// to the data on the placeholder node.
vm.$vnode=_parentVnode;// render self
var vnode=void 0;try{vnode=render.call(vm._renderProxy,vm.$createElement);}catch(e){if(true){warn('Error when rendering '+formatComponentName(vm)+':');}/* istanbul ignore else */if(config.errorHandler){config.errorHandler.call(null,e,vm);}else{if(config._isServer){throw e;}else{setTimeout(function(){throw e;},0);}}// return previous vnode to prevent render error causing blank component
vnode=vm._vnode;}// return empty vnode in case the render function errored out
if(!(vnode instanceof VNode)){if("development"!=='production'&&Array.isArray(vnode)){warn('Multiple root nodes returned from render function. Render function '+'should return a single root node.',vm);}vnode=emptyVNode();}// set parent
vnode.parent=_parentVnode;return vnode;};// shorthands used in render functions
Vue.prototype._h=createElement;// toString for mustaches
Vue.prototype._s=_toString;// number conversion
Vue.prototype._n=toNumber;// render static tree by index
Vue.prototype._m=function renderStatic(index,isInFor){var tree=this._staticTrees[index];// if has already-rendered static tree and not inside v-for,
// we can reuse the same tree by indentity.
if(tree&&!isInFor){return tree;}// otherwise, render a fresh tree.
tree=this._staticTrees[index]=this.$options.staticRenderFns[index].call(this._renderProxy);if(Array.isArray(tree)){for(var i=0;i<tree.length;i++){tree[i].isStatic=true;tree[i].key='__static__'+index+'_'+i;}}else{tree.isStatic=true;tree.key='__static__'+index;}return tree;};// filter resolution helper
var identity=function identity(_){return _;};Vue.prototype._f=function resolveFilter(id){return resolveAsset(this.$options,'filters',id,true)||identity;};// render v-for
Vue.prototype._l=function renderList(val,render){var ret=void 0,i=void 0,l=void 0,keys=void 0,key=void 0;if(Array.isArray(val)){ret=new Array(val.length);for(i=0,l=val.length;i<l;i++){ret[i]=render(val[i],i);}}else if(typeof val==='number'){ret=new Array(val);for(i=0;i<val;i++){ret[i]=render(i+1,i);}}else if(isObject(val)){keys=Object.keys(val);ret=new Array(keys.length);for(i=0,l=keys.length;i<l;i++){key=keys[i];ret[i]=render(val[key],key,i);}}return ret;};// apply v-bind object
Vue.prototype._b=function bindProps(vnode,value,asProp){if(value){if(!isObject(value)){"development"!=='production'&&warn('v-bind without argument expects an Object or Array value',this);}else{if(Array.isArray(value)){value=toObject(value);}var data=vnode.data;for(var _key in value){if(_key==='class'||_key==='style'){data[_key]=value[_key];}else{var hash=asProp||config.mustUseProp(_key)?data.domProps||(data.domProps={}):data.attrs||(data.attrs={});hash[_key]=value[_key];}}}}};// expose v-on keyCodes
Vue.prototype._k=function getKeyCodes(key){return config.keyCodes[key];};}function resolveSlots(renderChildren){var slots={};if(!renderChildren){return slots;}var children=normalizeChildren(renderChildren)||[];var defaultSlot=[];var name=void 0,child=void 0;for(var i=0,l=children.length;i<l;i++){child=children[i];if(child.data&&(name=child.data.slot)){delete child.data.slot;var slot=slots[name]||(slots[name]=[]);if(child.tag==='template'){slot.push.apply(slot,child.children);}else{slot.push(child);}}else{defaultSlot.push(child);}}// ignore single whitespace
if(defaultSlot.length&&!(defaultSlot.length===1&&defaultSlot[0].text===' ')){slots.default=defaultSlot;}return slots;}function initEvents(vm){vm._events=Object.create(null);// init parent attached events
var listeners=vm.$options._parentListeners;var on=bind(vm.$on,vm);var off=bind(vm.$off,vm);vm._updateListeners=function(listeners,oldListeners){updateListeners(listeners,oldListeners||{},on,off);};if(listeners){vm._updateListeners(listeners);}}function eventsMixin(Vue){Vue.prototype.$on=function(event,fn){var vm=this;(vm._events[event]||(vm._events[event]=[])).push(fn);return vm;};Vue.prototype.$once=function(event,fn){var vm=this;function on(){vm.$off(event,on);fn.apply(vm,arguments);}on.fn=fn;vm.$on(event,on);return vm;};Vue.prototype.$off=function(event,fn){var vm=this;// all
if(!arguments.length){vm._events=Object.create(null);return vm;}// specific event
var cbs=vm._events[event];if(!cbs){return vm;}if(arguments.length===1){vm._events[event]=null;return vm;}// specific handler
var cb=void 0;var i=cbs.length;while(i--){cb=cbs[i];if(cb===fn||cb.fn===fn){cbs.splice(i,1);break;}}return vm;};Vue.prototype.$emit=function(event){var vm=this;var cbs=vm._events[event];if(cbs){cbs=cbs.length>1?toArray(cbs):cbs;var args=toArray(arguments,1);for(var i=0,l=cbs.length;i<l;i++){cbs[i].apply(vm,args);}}return vm;};}var uid=0;function initMixin(Vue){Vue.prototype._init=function(options){var vm=this;// a uid
vm._uid=uid++;// a flag to avoid this being observed
vm._isVue=true;// merge options
if(options&&options._isComponent){// optimize internal component instantiation
// since dynamic options merging is pretty slow, and none of the
// internal component options needs special treatment.
initInternalComponent(vm,options);}else{vm.$options=mergeOptions(resolveConstructorOptions(vm),options||{},vm);}/* istanbul ignore else */if(true){initProxy(vm);}else{}// expose real self
vm._self=vm;initLifecycle(vm);initEvents(vm);callHook(vm,'beforeCreate');initState(vm);callHook(vm,'created');initRender(vm);};function initInternalComponent(vm,options){var opts=vm.$options=Object.create(resolveConstructorOptions(vm));// doing this because it's faster than dynamic enumeration.
opts.parent=options.parent;opts.propsData=options.propsData;opts._parentVnode=options._parentVnode;opts._parentListeners=options._parentListeners;opts._renderChildren=options._renderChildren;opts._componentTag=options._componentTag;if(options.render){opts.render=options.render;opts.staticRenderFns=options.staticRenderFns;}}function resolveConstructorOptions(vm){var Ctor=vm.constructor;var options=Ctor.options;if(Ctor.super){var superOptions=Ctor.super.options;var cachedSuperOptions=Ctor.superOptions;if(superOptions!==cachedSuperOptions){// super option changed
Ctor.superOptions=superOptions;options=Ctor.options=mergeOptions(superOptions,Ctor.extendOptions);if(options.name){options.components[options.name]=Ctor;}}}return options;}}function Vue(options){this._init(options);}initMixin(Vue);stateMixin(Vue);eventsMixin(Vue);lifecycleMixin(Vue);renderMixin(Vue);var warn=void 0;var formatComponentName=void 0;if(true){(function(){var hasConsole=typeof console!=='undefined';warn=function warn(msg,vm){if(hasConsole&&!config.silent){console.error('[Vue warn]: '+msg+' '+(vm?formatLocation(formatComponentName(vm)):''));}};formatComponentName=function formatComponentName(vm){if(vm.$root===vm){return'root instance';}var name=vm._isVue?vm.$options.name||vm.$options._componentTag:vm.name;return name?'component <'+name+'>':'anonymous component';};var formatLocation=function formatLocation(str){if(str==='anonymous component'){str+=' - use the "name" option for better debugging messages.';}return'(found in '+str+')';};})();}/**
   * Option overwriting strategies are functions that handle
   * how to merge a parent option value and a child option
   * value into the final value.
   */var strats=config.optionMergeStrategies;/**
   * Options with restrictions
   */if(true){strats.el=strats.propsData=function(parent,child,vm,key){if(!vm){warn('option "'+key+'" can only be used during instance '+'creation with the `new` keyword.');}return defaultStrat(parent,child);};strats.name=function(parent,child,vm){if(vm&&child){warn('options "name" can only be used as a component definition option, '+'not during instance creation.');}return defaultStrat(parent,child);};}/**
   * Helper that recursively merges two data objects together.
   */function mergeData(to,from){var key=void 0,toVal=void 0,fromVal=void 0;for(key in from){toVal=to[key];fromVal=from[key];if(!hasOwn(to,key)){set(to,key,fromVal);}else if(isObject(toVal)&&isObject(fromVal)){mergeData(toVal,fromVal);}}return to;}/**
   * Data
   */strats.data=function(parentVal,childVal,vm){if(!vm){// in a Vue.extend merge, both should be functions
if(!childVal){return parentVal;}if(typeof childVal!=='function'){"development"!=='production'&&warn('The "data" option should be a function '+'that returns a per-instance value in component '+'definitions.',vm);return parentVal;}if(!parentVal){return childVal;}// when parentVal & childVal are both present,
// we need to return a function that returns the
// merged result of both functions... no need to
// check if parentVal is a function here because
// it has to be a function to pass previous merges.
return function mergedDataFn(){return mergeData(childVal.call(this),parentVal.call(this));};}else if(parentVal||childVal){return function mergedInstanceDataFn(){// instance merge
var instanceData=typeof childVal==='function'?childVal.call(vm):childVal;var defaultData=typeof parentVal==='function'?parentVal.call(vm):undefined;if(instanceData){return mergeData(instanceData,defaultData);}else{return defaultData;}};}};/**
   * Hooks and param attributes are merged as arrays.
   */function mergeHook(parentVal,childVal){return childVal?parentVal?parentVal.concat(childVal):Array.isArray(childVal)?childVal:[childVal]:parentVal;}config._lifecycleHooks.forEach(function(hook){strats[hook]=mergeHook;});/**
   * Assets
   *
   * When a vm is present (instance creation), we need to do
   * a three-way merge between constructor options, instance
   * options and parent options.
   */function mergeAssets(parentVal,childVal){var res=Object.create(parentVal||null);return childVal?extend(res,childVal):res;}config._assetTypes.forEach(function(type){strats[type+'s']=mergeAssets;});/**
   * Watchers.
   *
   * Watchers hashes should not overwrite one
   * another, so we merge them as arrays.
   */strats.watch=function(parentVal,childVal){/* istanbul ignore if */if(!childVal)return parentVal;if(!parentVal)return childVal;var ret={};extend(ret,parentVal);for(var key in childVal){var parent=ret[key];var child=childVal[key];if(parent&&!Array.isArray(parent)){parent=[parent];}ret[key]=parent?parent.concat(child):[child];}return ret;};/**
   * Other object hashes.
   */strats.props=strats.methods=strats.computed=function(parentVal,childVal){if(!childVal)return parentVal;if(!parentVal)return childVal;var ret=Object.create(null);extend(ret,parentVal);extend(ret,childVal);return ret;};/**
   * Default strategy.
   */var defaultStrat=function defaultStrat(parentVal,childVal){return childVal===undefined?parentVal:childVal;};/**
   * Make sure component options get converted to actual
   * constructors.
   */function normalizeComponents(options){if(options.components){var components=options.components;var def=void 0;for(var key in components){var lower=key.toLowerCase();if(isBuiltInTag(lower)||config.isReservedTag(lower)){"development"!=='production'&&warn('Do not use built-in or reserved HTML elements as component '+'id: '+key);continue;}def=components[key];if(isPlainObject(def)){components[key]=Vue.extend(def);}}}}/**
   * Ensure all props option syntax are normalized into the
   * Object-based format.
   */function normalizeProps(options){var props=options.props;if(!props)return;var res={};var i=void 0,val=void 0,name=void 0;if(Array.isArray(props)){i=props.length;while(i--){val=props[i];if(typeof val==='string'){name=camelize(val);res[name]={type:null};}else if(true){warn('props must be strings when using array syntax.');}}}else if(isPlainObject(props)){for(var key in props){val=props[key];name=camelize(key);res[name]=isPlainObject(val)?val:{type:val};}}options.props=res;}/**
   * Normalize raw function directives into object format.
   */function normalizeDirectives(options){var dirs=options.directives;if(dirs){for(var key in dirs){var def=dirs[key];if(typeof def==='function'){dirs[key]={bind:def,update:def};}}}}/**
   * Merge two option objects into a new one.
   * Core utility used in both instantiation and inheritance.
   */function mergeOptions(parent,child,vm){normalizeComponents(child);normalizeProps(child);normalizeDirectives(child);var extendsFrom=child.extends;if(extendsFrom){parent=typeof extendsFrom==='function'?mergeOptions(parent,extendsFrom.options,vm):mergeOptions(parent,extendsFrom,vm);}if(child.mixins){for(var i=0,l=child.mixins.length;i<l;i++){var mixin=child.mixins[i];if(mixin.prototype instanceof Vue){mixin=mixin.options;}parent=mergeOptions(parent,mixin,vm);}}var options={};var key=void 0;for(key in parent){mergeField(key);}for(key in child){if(!hasOwn(parent,key)){mergeField(key);}}function mergeField(key){var strat=strats[key]||defaultStrat;options[key]=strat(parent[key],child[key],vm,key);}return options;}/**
   * Resolve an asset.
   * This function is used because child instances need access
   * to assets defined in its ancestor chain.
   */function resolveAsset(options,type,id,warnMissing){/* istanbul ignore if */if(typeof id!=='string'){return;}var assets=options[type];var res=assets[id]||// camelCase ID
assets[camelize(id)]||// Pascal Case ID
assets[capitalize(camelize(id))];if("development"!=='production'&&warnMissing&&!res){warn('Failed to resolve '+type.slice(0,-1)+': '+id,options);}return res;}function validateProp(key,propOptions,propsData,vm){/* istanbul ignore if */if(!propsData)return;var prop=propOptions[key];var absent=!hasOwn(propsData,key);var value=propsData[key];// handle boolean props
if(getType(prop.type)==='Boolean'){if(absent&&!hasOwn(prop,'default')){value=false;}else if(value===''||value===hyphenate(key)){value=true;}}// check default value
if(value===undefined){value=getPropDefaultValue(vm,prop,key);// since the default value is a fresh copy,
// make sure to observe it.
var prevShouldConvert=observerState.shouldConvert;observerState.shouldConvert=true;observe(value);observerState.shouldConvert=prevShouldConvert;}if(true){assertProp(prop,key,value,vm,absent);}return value;}/**
   * Get the default value of a prop.
   */function getPropDefaultValue(vm,prop,name){// no default, return undefined
if(!hasOwn(prop,'default')){return undefined;}var def=prop.default;// warn against non-factory defaults for Object & Array
if(isObject(def)){"development"!=='production'&&warn('Invalid default value for prop "'+name+'": '+'Props with type Object/Array must use a factory function '+'to return the default value.',vm);}// call factory function for non-Function types
return typeof def==='function'&&prop.type!==Function?def.call(vm):def;}/**
   * Assert whether a prop is valid.
   */function assertProp(prop,name,value,vm,absent){if(prop.required&&absent){warn('Missing required prop: "'+name+'"',vm);return;}if(value==null&&!prop.required){return;}var type=prop.type;var valid=!type;var expectedTypes=[];if(type){if(!Array.isArray(type)){type=[type];}for(var i=0;i<type.length&&!valid;i++){var assertedType=assertType(value,type[i]);expectedTypes.push(assertedType.expectedType);valid=assertedType.valid;}}if(!valid){warn('Invalid prop: type check failed for prop "'+name+'".'+' Expected '+expectedTypes.map(capitalize).join(', ')+', got '+Object.prototype.toString.call(value).slice(8,-1)+'.',vm);return;}var validator=prop.validator;if(validator){if(!validator(value)){warn('Invalid prop: custom validator check failed for prop "'+name+'".',vm);}}}/**
   * Assert the type of a value
   */function assertType(value,type){var valid=void 0;var expectedType=getType(type);if(expectedType==='String'){valid=(typeof value==='undefined'?'undefined':_typeof(value))===(expectedType='string');}else if(expectedType==='Number'){valid=(typeof value==='undefined'?'undefined':_typeof(value))===(expectedType='number');}else if(expectedType==='Boolean'){valid=(typeof value==='undefined'?'undefined':_typeof(value))===(expectedType='boolean');}else if(expectedType==='Function'){valid=(typeof value==='undefined'?'undefined':_typeof(value))===(expectedType='function');}else if(expectedType==='Object'){valid=isPlainObject(value);}else if(expectedType==='Array'){valid=Array.isArray(value);}else{valid=value instanceof type;}return{valid:valid,expectedType:expectedType};}/**
   * Use function string name to check built-in types,
   * because a simple equality check will fail when running
   * across different vms / iframes.
   */function getType(fn){var match=fn&&fn.toString().match(/^\s*function (\w+)/);return match&&match[1];}var util=Object.freeze({defineReactive:defineReactive,_toString:_toString,toNumber:toNumber,makeMap:makeMap,isBuiltInTag:isBuiltInTag,remove:remove,hasOwn:hasOwn,isPrimitive:isPrimitive,cached:cached,camelize:camelize,capitalize:capitalize,hyphenate:hyphenate,bind:bind,toArray:toArray,extend:extend,isObject:isObject,isPlainObject:isPlainObject,toObject:toObject,noop:noop,no:no,genStaticKeys:genStaticKeys,isReserved:isReserved,def:def,parsePath:parsePath,hasProto:hasProto,inBrowser:inBrowser,devtools:devtools,UA:UA,nextTick:nextTick,get _Set(){return _Set;},mergeOptions:mergeOptions,resolveAsset:resolveAsset,get warn(){return warn;},get formatComponentName(){return formatComponentName;},validateProp:validateProp});function initUse(Vue){Vue.use=function(plugin){/* istanbul ignore if */if(plugin.installed){return;}// additional parameters
var args=toArray(arguments,1);args.unshift(this);if(typeof plugin.install==='function'){plugin.install.apply(plugin,args);}else{plugin.apply(null,args);}plugin.installed=true;return this;};}function initMixin$1(Vue){Vue.mixin=function(mixin){Vue.options=mergeOptions(Vue.options,mixin);};}function initExtend(Vue){/**
     * Each instance constructor, including Vue, has a unique
     * cid. This enables us to create wrapped "child
     * constructors" for prototypal inheritance and cache them.
     */Vue.cid=0;var cid=1;/**
     * Class inheritance
     */Vue.extend=function(extendOptions){extendOptions=extendOptions||{};var Super=this;var isFirstExtend=Super.cid===0;if(isFirstExtend&&extendOptions._Ctor){return extendOptions._Ctor;}var name=extendOptions.name||Super.options.name;if(true){if(!/^[a-zA-Z][\w-]*$/.test(name)){warn('Invalid component name: "'+name+'". Component names '+'can only contain alphanumeric characaters and the hyphen.');name=null;}}var Sub=function VueComponent(options){this._init(options);};Sub.prototype=Object.create(Super.prototype);Sub.prototype.constructor=Sub;Sub.cid=cid++;Sub.options=mergeOptions(Super.options,extendOptions);Sub['super']=Super;// allow further extension
Sub.extend=Super.extend;// create asset registers, so extended classes
// can have their private assets too.
config._assetTypes.forEach(function(type){Sub[type]=Super[type];});// enable recursive self-lookup
if(name){Sub.options.components[name]=Sub;}// keep a reference to the super options at extension time.
// later at instantiation we can check if Super's options have
// been updated.
Sub.superOptions=Super.options;Sub.extendOptions=extendOptions;// cache constructor
if(isFirstExtend){extendOptions._Ctor=Sub;}return Sub;};}function initAssetRegisters(Vue){/**
     * Create asset registration methods.
     */config._assetTypes.forEach(function(type){Vue[type]=function(id,definition){if(!definition){return this.options[type+'s'][id];}else{/* istanbul ignore if */if(true){if(type==='component'&&config.isReservedTag(id)){warn('Do not use built-in or reserved HTML elements as component '+'id: '+id);}}if(type==='component'&&isPlainObject(definition)){definition.name=definition.name||id;definition=Vue.extend(definition);}if(type==='directive'&&typeof definition==='function'){definition={bind:definition,update:definition};}this.options[type+'s'][id]=definition;return definition;}};});}var KeepAlive={name:'keep-alive',abstract:true,created:function created(){this.cache=Object.create(null);},render:function render(){var vnode=getFirstComponentChild(this.$slots.default);if(vnode&&vnode.componentOptions){var opts=vnode.componentOptions;var key=vnode.key==null// same constructor may get registered as different local components
// so cid alone is not enough (#3269)
?opts.Ctor.cid+'::'+opts.tag:vnode.key;if(this.cache[key]){vnode.child=this.cache[key].child;}else{this.cache[key]=vnode;}vnode.data.keepAlive=true;}return vnode;},destroyed:function destroyed(){for(var key in this.cache){var vnode=this.cache[key];callHook(vnode.child,'deactivated');vnode.child.$destroy();}}};var builtInComponents={KeepAlive:KeepAlive};function initGlobalAPI(Vue){// config
var configDef={};configDef.get=function(){return config;};if(true){configDef.set=function(){warn('Do not replace the Vue.config object, set individual fields instead.');};}Object.defineProperty(Vue,'config',configDef);Vue.util=util;Vue.set=set;Vue.delete=del;Vue.nextTick=nextTick;Vue.options=Object.create(null);config._assetTypes.forEach(function(type){Vue.options[type+'s']=Object.create(null);});extend(Vue.options.components,builtInComponents);initUse(Vue);initMixin$1(Vue);initExtend(Vue);initAssetRegisters(Vue);}initGlobalAPI(Vue);Object.defineProperty(Vue.prototype,'$isServer',{get:function get(){return config._isServer;}});Vue.version='2.0.0-rc.3';// attributes that should be using props for binding
var mustUseProp=makeMap('value,selected,checked,muted');var isEnumeratedAttr=makeMap('contenteditable,draggable,spellcheck');var isBooleanAttr=makeMap('allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,'+'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,'+'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,'+'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,'+'required,reversed,scoped,seamless,selected,sortable,translate,'+'truespeed,typemustmatch,visible');var isAttr=makeMap('accept,accept-charset,accesskey,action,align,alt,async,autocomplete,'+'autofocus,autoplay,autosave,bgcolor,border,buffered,challenge,charset,'+'checked,cite,class,code,codebase,color,cols,colspan,content,http-equiv,'+'name,contenteditable,contextmenu,controls,coords,data,datetime,default,'+'defer,dir,dirname,disabled,download,draggable,dropzone,enctype,method,for,'+'form,formaction,headers,<th>,height,hidden,high,href,hreflang,http-equiv,'+'icon,id,ismap,itemprop,keytype,kind,label,lang,language,list,loop,low,'+'manifest,max,maxlength,media,method,GET,POST,min,multiple,email,file,'+'muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,'+'preload,radiogroup,readonly,rel,required,reversed,rows,rowspan,sandbox,'+'scope,scoped,seamless,selected,shape,size,type,text,password,sizes,span,'+'spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,'+'target,title,type,usemap,value,width,wrap');var xlinkNS='http://www.w3.org/1999/xlink';var isXlink=function isXlink(name){return name.charAt(5)===':'&&name.slice(0,5)==='xlink';};var getXlinkProp=function getXlinkProp(name){return isXlink(name)?name.slice(6,name.length):'';};var isFalsyAttrValue=function isFalsyAttrValue(val){return val==null||val===false;};function genClassForVnode(vnode){var data=vnode.data;var parentNode=vnode;var childNode=vnode;while(childNode.child){childNode=childNode.child._vnode;if(childNode.data){data=mergeClassData(childNode.data,data);}}while(parentNode=parentNode.parent){if(parentNode.data){data=mergeClassData(data,parentNode.data);}}return genClassFromData(data);}function mergeClassData(child,parent){return{staticClass:concat(child.staticClass,parent.staticClass),class:child.class?[child.class,parent.class]:parent.class};}function genClassFromData(data){var dynamicClass=data.class;var staticClass=data.staticClass;if(staticClass||dynamicClass){return concat(staticClass,stringifyClass(dynamicClass));}/* istanbul ignore next */return'';}function concat(a,b){return a?b?a+' '+b:a:b||'';}function stringifyClass(value){var res='';if(!value){return res;}if(typeof value==='string'){return value;}if(Array.isArray(value)){var stringified=void 0;for(var i=0,l=value.length;i<l;i++){if(value[i]){if(stringified=stringifyClass(value[i])){res+=stringified+' ';}}}return res.slice(0,-1);}if(isObject(value)){for(var key in value){if(value[key])res+=key+' ';}return res.slice(0,-1);}/* istanbul ignore next */return res;}var namespaceMap={svg:'http://www.w3.org/2000/svg',math:'http://www.w3.org/1998/Math/MathML'};var isHTMLTag=makeMap('html,body,base,head,link,meta,style,title,'+'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,'+'div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,'+'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,'+'s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,'+'embed,object,param,source,canvas,script,noscript,del,ins,'+'caption,col,colgroup,table,thead,tbody,td,th,tr,'+'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,'+'output,progress,select,textarea,'+'details,dialog,menu,menuitem,summary,'+'content,element,shadow,template');var isUnaryTag=makeMap('area,base,br,col,embed,frame,hr,img,input,isindex,keygen,'+'link,meta,param,source,track,wbr',true);// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag=makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source',true);// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag=makeMap('address,article,aside,base,blockquote,body,caption,col,colgroup,dd,'+'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,'+'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,'+'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,'+'title,tr,track',true);// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG=makeMap('svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font,'+'font-face,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,'+'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',true);var isPreTag=function isPreTag(tag){return tag==='pre';};var isReservedTag=function isReservedTag(tag){return isHTMLTag(tag)||isSVG(tag);};function getTagNamespace(tag){if(isSVG(tag)){return'svg';}// basic support for MathML
// note it doesn't support other MathML elements being component roots
if(tag==='math'){return'math';}}var unknownElementCache=Object.create(null);function isUnknownElement(tag){/* istanbul ignore if */if(!inBrowser){return true;}if(isReservedTag(tag)){return false;}tag=tag.toLowerCase();/* istanbul ignore if */if(unknownElementCache[tag]!=null){return unknownElementCache[tag];}var el=document.createElement(tag);if(tag.indexOf('-')>-1){// http://stackoverflow.com/a/28210364/1070244
return unknownElementCache[tag]=el.constructor===window.HTMLUnknownElement||el.constructor===window.HTMLElement;}else{return unknownElementCache[tag]=/HTMLUnknownElement/.test(el.toString());}}var UA$1=inBrowser&&window.navigator.userAgent.toLowerCase();var isIE=UA$1&&/msie|trident/.test(UA$1);var isIE9=UA$1&&UA$1.indexOf('msie 9.0')>0;var isAndroid=UA$1&&UA$1.indexOf('android')>0;// According to
// https://w3c.github.io/DOM-Parsing/#dfn-serializing-an-attribute-value
// when serializing innerHTML, <, >, ", & should be encoded as entities.
// However, only some browsers, e.g. PhantomJS, encodes < and >.
// this causes problems with the in-browser parser.
var shouldDecodeTags=inBrowser?function(){var div=document.createElement('div');div.innerHTML='<div a=">">';return div.innerHTML.indexOf('&gt;')>0;}():false;/**
   * Query an element selector if it's not an element already.
   */function query(el){if(typeof el==='string'){var selector=el;el=document.querySelector(el);if(!el){"development"!=='production'&&warn('Cannot find element: '+selector);return document.createElement('div');}}return el;}function createElement$1(tagName){return document.createElement(tagName);}function createElementNS(namespace,tagName){return document.createElementNS(namespaceMap[namespace],tagName);}function createTextNode(text){return document.createTextNode(text);}function createComment(text){return document.createComment(text);}function insertBefore(parentNode,newNode,referenceNode){parentNode.insertBefore(newNode,referenceNode);}function removeChild(node,child){node.removeChild(child);}function appendChild(node,child){node.appendChild(child);}function parentNode(node){return node.parentNode;}function nextSibling(node){return node.nextSibling;}function tagName(node){return node.tagName;}function setTextContent(node,text){node.textContent=text;}function childNodes(node){return node.childNodes;}function setAttribute(node,key,val){node.setAttribute(key,val);}var nodeOps=Object.freeze({createElement:createElement$1,createElementNS:createElementNS,createTextNode:createTextNode,createComment:createComment,insertBefore:insertBefore,removeChild:removeChild,appendChild:appendChild,parentNode:parentNode,nextSibling:nextSibling,tagName:tagName,setTextContent:setTextContent,childNodes:childNodes,setAttribute:setAttribute});var ref={create:function create(_,vnode){registerRef(vnode);},update:function update(oldVnode,vnode){if(oldVnode.data.ref!==vnode.data.ref){registerRef(oldVnode,true);registerRef(vnode);}},destroy:function destroy(vnode){registerRef(vnode,true);}};function registerRef(vnode,isRemoval){var key=vnode.data.ref;if(!key)return;var vm=vnode.context;var ref=vnode.child||vnode.elm;var refs=vm.$refs;if(isRemoval){if(Array.isArray(refs[key])){remove(refs[key],ref);}else if(refs[key]===ref){refs[key]=undefined;}}else{if(vnode.data.refInFor){if(Array.isArray(refs[key])){refs[key].push(ref);}else{refs[key]=[ref];}}else{refs[key]=ref;}}}var emptyData={};var emptyNode=new VNode('',emptyData,[]);var hooks$1=['create','update','postpatch','remove','destroy'];function isUndef(s){return s==null;}function isDef(s){return s!=null;}function sameVnode(vnode1,vnode2){return vnode1.key===vnode2.key&&vnode1.tag===vnode2.tag&&vnode1.isComment===vnode2.isComment&&!vnode1.data===!vnode2.data;}function createKeyToOldIdx(children,beginIdx,endIdx){var i=void 0,key=void 0;var map={};for(i=beginIdx;i<=endIdx;++i){key=children[i].key;if(isDef(key))map[key]=i;}return map;}function createPatchFunction(backend){var i=void 0,j=void 0;var cbs={};var modules=backend.modules;var nodeOps=backend.nodeOps;for(i=0;i<hooks$1.length;++i){cbs[hooks$1[i]]=[];for(j=0;j<modules.length;++j){if(modules[j][hooks$1[i]]!==undefined)cbs[hooks$1[i]].push(modules[j][hooks$1[i]]);}}function emptyNodeAt(elm){return new VNode(nodeOps.tagName(elm).toLowerCase(),{},[],undefined,elm);}function createRmCb(childElm,listeners){function remove(){if(--remove.listeners===0){removeElement(childElm);}}remove.listeners=listeners;return remove;}function removeElement(el){var parent=nodeOps.parentNode(el);nodeOps.removeChild(parent,el);}function createElm(vnode,insertedVnodeQueue,nested){var i=void 0,elm=void 0;var data=vnode.data;vnode.isRootInsert=!nested;if(isDef(data)){if(isDef(i=data.hook)&&isDef(i=i.init))i(vnode);// after calling the init hook, if the vnode is a child component
// it should've created a child instance and mounted it. the child
// component also has set the placeholder vnode's elm.
// in that case we can just return the element and be done.
if(isDef(i=vnode.child)){initComponent(vnode,insertedVnodeQueue);return vnode.elm;}}var children=vnode.children;var tag=vnode.tag;if(isDef(tag)){if(true){if(!vnode.ns&&!(config.ignoredElements&&config.ignoredElements.indexOf(tag)>-1)&&config.isUnknownElement(tag)){warn('Unknown custom element: <'+tag+'> - did you '+'register the component correctly? For recursive components, '+'make sure to provide the "name" option.',vnode.context);}}elm=vnode.elm=vnode.ns?nodeOps.createElementNS(vnode.ns,tag):nodeOps.createElement(tag);setScope(vnode);if(Array.isArray(children)){for(i=0;i<children.length;++i){nodeOps.appendChild(elm,createElm(children[i],insertedVnodeQueue,true));}}else if(isPrimitive(vnode.text)){nodeOps.appendChild(elm,nodeOps.createTextNode(vnode.text));}if(isDef(data)){invokeCreateHooks(vnode,insertedVnodeQueue);}}else if(vnode.isComment){elm=vnode.elm=nodeOps.createComment(vnode.text);}else{elm=vnode.elm=nodeOps.createTextNode(vnode.text);}return vnode.elm;}function isPatchable(vnode){while(vnode.child){vnode=vnode.child._vnode;}return isDef(vnode.tag);}function invokeCreateHooks(vnode,insertedVnodeQueue){for(var _i=0;_i<cbs.create.length;++_i){cbs.create[_i](emptyNode,vnode);}i=vnode.data.hook;// Reuse variable
if(isDef(i)){if(i.create)i.create(emptyNode,vnode);if(i.insert)insertedVnodeQueue.push(vnode);}}function initComponent(vnode,insertedVnodeQueue){if(vnode.data.pendingInsert){insertedVnodeQueue.push.apply(insertedVnodeQueue,vnode.data.pendingInsert);}vnode.elm=vnode.child.$el;if(isPatchable(vnode)){invokeCreateHooks(vnode,insertedVnodeQueue);setScope(vnode);}else{// empty component root.
// skip all element-related modules except for ref (#3455)
registerRef(vnode);// make sure to invoke the insert hook
insertedVnodeQueue.push(vnode);}}// set scope id attribute for scoped CSS.
// this is implemented as a special case to avoid the overhead
// of going through the normal attribute patching process.
function setScope(vnode){var i=void 0;if(isDef(i=vnode.context)&&isDef(i=i.$options._scopeId)){nodeOps.setAttribute(vnode.elm,i,'');}if(isDef(i=activeInstance)&&i!==vnode.context&&isDef(i=i.$options._scopeId)){nodeOps.setAttribute(vnode.elm,i,'');}}function addVnodes(parentElm,before,vnodes,startIdx,endIdx,insertedVnodeQueue){for(;startIdx<=endIdx;++startIdx){nodeOps.insertBefore(parentElm,createElm(vnodes[startIdx],insertedVnodeQueue),before);}}function invokeDestroyHook(vnode){var i=void 0,j=void 0;var data=vnode.data;if(isDef(data)){if(isDef(i=data.hook)&&isDef(i=i.destroy))i(vnode);for(i=0;i<cbs.destroy.length;++i){cbs.destroy[i](vnode);}}if(isDef(i=vnode.child)&&!data.keepAlive){invokeDestroyHook(i._vnode);}if(isDef(i=vnode.children)){for(j=0;j<vnode.children.length;++j){invokeDestroyHook(vnode.children[j]);}}}function removeVnodes(parentElm,vnodes,startIdx,endIdx){for(;startIdx<=endIdx;++startIdx){var ch=vnodes[startIdx];if(isDef(ch)){if(isDef(ch.tag)){removeAndInvokeRemoveHook(ch);invokeDestroyHook(ch);}else{// Text node
nodeOps.removeChild(parentElm,ch.elm);}}}}function removeAndInvokeRemoveHook(vnode,rm){if(rm||isDef(vnode.data)){var listeners=cbs.remove.length+1;if(!rm){// directly removing
rm=createRmCb(vnode.elm,listeners);}else{// we have a recursively passed down rm callback
// increase the listeners count
rm.listeners+=listeners;}// recursively invoke hooks on child component root node
if(isDef(i=vnode.child)&&isDef(i=i._vnode)&&isDef(i.data)){removeAndInvokeRemoveHook(i,rm);}for(i=0;i<cbs.remove.length;++i){cbs.remove[i](vnode,rm);}if(isDef(i=vnode.data.hook)&&isDef(i=i.remove)){i(vnode,rm);}else{rm();}}else{removeElement(vnode.elm);}}function updateChildren(parentElm,oldCh,newCh,insertedVnodeQueue,removeOnly){var oldStartIdx=0;var newStartIdx=0;var oldEndIdx=oldCh.length-1;var oldStartVnode=oldCh[0];var oldEndVnode=oldCh[oldEndIdx];var newEndIdx=newCh.length-1;var newStartVnode=newCh[0];var newEndVnode=newCh[newEndIdx];var oldKeyToIdx=void 0,idxInOld=void 0,elmToMove=void 0,before=void 0;// removeOnly is a special flag used only by <transition-group>
// to ensure removed elements stay in correct relative positions
// during leaving transitions
var canMove=!removeOnly;while(oldStartIdx<=oldEndIdx&&newStartIdx<=newEndIdx){if(isUndef(oldStartVnode)){oldStartVnode=oldCh[++oldStartIdx];// Vnode has been moved left
}else if(isUndef(oldEndVnode)){oldEndVnode=oldCh[--oldEndIdx];}else if(sameVnode(oldStartVnode,newStartVnode)){patchVnode(oldStartVnode,newStartVnode,insertedVnodeQueue);oldStartVnode=oldCh[++oldStartIdx];newStartVnode=newCh[++newStartIdx];}else if(sameVnode(oldEndVnode,newEndVnode)){patchVnode(oldEndVnode,newEndVnode,insertedVnodeQueue);oldEndVnode=oldCh[--oldEndIdx];newEndVnode=newCh[--newEndIdx];}else if(sameVnode(oldStartVnode,newEndVnode)){// Vnode moved right
patchVnode(oldStartVnode,newEndVnode,insertedVnodeQueue);canMove&&nodeOps.insertBefore(parentElm,oldStartVnode.elm,nodeOps.nextSibling(oldEndVnode.elm));oldStartVnode=oldCh[++oldStartIdx];newEndVnode=newCh[--newEndIdx];}else if(sameVnode(oldEndVnode,newStartVnode)){// Vnode moved left
patchVnode(oldEndVnode,newStartVnode,insertedVnodeQueue);canMove&&nodeOps.insertBefore(parentElm,oldEndVnode.elm,oldStartVnode.elm);oldEndVnode=oldCh[--oldEndIdx];newStartVnode=newCh[++newStartIdx];}else{if(isUndef(oldKeyToIdx))oldKeyToIdx=createKeyToOldIdx(oldCh,oldStartIdx,oldEndIdx);idxInOld=isDef(newStartVnode.key)?oldKeyToIdx[newStartVnode.key]:null;if(isUndef(idxInOld)){// New element
nodeOps.insertBefore(parentElm,createElm(newStartVnode,insertedVnodeQueue),oldStartVnode.elm);newStartVnode=newCh[++newStartIdx];}else{elmToMove=oldCh[idxInOld];/* istanbul ignore if */if("development"!=='production'&&!elmToMove){warn('It seems there are duplicate keys that is causing an update error. '+'Make sure each v-for item has a unique key.');}if(elmToMove.tag!==newStartVnode.tag){// same key but different element. treat as new element
nodeOps.insertBefore(parentElm,createElm(newStartVnode,insertedVnodeQueue),oldStartVnode.elm);newStartVnode=newCh[++newStartIdx];}else{patchVnode(elmToMove,newStartVnode,insertedVnodeQueue);oldCh[idxInOld]=undefined;canMove&&nodeOps.insertBefore(parentElm,newStartVnode.elm,oldStartVnode.elm);newStartVnode=newCh[++newStartIdx];}}}}if(oldStartIdx>oldEndIdx){before=isUndef(newCh[newEndIdx+1])?null:newCh[newEndIdx+1].elm;addVnodes(parentElm,before,newCh,newStartIdx,newEndIdx,insertedVnodeQueue);}else if(newStartIdx>newEndIdx){removeVnodes(parentElm,oldCh,oldStartIdx,oldEndIdx);}}function patchVnode(oldVnode,vnode,insertedVnodeQueue,removeOnly){if(oldVnode===vnode){return;}if(vnode.isStatic&&oldVnode.isStatic&&vnode.key===oldVnode.key){vnode.elm=oldVnode.elm;return;}var i=void 0,hook=void 0;var hasData=isDef(i=vnode.data);if(hasData&&isDef(hook=i.hook)&&isDef(i=hook.prepatch)){i(oldVnode,vnode);}var elm=vnode.elm=oldVnode.elm;var oldCh=oldVnode.children;var ch=vnode.children;if(hasData&&isPatchable(vnode)){for(i=0;i<cbs.update.length;++i){cbs.update[i](oldVnode,vnode);}if(isDef(hook)&&isDef(i=hook.update))i(oldVnode,vnode);}if(isUndef(vnode.text)){if(isDef(oldCh)&&isDef(ch)){if(oldCh!==ch)updateChildren(elm,oldCh,ch,insertedVnodeQueue,removeOnly);}else if(isDef(ch)){if(isDef(oldVnode.text))nodeOps.setTextContent(elm,'');addVnodes(elm,null,ch,0,ch.length-1,insertedVnodeQueue);}else if(isDef(oldCh)){removeVnodes(elm,oldCh,0,oldCh.length-1);}else if(isDef(oldVnode.text)){nodeOps.setTextContent(elm,'');}}else if(oldVnode.text!==vnode.text){nodeOps.setTextContent(elm,vnode.text);}if(hasData){for(i=0;i<cbs.postpatch.length;++i){cbs.postpatch[i](oldVnode,vnode);}if(isDef(hook)&&isDef(i=hook.postpatch))i(oldVnode,vnode);}}function invokeInsertHook(vnode,queue,initial){// delay insert hooks for component root nodes, invoke them after the
// element is really inserted
if(initial&&vnode.parent){vnode.parent.data.pendingInsert=queue;}else{for(var _i2=0;_i2<queue.length;++_i2){queue[_i2].data.hook.insert(queue[_i2]);}}}var bailed=false;function hydrate(elm,vnode,insertedVnodeQueue){if(true){if(!assertNodeMatch(elm,vnode)){return false;}}vnode.elm=elm;var tag=vnode.tag;var data=vnode.data;var children=vnode.children;if(isDef(data)){if(isDef(i=data.hook)&&isDef(i=i.init))i(vnode,true/* hydrating */);if(isDef(i=vnode.child)){// child component. it should have hydrated its own tree.
initComponent(vnode,insertedVnodeQueue);return true;}}if(isDef(tag)){if(isDef(children)){var childNodes=nodeOps.childNodes(elm);var childrenMatch=true;if(childNodes.length!==children.length){childrenMatch=false;}else{for(var _i3=0;_i3<children.length;_i3++){if(!hydrate(childNodes[_i3],children[_i3],insertedVnodeQueue)){childrenMatch=false;break;}}}if(!childrenMatch){if("development"!=='production'&&typeof console!=='undefined'&&!bailed){bailed=true;console.warn('Parent: ',elm);console.warn('Mismatching childNodes vs. VNodes: ',childNodes,children);}return false;}}if(isDef(data)){invokeCreateHooks(vnode,insertedVnodeQueue);}}return true;}function assertNodeMatch(node,vnode){if(vnode.tag){return vnode.tag.indexOf('vue-component')===0||vnode.tag===nodeOps.tagName(node).toLowerCase();}else{return _toString(vnode.text)===node.data;}}return function patch(oldVnode,vnode,hydrating,removeOnly){var elm=void 0,parent=void 0;var isInitialPatch=false;var insertedVnodeQueue=[];if(!oldVnode){// empty mount, create new root element
isInitialPatch=true;createElm(vnode,insertedVnodeQueue);}else{var isRealElement=isDef(oldVnode.nodeType);if(!isRealElement&&sameVnode(oldVnode,vnode)){patchVnode(oldVnode,vnode,insertedVnodeQueue,removeOnly);}else{if(isRealElement){// mounting to a real element
// check if this is server-rendered content and if we can perform
// a successful hydration.
if(oldVnode.nodeType===1&&oldVnode.hasAttribute('server-rendered')){oldVnode.removeAttribute('server-rendered');hydrating=true;}if(hydrating){if(hydrate(oldVnode,vnode,insertedVnodeQueue)){invokeInsertHook(vnode,insertedVnodeQueue,true);return oldVnode;}else if(true){warn('The client-side rendered virtual DOM tree is not matching '+'server-rendered content. This is likely caused by incorrect '+'HTML markup, for example nesting block-level elements inside '+'<p>, or missing <tbody>. Bailing hydration and performing '+'full client-side render.');}}// either not server-rendered, or hydration failed.
// create an empty node and replace it
oldVnode=emptyNodeAt(oldVnode);}elm=oldVnode.elm;parent=nodeOps.parentNode(elm);createElm(vnode,insertedVnodeQueue);// component root element replaced.
// update parent placeholder node element.
if(vnode.parent){vnode.parent.elm=vnode.elm;if(isPatchable(vnode)){for(var _i4=0;_i4<cbs.create.length;++_i4){cbs.create[_i4](emptyNode,vnode.parent);}}}if(parent!==null){nodeOps.insertBefore(parent,vnode.elm,nodeOps.nextSibling(elm));removeVnodes(parent,[oldVnode],0,0);}else if(isDef(oldVnode.tag)){invokeDestroyHook(oldVnode);}}}invokeInsertHook(vnode,insertedVnodeQueue,isInitialPatch);return vnode.elm;};}var directives={create:function bindDirectives(oldVnode,vnode){applyDirectives(oldVnode,vnode,'bind');},update:function updateDirectives(oldVnode,vnode){applyDirectives(oldVnode,vnode,'update');},postpatch:function postupdateDirectives(oldVnode,vnode){applyDirectives(oldVnode,vnode,'componentUpdated');},destroy:function unbindDirectives(vnode){applyDirectives(vnode,vnode,'unbind');}};var emptyModifiers=Object.create(null);function applyDirectives(oldVnode,vnode,hook){var dirs=vnode.data.directives;if(dirs){var oldDirs=oldVnode.data.directives;var isUpdate=hook==='update';for(var i=0;i<dirs.length;i++){var dir=dirs[i];var def=resolveAsset(vnode.context.$options,'directives',dir.name,true);var fn=def&&def[hook];if(fn){if(isUpdate&&oldDirs){dir.oldValue=oldDirs[i].value;}if(!dir.modifiers){dir.modifiers=emptyModifiers;}fn(vnode.elm,dir,vnode,oldVnode);}}}}var baseModules=[ref,directives];function updateAttrs(oldVnode,vnode){if(!oldVnode.data.attrs&&!vnode.data.attrs){return;}var key=void 0,cur=void 0,old=void 0;var elm=vnode.elm;var oldAttrs=oldVnode.data.attrs||{};var attrs=vnode.data.attrs||{};// clone observed objects, as the user probably wants to mutate it
if(attrs.__ob__){attrs=vnode.data.attrs=extend({},attrs);}for(key in attrs){cur=attrs[key];old=oldAttrs[key];if(old!==cur){setAttr(elm,key,cur);}}for(key in oldAttrs){if(attrs[key]==null){if(isXlink(key)){elm.removeAttributeNS(xlinkNS,getXlinkProp(key));}else if(!isEnumeratedAttr(key)){elm.removeAttribute(key);}}}}function setAttr(el,key,value){if(isBooleanAttr(key)){// set attribute for blank value
// e.g. <option disabled>Select one</option>
if(isFalsyAttrValue(value)){el.removeAttribute(key);}else{el.setAttribute(key,key);}}else if(isEnumeratedAttr(key)){el.setAttribute(key,isFalsyAttrValue(value)||value==='false'?'false':'true');}else if(isXlink(key)){if(isFalsyAttrValue(value)){el.removeAttributeNS(xlinkNS,getXlinkProp(key));}else{el.setAttributeNS(xlinkNS,key,value);}}else{if(isFalsyAttrValue(value)){el.removeAttribute(key);}else{el.setAttribute(key,value);}}}var attrs={create:updateAttrs,update:updateAttrs};function updateClass(oldVnode,vnode){var el=vnode.elm;var data=vnode.data;var oldData=oldVnode.data;if(!data.staticClass&&!data.class&&(!oldData||!oldData.staticClass&&!oldData.class)){return;}var cls=genClassForVnode(vnode);// handle transition classes
var transitionClass=el._transitionClasses;if(transitionClass){cls=concat(cls,stringifyClass(transitionClass));}// set the class
if(cls!==el._prevClass){el.setAttribute('class',cls);el._prevClass=cls;}}var klass={create:updateClass,update:updateClass};function updateDOMListeners(oldVnode,vnode){if(!oldVnode.data.on&&!vnode.data.on){return;}var on=vnode.data.on||{};var oldOn=oldVnode.data.on||{};var add=vnode.elm._v_add||(vnode.elm._v_add=function(event,handler,capture){vnode.elm.addEventListener(event,handler,capture);});var remove=vnode.elm._v_remove||(vnode.elm._v_remove=function(event,handler){vnode.elm.removeEventListener(event,handler);});updateListeners(on,oldOn,add,remove);}var events={create:updateDOMListeners,update:updateDOMListeners};function updateDOMProps(oldVnode,vnode){if(!oldVnode.data.domProps&&!vnode.data.domProps){return;}var key=void 0,cur=void 0;var elm=vnode.elm;var oldProps=oldVnode.data.domProps||{};var props=vnode.data.domProps||{};// clone observed objects, as the user probably wants to mutate it
if(props.__ob__){props=vnode.data.domProps=extend({},props);}for(key in oldProps){if(props[key]==null){elm[key]=undefined;}}for(key in props){// ignore children if the node has textContent or innerHTML,
// as these will throw away existing DOM nodes and cause removal errors
// on subsequent patches (#3360)
if((key==='textContent'||key==='innerHTML')&&vnode.children){vnode.children.length=0;}cur=props[key];if(key==='value'){// store value as _value as well since
// non-string values will be stringified
elm._value=cur;// avoid resetting cursor position when value is the same
var strCur=cur==null?'':String(cur);if(elm.value!==strCur){elm.value=strCur;}}else{elm[key]=cur;}}}var domProps={create:updateDOMProps,update:updateDOMProps};var prefixes=['Webkit','Moz','ms'];var testEl=void 0;var normalize=cached(function(prop){testEl=testEl||document.createElement('div');prop=camelize(prop);if(prop!=='filter'&&prop in testEl.style){return prop;}var upper=prop.charAt(0).toUpperCase()+prop.slice(1);for(var i=0;i<prefixes.length;i++){var prefixed=prefixes[i]+upper;if(prefixed in testEl.style){return prefixed;}}});function updateStyle(oldVnode,vnode){if((!oldVnode.data||!oldVnode.data.style)&&!vnode.data.style){return;}var cur=void 0,name=void 0;var el=vnode.elm;var oldStyle=oldVnode.data.style||{};var style=vnode.data.style||{};// handle string
if(typeof style==='string'){el.style.cssText=style;return;}var needClone=style.__ob__;// handle array syntax
if(Array.isArray(style)){style=vnode.data.style=toObject(style);}// clone the style for future updates,
// in case the user mutates the style object in-place.
if(needClone){style=vnode.data.style=extend({},style);}for(name in oldStyle){if(!style[name]){el.style[normalize(name)]='';}}for(name in style){cur=style[name];if(cur!==oldStyle[name]){// ie9 setting to null has no effect, must use empty string
el.style[normalize(name)]=cur||'';}}}var style={create:updateStyle,update:updateStyle};/**
   * Add class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */function addClass(el,cls){/* istanbul ignore else */if(el.classList){if(cls.indexOf(' ')>-1){cls.split(/\s+/).forEach(function(c){return el.classList.add(c);});}else{el.classList.add(cls);}}else{var cur=' '+el.getAttribute('class')+' ';if(cur.indexOf(' '+cls+' ')<0){el.setAttribute('class',(cur+cls).trim());}}}/**
   * Remove class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */function removeClass(el,cls){/* istanbul ignore else */if(el.classList){if(cls.indexOf(' ')>-1){cls.split(/\s+/).forEach(function(c){return el.classList.remove(c);});}else{el.classList.remove(cls);}}else{var cur=' '+el.getAttribute('class')+' ';var tar=' '+cls+' ';while(cur.indexOf(tar)>=0){cur=cur.replace(tar,' ');}el.setAttribute('class',cur.trim());}}var hasTransition=inBrowser&&!isIE9;var TRANSITION='transition';var ANIMATION='animation';// Transition property/event sniffing
var transitionProp='transition';var transitionEndEvent='transitionend';var animationProp='animation';var animationEndEvent='animationend';if(hasTransition){/* istanbul ignore if */if(window.ontransitionend===undefined&&window.onwebkittransitionend!==undefined){transitionProp='WebkitTransition';transitionEndEvent='webkitTransitionEnd';}if(window.onanimationend===undefined&&window.onwebkitanimationend!==undefined){animationProp='WebkitAnimation';animationEndEvent='webkitAnimationEnd';}}var raf=inBrowser&&window.requestAnimationFrame||setTimeout;function nextFrame(fn){raf(function(){raf(fn);});}function addTransitionClass(el,cls){(el._transitionClasses||(el._transitionClasses=[])).push(cls);addClass(el,cls);}function removeTransitionClass(el,cls){if(el._transitionClasses){remove(el._transitionClasses,cls);}removeClass(el,cls);}function whenTransitionEnds(el,expectedType,cb){var _getTransitionInfo=getTransitionInfo(el,expectedType);var type=_getTransitionInfo.type;var timeout=_getTransitionInfo.timeout;var propCount=_getTransitionInfo.propCount;if(!type)return cb();var event=type===TRANSITION?transitionEndEvent:animationEndEvent;var ended=0;var end=function end(){el.removeEventListener(event,onEnd);cb();};var onEnd=function onEnd(){if(++ended>=propCount){end();}};setTimeout(function(){if(ended<propCount){end();}},timeout+1);el.addEventListener(event,onEnd);}var transformRE=/\b(transform|all)(,|$)/;function getTransitionInfo(el,expectedType){var styles=window.getComputedStyle(el);var transitioneDelays=styles[transitionProp+'Delay'].split(', ');var transitionDurations=styles[transitionProp+'Duration'].split(', ');var transitionTimeout=getTimeout(transitioneDelays,transitionDurations);var animationDelays=styles[animationProp+'Delay'].split(', ');var animationDurations=styles[animationProp+'Duration'].split(', ');var animationTimeout=getTimeout(animationDelays,animationDurations);var type=void 0;var timeout=0;var propCount=0;/* istanbul ignore if */if(expectedType===TRANSITION){if(transitionTimeout>0){type=TRANSITION;timeout=transitionTimeout;propCount=transitionDurations.length;}}else if(expectedType===ANIMATION){if(animationTimeout>0){type=ANIMATION;timeout=animationTimeout;propCount=animationDurations.length;}}else{timeout=Math.max(transitionTimeout,animationTimeout);type=timeout>0?transitionTimeout>animationTimeout?TRANSITION:ANIMATION:null;propCount=type?type===TRANSITION?transitionDurations.length:animationDurations.length:0;}var hasTransform=type===TRANSITION&&transformRE.test(styles[transitionProp+'Property']);return{type:type,timeout:timeout,propCount:propCount,hasTransform:hasTransform};}function getTimeout(delays,durations){return Math.max.apply(null,durations.map(function(d,i){return toMs(d)+toMs(delays[i]);}));}function toMs(s){return Number(s.slice(0,-1))*1000;}function enter(vnode){var el=vnode.elm;// call leave callback now
if(el._leaveCb){el._leaveCb.cancelled=true;el._leaveCb();}var data=resolveTransition(vnode.data.transition);if(!data){return;}/* istanbul ignore if */if(el._enterCb||el.nodeType!==1){return;}var css=data.css;var type=data.type;var enterClass=data.enterClass;var enterActiveClass=data.enterActiveClass;var appearClass=data.appearClass;var appearActiveClass=data.appearActiveClass;var beforeEnter=data.beforeEnter;var enter=data.enter;var afterEnter=data.afterEnter;var enterCancelled=data.enterCancelled;var beforeAppear=data.beforeAppear;var appear=data.appear;var afterAppear=data.afterAppear;var appearCancelled=data.appearCancelled;// activeInstance will always be the <transition> component managing this
// transition. One edge case to check is when the <transition> is placed
// as the root node of a child component. In that case we need to check
// <transition>'s parent for appear check.
var transitionNode=activeInstance.$vnode;var context=transitionNode&&transitionNode.parent?transitionNode.parent.context:activeInstance;var isAppear=!context._isMounted||!vnode.isRootInsert;if(isAppear&&!appear&&appear!==''){return;}var startClass=isAppear?appearClass:enterClass;var activeClass=isAppear?appearActiveClass:enterActiveClass;var beforeEnterHook=isAppear?beforeAppear||beforeEnter:beforeEnter;var enterHook=isAppear?typeof appear==='function'?appear:enter:enter;var afterEnterHook=isAppear?afterAppear||afterEnter:afterEnter;var enterCancelledHook=isAppear?appearCancelled||enterCancelled:enterCancelled;var expectsCSS=css!==false&&!isIE9;var userWantsControl=enterHook&&// enterHook may be a bound method which exposes
// the length of original fn as _length
(enterHook._length||enterHook.length)>1;var cb=el._enterCb=once(function(){if(expectsCSS){removeTransitionClass(el,activeClass);}if(cb.cancelled){if(expectsCSS){removeTransitionClass(el,startClass);}enterCancelledHook&&enterCancelledHook(el);}else{afterEnterHook&&afterEnterHook(el);}el._enterCb=null;});if(!vnode.data.show){// remove pending leave element on enter by injecting an insert hook
var hooks=vnode.data.hook||(vnode.data.hook={});hooks._transitionInsert=function(){var parent=el.parentNode;var pendingNode=parent&&parent._pending&&parent._pending[vnode.key];if(pendingNode&&pendingNode.tag===vnode.tag&&pendingNode.elm._leaveCb){pendingNode.elm._leaveCb();}enterHook&&enterHook(el,cb);};if(!vnode.data.transitionInjected){vnode.data.transitionInjected=true;mergeVNodeHook(hooks,'insert',function(){hooks._transitionInsert();});}}// start enter transition
beforeEnterHook&&beforeEnterHook(el);if(expectsCSS){addTransitionClass(el,startClass);addTransitionClass(el,activeClass);nextFrame(function(){removeTransitionClass(el,startClass);if(!cb.cancelled&&!userWantsControl){whenTransitionEnds(el,type,cb);}});}if(vnode.data.show){enterHook&&enterHook(el,cb);}if(!expectsCSS&&!userWantsControl){cb();}}function leave(vnode,rm){var el=vnode.elm;// call enter callback now
if(el._enterCb){el._enterCb.cancelled=true;el._enterCb();}var data=resolveTransition(vnode.data.transition);if(!data){return rm();}/* istanbul ignore if */if(el._leaveCb||el.nodeType!==1){return;}var css=data.css;var type=data.type;var leaveClass=data.leaveClass;var leaveActiveClass=data.leaveActiveClass;var beforeLeave=data.beforeLeave;var leave=data.leave;var afterLeave=data.afterLeave;var leaveCancelled=data.leaveCancelled;var delayLeave=data.delayLeave;var expectsCSS=css!==false&&!isIE9;var userWantsControl=leave&&// leave hook may be a bound method which exposes
// the length of original fn as _length
(leave._length||leave.length)>1;var cb=el._leaveCb=once(function(){if(el.parentNode&&el.parentNode._pending){el.parentNode._pending[vnode.key]=null;}if(expectsCSS){removeTransitionClass(el,leaveActiveClass);}if(cb.cancelled){if(expectsCSS){removeTransitionClass(el,leaveClass);}leaveCancelled&&leaveCancelled(el);}else{rm();afterLeave&&afterLeave(el);}el._leaveCb=null;});if(delayLeave){delayLeave(performLeave);}else{performLeave();}function performLeave(){// the delayed leave may have already been cancelled
if(cb.cancelled){return;}// record leaving element
if(!vnode.data.show){(el.parentNode._pending||(el.parentNode._pending={}))[vnode.key]=vnode;}beforeLeave&&beforeLeave(el);if(expectsCSS){addTransitionClass(el,leaveClass);addTransitionClass(el,leaveActiveClass);nextFrame(function(){removeTransitionClass(el,leaveClass);if(!cb.cancelled&&!userWantsControl){whenTransitionEnds(el,type,cb);}});}leave&&leave(el,cb);if(!expectsCSS&&!userWantsControl){cb();}}}function resolveTransition(def){if(!def){return;}/* istanbul ignore else */if((typeof def==='undefined'?'undefined':_typeof(def))==='object'){var res={};if(def.css!==false){extend(res,autoCssTransition(def.name||'v'));}extend(res,def);return res;}else if(typeof def==='string'){return autoCssTransition(def);}}var autoCssTransition=cached(function(name){return{enterClass:name+'-enter',leaveClass:name+'-leave',appearClass:name+'-enter',enterActiveClass:name+'-enter-active',leaveActiveClass:name+'-leave-active',appearActiveClass:name+'-enter-active'};});function once(fn){var called=false;return function(){if(!called){called=true;fn();}};}var transition=inBrowser?{create:function create(_,vnode){if(!vnode.data.show){enter(vnode);}},remove:function remove(vnode,rm){/* istanbul ignore else */if(!vnode.data.show){leave(vnode,rm);}else{rm();}}}:{};var platformModules=[attrs,klass,events,domProps,style,transition];// the directive module should be applied last, after all
// built-in modules have been applied.
var modules=platformModules.concat(baseModules);var patch=createPatchFunction({nodeOps:nodeOps,modules:modules});var modelableTagRE=/^input|select|textarea|vue-component-[0-9]+(-[0-9a-zA-Z_\-]*)?$/;/* istanbul ignore if */if(isIE9){// http://www.matts411.com/post/internet-explorer-9-oninput/
document.addEventListener('selectionchange',function(){var el=document.activeElement;if(el&&el.vmodel){trigger(el,'input');}});}var model={bind:function bind(el,binding,vnode){if(true){if(!modelableTagRE.test(vnode.tag)){warn('v-model is not supported on element type: <'+vnode.tag+'>. '+'If you are working with contenteditable, it\'s recommended to '+'wrap a library dedicated for that purpose inside a custom component.',vnode.context);}}if(vnode.tag==='select'){setSelected(el,binding,vnode.context);}else{if(!isAndroid){el.addEventListener('compositionstart',onCompositionStart);el.addEventListener('compositionend',onCompositionEnd);}/* istanbul ignore if */if(isIE9){el.vmodel=true;}}},componentUpdated:function componentUpdated(el,binding,vnode){if(vnode.tag==='select'){setSelected(el,binding,vnode.context);// in case the options rendered by v-for have changed,
// it's possible that the value is out-of-sync with the rendered options.
// detect such cases and filter out values that no longer has a matchig
// option in the DOM.
var needReset=el.multiple?binding.value.some(function(v){return hasNoMatchingOption(v,el.options);}):hasNoMatchingOption(binding.value,el.options);if(needReset){trigger(el,'change');}}}};function setSelected(el,binding,vm){var value=binding.value;var isMultiple=el.multiple;if(!isMultiple){el.selectedIndex=-1;}else if(!Array.isArray(value)){"development"!=='production'&&warn('<select multiple v-model="'+binding.expression+'"> '+('expects an Array value for its binding, but got '+Object.prototype.toString.call(value).slice(8,-1)),vm);return;}for(var i=0,l=el.options.length;i<l;i++){var option=el.options[i];if(isMultiple){option.selected=value.indexOf(getValue(option))>-1;}else{if(getValue(option)===value){el.selectedIndex=i;break;}}}}function hasNoMatchingOption(value,options){for(var i=0,l=options.length;i<l;i++){if(getValue(options[i])===value){return false;}}return true;}function getValue(option){return'_value'in option?option._value:option.value||option.text;}function onCompositionStart(e){e.target.composing=true;}function onCompositionEnd(e){e.target.composing=false;trigger(e.target,'input');}function trigger(el,type){var e=document.createEvent('HTMLEvents');e.initEvent(type,true,true);el.dispatchEvent(e);}// recursively search for possible transition defined inside the component root
function locateNode(vnode){return vnode.child&&(!vnode.data||!vnode.data.transition)?locateNode(vnode.child._vnode):vnode;}var show={bind:function bind(el,_ref,vnode){var value=_ref.value;vnode=locateNode(vnode);var transition=vnode.data&&vnode.data.transition;if(value&&transition&&transition.appear&&!isIE9){enter(vnode);}var originalDisplay=el.style.display==='none'?'':el.style.display;el.style.display=value?originalDisplay:'none';el.__vOriginalDisplay=originalDisplay;},update:function update(el,_ref2,vnode){var value=_ref2.value;var oldValue=_ref2.oldValue;/* istanbul ignore if */if(value===oldValue)return;vnode=locateNode(vnode);var transition=vnode.data&&vnode.data.transition;if(transition&&!isIE9){if(value){enter(vnode);el.style.display=el.__vOriginalDisplay;}else{leave(vnode,function(){el.style.display='none';});}}else{el.style.display=value?el.__vOriginalDisplay:'none';}}};var platformDirectives={model:model,show:show};var transitionProps={name:String,appear:Boolean,css:Boolean,mode:String,type:String,enterClass:String,leaveClass:String,enterActiveClass:String,leaveActiveClass:String,appearClass:String,appearActiveClass:String};// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recrusively retrieve the real component to be rendered
function getRealChild(vnode){var compOptions=vnode&&vnode.componentOptions;if(compOptions&&compOptions.Ctor.options.abstract){return getRealChild(getFirstComponentChild(compOptions.children));}else{return vnode;}}function extractTransitionData(comp){var data={};var options=comp.$options;// props
for(var key in options.propsData){data[key]=comp[key];}// events.
// extract listeners and pass them directly to the transition methods
var listeners=options._parentListeners;for(var _key in listeners){data[camelize(_key)]=listeners[_key].fn;}return data;}function placeholder(h,rawChild){return /\d-keep-alive$/.test(rawChild.tag)?h('keep-alive'):null;}function hasParentTransition(vnode){while(vnode=vnode.parent){if(vnode.data.transition){return true;}}}var Transition={name:'transition',props:transitionProps,abstract:true,render:function render(h){var _this=this;var children=this.$slots.default;if(!children){return;}// filter out text nodes (possible whitespaces)
children=children.filter(function(c){return c.tag;});/* istanbul ignore if */if(!children.length){return;}// warn multiple elements
if("development"!=='production'&&children.length>1){warn('<transition> can only be used on a single element. Use '+'<transition-group> for lists.',this.$parent);}var mode=this.mode;// warn invalid mode
if("development"!=='production'&&mode&&mode!=='in-out'&&mode!=='out-in'){warn('invalid <transition> mode: '+mode,this.$parent);}var rawChild=children[0];// if this is a component root node and the component's
// parent container node also has transition, skip.
if(hasParentTransition(this.$vnode)){return rawChild;}// apply transition data to child
// use getRealChild() to ignore abstract components e.g. keep-alive
var child=getRealChild(rawChild);/* istanbul ignore if */if(!child){return rawChild;}if(this._leaving){return placeholder(h,rawChild);}child.key=child.key==null?'__v'+(child.tag+this._uid)+'__':child.key;var data=(child.data||(child.data={})).transition=extractTransitionData(this);var oldRawChild=this._vnode;var oldChild=getRealChild(oldRawChild);// mark v-show
// so that the transition module can hand over the control to the directive
if(child.data.directives&&child.data.directives.some(function(d){return d.name==='show';})){child.data.show=true;}if(oldChild&&oldChild.data&&oldChild.key!==child.key){// replace old child transition data with fresh one
// important for dynamic transitions!
var oldData=oldChild.data.transition=extend({},data);// handle transition mode
if(mode==='out-in'){// return placeholder node and queue update when leave finishes
this._leaving=true;mergeVNodeHook(oldData,'afterLeave',function(){_this._leaving=false;_this.$forceUpdate();});return placeholder(h,rawChild);}else if(mode==='in-out'){var delayedLeave;var performLeave=function performLeave(){delayedLeave();};mergeVNodeHook(data,'afterEnter',performLeave);mergeVNodeHook(data,'enterCancelled',performLeave);mergeVNodeHook(oldData,'delayLeave',function(leave){delayedLeave=leave;});}}return rawChild;}};var props=extend({tag:String,moveClass:String},transitionProps);delete props.mode;var TransitionGroup={props:props,render:function render(h){var tag=this.tag||this.$vnode.data.tag||'span';var map=Object.create(null);var prevChildren=this.prevChildren=this.children;var rawChildren=this.$slots.default||[];var children=this.children=[];var transitionData=extractTransitionData(this);for(var i=0;i<rawChildren.length;i++){var c=rawChildren[i];if(c.tag){if(c.key!=null){children.push(c);map[c.key]=c;(c.data||(c.data={})).transition=transitionData;}else if(true){var opts=c.componentOptions;var name=opts?opts.Ctor.options.name||opts.tag:c.tag;warn('<transition-group> children must be keyed: <'+name+'>');}}}if(prevChildren){var kept=[];var removed=[];for(var _i=0;_i<prevChildren.length;_i++){var _c=prevChildren[_i];_c.data.transition=transitionData;_c.data.pos=_c.elm.getBoundingClientRect();if(map[_c.key]){kept.push(_c);}else{removed.push(_c);}}this.kept=h(tag,null,kept);this.removed=removed;}return h(tag,null,children);},beforeUpdate:function beforeUpdate(){// force removing pass
this.__patch__(this._vnode,this.kept,false,// hydrating
true// removeOnly (!important, avoids unnecessary moves)
);this._vnode=this.kept;},updated:function updated(){var children=this.prevChildren;var moveClass=this.moveClass||this.name+'-move';if(!children.length||!this.hasMove(children[0].elm,moveClass)){return;}children.forEach(function(c){/* istanbul ignore if */if(c.elm._moveCb){c.elm._moveCb();}/* istanbul ignore if */if(c.elm._enterCb){c.elm._enterCb();}var oldPos=c.data.pos;var newPos=c.data.pos=c.elm.getBoundingClientRect();var dx=oldPos.left-newPos.left;var dy=oldPos.top-newPos.top;if(dx||dy){c.data.moved=true;var s=c.elm.style;s.transform=s.WebkitTransform='translate('+dx+'px,'+dy+'px)';s.transitionDuration='0s';}});// force reflow to put everything in position
var f=document.body.offsetHeight;// eslint-disable-line
children.forEach(function(c){if(c.data.moved){var el=c.elm;var s=el.style;addTransitionClass(el,moveClass);s.transform=s.WebkitTransform=s.transitionDuration='';el._moveDest=c.data.pos;el.addEventListener(transitionEndEvent,el._moveCb=function cb(e){if(!e||/transform$/.test(e.propertyName)){el.removeEventListener(transitionEndEvent,cb);el._moveCb=null;removeTransitionClass(el,moveClass);}});}});},methods:{hasMove:function hasMove(el,moveClass){/* istanbul ignore if */if(!hasTransition){return false;}if(this._hasMove!=null){return this._hasMove;}addTransitionClass(el,moveClass);var info=getTransitionInfo(el);removeTransitionClass(el,moveClass);return this._hasMove=info.hasTransform;}}};var platformComponents={Transition:Transition,TransitionGroup:TransitionGroup};// install platform specific utils
Vue.config.isUnknownElement=isUnknownElement;Vue.config.isReservedTag=isReservedTag;Vue.config.getTagNamespace=getTagNamespace;Vue.config.mustUseProp=mustUseProp;// install platform runtime directives & components
extend(Vue.options.directives,platformDirectives);extend(Vue.options.components,platformComponents);// install platform patch function
Vue.prototype.__patch__=config._isServer?noop:patch;// wrap mount
Vue.prototype.$mount=function(el,hydrating){el=el&&!config._isServer?query(el):undefined;return this._mount(el,hydrating);};// devtools global hook
/* istanbul ignore next */setTimeout(function(){if(config.devtools){if(devtools){devtools.emit('init',Vue);}else if("development"!=='production'&&inBrowser&&/Chrome\/\d+/.test(window.navigator.userAgent)){console.log('Download the Vue Devtools for a better development experience:\n'+'https://github.com/vuejs/vue-devtools');}}},0);var decoder=document.createElement('div');function decodeHTML(html){decoder.innerHTML=html;return decoder.textContent;}// Regular Expressions for parsing tags and attributes
var singleAttrIdentifier=/([^\s"'<>\/=]+)/;var singleAttrAssign=/(?:=)/;var singleAttrValues=[// attr value double quotes
/"([^"]*)"+/.source,// attr value, single quotes
/'([^']*)'+/.source,// attr value, no quotes
/([^\s"'=<>`]+)/.source];var attribute=new RegExp('^\\s*'+singleAttrIdentifier.source+'(?:\\s*('+singleAttrAssign.source+')'+'\\s*(?:'+singleAttrValues.join('|')+'))?');// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
var ncname='[a-zA-Z_][\\w\\-\\.]*';var qnameCapture='((?:'+ncname+'\\:)?'+ncname+')';var startTagOpen=new RegExp('^<'+qnameCapture);var startTagClose=/^\s*(\/?)>/;var endTag=new RegExp('^<\\/'+qnameCapture+'[^>]*>');var doctype=/^<!DOCTYPE [^>]+>/i;var IS_REGEX_CAPTURING_BROKEN=false;'x'.replace(/x(.)?/g,function(m,g){IS_REGEX_CAPTURING_BROKEN=g==='';});// Special Elements (can contain anything)
var isSpecialTag=makeMap('script,style',true);var reCache={};var ampRE=/&amp;/g;var ltRE=/&lt;/g;var gtRE=/&gt;/g;var quoteRE=/&quot;/g;function decodeAttr(value,shouldDecodeTags){if(shouldDecodeTags){value=value.replace(ltRE,'<').replace(gtRE,'>');}return value.replace(ampRE,'&').replace(quoteRE,'"');}function parseHTML(html,options){var stack=[];var expectHTML=options.expectHTML;var isUnaryTag=options.isUnaryTag||no;var isFromDOM=options.isFromDOM;var shouldDecodeTags=options.shouldDecodeTags;var index=0;var last=void 0,lastTag=void 0;while(html){last=html;// Make sure we're not in a script or style element
if(!lastTag||!isSpecialTag(lastTag)){var textEnd=html.indexOf('<');if(textEnd===0){// Comment:
if(/^<!--/.test(html)){var commentEnd=html.indexOf('-->');if(commentEnd>=0){advance(commentEnd+3);continue;}}// http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
if(/^<!\[/.test(html)){var conditionalEnd=html.indexOf(']>');if(conditionalEnd>=0){advance(conditionalEnd+2);continue;}}// Doctype:
var doctypeMatch=html.match(doctype);if(doctypeMatch){advance(doctypeMatch[0].length);continue;}// End tag:
var endTagMatch=html.match(endTag);if(endTagMatch){var curIndex=index;advance(endTagMatch[0].length);parseEndTag(endTagMatch[0],endTagMatch[1],curIndex,index);continue;}// Start tag:
var startTagMatch=parseStartTag();if(startTagMatch){handleStartTag(startTagMatch);continue;}}var text=void 0;if(textEnd>=0){text=html.substring(0,textEnd);advance(textEnd);}else{text=html;html='';}if(options.chars){options.chars(text);}}else{var stackedTag=lastTag.toLowerCase();var reStackedTag=reCache[stackedTag]||(reCache[stackedTag]=new RegExp('([\\s\\S]*?)(</'+stackedTag+'[^>]*>)','i'));var endTagLength=0;var rest=html.replace(reStackedTag,function(all,text,endTag){endTagLength=endTag.length;if(stackedTag!=='script'&&stackedTag!=='style'&&stackedTag!=='noscript'){text=text.replace(/<!--([\s\S]*?)-->/g,'$1').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1');}if(options.chars){options.chars(text);}return'';});index+=html.length-rest.length;html=rest;parseEndTag('</'+stackedTag+'>',stackedTag,index-endTagLength,index);}if(html===last){throw new Error('Error parsing template:\n\n'+html);}}// Clean up any remaining tags
parseEndTag();function advance(n){index+=n;html=html.substring(n);}function parseStartTag(){var start=html.match(startTagOpen);if(start){var match={tagName:start[1],attrs:[],start:index};advance(start[0].length);var end=void 0,attr=void 0;while(!(end=html.match(startTagClose))&&(attr=html.match(attribute))){advance(attr[0].length);match.attrs.push(attr);}if(end){match.unarySlash=end[1];advance(end[0].length);match.end=index;return match;}}}function handleStartTag(match){var tagName=match.tagName;var unarySlash=match.unarySlash;if(expectHTML){if(lastTag==='p'&&isNonPhrasingTag(tagName)){parseEndTag('',lastTag);}if(canBeLeftOpenTag(tagName)&&lastTag===tagName){parseEndTag('',tagName);}}var unary=isUnaryTag(tagName)||tagName==='html'&&lastTag==='head'||!!unarySlash;var l=match.attrs.length;var attrs=new Array(l);for(var i=0;i<l;i++){var args=match.attrs[i];// hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
if(IS_REGEX_CAPTURING_BROKEN&&args[0].indexOf('""')===-1){if(args[3]===''){delete args[3];}if(args[4]===''){delete args[4];}if(args[5]===''){delete args[5];}}var value=args[3]||args[4]||args[5]||'';attrs[i]={name:args[1],value:isFromDOM?decodeAttr(value,shouldDecodeTags):value};}if(!unary){stack.push({tag:tagName,attrs:attrs});lastTag=tagName;unarySlash='';}if(options.start){options.start(tagName,attrs,unary,match.start,match.end);}}function parseEndTag(tag,tagName,start,end){var pos=void 0;if(start==null)start=index;if(end==null)end=index;// Find the closest opened tag of the same type
if(tagName){var needle=tagName.toLowerCase();for(pos=stack.length-1;pos>=0;pos--){if(stack[pos].tag.toLowerCase()===needle){break;}}}else{// If no tag name is provided, clean shop
pos=0;}if(pos>=0){// Close all the open elements, up the stack
for(var i=stack.length-1;i>=pos;i--){if(options.end){options.end(stack[i].tag,start,end);}}// Remove the open elements from the stack
stack.length=pos;lastTag=pos&&stack[pos-1].tag;}else if(tagName.toLowerCase()==='br'){if(options.start){options.start(tagName,[],true,start,end);}}else if(tagName.toLowerCase()==='p'){if(options.start){options.start(tagName,[],false,start,end);}if(options.end){options.end(tagName,start,end);}}}}function parseFilters(exp){var inSingle=false;var inDouble=false;var curly=0;var square=0;var paren=0;var lastFilterIndex=0;var c=void 0,prev=void 0,i=void 0,expression=void 0,filters=void 0;for(i=0;i<exp.length;i++){prev=c;c=exp.charCodeAt(i);if(inSingle){// check single quote
if(c===0x27&&prev!==0x5C)inSingle=!inSingle;}else if(inDouble){// check double quote
if(c===0x22&&prev!==0x5C)inDouble=!inDouble;}else if(c===0x7C&&// pipe
exp.charCodeAt(i+1)!==0x7C&&exp.charCodeAt(i-1)!==0x7C&&!curly&&!square&&!paren){if(expression===undefined){// first filter, end of expression
lastFilterIndex=i+1;expression=exp.slice(0,i).trim();}else{pushFilter();}}else{switch(c){case 0x22:inDouble=true;break;// "
case 0x27:inSingle=true;break;// '
case 0x28:paren++;break;// (
case 0x29:paren--;break;// )
case 0x5B:square++;break;// [
case 0x5D:square--;break;// ]
case 0x7B:curly++;break;// {
case 0x7D:curly--;break;// }
}}}if(expression===undefined){expression=exp.slice(0,i).trim();}else if(lastFilterIndex!==0){pushFilter();}function pushFilter(){(filters||(filters=[])).push(exp.slice(lastFilterIndex,i).trim());lastFilterIndex=i+1;}if(filters){for(i=0;i<filters.length;i++){expression=wrapFilter(expression,filters[i]);}}return expression;}function wrapFilter(exp,filter){var i=filter.indexOf('(');if(i<0){// _f: resolveFilter
return'_f("'+filter+'")('+exp+')';}else{var name=filter.slice(0,i);var args=filter.slice(i+1);return'_f("'+name+'")('+exp+','+args;}}var defaultTagRE=/\{\{((?:.|\\n)+?)\}\}/g;var regexEscapeRE=/[-.*+?^${}()|[\]\/\\]/g;var buildRegex=cached(function(delimiters){var open=delimiters[0].replace(regexEscapeRE,'\\$&');var close=delimiters[1].replace(regexEscapeRE,'\\$&');return new RegExp(open+'((?:.|\\n)+?)'+close,'g');});function parseText(text,delimiters){var tagRE=delimiters?buildRegex(delimiters):defaultTagRE;if(!tagRE.test(text)){return;}var tokens=[];var lastIndex=tagRE.lastIndex=0;var match=void 0,index=void 0;while(match=tagRE.exec(text)){index=match.index;// push text token
if(index>lastIndex){tokens.push(JSON.stringify(text.slice(lastIndex,index)));}// tag token
var exp=parseFilters(match[1].trim());tokens.push('_s('+exp+')');lastIndex=index+match[0].length;}if(lastIndex<text.length){tokens.push(JSON.stringify(text.slice(lastIndex)));}return tokens.join('+');}function baseWarn(msg){console.error('[Vue parser]: '+msg);}function pluckModuleFunction(modules,key){return modules?modules.map(function(m){return m[key];}).filter(function(_){return _;}):[];}function addProp(el,name,value){(el.props||(el.props=[])).push({name:name,value:value});}function addAttr(el,name,value){(el.attrs||(el.attrs=[])).push({name:name,value:value});}function addDirective(el,name,value,arg,modifiers){(el.directives||(el.directives=[])).push({name:name,value:value,arg:arg,modifiers:modifiers});}function addHook(el,name,code){var hooks=el.hooks||(el.hooks={});var hook=hooks[name];/* istanbul ignore if */if(hook){hook.push(code);}else{hooks[name]=[code];}}function addHandler(el,name,value,modifiers,important){// check capture modifier
if(modifiers&&modifiers.capture){delete modifiers.capture;name='!'+name;// mark the event as captured
}var events=void 0;if(modifiers&&modifiers.native){delete modifiers.native;events=el.nativeEvents||(el.nativeEvents={});}else{events=el.events||(el.events={});}var newHandler={value:value,modifiers:modifiers};var handlers=events[name];/* istanbul ignore if */if(Array.isArray(handlers)){important?handlers.unshift(newHandler):handlers.push(newHandler);}else if(handlers){events[name]=important?[newHandler,handlers]:[handlers,newHandler];}else{events[name]=newHandler;}}function getBindingAttr(el,name,getStatic){var dynamicValue=getAndRemoveAttr(el,':'+name)||getAndRemoveAttr(el,'v-bind:'+name);if(dynamicValue!=null){return dynamicValue;}else if(getStatic!==false){var staticValue=getAndRemoveAttr(el,name);if(staticValue!=null){return JSON.stringify(staticValue);}}}function getAndRemoveAttr(el,name){var val=void 0;if((val=el.attrsMap[name])!=null){var list=el.attrsList;for(var i=0,l=list.length;i<l;i++){if(list[i].name===name){list.splice(i,1);break;}}}return val;}var dirRE=/^v-|^@|^:/;var forAliasRE=/(.*)\s+(?:in|of)\s+(.*)/;var forIteratorRE=/\(([^,]*),([^,]*)(?:,([^,]*))?\)/;var bindRE=/^:|^v-bind:/;var onRE=/^@|^v-on:/;var argRE=/:(.*)$/;var modifierRE=/\.[^\.]+/g;var decodeHTMLCached=cached(decodeHTML);// configurable state
var warn$1=void 0;var platformGetTagNamespace=void 0;var platformMustUseProp=void 0;var platformIsPreTag=void 0;var preTransforms=void 0;var transforms=void 0;var postTransforms=void 0;var delimiters=void 0;var seenSlots=void 0;/**
   * Convert HTML string to AST.
   */function parse(template,options){warn$1=options.warn||baseWarn;platformGetTagNamespace=options.getTagNamespace||no;platformMustUseProp=options.mustUseProp||no;platformIsPreTag=options.isPreTag||no;preTransforms=pluckModuleFunction(options.modules,'preTransformNode');transforms=pluckModuleFunction(options.modules,'transformNode');postTransforms=pluckModuleFunction(options.modules,'postTransformNode');delimiters=options.delimiters;seenSlots=Object.create(null);var stack=[];var preserveWhitespace=options.preserveWhitespace!==false;var root=void 0;var currentParent=void 0;var inVPre=false;var inPre=false;var warned=false;parseHTML(template,{expectHTML:options.expectHTML,isUnaryTag:options.isUnaryTag,isFromDOM:options.isFromDOM,shouldDecodeTags:options.shouldDecodeTags,start:function start(tag,attrs,unary){// check namespace.
// inherit parent ns if there is one
var ns=currentParent&&currentParent.ns||platformGetTagNamespace(tag);// handle IE svg bug
/* istanbul ignore if */if(options.isIE&&ns==='svg'){attrs=guardIESVGBug(attrs);}var element={type:1,tag:tag,attrsList:attrs,attrsMap:makeAttrsMap(attrs),parent:currentParent,children:[]};if(ns){element.ns=ns;}if("client"!=='server'&&isForbiddenTag(element)){element.forbidden=true;"development"!=='production'&&warn$1('Templates should only be responsbile for mapping the state to the '+'UI. Avoid placing tags with side-effects in your templates, such as '+('<'+tag+'>.'));}// apply pre-transforms
for(var i=0;i<preTransforms.length;i++){preTransforms[i](element,options);}if(!inVPre){processPre(element);if(element.pre){inVPre=true;}}if(platformIsPreTag(element.tag)){inPre=true;}if(inVPre){processRawAttrs(element);}else{processFor(element);processIf(element);processOnce(element);// determine whether this is a plain element after
// removing structural attributes
element.plain=!element.key&&!attrs.length;processKey(element);processRef(element);processSlot(element);processComponent(element);for(var _i=0;_i<transforms.length;_i++){transforms[_i](element,options);}processAttrs(element);}function checkRootConstraints(el){if(true){if(el.tag==='slot'||el.tag==='template'){warn$1('Cannot use <'+el.tag+'> as component root element because it may '+'contain multiple nodes:\n'+template);}if(el.attrsMap.hasOwnProperty('v-for')){warn$1('Cannot use v-for on stateful component root element because '+'it renders multiple elements:\n'+template);}}}// tree management
if(!root){root=element;checkRootConstraints(root);}else if("development"!=='production'&&!stack.length&&!warned){// allow 2 root elements with v-if and v-else
if(root.attrsMap.hasOwnProperty('v-if')&&element.attrsMap.hasOwnProperty('v-else')){checkRootConstraints(element);}else{warned=true;warn$1('Component template should contain exactly one root element:\n\n'+template);}}if(currentParent&&!element.forbidden){if(element.else){processElse(element,currentParent);}else{currentParent.children.push(element);element.parent=currentParent;}}if(!unary){currentParent=element;stack.push(element);}// apply post-transforms
for(var _i2=0;_i2<postTransforms.length;_i2++){postTransforms[_i2](element,options);}},end:function end(){// remove trailing whitespace
var element=stack[stack.length-1];var lastNode=element.children[element.children.length-1];if(lastNode&&lastNode.type===3&&lastNode.text===' '){element.children.pop();}// pop stack
stack.length-=1;currentParent=stack[stack.length-1];// check pre state
if(element.pre){inVPre=false;}if(platformIsPreTag(element.tag)){inPre=false;}},chars:function chars(text){if(!currentParent){if("development"!=='production'&&!warned){warned=true;warn$1('Component template should contain exactly one root element:\n\n'+template);}return;}text=inPre||text.trim()?decodeHTMLCached(text)// only preserve whitespace if its not right after a starting tag
:preserveWhitespace&&currentParent.children.length?' ':'';if(text){var expression=void 0;if(!inVPre&&text!==' '&&(expression=parseText(text,delimiters))){currentParent.children.push({type:2,expression:expression,text:text});}else{currentParent.children.push({type:3,text:text});}}}});return root;}function processPre(el){if(getAndRemoveAttr(el,'v-pre')!=null){el.pre=true;}}function processRawAttrs(el){var l=el.attrsList.length;if(l){var attrs=el.attrs=new Array(l);for(var i=0;i<l;i++){attrs[i]={name:el.attrsList[i].name,value:JSON.stringify(el.attrsList[i].value)};}}else if(!el.pre){// non root node in pre blocks with no attributes
el.plain=true;}}function processKey(el){var exp=getBindingAttr(el,'key');if(exp){el.key=exp;}}function processRef(el){var ref=getBindingAttr(el,'ref');if(ref){el.ref=ref;el.refInFor=checkInFor(el);}}function processFor(el){var exp=void 0;if(exp=getAndRemoveAttr(el,'v-for')){var inMatch=exp.match(forAliasRE);if(!inMatch){"development"!=='production'&&warn$1('Invalid v-for expression: '+exp);return;}el.for=inMatch[2].trim();var alias=inMatch[1].trim();var iteratorMatch=alias.match(forIteratorRE);if(iteratorMatch){el.alias=iteratorMatch[1].trim();el.iterator1=iteratorMatch[2].trim();if(iteratorMatch[3]){el.iterator2=iteratorMatch[3].trim();}}else{el.alias=alias;}}}function processIf(el){var exp=getAndRemoveAttr(el,'v-if');if(exp){el.if=exp;}if(getAndRemoveAttr(el,'v-else')!=null){el.else=true;}}function processElse(el,parent){var prev=findPrevElement(parent.children);if(prev&&prev.if){prev.elseBlock=el;}else if(true){warn$1('v-else used on element <'+el.tag+'> without corresponding v-if.');}}function processOnce(el){var once=getAndRemoveAttr(el,'v-once');if(once!=null){el.once=true;}}function processSlot(el){if(el.tag==='slot'){if(true){if(!el.attrsMap[':name']&&!el.attrsMap['v-bind:name']&&checkInFor(el)){warn$1('Static <slot> found inside v-for: they will not render correctly. '+'Render the list in parent scope and use a single <slot> instead.');}}el.slotName=getBindingAttr(el,'name');if(true){var name=el.slotName;if(seenSlots[name]){warn$1('Duplicate '+(name?'<slot> with name '+name:'default <slot>')+' '+'found in the same template.');}seenSlots[name]=true;}}else{var slotTarget=getBindingAttr(el,'slot');if(slotTarget){el.slotTarget=slotTarget;}}}function processComponent(el){var binding=void 0;if(binding=getBindingAttr(el,'is')){el.component=binding;}if(getAndRemoveAttr(el,'inline-template')!=null){el.inlineTemplate=true;}}function processAttrs(el){var list=el.attrsList;var i=void 0,l=void 0,name=void 0,value=void 0,arg=void 0,modifiers=void 0,isProp=void 0;for(i=0,l=list.length;i<l;i++){name=list[i].name;value=list[i].value;if(dirRE.test(name)){// mark element as dynamic
el.hasBindings=true;// modifiers
modifiers=parseModifiers(name);if(modifiers){name=name.replace(modifierRE,'');}if(bindRE.test(name)){// v-bind
name=name.replace(bindRE,'');if(modifiers&&modifiers.prop){isProp=true;name=camelize(name);if(name==='innerHtml')name='innerHTML';}if(isProp||platformMustUseProp(name)){addProp(el,name,value);}else{addAttr(el,name,value);}}else if(onRE.test(name)){// v-on
name=name.replace(onRE,'');addHandler(el,name,value,modifiers);}else{// normal directives
name=name.replace(dirRE,'');// parse arg
var argMatch=name.match(argRE);if(argMatch&&(arg=argMatch[1])){name=name.slice(0,-(arg.length+1));}addDirective(el,name,value,arg,modifiers);}}else{// literal attribute
if(true){var expression=parseText(value,delimiters);if(expression){warn$1(name+'="'+value+'": '+'Interpolation inside attributes has been deprecated. '+'Use v-bind or the colon shorthand instead.');}}addAttr(el,name,JSON.stringify(value));}}}function checkInFor(el){var parent=el;while(parent){if(parent.for!==undefined){return true;}parent=parent.parent;}return false;}function parseModifiers(name){var match=name.match(modifierRE);if(match){var _ret=function(){var ret={};match.forEach(function(m){ret[m.slice(1)]=true;});return{v:ret};}();if((typeof _ret==='undefined'?'undefined':_typeof(_ret))==="object")return _ret.v;}}function makeAttrsMap(attrs){var map={};for(var i=0,l=attrs.length;i<l;i++){if("development"!=='production'&&map[attrs[i].name]){warn$1('duplicate attribute: '+attrs[i].name);}map[attrs[i].name]=attrs[i].value;}return map;}function findPrevElement(children){var i=children.length;while(i--){if(children[i].tag)return children[i];}}function isForbiddenTag(el){return el.tag==='style'||el.tag==='script'&&(!el.attrsMap.type||el.attrsMap.type==='text/javascript');}var ieNSBug=/^xmlns:NS\d+/;var ieNSPrefix=/^NS\d+:/;/* istanbul ignore next */function guardIESVGBug(attrs){var res=[];for(var i=0;i<attrs.length;i++){var attr=attrs[i];if(!ieNSBug.test(attr.name)){attr.name=attr.name.replace(ieNSPrefix,'');res.push(attr);}}return res;}var isStaticKey=void 0;var isPlatformReservedTag=void 0;var genStaticKeysCached=cached(genStaticKeys$1);/**
   * Goal of the optimizier: walk the generated template AST tree
   * and detect sub-trees that are purely static, i.e. parts of
   * the DOM that never needs to change.
   *
   * Once we detect these sub-trees, we can:
   *
   * 1. Hoist them into constants, so that we no longer need to
   *    create fresh nodes for them on each re-render;
   * 2. Completely skip them in the patching process.
   */function optimize(root,options){if(!root)return;isStaticKey=genStaticKeysCached(options.staticKeys||'');isPlatformReservedTag=options.isReservedTag||function(){return false;};// first pass: mark all non-static nodes.
markStatic(root);// second pass: mark static roots.
markStaticRoots(root,false);}function genStaticKeys$1(keys){return makeMap('type,tag,attrsList,attrsMap,plain,parent,children,attrs'+(keys?','+keys:''));}function markStatic(node){node.static=isStatic(node);if(node.type===1){for(var i=0,l=node.children.length;i<l;i++){var child=node.children[i];markStatic(child);if(!child.static){node.static=false;}}}}function markStaticRoots(node,isInFor){if(node.type===1){if(node.once||node.static){node.staticRoot=true;node.staticInFor=isInFor;return;}if(node.children){for(var i=0,l=node.children.length;i<l;i++){markStaticRoots(node.children[i],!!node.for);}}}}function isStatic(node){if(node.type===2){// expression
return false;}if(node.type===3){// text
return true;}return!!(node.pre||!node.hasBindings&&// no dynamic bindings
!node.if&&!node.for&&// not v-if or v-for or v-else
!isBuiltInTag(node.tag)&&// not a built-in
isPlatformReservedTag(node.tag)&&// not a component
Object.keys(node).every(isStaticKey));}var simplePathRE=/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;// keyCode aliases
var keyCodes={esc:27,tab:9,enter:13,space:32,up:38,left:37,right:39,down:40,'delete':[8,46]};var modifierCode={stop:'$event.stopPropagation();',prevent:'$event.preventDefault();',self:'if($event.target !== $event.currentTarget)return;'};function genHandlers(events,native){var res=native?'nativeOn:{':'on:{';for(var name in events){res+='"'+name+'":'+genHandler(events[name])+',';}return res.slice(0,-1)+'}';}function genHandler(handler){if(!handler){return'function(){}';}else if(Array.isArray(handler)){return'['+handler.map(genHandler).join(',')+']';}else if(!handler.modifiers){return simplePathRE.test(handler.value)?handler.value:'function($event){'+handler.value+'}';}else{var code='';var keys=[];for(var key in handler.modifiers){if(modifierCode[key]){code+=modifierCode[key];}else{keys.push(key);}}if(keys.length){code=genKeyFilter(keys)+code;}var handlerCode=simplePathRE.test(handler.value)?handler.value+'($event)':handler.value;return'function($event){'+code+handlerCode+'}';}}function genKeyFilter(keys){var code=keys.length===1?normalizeKeyCode(keys[0]):Array.prototype.concat.apply([],keys.map(normalizeKeyCode));if(Array.isArray(code)){return'if('+code.map(function(c){return'$event.keyCode!=='+c;}).join('&&')+')return;';}else{return'if($event.keyCode!=='+code+')return;';}}function normalizeKeyCode(key){return parseInt(key,10)||// number keyCode
keyCodes[key]||// built-in alias
'_k('+JSON.stringify(key)+')'// custom alias
;}function bind$1(el,dir){addHook(el,'construct','_b(n1,'+dir.value+(dir.modifiers&&dir.modifiers.prop?',true':'')+')');}var baseDirectives={bind:bind$1,cloak:noop};// configurable state
var warn$2=void 0;var transforms$1=void 0;var dataGenFns=void 0;var platformDirectives$1=void 0;var staticRenderFns=void 0;var currentOptions=void 0;function generate(ast,options){// save previous staticRenderFns so generate calls can be nested
var prevStaticRenderFns=staticRenderFns;var currentStaticRenderFns=staticRenderFns=[];currentOptions=options;warn$2=options.warn||baseWarn;transforms$1=pluckModuleFunction(options.modules,'transformCode');dataGenFns=pluckModuleFunction(options.modules,'genData');platformDirectives$1=options.directives||{};var code=ast?genElement(ast):'_h("div")';staticRenderFns=prevStaticRenderFns;return{render:'with(this){return '+code+'}',staticRenderFns:currentStaticRenderFns};}function genElement(el){if(el.staticRoot&&!el.staticProcessed){// hoist static sub-trees out
el.staticProcessed=true;staticRenderFns.push('with(this){return '+genElement(el)+'}');return'_m('+(staticRenderFns.length-1)+(el.staticInFor?',true':'')+')';}else if(el.for&&!el.forProcessed){return genFor(el);}else if(el.if&&!el.ifProcessed){return genIf(el);}else if(el.tag==='template'&&!el.slotTarget){return genChildren(el)||'void 0';}else if(el.tag==='slot'){return genSlot(el);}else{// component or element
var code=void 0;if(el.component){code=genComponent(el);}else{var data=genData(el);var children=el.inlineTemplate?null:genChildren(el);code='_h(\''+el.tag+'\''+(data?','+data:''// data
)+(children?','+children:''// children
)+')';}// module transforms
for(var i=0;i<transforms$1.length;i++){code=transforms$1[i](el,code);}return code;}}function genIf(el){var exp=el.if;el.ifProcessed=true;// avoid recursion
return'('+exp+')?'+genElement(el)+':'+genElse(el);}function genElse(el){return el.elseBlock?genElement(el.elseBlock):'void 0';}function genFor(el){var exp=el.for;var alias=el.alias;var iterator1=el.iterator1?','+el.iterator1:'';var iterator2=el.iterator2?','+el.iterator2:'';el.forProcessed=true;// avoid recursion
return'('+exp+')&&_l(('+exp+'),'+('function('+alias+iterator1+iterator2+'){')+('return '+genElement(el))+'})';}function genData(el){if(el.plain){return;}var data='{';// directives first.
// directives may mutate the el's other properties before they are generated.
var dirs=genDirectives(el);if(dirs)data+=dirs+',';// key
if(el.key){data+='key:'+el.key+',';}// ref
if(el.ref){data+='ref:'+el.ref+',';}if(el.refInFor){data+='refInFor:true,';}// record original tag name for components using "is" attribute
if(el.component){data+='tag:"'+el.tag+'",';}// slot target
if(el.slotTarget){data+='slot:'+el.slotTarget+',';}// module data generation functions
for(var i=0;i<dataGenFns.length;i++){data+=dataGenFns[i](el);}// attributes
if(el.attrs){data+='attrs:{'+genProps(el.attrs)+'},';}// DOM props
if(el.props){data+='domProps:{'+genProps(el.props)+'},';}// hooks
if(el.hooks){data+='hook:{'+genHooks(el.hooks)+'},';}// event handlers
if(el.events){data+=genHandlers(el.events)+',';}if(el.nativeEvents){data+=genHandlers(el.nativeEvents,true)+',';}// inline-template
if(el.inlineTemplate){var ast=el.children[0];if("development"!=='production'&&(el.children.length>1||ast.type!==1)){warn$2('Inline-template components must have exactly one child element.');}if(ast.type===1){var inlineRenderFns=generate(ast,currentOptions);data+='inlineTemplate:{render:function(){'+inlineRenderFns.render+'},staticRenderFns:['+inlineRenderFns.staticRenderFns.map(function(code){return'function(){'+code+'}';}).join(',')+']}';}}return data.replace(/,$/,'')+'}';}function genDirectives(el){var dirs=el.directives;if(!dirs)return;var res='directives:[';var hasRuntime=false;var i=void 0,l=void 0,dir=void 0,needRuntime=void 0;for(i=0,l=dirs.length;i<l;i++){dir=dirs[i];needRuntime=true;var gen=platformDirectives$1[dir.name]||baseDirectives[dir.name];if(gen){// compile-time directive that manipulates AST.
// returns true if it also needs a runtime counterpart.
needRuntime=!!gen(el,dir,warn$2);}if(needRuntime){hasRuntime=true;res+='{name:"'+dir.name+'"'+(dir.value?',value:('+dir.value+'),expression:'+JSON.stringify(dir.value):'')+(dir.arg?',arg:"'+dir.arg+'"':'')+(dir.modifiers?',modifiers:'+JSON.stringify(dir.modifiers):'')+'},';}}if(hasRuntime){return res.slice(0,-1)+']';}}function genChildren(el){if(el.children.length){return'['+el.children.map(genNode).join(',')+']';}}function genNode(node){if(node.type===1){return genElement(node);}else{return genText(node);}}function genText(text){return text.type===2?text.expression// no need for () because already wrapped in _s()
:JSON.stringify(text.text);}function genSlot(el){var slot='$slots['+(el.slotName||'"default"')+']';var children=genChildren(el);return children?'('+slot+'||'+children+')':slot;}function genComponent(el){var children=genChildren(el);return'_h('+el.component+','+genData(el)+(children?','+children:'')+')';}function genProps(props){var res='';for(var i=0;i<props.length;i++){var prop=props[i];res+='"'+prop.name+'":'+prop.value+',';}return res.slice(0,-1);}function genHooks(hooks){var res='';for(var _key in hooks){res+='"'+_key+'":function(n1,n2){'+hooks[_key].join(';')+'},';}return res.slice(0,-1);}/**
   * Compile a template.
   */function compile$1(template,options){var ast=parse(template.trim(),options);optimize(ast,options);var code=generate(ast,options);return{ast:ast,render:code.render,staticRenderFns:code.staticRenderFns};}// operators like typeof, instanceof and in are allowed
var prohibitedKeywordRE=new RegExp('\\b'+('do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,'+'super,throw,while,yield,delete,export,import,return,switch,default,'+'extends,finally,continue,debugger,function,arguments').split(',').join('\\b|\\b')+'\\b');// check valid identifier for v-for
var identRE=/[A-Za-z_$][\w$]*/;// strip strings in expressions
var stripStringRE=/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;// detect problematic expressions in a template
function detectErrors(ast){var errors=[];if(ast){checkNode(ast,errors);}return errors;}function checkNode(node,errors){if(node.type===1){for(var name in node.attrsMap){if(dirRE.test(name)){var value=node.attrsMap[name];if(value){if(name==='v-for'){checkFor(node,'v-for="'+value+'"',errors);}else{checkExpression(value,name+'="'+value+'"',errors);}}}}if(node.children){for(var i=0;i<node.children.length;i++){checkNode(node.children[i],errors);}}}else if(node.type===2){checkExpression(node.expression,node.text,errors);}}function checkFor(node,text,errors){checkExpression(node.for||'',text,errors);checkIdentifier(node.alias,'v-for alias',text,errors);checkIdentifier(node.iterator1,'v-for iterator',text,errors);checkIdentifier(node.iterator2,'v-for iterator',text,errors);}function checkIdentifier(ident,type,text,errors){if(typeof ident==='string'&&!identRE.test(ident)){errors.push('- invalid '+type+' "'+ident+'" in expression: '+text);}}function checkExpression(exp,text,errors){try{new Function('return '+exp);}catch(e){var keywordMatch=exp.replace(stripStringRE,'').match(prohibitedKeywordRE);if(keywordMatch){errors.push('- avoid using JavaScript keyword as property name: '+('"'+keywordMatch[0]+'" in expression '+text));}else{errors.push('- invalid expression: '+text);}}}function transformNode(el,options){var warn=options.warn||baseWarn;var staticClass=getAndRemoveAttr(el,'class');if("development"!=='production'&&staticClass){var expression=parseText(staticClass,options.delimiters);if(expression){warn('class="'+staticClass+'": '+'Interpolation inside attributes has been deprecated. '+'Use v-bind or the colon shorthand instead.');}}if(staticClass){el.staticClass=JSON.stringify(staticClass);}var classBinding=getBindingAttr(el,'class',false/* getStatic */);if(classBinding){el.classBinding=classBinding;}}function genData$1(el){var data='';if(el.staticClass){data+='staticClass:'+el.staticClass+',';}if(el.classBinding){data+='class:'+el.classBinding+',';}return data;}var klass$1={staticKeys:['staticClass'],transformNode:transformNode,genData:genData$1};function transformNode$1(el){var styleBinding=getBindingAttr(el,'style',false/* getStatic */);if(styleBinding){el.styleBinding=styleBinding;}}function genData$2(el){return el.styleBinding?'style:('+el.styleBinding+'),':'';}var style$1={transformNode:transformNode$1,genData:genData$2};var modules$1=[klass$1,style$1];var warn$3=void 0;function model$1(el,dir,_warn){warn$3=_warn;var value=dir.value;var modifiers=dir.modifiers;if(el.tag==='select'){return genSelect(el,value);}else{switch(el.attrsMap.type){case'checkbox':genCheckboxModel(el,value);break;case'radio':genRadioModel(el,value);break;default:return genDefaultModel(el,value,modifiers);}}}function genCheckboxModel(el,value){if("development"!=='production'&&el.attrsMap.checked!=null){warn$3('<'+el.tag+' v-model="'+value+'" checked>:\n'+'inline checked attributes will be ignored when using v-model. '+'Declare initial values in the component\'s data option instead.');}var valueBinding=getBindingAttr(el,'value');var trueValueBinding=getBindingAttr(el,'true-value')||'true';var falseValueBinding=getBindingAttr(el,'false-value')||'false';addProp(el,'checked','Array.isArray('+value+')'+('?('+value+').indexOf('+valueBinding+')>-1')+(':('+value+')===('+trueValueBinding+')'));addHandler(el,'change','var $$a='+value+','+'$$el=$event.target,'+('$$c=$$el.checked?('+trueValueBinding+'):('+falseValueBinding+');')+'if(Array.isArray($$a)){'+('var $$v='+valueBinding+',')+'$$i=$$a.indexOf($$v);'+('if($$c){$$i<0&&('+value+'=$$a.concat($$v))}')+('else{$$i>-1&&('+value+'=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}')+('}else{'+value+'=$$c}'),null,true);}function genRadioModel(el,value){if("development"!=='production'&&el.attrsMap.checked!=null){warn$3('<'+el.tag+' v-model="'+value+'" checked>:\n'+'inline checked attributes will be ignored when using v-model. '+'Declare initial values in the component\'s data option instead.');}var valueBinding=getBindingAttr(el,'value');addProp(el,'checked','('+value+')===('+valueBinding+')');addHandler(el,'change',value+'='+valueBinding,null,true);}function genDefaultModel(el,value,modifiers){if(true){if(el.tag==='input'&&el.attrsMap.value){warn$3('<'+el.tag+' v-model="'+value+'" value="'+el.attrsMap.value+'">:\n'+'inline value attributes will be ignored when using v-model. '+'Declare initial values in the component\'s data option instead.');}if(el.tag==='textarea'&&el.children.length){warn$3('<textarea v-model="'+value+'">:\n'+'inline content inside <textarea> will be ignored when using v-model. '+'Declare initial values in the component\'s data option instead.');}}var type=el.attrsMap.type;var _ref=modifiers||{};var lazy=_ref.lazy;var number=_ref.number;var trim=_ref.trim;var event=lazy||isIE&&type==='range'?'change':'input';var needCompositionGuard=!lazy&&type!=='range';var isNative=el.tag==='input'||el.tag==='textarea';var valueExpression=isNative?'$event.target.value'+(trim?'.trim()':''):'$event';var code=number||type==='number'?value+'=_n('+valueExpression+')':value+'='+valueExpression;if(isNative&&needCompositionGuard){code='if($event.target.composing)return;'+code;}addProp(el,'value',isNative?'_s('+value+')':'('+value+')');addHandler(el,event,code,null,true);if(needCompositionGuard){// need runtime directive code to help with composition events
return true;}}function genSelect(el,value){if(true){el.children.some(checkOptionWarning);}var code=value+'=Array.prototype.filter'+'.call($event.target.options,function(o){return o.selected})'+'.map(function(o){return "_value" in o ? o._value : o.value})'+(el.attrsMap.multiple==null?'[0]':'');addHandler(el,'change',code,null,true);// need runtime to help with possible dynamically generated options
return true;}function checkOptionWarning(option){if(option.type===1&&option.tag==='option'&&option.attrsMap.selected!=null){var parentModel=option.parent&&option.parent.type===1&&option.parent.attrsMap['v-model'];warn$3('<select v-model="'+parentModel+'">:\n'+'inline selected attributes on <option> will be ignored when using v-model. '+'Declare initial values in the component\'s data option instead.');return true;}}function text(el,dir){if(dir.value){addProp(el,'textContent','_s('+dir.value+')');}}function html(el,dir){if(dir.value){addProp(el,'innerHTML','_s('+dir.value+')');}}var directives$1={model:model$1,text:text,html:html};var cache=Object.create(null);var baseOptions={isIE:isIE,expectHTML:true,modules:modules$1,staticKeys:genStaticKeys(modules$1),directives:directives$1,isReservedTag:isReservedTag,isUnaryTag:isUnaryTag,mustUseProp:mustUseProp,getTagNamespace:getTagNamespace,isPreTag:isPreTag};function compile(template,options){options=options?extend(extend({},baseOptions),options):baseOptions;return compile$1(template,options);}function compileToFunctions(template,options,vm){var _warn=options&&options.warn||warn;// detect possible CSP restriction
/* istanbul ignore if */if(true){try{new Function('return 1');}catch(e){if(e.toString().match(/unsafe-eval|CSP/)){_warn('It seems you are using the standalone build of Vue.js in an '+'environment with Content Security Policy that prohibits unsafe-eval. '+'The template compiler cannot work in this environment. Consider '+'relaxing the policy to allow unsafe-eval or pre-compiling your '+'templates into render functions.');}}}var key=options&&options.delimiters?String(options.delimiters)+template:template;if(cache[key]){return cache[key];}var res={};var compiled=compile(template,options);res.render=makeFunction(compiled.render);var l=compiled.staticRenderFns.length;res.staticRenderFns=new Array(l);for(var i=0;i<l;i++){res.staticRenderFns[i]=makeFunction(compiled.staticRenderFns[i]);}if(true){if(res.render===noop||res.staticRenderFns.some(function(fn){return fn===noop;})){_warn('failed to compile template:\n\n'+template+'\n\n'+detectErrors(compiled.ast).join('\n')+'\n\n',vm);}}return cache[key]=res;}function makeFunction(code){try{return new Function(code);}catch(e){return noop;}}var idToTemplate=cached(function(id){var el=query(id);return el&&el.innerHTML;});var mount=Vue.prototype.$mount;Vue.prototype.$mount=function(el,hydrating){el=el&&query(el);if(el===document.body||el===document.documentElement){"development"!=='production'&&warn('Do not mount Vue to <html> or <body> - mount to normal elements instead.');return this;}var options=this.$options;// resolve template/el and convert to render function
if(!options.render){var template=options.template;var isFromDOM=false;if(template){if(typeof template==='string'){if(template.charAt(0)==='#'){isFromDOM=true;template=idToTemplate(template);}}else if(template.nodeType){isFromDOM=true;template=template.innerHTML;}else{if(true){warn('invalid template option:'+template,this);}return this;}}else if(el){isFromDOM=true;template=getOuterHTML(el);}if(template){var _compileToFunctions=compileToFunctions(template,{warn:warn,isFromDOM:isFromDOM,shouldDecodeTags:shouldDecodeTags,delimiters:options.delimiters},this);var render=_compileToFunctions.render;var staticRenderFns=_compileToFunctions.staticRenderFns;options.render=render;options.staticRenderFns=staticRenderFns;}}return mount.call(this,el,hydrating);};/**
   * Get outerHTML of elements, taking care
   * of SVG elements in IE as well.
   */function getOuterHTML(el){if(el.outerHTML){return el.outerHTML;}else{var container=document.createElement('div');container.appendChild(el.cloneNode(true));return container.innerHTML;}}Vue.compile=compileToFunctions;return Vue;});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BasicExample_vue__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BasicExample_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__BasicExample_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__DelayExample_vue__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__DelayExample_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__DelayExample_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__RejectExample_vue__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__RejectExample_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__RejectExample_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ValidatorExample_vue__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ValidatorExample_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__ValidatorExample_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ValidateData_vue__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ValidateData_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__ValidateData_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ValidateEventExample_vue__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ValidateEventExample_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__ValidateEventExample_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__LocaleExample_vue__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__LocaleExample_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__LocaleExample_vue__);








// Register Examples.
/* harmony default export */ exports["a"] = function (Vue) {
    Vue.component('basic-example', __WEBPACK_IMPORTED_MODULE_0__BasicExample_vue___default.a);
    Vue.component('delay-example', __WEBPACK_IMPORTED_MODULE_1__DelayExample_vue___default.a);
    Vue.component('reject-example', __WEBPACK_IMPORTED_MODULE_2__RejectExample_vue___default.a);
    Vue.component('validator-example', __WEBPACK_IMPORTED_MODULE_3__ValidatorExample_vue___default.a);
    Vue.component('data-example', __WEBPACK_IMPORTED_MODULE_4__ValidateData_vue___default.a);
    Vue.component('event-example', __WEBPACK_IMPORTED_MODULE_5__ValidateEventExample_vue___default.a);
    Vue.component('locale-example', __WEBPACK_IMPORTED_MODULE_6__LocaleExample_vue___default.a);
};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__email__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__in__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__required__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__min__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__max__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__notIn__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__alpha__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__alpha_num__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__alpha_dash__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__numeric__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__regex__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ip__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ext__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__mimes__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__size__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__digits__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__image__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__dimensions__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__between__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__confirmed__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__url__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__decimal__ = __webpack_require__(30);





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
    url: __WEBPACK_IMPORTED_MODULE_20__url__["a" /* default */],
    decimal: __WEBPACK_IMPORTED_MODULE_21__decimal__["a" /* default */]
};

/***/ },
/* 7 */
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ },
/* 8 */
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ },
/* 9 */
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ },
/* 10 */
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ },
/* 11 */
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* script */
__vue_exports__ = __webpack_require__(15)

/* template */
var __vue_template__ = __webpack_require__(59)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (typeof __vue_exports__.default === "object") {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3", __vue_options__)
  } else {
    hotAPI.reload("data-v-3", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] App.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(47)

/* script */
__vue_exports__ = __webpack_require__(16)

/* template */
var __vue_template__ = __webpack_require__(56)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (typeof __vue_exports__.default === "object") {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1", __vue_options__)
  } else {
    hotAPI.reload("data-v-1", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] CodeBlock.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(48)

/* script */
__vue_exports__ = __webpack_require__(17)

/* template */
var __vue_template__ = __webpack_require__(58)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (typeof __vue_exports__.default === "object") {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2", __vue_options__)
  } else {
    hotAPI.reload("data-v-2", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] CodeExample.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ },
/* 15 */
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
    props: ['heading', 'subtitle'],

    mounted: function mounted() {
        var layout = this.$refs.layout;
        var menu = this.$refs.menu;
        var menuLink = this.$refs.menuLink;

        var toggleClass = function toggleClass(element, className) {
            var classes = element.className.split(/\s+/);
            var length = classes.length;

            for (var i = 0; i < length; i++) {
                if (classes[i] === className) {
                    classes.splice(i, 1);
                    break;
                }
            }
            // The className is not found
            if (length === classes.length) {
                classes.push(className);
            }

            element.className = classes.join(' ');
        };

        menuLink.onclick = function (e) {
            var active = 'active';

            e.preventDefault();
            toggleClass(layout, active);
            toggleClass(menu, active);
            toggleClass(menuLink, active);
        };
    }
};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _prismjs = __webpack_require__(24);

var _prismjs2 = _interopRequireDefault(_prismjs);

__webpack_require__(23);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//

exports.default = {
    methods: {
        removeWhitespace: function removeWhitespace() {
            var el = this.$refs.code;
            var txt = el.textContent.replace(/^[\r\n]+/, "").replace(/\s+$/g, "");

            if (/^\S/gm.test(txt)) {
                el.textContent = txt;
                return;
            }

            var mat = void 0;
            var str = void 0;
            var re = /^[\t ]+/gm;
            var len = void 0;
            var min = 1e3;

            while (mat = re.exec(txt)) {
                len = mat[0].length;

                if (len < min) {
                    min = len;
                    str = mat[0];
                }
            }

            if (min == 1e3) {
                return;
            }

            el.textContent = txt.replace(new RegExp("^" + str, 'gm'), "");
        }
    },
    mounted: function mounted() {
        this.removeWhitespace();
        _prismjs2.default.highlightElement(this.$refs.code);
    }
};

/***/ },
/* 17 */
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
    data: function data() {
        return {
            content: 'demo'
        };
    }
};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ar = __webpack_require__(22);

var _ar2 = _interopRequireDefault(_ar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    data: function data() {
        return {
            email: '',
            phone: ''
        };
    },
    created: function created() {
        this.$validator.updateDictionary({
            ar: _ar2.default.default
        });
        this.$validator.setLocale('ar');
    }
}; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/***/ },
/* 19 */
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
    data: function data() {
        return {
            email: '',
            name: ''
        };
    }
};

/***/ },
/* 20 */
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
    data: function data() {
        return {
            email: '',
            name: '',
            phone: '',
            url: ''
        };
    },

    methods: {
        validateBeforeSubmit: function validateBeforeSubmit(e) {
            this.$validator.validateAll();

            if (this.errors.any()) {
                e.preventDefault();
            }
        }
    }
};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _veeValidate = __webpack_require__(0);

exports.default = {
    validator: null,
    data: function data() {
        return {
            email: '',
            name: '',
            errors: []
        };
    },

    watch: {
        email: function email(value) {
            this.validator.validate('email', value);
        },
        name: function name(value) {
            this.validator.validate('name', value);
        }
    },
    methods: {
        validateForm: function validateForm() {
            this.validator.validateAll({
                email: this.email,
                name: this.name
            });
        },
        clearErrors: function clearErrors() {
            this.errors.clear();
        }
    },
    mounted: function mounted() {
        this.validator = new _veeValidate.Validator({
            email: 'required|email',
            name: 'required|alpha|min:3'
        });
        this.$set('errors', this.validator.errorBag);
    }
}; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* harmony default export */ exports["default"] = {
    alpha_dash: function alpha_dash(field) {
        return field + ' قد يحتوي على حروف او الرموز - و _.';
    },
    alpha_num: function alpha_num(field) {
        return field + ' قد يحتوي فقط على حروف وارقام.';
    },
    alpha: function alpha(field) {
        return field + ' يجب ان يحتوي على حروف فقط.';
    },
    between: function between(field, _ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var min = _ref2[0];
        var max = _ref2[1];
        return 'قيمة ' + field + ' يجب ان تكون ما بين ' + min + ' و ' + max + '.';
    },
    confirmed: function confirmed(field, _ref3) {
        var _ref4 = _slicedToArray(_ref3, 1);

        var confirmedField = _ref4[0];
        return field + ' لا يماثل التأكيد.';
    },
    decimal: function decimal(field) {
        var _ref5 = arguments.length <= 1 || arguments[1] === undefined ? ['*'] : arguments[1];

        var _ref6 = _slicedToArray(_ref5, 1);

        var decimals = _ref6[0];
        return field + ' يجب ان يكون قيمة رقمية وقد يحتوي على ' + (decimals === '*' ? '' : decimals) + ' ارقام عشرية.';
    },
    digits: function digits(field, _ref7) {
        var _ref8 = _slicedToArray(_ref7, 1);

        var length = _ref8[0];
        return field + ' يجب ان تحتوي فقط على ارقام والا يزيد عددها عن ' + length + ' رقم.';
    },
    dimensions: function dimensions(field, _ref9) {
        var _ref10 = _slicedToArray(_ref9, 2);

        var width = _ref10[0];
        var height = _ref10[1];
        return field + ' يجب ان تكون بمقاس ' + width + ' بكسل في ' + height + ' بكسل.';
    },
    email: function email(field) {
        return field + ' يجب ان يكون بريدا اليكتروني صحيح.';
    },
    ext: function ext(field) {
        return 'نوع ملف ' + field + ' غير صحيح.';
    },
    image: function image(field) {
        return field + ' يجب ان تكون صورة.';
    },
    in: function _in(field) {
        return 'الحقل ' + field + ' يجب ان يكون قيمة صحيحة.';
    },
    ip: function ip(field) {
        return field + ' يجب ان يكون ip صحيح.';
    },
    max: function max(field, _ref11) {
        var _ref12 = _slicedToArray(_ref11, 1);

        var length = _ref12[0];
        return 'الحقل ' + field + ' يجب ان يحتوي على ' + length + ' حروف على الأكثر.';
    },
    mimes: function mimes(field) {
        return 'نوع ملف ' + field + ' غير صحيح.';
    },
    min: function min(field, _ref13) {
        var _ref14 = _slicedToArray(_ref13, 1);

        var length = _ref14[0];
        return 'الحقل ' + field + ' يجب ان يحتوي على ' + length + ' حروف على الأقل.';
    },
    not_in: function not_in(field) {
        return 'الحقل ' + field + ' غير صحيح.';
    },
    numeric: function numeric(field) {
        return field + ' يمكن ان يحتوي فقط على ارقام.';
    },
    regex: function regex(field) {
        return 'الحقل ' + field + ' غير صحيح.';
    },
    required: function required(field) {
        return field + ' مطلوب.';
    },
    size: function size(field, _ref15) {
        var _ref16 = _slicedToArray(_ref15, 1);

        var _size = _ref16[0];
        return field + ' يجب ان يكون اقل من ' + _size + ' كيلوبايت.';
    },
    url: function url(field) {
        return 'الحقل ' + field + ' يجب ان يكون رابطاً صحيحاً.';
    }
};

/***/ },
/* 23 */
/***/ function(module, exports) {

(function () {

	if (typeof self === 'undefined' || !self.Prism || !self.document) {
		return;
	}

	// The languages map is built automatically with gulp
	var Languages = /*languages_placeholder[*/{ "html": "HTML", "xml": "XML", "svg": "SVG", "mathml": "MathML", "css": "CSS", "clike": "C-like", "javascript": "JavaScript", "abap": "ABAP", "actionscript": "ActionScript", "apacheconf": "Apache Configuration", "apl": "APL", "applescript": "AppleScript", "asciidoc": "AsciiDoc", "aspnet": "ASP.NET (C#)", "autoit": "AutoIt", "autohotkey": "AutoHotkey", "basic": "BASIC", "csharp": "C#", "cpp": "C++", "coffeescript": "CoffeeScript", "css-extras": "CSS Extras", "fsharp": "F#", "glsl": "GLSL", "http": "HTTP", "inform7": "Inform 7", "json": "JSON", "latex": "LaTeX", "lolcode": "LOLCODE", "matlab": "MATLAB", "mel": "MEL", "nasm": "NASM", "nginx": "nginx", "nsis": "NSIS", "objectivec": "Objective-C", "ocaml": "OCaml", "parigp": "PARI/GP", "php": "PHP", "php-extras": "PHP Extras", "powershell": "PowerShell", "protobuf": "Protocol Buffers", "jsx": "React JSX", "rest": "reST (reStructuredText)", "sas": "SAS", "sass": "Sass (Sass)", "scss": "Sass (Scss)", "sql": "SQL", "typescript": "TypeScript", "vhdl": "VHDL", "vim": "vim", "wiki": "Wiki markup", "yaml": "YAML" } /*]*/;
	Prism.hooks.add('before-highlight', function (env) {
		var pre = env.element.parentNode;
		if (!pre || !/pre/i.test(pre.nodeName)) {
			return;
		}
		var language = pre.getAttribute('data-language') || Languages[env.language] || env.language.substring(0, 1).toUpperCase() + env.language.substring(1);

		/* check if the divs already exist */
		var sib = pre.previousSibling;
		var div, div2;
		if (sib && /\s*\bprism-show-language\b\s*/.test(sib.className) && sib.firstChild && /\s*\bprism-show-language-label\b\s*/.test(sib.firstChild.className)) {
			div2 = sib.firstChild;
		} else {
			div = document.createElement('div');
			div2 = document.createElement('div');

			div2.className = 'prism-show-language-label';

			div.className = 'prism-show-language';
			div.appendChild(div2);

			pre.parentNode.insertBefore(div, pre);
		}

		div2.innerHTML = language;
	});
})();

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
/* **********************************************
     Begin prism-core.js
********************************************** */

var _self = typeof window !== 'undefined' ? window // if in browser
: typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope ? self // if in worker
: {} // if in node js
;

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = function () {

	// Private helper vars
	var lang = /\blang(?:uage)?-(\w+)\b/i;
	var uniqueId = 0;

	var _ = _self.Prism = {
		util: {
			encode: function encode(tokens) {
				if (tokens instanceof Token) {
					return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
				} else if (_.util.type(tokens) === 'Array') {
					return tokens.map(_.util.encode);
				} else {
					return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
				}
			},

			type: function type(o) {
				return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
			},

			objId: function objId(obj) {
				if (!obj['__id']) {
					Object.defineProperty(obj, '__id', { value: ++uniqueId });
				}
				return obj['__id'];
			},

			// Deep clone a language definition (e.g. to extend it)
			clone: function clone(o) {
				var type = _.util.type(o);

				switch (type) {
					case 'Object':
						var clone = {};

						for (var key in o) {
							if (o.hasOwnProperty(key)) {
								clone[key] = _.util.clone(o[key]);
							}
						}

						return clone;

					case 'Array':
						// Check for existence for IE8
						return o.map && o.map(function (v) {
							return _.util.clone(v);
						});
				}

				return o;
			}
		},

		languages: {
			extend: function extend(id, redef) {
				var lang = _.util.clone(_.languages[id]);

				for (var key in redef) {
					lang[key] = redef[key];
				}

				return lang;
			},

			/**
    * Insert a token before another token in a language literal
    * As this needs to recreate the object (we cannot actually insert before keys in object literals),
    * we cannot just provide an object, we need anobject and a key.
    * @param inside The key (or language id) of the parent
    * @param before The key to insert before. If not provided, the function appends instead.
    * @param insert Object with the key/value pairs to insert
    * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
    */
			insertBefore: function insertBefore(inside, before, insert, root) {
				root = root || _.languages;
				var grammar = root[inside];

				if (arguments.length == 2) {
					insert = arguments[1];

					for (var newToken in insert) {
						if (insert.hasOwnProperty(newToken)) {
							grammar[newToken] = insert[newToken];
						}
					}

					return grammar;
				}

				var ret = {};

				for (var token in grammar) {

					if (grammar.hasOwnProperty(token)) {

						if (token == before) {

							for (var newToken in insert) {

								if (insert.hasOwnProperty(newToken)) {
									ret[newToken] = insert[newToken];
								}
							}
						}

						ret[token] = grammar[token];
					}
				}

				// Update references in other language definitions
				_.languages.DFS(_.languages, function (key, value) {
					if (value === root[inside] && key != inside) {
						this[key] = ret;
					}
				});

				return root[inside] = ret;
			},

			// Traverse a language definition with Depth First Search
			DFS: function DFS(o, callback, type, visited) {
				visited = visited || {};
				for (var i in o) {
					if (o.hasOwnProperty(i)) {
						callback.call(o, i, o[i], type || i);

						if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
							visited[_.util.objId(o[i])] = true;
							_.languages.DFS(o[i], callback, null, visited);
						} else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
							visited[_.util.objId(o[i])] = true;
							_.languages.DFS(o[i], callback, i, visited);
						}
					}
				}
			}
		},
		plugins: {},

		highlightAll: function highlightAll(async, callback) {
			var env = {
				callback: callback,
				selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
			};

			_.hooks.run("before-highlightall", env);

			var elements = env.elements || document.querySelectorAll(env.selector);

			for (var i = 0, element; element = elements[i++];) {
				_.highlightElement(element, async === true, env.callback);
			}
		},

		highlightElement: function highlightElement(element, async, callback) {
			// Find language
			var language,
			    grammar,
			    parent = element;

			while (parent && !lang.test(parent.className)) {
				parent = parent.parentNode;
			}

			if (parent) {
				language = (parent.className.match(lang) || [, ''])[1].toLowerCase();
				grammar = _.languages[language];
			}

			// Set language on the element, if not present
			element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

			// Set language on the parent, for styling
			parent = element.parentNode;

			if (/pre/i.test(parent.nodeName)) {
				parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
			}

			var code = element.textContent;

			var env = {
				element: element,
				language: language,
				grammar: grammar,
				code: code
			};

			_.hooks.run('before-sanity-check', env);

			if (!env.code || !env.grammar) {
				_.hooks.run('complete', env);
				return;
			}

			_.hooks.run('before-highlight', env);

			if (async && _self.Worker) {
				var worker = new Worker(_.filename);

				worker.onmessage = function (evt) {
					env.highlightedCode = evt.data;

					_.hooks.run('before-insert', env);

					env.element.innerHTML = env.highlightedCode;

					callback && callback.call(env.element);
					_.hooks.run('after-highlight', env);
					_.hooks.run('complete', env);
				};

				worker.postMessage(JSON.stringify({
					language: env.language,
					code: env.code,
					immediateClose: true
				}));
			} else {
				env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				callback && callback.call(element);

				_.hooks.run('after-highlight', env);
				_.hooks.run('complete', env);
			}
		},

		highlight: function highlight(text, grammar, language) {
			var tokens = _.tokenize(text, grammar);
			return Token.stringify(_.util.encode(tokens), language);
		},

		tokenize: function tokenize(text, grammar, language) {
			var Token = _.Token;

			var strarr = [text];

			var rest = grammar.rest;

			if (rest) {
				for (var token in rest) {
					grammar[token] = rest[token];
				}

				delete grammar.rest;
			}

			tokenloop: for (var token in grammar) {
				if (!grammar.hasOwnProperty(token) || !grammar[token]) {
					continue;
				}

				var patterns = grammar[token];
				patterns = _.util.type(patterns) === "Array" ? patterns : [patterns];

				for (var j = 0; j < patterns.length; ++j) {
					var pattern = patterns[j],
					    inside = pattern.inside,
					    lookbehind = !!pattern.lookbehind,
					    greedy = !!pattern.greedy,
					    lookbehindLength = 0,
					    alias = pattern.alias;

					pattern = pattern.pattern || pattern;

					for (var i = 0; i < strarr.length; i++) {
						// Don’t cache length as it changes during the loop

						var str = strarr[i];

						if (strarr.length > text.length) {
							// Something went terribly wrong, ABORT, ABORT!
							break tokenloop;
						}

						if (str instanceof Token) {
							continue;
						}

						pattern.lastIndex = 0;

						var match = pattern.exec(str),
						    delNum = 1;

						// Greedy patterns can override/remove up to two previously matched tokens
						if (!match && greedy && i != strarr.length - 1) {
							// Reconstruct the original text using the next two tokens
							var nextToken = strarr[i + 1].matchedStr || strarr[i + 1],
							    combStr = str + nextToken;

							if (i < strarr.length - 2) {
								combStr += strarr[i + 2].matchedStr || strarr[i + 2];
							}

							// Try the pattern again on the reconstructed text
							pattern.lastIndex = 0;
							match = pattern.exec(combStr);
							if (!match) {
								continue;
							}

							var from = match.index + (lookbehind ? match[1].length : 0);
							// To be a valid candidate, the new match has to start inside of str
							if (from >= str.length) {
								continue;
							}
							var to = match.index + match[0].length,
							    len = str.length + nextToken.length;

							// Number of tokens to delete and replace with the new match
							delNum = 3;

							if (to <= len) {
								if (strarr[i + 1].greedy) {
									continue;
								}
								delNum = 2;
								combStr = combStr.slice(0, len);
							}
							str = combStr;
						}

						if (!match) {
							continue;
						}

						if (lookbehind) {
							lookbehindLength = match[1].length;
						}

						var from = match.index + lookbehindLength,
						    match = match[0].slice(lookbehindLength),
						    to = from + match.length,
						    before = str.slice(0, from),
						    after = str.slice(to);

						var args = [i, delNum];

						if (before) {
							args.push(before);
						}

						var wrapped = new Token(token, inside ? _.tokenize(match, inside) : match, alias, match, greedy);

						args.push(wrapped);

						if (after) {
							args.push(after);
						}

						Array.prototype.splice.apply(strarr, args);
					}
				}
			}

			return strarr;
		},

		hooks: {
			all: {},

			add: function add(name, callback) {
				var hooks = _.hooks.all;

				hooks[name] = hooks[name] || [];

				hooks[name].push(callback);
			},

			run: function run(name, env) {
				var callbacks = _.hooks.all[name];

				if (!callbacks || !callbacks.length) {
					return;
				}

				for (var i = 0, callback; callback = callbacks[i++];) {
					callback(env);
				}
			}
		}
	};

	var Token = _.Token = function (type, content, alias, matchedStr, greedy) {
		this.type = type;
		this.content = content;
		this.alias = alias;
		// Copy of the full string this token was created from
		this.matchedStr = matchedStr || null;
		this.greedy = !!greedy;
	};

	Token.stringify = function (o, language, parent) {
		if (typeof o == 'string') {
			return o;
		}

		if (_.util.type(o) === 'Array') {
			return o.map(function (element) {
				return Token.stringify(element, language, o);
			}).join('');
		}

		var env = {
			type: o.type,
			content: Token.stringify(o.content, language, parent),
			tag: 'span',
			classes: ['token', o.type],
			attributes: {},
			language: language,
			parent: parent
		};

		if (env.type == 'comment') {
			env.attributes['spellcheck'] = 'true';
		}

		if (o.alias) {
			var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
			Array.prototype.push.apply(env.classes, aliases);
		}

		_.hooks.run('wrap', env);

		var attributes = '';

		for (var name in env.attributes) {
			attributes += (attributes ? ' ' : '') + name + '="' + (env.attributes[name] || '') + '"';
		}

		return '<' + env.tag + ' class="' + env.classes.join(' ') + '" ' + attributes + '>' + env.content + '</' + env.tag + '>';
	};

	if (!_self.document) {
		if (!_self.addEventListener) {
			// in Node.js
			return _self.Prism;
		}
		// In worker
		_self.addEventListener('message', function (evt) {
			var message = JSON.parse(evt.data),
			    lang = message.language,
			    code = message.code,
			    immediateClose = message.immediateClose;

			_self.postMessage(_.highlight(code, _.languages[lang], lang));
			if (immediateClose) {
				_self.close();
			}
		}, false);

		return _self.Prism;
	}

	//Get current script and highlight
	var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

	if (script) {
		_.filename = script.src;

		if (document.addEventListener && !script.hasAttribute('data-manual')) {
			if (document.readyState !== "loading") {
				requestAnimationFrame(_.highlightAll, 0);
			} else {
				document.addEventListener('DOMContentLoaded', _.highlightAll);
			}
		}
	}

	return _self.Prism;
}();

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
	global.Prism = Prism;
}

/* **********************************************
     Begin prism-markup.js
********************************************** */

Prism.languages.markup = {
	'comment': /<!--[\w\W]*?-->/,
	'prolog': /<\?[\w\W]+?\?>/,
	'doctype': /<!DOCTYPE[\w\W]+?>/,
	'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,
	'tag': {
		pattern: /<\/?(?!\d)[^\s>\/=.$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
		inside: {
			'tag': {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: {
					'punctuation': /^<\/?/,
					'namespace': /^[^\s>\/:]+:/
				}
			},
			'attr-value': {
				pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
				inside: {
					'punctuation': /[=>"']/
				}
			},
			'punctuation': /\/?>/,
			'attr-name': {
				pattern: /[^\s>\/]+/,
				inside: {
					'namespace': /^[^\s>\/:]+:/
				}
			}

		}
	},
	'entity': /&#?[\da-z]{1,8};/i
};

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function (env) {

	if (env.type === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});

Prism.languages.xml = Prism.languages.markup;
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;

/* **********************************************
     Begin prism-css.js
********************************************** */

Prism.languages.css = {
	'comment': /\/\*[\w\W]*?\*\//,
	'atrule': {
		pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
		inside: {
			'rule': /@[\w-]+/
			// See rest below
		}
	},
	'url': /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
	'selector': /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
	'string': /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,
	'property': /(\b|\B)[\w-]+(?=\s*:)/i,
	'important': /\B!important\b/i,
	'function': /[-a-z0-9]+(?=\()/i,
	'punctuation': /[(){};:]/
};

Prism.languages.css['atrule'].inside.rest = Prism.util.clone(Prism.languages.css);

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'style': {
			pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
			lookbehind: true,
			inside: Prism.languages.css,
			alias: 'language-css'
		}
	});

	Prism.languages.insertBefore('inside', 'attr-value', {
		'style-attr': {
			pattern: /\s*style=("|').*?\1/i,
			inside: {
				'attr-name': {
					pattern: /^\s*style/i,
					inside: Prism.languages.markup.tag.inside
				},
				'punctuation': /^\s*=\s*['"]|['"]\s*$/,
				'attr-value': {
					pattern: /.+/i,
					inside: Prism.languages.css
				}
			},
			alias: 'language-css'
		}
	}, Prism.languages.markup.tag);
}

/* **********************************************
     Begin prism-clike.js
********************************************** */

Prism.languages.clike = {
	'comment': [{
		pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
		lookbehind: true
	}, {
		pattern: /(^|[^\\:])\/\/.*/,
		lookbehind: true
	}],
	'string': {
		pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'class-name': {
		pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
		lookbehind: true,
		inside: {
			punctuation: /(\.|\\)/
		}
	},
	'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	'boolean': /\b(true|false)\b/,
	'function': /[a-z0-9_]+(?=\()/i,
	'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	'punctuation': /[{}[\];(),.:]/
};

/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
	'number': /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
	'function': /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
		lookbehind: true,
		greedy: true
	}
});

Prism.languages.insertBefore('javascript', 'string', {
	'template-string': {
		pattern: /`(?:\\\\|\\?[^\\])*?`/,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /\$\{[^}]+\}/,
				inside: {
					'interpolation-punctuation': {
						pattern: /^\$\{|\}$/,
						alias: 'punctuation'
					},
					rest: Prism.languages.javascript
				}
			},
			'string': /[\s\S]+/
		}
	}
});

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'script': {
			pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
			lookbehind: true,
			inside: Prism.languages.javascript,
			alias: 'language-javascript'
		}
	});
}

Prism.languages.js = Prism.languages.javascript;

/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
		return;
	}

	self.Prism.fileHighlight = function () {

		var Extensions = {
			'js': 'javascript',
			'py': 'python',
			'rb': 'ruby',
			'ps1': 'powershell',
			'psm1': 'powershell',
			'sh': 'bash',
			'bat': 'batch',
			'h': 'c',
			'tex': 'latex'
		};

		if (Array.prototype.forEach) {
			// Check to prevent error in IE8
			Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (pre) {
				var src = pre.getAttribute('data-src');

				var language,
				    parent = pre;
				var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;
				while (parent && !lang.test(parent.className)) {
					parent = parent.parentNode;
				}

				if (parent) {
					language = (pre.className.match(lang) || [, ''])[1];
				}

				if (!language) {
					var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
					language = Extensions[extension] || extension;
				}

				var code = document.createElement('code');
				code.className = 'language-' + language;

				pre.textContent = '';

				code.textContent = 'Loading…';

				pre.appendChild(code);

				var xhr = new XMLHttpRequest();

				xhr.open('GET', src, true);

				xhr.onreadystatechange = function () {
					if (xhr.readyState == 4) {

						if (xhr.status < 400 && xhr.responseText) {
							code.textContent = xhr.responseText;

							Prism.highlightElement(code);
						} else if (xhr.status >= 400) {
							code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
						} else {
							code.textContent = '✖ Error: File does not exist or is empty';
						}
					}
				};

				xhr.send(null);
			});
		}
	};

	document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);
})();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (value) {
  return !Array.isArray(value) && /^[a-zA-Z]*$/.test(value);
};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (value) {
  return !Array.isArray(value) && /^[a-zA-Z0-9_-]*$/.test(value);
};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (value) {
  return !Array.isArray(value) && /^[a-zA-Z0-9]*$/.test(value);
};

/***/ },
/* 28 */
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
/* 29 */
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
/* 30 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* harmony default export */ exports["a"] = function (value) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? ['*'] : arguments[1];

    var _ref2 = _slicedToArray(_ref, 1);

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
};

/***/ },
/* 31 */
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
/* 32 */
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
            // Validate exact dimensions.
            var valid = image.width === Number(width) && image.height === Number(height);

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
/* 33 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (value) {
  return (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value)
  );
};

/***/ },
/* 34 */
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
/* 35 */
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
/* 36 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (value, options) {
  return !!options.filter(function (option) {
    return option == value;
  }).length;
}; // eslint-disable-line

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
// TODO: Maybe add ipv6 flag?
/* harmony default export */ exports["a"] = function (value) {
  return (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value)
  );
};

/***/ },
/* 38 */
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
/* harmony default export */ exports["a"] = function (value, options) {
  return !options.filter(function (option) {
    return option == value;
  }).length;
}; // eslint-disable-line

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony default export */ exports["a"] = function (value) {
  return !Array.isArray(value) && /^[0-9]*$/.test(value);
};

/***/ },
/* 43 */
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
/* 44 */
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
/* 45 */
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
/* 46 */
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
/* 47 */
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ },
/* 48 */
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* template */
var __vue_template__ = __webpack_require__(60)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (typeof __vue_exports__.default === "object") {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4", __vue_options__)
  } else {
    hotAPI.reload("data-v-4", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] BasicExample.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* template */
var __vue_template__ = __webpack_require__(62)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (typeof __vue_exports__.default === "object") {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6", __vue_options__)
  } else {
    hotAPI.reload("data-v-6", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] DelayExample.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* script */
__vue_exports__ = __webpack_require__(18)

/* template */
var __vue_template__ = __webpack_require__(64)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (typeof __vue_exports__.default === "object") {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-8", __vue_options__)
  } else {
    hotAPI.reload("data-v-8", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] LocaleExample.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* template */
var __vue_template__ = __webpack_require__(61)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (typeof __vue_exports__.default === "object") {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5", __vue_options__)
  } else {
    hotAPI.reload("data-v-5", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] RejectExample.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* script */
__vue_exports__ = __webpack_require__(19)

/* template */
var __vue_template__ = __webpack_require__(63)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (typeof __vue_exports__.default === "object") {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7", __vue_options__)
  } else {
    hotAPI.reload("data-v-7", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] ValidateData.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* script */
__vue_exports__ = __webpack_require__(20)

/* template */
var __vue_template__ = __webpack_require__(65)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (typeof __vue_exports__.default === "object") {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-9", __vue_options__)
  } else {
    hotAPI.reload("data-v-9", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] ValidateEventExample.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* script */
__vue_exports__ = __webpack_require__(21)

/* template */
var __vue_template__ = __webpack_require__(57)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (typeof __vue_exports__.default === "object") {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-10", __vue_options__)
  } else {
    hotAPI.reload("data-v-10", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] ValidatorExample.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

module.exports={render:function (){with(this) {
  return _h('pre', [_h('code', {
    ref: "code"
  }, [$slots["default"]])])
}},staticRenderFns: []}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-1", module.exports)
  }
}

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

module.exports={render:function (){with(this) {
  return _h('code-example', [_h('form', {
    slot: "example",
    staticClass: "pure-form pure-form-stacked"
  }, [_h('div', {
    staticClass: "pure-u-1"
  }, [_h('label', {
    class: {
      'error': errors.has('email')
    },
    attrs: {
      "for": "email"
    }
  }, ["Email"]), " ", _h('input', {
    directives: [{
      name: "model",
      value: (email),
      expression: "email"
    }],
    class: {
      'pure-input-1': true, 'has-error': errors.has('email')
    },
    attrs: {
      "name": "email",
      "type": "text",
      "placeholder": "Email"
    },
    domProps: {
      "value": _s(email)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) return;
        email = $event.target.value
      }
    }
  }), " ", _h('span', {
    directives: [{
      name: "show",
      value: (errors.has('email')),
      expression: "errors.has('email')"
    }],
    staticClass: "error"
  }, ["Errors: " + _s(_f("json")(errors.collect('email')))])]), " ", _h('div', {
    staticClass: "pure-u-1"
  }, [_h('label', {
    class: {
      'error': errors.has('name')
    },
    attrs: {
      "for": "name"
    }
  }, ["Full Name"]), " ", _h('input', {
    directives: [{
      name: "model",
      value: (name),
      expression: "name"
    }],
    class: {
      'pure-input-1': true, 'has-error': errors.has('name')
    },
    attrs: {
      "name": "name",
      "type": "text",
      "placeholder": "Full Name"
    },
    domProps: {
      "value": _s(name)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) return;
        name = $event.target.value
      }
    }
  }), " ", _h('span', {
    directives: [{
      name: "show",
      value: (errors.has('name')),
      expression: "errors.has('name')"
    }],
    staticClass: "error"
  }, ["Errors: " + _s(_f("json")(errors.collect('name')))])]), " ", _h('button', {
    staticClass: "pure-button pure-button-primary",
    attrs: {
      "type": "button",
      "name": "button"
    },
    on: {
      "click": validateForm
    }
  }, ["Validate All"]), " ", _h('button', {
    staticClass: "pure-button button-error",
    attrs: {
      "type": "button",
      "name": "button"
    },
    on: {
      "click": clearErrors
    }
  }, ["Clear"])]), " ", _h('div', {
    slot: "code-html"
  }, ["\n        <div id=\"app\">\n            <form class=\"pure-form pure-form-stacked\">\n                <div class=\"pure-u-1\">\n                    <label :class=\"{'error': errors.has('email') }\" for=\"email\">Email</label>\n                    <input v-model=\"email\" :class=\"{'pure-input-1': true, 'has-error': errors.has('email') }\" name=\"email\" type=\"text\" placeholder=\"Email\">\n                    <span class=\"error\" v-show=\"errors.has('email')\">" + _s(_f("json")(errors.collect('email'))) + "</span>\n                </div>\n                <div class=\"pure-u-1\">\n                    <label :class=\"{'error': errors.has('name') }\" for=\"name\">Full Name</label>\n                    <input v-model=\"name\" :class=\"{'pure-input-1': true, 'has-error': errors.has('name') }\" name=\"name\" type=\"text\" placeholder=\"Full Name\">\n                    <span class=\"error\" v-show=\"errors.has('name')\">" + _s(_f("json")(errors.collect('name'))) + "</span>\n                </div>\n                <button class=\"pure-button pure-button-primary\" @click=\"validateForm\" type=\"button\" name=\"button\">Validate All</button>\n                <button class=\"pure-button button-error\" @click=\"clearErrors\" type=\"button\" name=\"button\">Clear</button>\n            </form>\n        </div>\n    "]), " ", _h('div', {
    slot: "code-js"
  }, ["\n        import Vue from 'vue';\n        import { Validator } from 'vee-validate';\n\n        new Vue({\n            el: '#app',\n            validator: null, // private reference\n            data() {\n                return {\n                    email: '',\n                    name: '',\n                    errors: []\n                }\n            },\n            watch: {\n                email(value) {\n                    this.validator.validate('email', value);\n                },\n                name(value) {\n                    this.validator.validate('name', value);\n                }\n            },\n            methods: {\n                validateForm() {\n                    this.validator.validateAll({\n                        email: this.email,\n                        name: this.name\n                    });\n                },\n                clearErrors() {\n                    this.errors.clear();\n                }\n            },\n            ready() {\n                this.validator = new Validator({\n                    email: 'required|email',\n                    name: 'required|alpha|min:3'\n                });\n                this.$set('errors', this.validator.errorBag); // update the data.\n            }\n        });\n    "])])
}},staticRenderFns: []}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-10", module.exports)
  }
}

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

module.exports={render:function (){with(this) {
  return _h('div', {
    staticClass: "pure-g"
  }, [_h('div', {
    staticClass: "pure-u-1"
  }, [_h('div', {
    staticClass: "pure-menu pure-menu-horizontal"
  }, [_h('ul', {
    staticClass: "pure-menu-list"
  }, [_h('li', {
    class: {
      'pure-menu-item': true, 'pure-menu-selected': content === 'demo'
    }
  }, [_h('a', {
    staticClass: "pure-menu-link",
    on: {
      "click": function($event) {
        content = 'demo'
      }
    }
  }, [_m(0), "\n                        Demo\n                    "])]), " ", _h('li', {
    class: {
      'pure-menu-item': true, 'pure-menu-selected': content === 'html'
    }
  }, [_h('a', {
    staticClass: "pure-menu-link",
    on: {
      "click": function($event) {
        content = 'html'
      }
    }
  }, [_m(1), "\n                        HTML\n                    "])]), " ", _h('li', {
    class: {
      'pure-menu-item': true, 'pure-menu-selected': content === 'js'
    }
  }, [_h('a', {
    staticClass: "pure-menu-link",
    on: {
      "click": function($event) {
        content = 'js'
      }
    }
  }, [_m(2), "\n                        JavaScript\n                    "])])])])]), " ", _h('div', {
    directives: [{
      name: "show",
      value: (content === 'demo'),
      expression: "content === 'demo'"
    }],
    staticClass: "pure-u-1"
  }, [$slots["example"]]), " ", _h('div', {
    directives: [{
      name: "show",
      value: (content === 'html'),
      expression: "content === 'html'"
    }],
    staticClass: "pure-u-1"
  }, [_h('code-block', {
    staticClass: "language-html"
  }, [$slots["code-html"]])]), " ", _h('div', {
    directives: [{
      name: "show",
      value: (content === 'js'),
      expression: "content === 'js'"
    }],
    staticClass: "pure-u-1"
  }, [_h('code-block', {
    staticClass: "language-javascript"
  }, [$slots["code-js"]])])])
}},staticRenderFns: [function (){with(this) {
  return _h('i', {
    staticClass: "icon-play"
  })
}},function (){with(this) {
  return _h('i', {
    staticClass: "icon-html5"
  })
}},function (){with(this) {
  return _h('i', {
    staticClass: "icon-code"
  })
}}]}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-2", module.exports)
  }
}

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

module.exports={render:function (){with(this) {
  return _h('div', {
    ref: "layout",
    attrs: {
      "id": "layout"
    }
  }, [_h('a', {
    ref: "menuLink",
    staticClass: "menu-link",
    attrs: {
      "href": "#menu",
      "id": "menuLink"
    }
  }, [_m(0)]), " ", _h('div', {
    ref: "menu",
    attrs: {
      "id": "menu"
    }
  }, [_m(1), " ", _m(2)]), " ", _h('div', {
    attrs: {
      "id": "main"
    }
  }, [_h('div', {
    staticClass: "header"
  }, [_h('h1', [_s(heading)]), " ", _h('h2', [_s(subtitle)])]), " ", _h('div', {
    staticClass: "content"
  }, [$slots["default"]])])])
}},staticRenderFns: [function (){with(this) {
  return _h('span')
}},function (){with(this) {
  return _h('div', {
    staticClass: "pure-menu"
  }, [_h('a', {
    staticClass: "pure-menu-heading",
    attrs: {
      "href": "/"
    }
  }, ["Vee Validate"]), " ", _h('ul', {
    staticClass: "pure-menu-list"
  }, [_h('li', {
    staticClass: "pure-menu-item"
  }, [_h('a', {
    staticClass: "pure-menu-link",
    attrs: {
      "href": "index.html"
    }
  }, ["Getting Started"])]), " ", _h('li', {
    staticClass: "pure-menu-item"
  }, [_h('a', {
    staticClass: "pure-menu-link",
    attrs: {
      "href": "index.html#installation"
    }
  }, ["Installation"])]), " ", _h('li', {
    staticClass: "pure-menu-item"
  }, [_h('a', {
    staticClass: "pure-menu-link",
    attrs: {
      "href": "index.html#basic-example"
    }
  }, ["Basic Example"])]), " ", _h('li', {
    staticClass: "pure-menu-item"
  }, [_h('a', {
    staticClass: "pure-menu-link",
    attrs: {
      "href": "index.html#render-errors"
    }
  }, ["Rendering Errors"])]), " ", _h('li', {
    staticClass: "pure-menu-item"
  }, [_h('a', {
    staticClass: "pure-menu-link",
    attrs: {
      "href": "examples.html"
    }
  }, ["Examples"])]), " ", _h('li', {
    staticClass: "pure-menu-item"
  }, [_h('a', {
    staticClass: "pure-menu-link",
    attrs: {
      "href": "rules.html"
    }
  }, ["Validation Rules"])]), " ", _h('li', {
    staticClass: "pure-menu-item"
  }, [_h('a', {
    staticClass: "pure-menu-link",
    attrs: {
      "href": "localization.html"
    }
  }, ["Localization"])]), " ", _h('li', {
    staticClass: "pure-menu-item"
  }, [_h('a', {
    staticClass: "pure-menu-link",
    attrs: {
      "href": "api.html"
    }
  }, ["API Reference"])]), " ", _h('li', {
    staticClass: "pure-menu-item"
  }, [_h('a', {
    staticClass: "pure-menu-link",
    attrs: {
      "href": "index.html#configuration"
    }
  }, ["Configuration"])])])])
}},function (){with(this) {
  return _h('div', {
    staticClass: "about flex-center"
  }, [_h('a', {
    attrs: {
      "target": "github",
      "href": "https://github.com/logaretm/vee-validation"
    }
  }, [_h('i', {
    staticClass: "icon-github"
  })])])
}}]}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-3", module.exports)
  }
}

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

module.exports={render:function (){with(this) {
  return _h('code-example', [_h('form', {
    slot: "example",
    staticClass: "pure-form pure-form-stacked"
  }, [_h('div', {
    staticClass: "pure-u-1"
  }, [_h('label', {
    class: {
      'error': errors.has('email')
    },
    attrs: {
      "for": "email"
    }
  }, ["Email"]), " ", _h('input', {
    directives: [{
      name: "validate"
    }],
    class: {
      'pure-input-1': true, 'has-error': errors.has('email')
    },
    attrs: {
      "data-rules": "required|email",
      "name": "email",
      "type": "text",
      "placeholder": "Email"
    }
  }), " ", _h('span', {
    directives: [{
      name: "show",
      value: (errors.has('email')),
      expression: "errors.has('email')"
    }],
    staticClass: "error"
  }, [_s(errors.first('email'))])])]), " ", _h('div', {
    slot: "code-html"
  }, ["\n        <div id=\"app\">\n            <form class=\"pure-form pure-form-stacked\">\n                <div class=\"pure-u-1\">\n                    <label :class=\"{'error': errors.has('email') }\" for=\"email\">Email</label>\n                    <input v-validate data-rules=\"required|email\" :class=\"{'pure-input-1': true, 'has-error': errors.has('email') }\" name=\"email\" type=\"text\" placeholder=\"Email\">\n                    <span class=\"error\" v-show=\"errors.has('email')\">" + _s("{" + "{ errors.first('email') }" + "}") + "</span>\n                </div>\n            </form>\n        </div>\n    "]), " ", _h('div', {
    slot: "code-js"
  }, ["\n        import Vue from 'vue';\n        import VeeValidate from 'vee-validate';\n\n        Vue.use(VeeValidate);\n\n        new Vue({\n            el: '#app'\n        });\n    "])])
}},staticRenderFns: []}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-4", module.exports)
  }
}

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

module.exports={render:function (){with(this) {
  return _h('code-example', [_h('form', {
    slot: "example",
    staticClass: "pure-form pure-form-stacked"
  }, [_m(0), " ", _h('div', {
    staticClass: "pure-u-1"
  }, [_h('label', {
    class: {
      'error': errors.has('image')
    },
    attrs: {
      "for": "image"
    }
  }, ["Unrejected Image"]), " ", _h('input', {
    directives: [{
      name: "validate"
    }],
    class: {
      'pure-input-1': true, 'has-error': errors.has('image')
    },
    attrs: {
      "data-rules": "mimes:image/*",
      "name": "image",
      "type": "file"
    }
  }), " ", _h('span', {
    directives: [{
      name: "show",
      value: (errors.has('image')),
      expression: "errors.has('image')"
    }],
    staticClass: "error"
  }, [_s(errors.first('image'))])]), " ", _h('div', {
    staticClass: "pure-u-1"
  }, [_h('label', {
    class: {
      'error': errors.has('file')
    },
    attrs: {
      "for": "file"
    }
  }, ["Rejected Image"]), " ", _h('input', {
    directives: [{
      name: "validate",
      modifiers: {
        "reject": true
      }
    }],
    class: {
      'pure-input-1': true, 'has-error': errors.has('file')
    },
    attrs: {
      "data-rules": "mimes:image/*",
      "name": "file",
      "type": "file"
    }
  }), " ", _h('span', {
    directives: [{
      name: "show",
      value: (errors.has('file')),
      expression: "errors.has('file')"
    }],
    staticClass: "error"
  }, [_s(errors.first('file'))])])]), " ", _h('div', {
    slot: "code-html"
  }, ["\n        <div id=\"app\">\n            <form class=\"pure-form pure-form-stacked\">\n                <legend>File Upload</legend>\n                <div class=\"pure-u-1\">\n                    <label :class=\"{'error': errors.has('image') }\" for=\"image\">Unrejected Image</label>\n                    <input v-validate data-rules=\"mimes:image/*\" :class=\"{'pure-input-1': true, 'has-error': errors.has('image') }\" name=\"image\" type=\"file\">\n                    <span class=\"error\" v-show=\"errors.has('image')\">" + _s(errors.first('image')) + "</span>\n                </div>\n                <div class=\"pure-u-1\">\n                    <label :class=\"{'error': errors.has('file') }\" for=\"file\">Rejected Image</label>\n                    <input  v-validate.reject data-rules=\"mimes:image/*\" :class=\"{'pure-input-1': true, 'has-error': errors.has('file') }\" name=\"file\" type=\"file\">\n                    <span class=\"error\" v-show=\"errors.has('file')\">" + _s(errors.first('file')) + "</span>\n                </div>\n            </form>\n        </div>\n    "]), " ", _h('div', {
    slot: "code-js"
  }, ["\n        import Vue from 'vue';\n        import VeeValidate from 'vee-validate';\n\n        Vue.use(VeeValidate);\n\n        new Vue({\n            el: '#app'\n        });\n    "])])
}},staticRenderFns: [function (){with(this) {
  return _h('legend', ["File Upload"])
}}]}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-5", module.exports)
  }
}

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

module.exports={render:function (){with(this) {
  return _h('code-example', [_h('form', {
    slot: "example",
    staticClass: "pure-form pure-form-stacked"
  }, [_m(0), " ", _h('div', {
    staticClass: "pure-u-1"
  }, [_h('label', {
    class: {
      'error': errors.has('email')
    },
    attrs: {
      "for": "email"
    }
  }, ["Email - Delay: 500ms"]), " ", _h('input', {
    directives: [{
      name: "validate"
    }],
    class: {
      'pure-input-1': true, 'has-error': errors.has('email')
    },
    attrs: {
      "data-rules": "required|email",
      "data-delay": "500",
      "name": "email",
      "type": "text",
      "placeholder": "Email"
    }
  }), " ", _h('span', {
    directives: [{
      name: "show",
      value: (errors.has('email')),
      expression: "errors.has('email')"
    }],
    staticClass: "error"
  }, [_s(errors.first('email'))])]), " ", _h('div', {
    staticClass: "pure-u-1"
  }, [_h('label', {
    class: {
      'error': errors.has('name')
    },
    attrs: {
      "for": "name"
    }
  }, ["Name - Delay: 1s"]), " ", _h('input', {
    directives: [{
      name: "validate"
    }],
    class: {
      'pure-input-1': true, 'has-error': errors.has('name')
    },
    attrs: {
      "data-rules": "required|alpha|min:3",
      "data-delay": "1000",
      "name": "name",
      "type": "text",
      "placeholder": "Full Name"
    }
  }), " ", _h('span', {
    directives: [{
      name: "show",
      value: (errors.has('name')),
      expression: "errors.has('name')"
    }],
    staticClass: "error"
  }, [_s(errors.first('name'))])])]), " ", _h('div', {
    slot: "code-html"
  }, ["\n        <div id=\"app\">\n            <form class=\"pure-form pure-form-stacked\">\n                <legend>Basic Form</legend>\n                <div class=\"pure-u-1\">\n                    <label :class=\"{'error': errors.has('email') }\" for=\"email\">Email - Delay: 500ms</label>\n                    <input v-validate data-rules=\"required|email\" data-delay=\"500\" :class=\"{'pure-input-1': true, 'has-error': errors.has('email') }\" name=\"email\" type=\"email\" placeholder=\"Email\">\n                    <span class=\"error\" v-show=\"errors.has('email')\">" + _s("{" + "{ errors.first('email') }" + "}") + "</span>\n                </div>\n                <div class=\"pure-u-1\">\n                    <label :class=\"{'error': errors.has('name') }\" for=\"name\">Name - Delay: 1s</label>\n                    <input v-validate data-rules=\"required|alpha|min:3\" data-delay=\"1000\" :class=\"{'pure-input-1': true, 'has-error': errors.has('name') }\" name=\"name\" type=\"text\" placeholder=\"Full Name\">\n                    <span class=\"error\" v-show=\"errors.has('name')\">" + _s("{" + "{ errors.first('name') }" + "}") + "</span>\n                </div>\n            </form>\n        </div>\n    "]), " ", _h('div', {
    slot: "code-js"
  }, ["\n        import Vue from 'vue';\n        import VeeValidate from 'vee-validate';\n\n        Vue.use(VeeValidate);\n\n        new Vue({\n            el: '#app'\n        });\n    "])])
}},staticRenderFns: [function (){with(this) {
  return _h('legend', ["Debounced Form"])
}}]}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-6", module.exports)
  }
}

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

module.exports={render:function (){with(this) {
  return _h('code-example', [_h('form', {
    slot: "example",
    staticClass: "pure-form pure-form-stacked"
  }, [_h('div', {
    staticClass: "pure-u-1"
  }, [_h('label', {
    class: {
      'error': errors.has('email')
    },
    attrs: {
      "for": "email"
    }
  }, ["Email"]), " ", _h('input', {
    directives: [{
      name: "model",
      value: (email),
      expression: "email"
    }, {
      name: "validate",
      value: (email),
      expression: "email"
    }],
    class: {
      'pure-input-1': true, 'has-error': errors.has('email')
    },
    attrs: {
      "data-rules": "required|email",
      "type": "text",
      "placeholder": "Email"
    },
    domProps: {
      "value": _s(email)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) return;
        email = $event.target.value
      }
    }
  }), " ", _h('span', {
    directives: [{
      name: "show",
      value: (errors.has('email')),
      expression: "errors.has('email')"
    }],
    staticClass: "error"
  }, [_s(errors.first('email'))])]), " ", _h('div', {
    staticClass: "pure-u-1"
  }, [_h('label', {
    class: {
      'error': errors.has('name')
    },
    attrs: {
      "for": "name"
    }
  }, ["Full Name"]), " ", _h('input', {
    directives: [{
      name: "model",
      value: (name),
      expression: "name"
    }, {
      name: "validate",
      value: (name),
      expression: "name",
      modifiers: {
        "initial": true
      }
    }],
    class: {
      'pure-input-1': true, 'has-error': errors.has('name')
    },
    attrs: {
      "data-rules": "required|alpha",
      "type": "text",
      "placeholder": "Full Name"
    },
    domProps: {
      "value": _s(name)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) return;
        name = $event.target.value
      }
    }
  }), " ", _h('span', {
    directives: [{
      name: "show",
      value: (errors.has('name')),
      expression: "errors.has('name')"
    }],
    staticClass: "error"
  }, [_s(errors.first('name'))])])]), " ", _h('div', {
    slot: "code-html"
  }, ["\n        <div id=\"app\">\n            <form class=\"pure-form pure-form-stacked\">\n                <div class=\"pure-u-1\">\n                    <label :class=\"{'error': errors.has('email') }\" for=\"email\">Email</label>\n                    <input v-model=\"email\" v-validate=\"email\" data-rules=\"required|email\" :class=\"{'pure-input-1': true, 'has-error': errors.has('email') }\" type=\"text\" placeholder=\"Email\">\n                    <span class=\"error\" v-show=\"errors.has('email')\">" + _s("{" + "{ errors.first('email') }" + "}") + "</span>\n                </div>\n                <div class=\"pure-u-1\">\n                    <label :class=\"{'error': errors.has('name') }\" for=\"name\">Full Name</label>\n                    <input v-model=\"name\" v-validate.initial=\"name\" data-rules=\"required|alpha\" :class=\"{'pure-input-1': true, 'has-error': errors.has('name') }\" type=\"text\" placeholder=\"Full Name\">\n                    <span class=\"error\" v-show=\"errors.has('name')\">" + _s("{" + "{ errors.first('name') }" + "}") + "</span>\n                </div>\n            </form>\n        </div>\n    "]), " ", _h('div', {
    slot: "code-js"
  }, ["\n        import Vue from 'vue';\n        import VeeValidate from 'vee-validate';\n\n        Vue.use(VeeValidate);\n\n        new Vue({\n            el: '#app',\n            data: {\n                email: '',\n                name: ''\n            }\n        });\n    "])])
}},staticRenderFns: []}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-7", module.exports)
  }
}

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

module.exports={render:function (){with(this) {
  return _h('code-example', [_h('form', {
    slot: "example",
    staticClass: "pure-form pure-form-stacked rtl"
  }, [_h('div', {
    staticClass: "pure-u-1"
  }, [_h('label', {
    class: {
      'error': errors.has('email')
    },
    attrs: {
      "for": "email"
    }
  }, ["Email"]), " ", _h('input', {
    directives: [{
      name: "validate"
    }],
    class: {
      'pure-input-1': true, 'has-error': errors.has('email')
    },
    attrs: {
      "data-rules": "required|email",
      "data-as": "البريد",
      "name": "email",
      "type": "text"
    }
  }), " ", _h('span', {
    directives: [{
      name: "show",
      value: (errors.has('email')),
      expression: "errors.has('email')"
    }],
    staticClass: "error"
  }, [_s(errors.first('email'))])]), " ", _h('div', {
    staticClass: "pure-u-1"
  }, [_h('label', {
    class: {
      'error': errors.has('phone')
    },
    attrs: {
      "for": "phone"
    }
  }, ["Phone"]), " ", _h('input', {
    directives: [{
      name: "validate"
    }],
    class: {
      'pure-input-1': true, 'has-error': errors.has('phone')
    },
    attrs: {
      "data-rules": "required|numeric",
      "data-as": "رقم الهاتف",
      "name": "phone",
      "type": "text"
    }
  }), " ", _h('span', {
    directives: [{
      name: "show",
      value: (errors.has('phone')),
      expression: "errors.has('phone')"
    }],
    staticClass: "error"
  }, [_s(errors.first('phone'))])])]), " ", _h('div', {
    slot: "code-html"
  }, ["\n        <div id=\"app\">\n            <form class=\"pure-form pure-form-stacked rtl\">\n                <div class=\"pure-u-1\">\n                    <label :class=\"{'error': errors.has('email') }\" for=\"email\">Email</label>\n                    <input v-validate data-rules=\"required|email\" data-as=\"البريد\" :class=\"{'pure-input-1': true, 'has-error': errors.has('email') }\" name=\"email\" type=\"text\">\n                    <span class=\"error\" v-show=\"errors.has('email')\">" + _s("{" + "{ errors.first('email') }" + "}") + "</span>\n                </div>\n                <div class=\"pure-u-1\">\n                    <label :class=\"{'error': errors.has('phone') }\" for=\"phone\">Phone</label>\n                    <input v-validate data-rules=\"required|numeric\" data-as=\"رقم الهاتف\" :class=\"{'pure-input-1': true, 'has-error': errors.has('phone') }\" name=\"phone\" type=\"text\">\n                    <span class=\"error\" v-show=\"errors.has('phone')\">" + _s("{" + "{ errors.first('phone') }" + "}") + "</span>\n                </div>\n            </form>\n        </div>\n    "]), " ", _h('div', {
    slot: "code-js"
  }, ["\n        import ar from './locale/ar';\n        import Vue from 'vue';\n        import VeeValidate, { Validator } from 'vee-validate';\n        Vue.use(VeeValidate);\n\n        // Merge dictionary messages.\n        Validator.updateDictionary({ ar });\n\n        new Vue({\n            el: 'body',\n            data: {\n                phone: '',\n                email: ''\n            },\n            created() {\n                this.$validator.setLocale('ar'); // Switch locale for this instance.\n            }\n        });\n    "])])
}},staticRenderFns: []}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-8", module.exports)
  }
}

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

module.exports={render:function (){with(this) {
  return _h('code-example', [_h('form', {
    slot: "example",
    staticClass: "pure-form pure-form-stacked",
    on: {
      "submit": validateBeforeSubmit
    }
  }, [_h('div', {
    staticClass: "pure-u-1"
  }, [_h('label', {
    class: {
      'error': errors.has('email')
    },
    attrs: {
      "for": "email"
    }
  }, ["Email"]), " ", _h('input', {
    directives: [{
      name: "model",
      value: (email),
      expression: "email"
    }, {
      name: "validate",
      value: (email),
      expression: "email",
      modifiers: {
        "initial": true
      }
    }],
    class: {
      'pure-input-1': true, 'has-error': errors.has('email')
    },
    attrs: {
      "data-rules": "required|email",
      "type": "text",
      "placeholder": "Email"
    },
    domProps: {
      "value": _s(email)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) return;
        email = $event.target.value
      }
    }
  }), " ", _h('span', {
    directives: [{
      name: "show",
      value: (errors.has('email')),
      expression: "errors.has('email')"
    }],
    staticClass: "error"
  }, [_s(errors.first('email'))])]), " ", _h('div', {
    staticClass: "pure-u-1"
  }, [_h('label', {
    class: {
      'error': errors.has('name')
    },
    attrs: {
      "for": "name"
    }
  }, ["Name"]), " ", _h('input', {
    directives: [{
      name: "model",
      value: (name),
      expression: "name"
    }, {
      name: "validate",
      value: (name),
      expression: "name",
      modifiers: {
        "initial": true
      }
    }],
    class: {
      'pure-input-1': true, 'has-error': errors.has('name')
    },
    attrs: {
      "data-rules": "required|alpha|min:3",
      "type": "text",
      "placeholder": "Name"
    },
    domProps: {
      "value": _s(name)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) return;
        name = $event.target.value
      }
    }
  }), " ", _h('span', {
    directives: [{
      name: "show",
      value: (errors.has('name')),
      expression: "errors.has('name')"
    }],
    staticClass: "error"
  }, [_s(errors.first('name'))])]), " ", _h('div', {
    staticClass: "pure-u-1"
  }, [_h('label', {
    class: {
      'error': errors.has('phone')
    },
    attrs: {
      "for": "phone"
    }
  }, ["Phone Number"]), " ", _h('input', {
    directives: [{
      name: "model",
      value: (phone),
      expression: "phone"
    }, {
      name: "validate",
      value: (phone),
      expression: "phone",
      modifiers: {
        "initial": true
      }
    }],
    class: {
      'pure-input-1': true, 'has-error': errors.has('phone')
    },
    attrs: {
      "data-rules": "required|numeric",
      "type": "text",
      "placeholder": "Phone"
    },
    domProps: {
      "value": _s(phone)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) return;
        phone = $event.target.value
      }
    }
  }), " ", _h('span', {
    directives: [{
      name: "show",
      value: (errors.has('phone')),
      expression: "errors.has('phone')"
    }],
    staticClass: "error"
  }, [_s(errors.first('phone'))])]), " ", _h('div', {
    staticClass: "pure-u-1"
  }, [_h('label', {
    class: {
      'error': errors.has('url')
    },
    attrs: {
      "for": "url"
    }
  }, ["Website"]), " ", _h('input', {
    directives: [{
      name: "model",
      value: (url),
      expression: "url"
    }, {
      name: "validate",
      value: (url),
      expression: "url",
      modifiers: {
        "initial": true
      }
    }],
    class: {
      'pure-input-1': true, 'has-error': errors.has('url')
    },
    attrs: {
      "data-rules": "required|url",
      "type": "text",
      "placeholder": "Website"
    },
    domProps: {
      "value": _s(url)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) return;
        url = $event.target.value
      }
    }
  }), " ", _h('span', {
    directives: [{
      name: "show",
      value: (errors.has('url')),
      expression: "errors.has('url')"
    }],
    staticClass: "error"
  }, [_s(errors.first('url'))])]), " ", _m(0)]), " ", _h('div', {
    slot: "code-html"
  }, ["\n        <div id=\"app\">\n            <form @submit=\"validateBeforeSubmit\" class=\"pure-form pure-form-stacked\">\n                <div class=\"pure-u-1\">\n                    <label :class=\"{'error': errors.has('email') }\" for=\"email\">Email</label>\n                    <input v-model=\"email\" v-validate.initial=\"email\" data-rules=\"required|email\" :class=\"{'pure-input-1': true, 'has-error': errors.has('email') }\" type=\"text\" placeholder=\"Email\">\n                    <span class=\"error\" v-show=\"errors.has('email')\">" + _s("{" + "{ errors.first('email') }" + "}") + "</span>\n                </div>\n                <div class=\"pure-u-1\">\n                    <label :class=\"{'error': errors.has('name') }\" for=\"name\">Name</label>\n                    <input v-model=\"name\" v-validate.initial=\"name\" data-rules=\"required|alpha|min:3\" :class=\"{'pure-input-1': true, 'has-error': errors.has('name') }\" type=\"text\" placeholder=\"Full Name\">\n                    <span class=\"error\" v-show=\"errors.has('name')\">" + _s("{" + "{ errors.first('name') }" + "}") + "</span>\n                </div>\n                <div class=\"pure-u-1\">\n                    <label :class=\"{'error': errors.has('phone') }\" for=\"phone\">Phone Number</label>\n                    <input v-model=\"phone\" v-validate.initial=\"phone\" data-rules=\"required|numeric\" :class=\"{'pure-input-1': true, 'has-error': errors.has('phone') }\" type=\"text\" placeholder=\"Phone\">\n                    <span class=\"error\" v-show=\"errors.has('phone')\">" + _s("{" + "{ errors.first('phone') }" + "}") + "</span>\n                </div>\n                <div class=\"pure-u-1\">\n                    <label :class=\"{'error': errors.has('url') }\" for=\"url\">Website</label>\n                    <input v-model=\"url\" v-validate.initial=\"url\" data-rules=\"required|url\" :class=\"{'pure-input-1': true, 'has-error': errors.has('url') }\" type=\"text\" placeholder=\"Website\">\n                    <span class=\"error\" v-show=\"errors.has('url')\">" + _s("{" + "{ errors.first('url') }" + "}") + "</span>\n                </div>\n\n                <input class=\"pure-button pure-button-primary\" type=\"submit\">\n            </form>\n        </div>\n    "]), " ", _h('div', {
    slot: "code-js"
  }, ["\n        import Vue from 'vue';\n        import Vee from 'vee-validate';\n\n        new Vue({\n            el: '#app',\n            data() {\n                return {\n                    email: '',\n                    name: '',\n                    phone: '',\n                    url: '',\n                };\n            },\n            methods: {\n                validateBeforeSubmit(e) {\n                    // Note that validateAll here is missing the values parameter, which tells the validator\n                    // to trigger validation for attached inputs.\n                    this.$validator.validateAll();\n\n                    if (this.errors.any()) {\n                        e.preventDefault();\n                    }\n                }\n            }\n        });\n    "])])
}},staticRenderFns: [function (){with(this) {
  return _h('input', {
    staticClass: "pure-button pure-button-primary",
    attrs: {
      "type": "submit"
    }
  })
}}]}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-9", module.exports)
  }
}

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_purecss_build_pure_css__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_purecss_build_pure_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_purecss_build_pure_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prismjs_themes_prism_css__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prismjs_themes_prism_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prismjs_themes_prism_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prismjs_plugins_show_language_prism_show_language_css__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prismjs_plugins_show_language_prism_show_language_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_prismjs_plugins_show_language_prism_show_language_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_prismjs_plugins_line_numbers_prism_line_numbers_css__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_prismjs_plugins_line_numbers_prism_line_numbers_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_prismjs_plugins_line_numbers_prism_line_numbers_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vue_dist_vue_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vue_dist_vue_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_vue_dist_vue_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_collectionsjs__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_collectionsjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_collectionsjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__dist_vee_validate__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__dist_vee_validate___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__dist_vee_validate__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_examples__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_CodeExample_vue__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_CodeExample_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__components_CodeExample_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_CodeBlock_vue__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_CodeBlock_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__components_CodeBlock_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__App_vue__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__App_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__App_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__sass_main_scss__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__sass_main_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11__sass_main_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__src_rules__ = __webpack_require__(6);














__WEBPACK_IMPORTED_MODULE_4_vue_dist_vue_js___default.a.use(__WEBPACK_IMPORTED_MODULE_6__dist_vee_validate___default.a);
__WEBPACK_IMPORTED_MODULE_4_vue_dist_vue_js___default.a.use(__WEBPACK_IMPORTED_MODULE_7__components_examples__["a" /* default */]);
__WEBPACK_IMPORTED_MODULE_4_vue_dist_vue_js___default.a.component('code-example', __WEBPACK_IMPORTED_MODULE_8__components_CodeExample_vue___default.a);
__WEBPACK_IMPORTED_MODULE_4_vue_dist_vue_js___default.a.component('code-block', __WEBPACK_IMPORTED_MODULE_9__components_CodeBlock_vue___default.a);

new __WEBPACK_IMPORTED_MODULE_4_vue_dist_vue_js___default.a({
    el: '#app',
    data: {
        rules: new __WEBPACK_IMPORTED_MODULE_5_collectionsjs___default.a(Object.keys(__WEBPACK_IMPORTED_MODULE_12__src_rules__["a" /* default */])).sort().chunk(10).all()
    },
    components: {
        App: __WEBPACK_IMPORTED_MODULE_10__App_vue___default.a
    }
});

/***/ }
/******/ ]);