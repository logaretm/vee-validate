/**
 * vee-validate v2.0.0-rc.13
 * (c) 2017 Abdelrahman Awad
 * @license MIT
 */
/**
 * Some Alpha Regex helpers.
 * https://github.com/chriso/validator.js/blob/master/src/lib/alpha.js
 */

const alpha$1 = {
  en: /^[A-Z]*$/i,
  cs: /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]*$/i,
  da: /^[A-ZÆØÅ]*$/i,
  de: /^[A-ZÄÖÜß]*$/i,
  es: /^[A-ZÁÉÍÑÓÚÜ]*$/i,
  fr: /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]*$/i,
  lt: /^[A-ZĄČĘĖĮŠŲŪŽ]*$/i,
  nl: /^[A-ZÉËÏÓÖÜ]*$/i,
  hu: /^[A-ZÁÉÍÓÖŐÚÜŰ]*$/i,
  pl: /^[A-ZĄĆĘŚŁŃÓŻŹ]*$/i,
  pt: /^[A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ]*$/i,
  ru: /^[А-ЯЁ]*$/i,
  sk: /^[A-ZÁÄČĎÉÍĹĽŇÓŔŠŤÚÝŽ]*$/i,
  sr: /^[A-ZČĆŽŠĐ]*$/i,
  tr: /^[A-ZÇĞİıÖŞÜ]*$/i,
  uk: /^[А-ЩЬЮЯЄІЇҐ]*$/i,
  ar: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]*$/
};

const alphaSpaces = {
  en: /^[A-Z\s]*$/i,
  cs: /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ\s]*$/i,
  da: /^[A-ZÆØÅ\s]*$/i,
  de: /^[A-ZÄÖÜß\s]*$/i,
  es: /^[A-ZÁÉÍÑÓÚÜ\s]*$/i,
  fr: /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ\s]*$/i,
  lt: /^[A-ZĄČĘĖĮŠŲŪŽ\s]*$/i,
  nl: /^[A-ZÉËÏÓÖÜ\s]*$/i,
  hu: /^[A-ZÁÉÍÓÖŐÚÜŰ\s]*$/i,
  pl: /^[A-ZĄĆĘŚŁŃÓŻŹ\s]*$/i,
  pt: /^[A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ\s]*$/i,
  ru: /^[А-ЯЁ\s]*$/i,
  sk: /^[A-ZÁÄČĎÉÍĹĽŇÓŔŠŤÚÝŽ\s]*$/i,
  sr: /^[A-ZČĆŽŠĐ\s]*$/i,
  tr: /^[A-ZÇĞİıÖŞÜ\s]*$/i,
  uk: /^[А-ЩЬЮЯЄІЇҐ\s]*$/i,
  ar: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ\s]*$/
};

const alphanumeric = {
  en: /^[0-9A-Z]*$/i,
  cs: /^[0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]*$/i,
  da: /^[0-9A-ZÆØÅ]$/i,
  de: /^[0-9A-ZÄÖÜß]*$/i,
  es: /^[0-9A-ZÁÉÍÑÓÚÜ]*$/i,
  fr: /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]*$/i,
  lt: /^[0-9A-ZĄČĘĖĮŠŲŪŽ]*$/i,
  hu: /^[0-9A-ZÁÉÍÓÖŐÚÜŰ]*$/i,
  nl: /^[0-9A-ZÉËÏÓÖÜ]*$/i,
  pl: /^[0-9A-ZĄĆĘŚŁŃÓŻŹ]*$/i,
  pt: /^[0-9A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ]*$/i,
  ru: /^[0-9А-ЯЁ]*$/i,
  sk: /^[0-9A-ZÁÄČĎÉÍĹĽŇÓŔŠŤÚÝŽ]*$/i,
  sr: /^[0-9A-ZČĆŽŠĐ]*$/i,
  tr: /^[0-9A-ZÇĞİıÖŞÜ]*$/i,
  uk: /^[0-9А-ЩЬЮЯЄІЇҐ]*$/i,
  ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]*$/
};

const alphaDash = {
  en: /^[0-9A-Z_-]*$/i,
  cs: /^[0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ_-]*$/i,
  da: /^[0-9A-ZÆØÅ_-]*$/i,
  de: /^[0-9A-ZÄÖÜß_-]*$/i,
  es: /^[0-9A-ZÁÉÍÑÓÚÜ_-]*$/i,
  fr: /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ_-]*$/i,
  lt: /^[0-9A-ZĄČĘĖĮŠŲŪŽ_-]*$/i,
  nl: /^[0-9A-ZÉËÏÓÖÜ_-]*$/i,
  hu: /^[0-9A-ZÁÉÍÓÖŐÚÜŰ_-]*$/i,
  pl: /^[0-9A-ZĄĆĘŚŁŃÓŻŹ_-]*$/i,
  pt: /^[0-9A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ_-]*$/i,
  ru: /^[0-9А-ЯЁ_-]*$/i,
  sk: /^[0-9A-ZÁÄČĎÉÍĹĽŇÓŔŠŤÚÝŽ_-]*$/i,
  sr: /^[0-9A-ZČĆŽŠĐ_-]*$/i,
  tr: /^[0-9A-ZÇĞİıÖŞÜ_-]*$/i,
  uk: /^[0-9А-ЩЬЮЯЄІЇҐ_-]*$/i,
  ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ_-]*$/
};

const validate = (value, [locale] = [null]) => {
  if (Array.isArray(value)) {
    return value.every(val => validate(val, [locale]));
  }

  // Match at least one locale.
  if (! locale) {
    return Object.keys(alpha$1).some(loc => alpha$1[loc].test(value));
  }

  return (alpha$1[locale] || alpha$1.en).test(value);
};

const validate$1 = (value, [locale] = [null]) => {
  if (Array.isArray(value)) {
    return value.every(val => validate$1(val, [locale]));
  }

  // Match at least one locale.
  if (! locale) {
    return Object.keys(alphaDash).some(loc => alphaDash[loc].test(value));
  }

  return (alphaDash[locale] || alphaDash.en).test(value);
};

const validate$2 = (value, [locale] = [null]) => {
  if (Array.isArray(value)) {
    return value.every(val => validate$2(val, [locale]));
  }

  // Match at least one locale.
  if (! locale) {
    return Object.keys(alphanumeric).some(loc => alphanumeric[loc].test(value));
  }

  return (alphanumeric[locale] || alphanumeric.en).test(value);
};

const validate$3 = (value, [locale] = [null]) => {
  if (Array.isArray(value)) {
    return value.every(val => validate$3(val, [locale]));
  }

  // Match at least one locale.
  if (! locale) {
    return Object.keys(alphaSpaces).some(loc => alphaSpaces[loc].test(value));
  }

  return (alphaSpaces[locale] || alphaSpaces.en).test(value);
};

const validate$4 = (value, [min, max]) => {
  if (Array.isArray(value)) {
    return value.every(val => validate$4(val, [min, max]));
  }

  return Number(min) <= value && Number(max) >= value;
};

var confirmed = (value, other) => String(value) === String(other);

function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var assertString_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = assertString;
function assertString(input) {
  var isString = typeof input === 'string' || input instanceof String;

  if (!isString) {
    throw new TypeError('This library (validator.js) validates strings only');
  }
}
module.exports = exports['default'];
});

var isCreditCard_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isCreditCard;



var _assertString2 = _interopRequireDefault(assertString_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable max-len */
var creditCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11}|62[0-9]{14})$/;
/* eslint-enable max-len */

function isCreditCard(str) {
  (0, _assertString2.default)(str);
  var sanitized = str.replace(/[- ]+/g, '');
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
});

var isCreditCard = unwrapExports(isCreditCard_1);

var credit_card = (value) => isCreditCard(String(value));

const validate$5 = (value, params) => {
  const decimals = Array.isArray(params) ? (params[0] || '*') : '*';
  if (Array.isArray(value)) {
    return value.every(val => validate$5(val, params));
  }

  if (value === null || value === undefined || value === '') {
    return true;
  }

  // if is 0.
  if (Number(decimals) === 0) {
    return /^-?\d*$/.test(value);
  }

  const regexPart = decimals === '*' ? '+' : `{1,${decimals}}`;
  const regex = new RegExp(`^-?\\d*(\\.\\d${regexPart})?$`);

  if (! regex.test(value)) {
    return false;
  }

  const parsedValue = parseFloat(value);

  // eslint-disable-next-line
    return parsedValue === parsedValue;
};

const validate$6 = (value, [length]) => {
  if (Array.isArray(value)) {
    return value.every(val => validate$6(val, [length]));
  }
  const strVal = String(value);

  return /^[0-9]*$/.test(strVal) && strVal.length === Number(length);
};

const validateImage = (file, width, height) => {
  const URL = window.URL || window.webkitURL;
  return new Promise(resolve => {
    const image = new Image();
    image.onerror = () => resolve({ valid: false });
    image.onload = () => resolve({
      valid: image.width === Number(width) && image.height === Number(height)
    });

    image.src = URL.createObjectURL(file);
  });
};

var dimensions = (files, [width, height]) => {
  const list = [];
  for (let i = 0; i < files.length; i++) {
    // if file is not an image, reject.
    if (! /\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(files[i].name)) {
      return false;
    }

    list.push(files[i]);
  }

  return Promise.all(list.map(file => validateImage(file, width, height)));
};

var merge_1 = createCommonjsModule(function (module, exports) {
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
});

var isByteLength_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = isByteLength;



var _assertString2 = _interopRequireDefault(assertString_1);

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
});

var isFQDN = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isFDQN;



var _assertString2 = _interopRequireDefault(assertString_1);



var _merge2 = _interopRequireDefault(merge_1);

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
    // disallow spaces
    if (/[\s\u2002-\u200B\u202F\u205F\u3000\uFEFF\uDB40\uDC20]/.test(tld)) {
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
    // disallow full-width chars
    if (/[\uff01-\uff5e]/.test(part)) {
      return false;
    }
    if (part[0] === '-' || part[part.length - 1] === '-') {
      return false;
    }
  }
  return true;
}
module.exports = exports['default'];
});

var isEmail_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isEmail;



var _assertString2 = _interopRequireDefault(assertString_1);



var _merge2 = _interopRequireDefault(merge_1);



var _isByteLength2 = _interopRequireDefault(isByteLength_1);



var _isFQDN2 = _interopRequireDefault(isFQDN);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_email_options = {
  allow_display_name: false,
  require_display_name: false,
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

  if (options.require_display_name || options.allow_display_name) {
    var display_email = str.match(displayName);
    if (display_email) {
      str = display_email[1];
    } else if (options.require_display_name) {
      return false;
    }
  }

  var parts = str.split('@');
  var domain = parts.pop();
  var user = parts.join('@');

  var lower_domain = domain.toLowerCase();
  if (lower_domain === 'gmail.com' || lower_domain === 'googlemail.com') {
    user = user.replace(/\./g, '').toLowerCase();
  }

  if (!(0, _isByteLength2.default)(user, { max: 64 }) || !(0, _isByteLength2.default)(domain, { max: 254 })) {
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
});

var isEmail = unwrapExports(isEmail_1);

const validate$7 = (value) => {
  if (Array.isArray(value)) {
    return value.every(val => isEmail(String(val)));
  }

  return isEmail(String(value));
};

var ext = (files, extensions) => {
  const regex = new RegExp(`.(${extensions.join('|')})$`, 'i');

  return files.every(file => regex.test(file.name));
};

var image = (files) => files.every(file =>
  /\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(file.name)
);

const validate$8 = (value, options) => {
  if (Array.isArray(value)) {
    return value.every(val => validate$8(val, options));
  }

  // eslint-disable-next-line
  return !! options.filter(option => option == value).length;
};

var isIP_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isIP;



var _assertString2 = _interopRequireDefault(assertString_1);

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
});

var isIP = unwrapExports(isIP_1);

var ip = (value, [version] = [4]) => {
  if (Array.isArray(value)) {
    return value.every(val => isIP(val, [version]));
  }

  return isIP(value, version);
};

var max = (value, [length]) => {
  if (value === undefined || value === null) {
    return length >= 0;
  }

  return String(value).length <= length;
};

var max_value = (value, [max]) => {
  if (Array.isArray(value) || value === null || value === undefined || value === '') {
    return false;
  }

  return Number(value) <= max;
};

var mimes = (files, mimes) => {
  const regex = new RegExp(`${mimes.join('|').replace('*', '.+')}$`, 'i');

  return files.every(file => regex.test(file.type));
};

var min = (value, [length]) => {
  if (value === undefined || value === null) {
    return false;
  }
  return String(value).length >= length;
};

var min_value = (value, [min]) => {
  if (Array.isArray(value) || value === null || value === undefined || value === '') {
    return false;
  }

  return Number(value) >= min;
};

const validate$9 = (value, options) => {
  if (Array.isArray(value)) {
    return value.every(val => validate$9(val, options));
  }

  // eslint-disable-next-line
  return ! options.filter(option => option == value).length;
};

var numeric = (value) => {
  if (Array.isArray(value)) {
    return value.every(val => /^[0-9]+$/.test(String(val)));
  }

  return /^[0-9]+$/.test(String(value));
};

var regex = (value, [regex, ...flags]) => {
  if (regex instanceof RegExp) {
    return regex.test(value);
  }

  return new RegExp(regex, flags).test(String(value));
};

var required = (value, params = [false]) => {
  if (Array.isArray(value)) {
    return !! value.length;
  }

  // incase a field considers `false` as an empty value like checkboxes.
  const invalidateFalse = params[0];
  if (value === false && invalidateFalse) {
    return false;
  }

  if (value === undefined || value === null) {
    return false;
  }

  return !! String(value).trim().length;
};

var size = (files, [size]) => {
  if (isNaN(size)) {
    return false;
  }

  const nSize = Number(size) * 1024;
  for (let i = 0; i < files.length; i++) {
    if (files[i].size > nSize) {
      return false;
    }
  }

  return true;
};

var isURL_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isURL;



var _assertString2 = _interopRequireDefault(assertString_1);



var _isFQDN2 = _interopRequireDefault(isFQDN);



var _isIP2 = _interopRequireDefault(isIP_1);



var _merge2 = _interopRequireDefault(merge_1);

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
  if (!url || url.length >= 2083 || /[\s<>]/.test(url)) {
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

  port_str = null;
  ipv6 = null;
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
});

var isURL = unwrapExports(isURL_1);

var url = (value, [requireProtocol] = [true]) => {
  const options = { require_protocol: !!requireProtocol, allow_underscores: true };
  if (Array.isArray(value)) {
    return value.every(val => isURL(val, options));
  }

  return isURL(value, options);
};

/* eslint-disable camelcase */
var Rules = {
  alpha_dash: validate$1,
  alpha_num: validate$2,
  alpha_spaces: validate$3,
  alpha: validate,
  between: validate$4,
  confirmed,
  credit_card,
  decimal: validate$5,
  digits: validate$6,
  dimensions,
  email: validate$7,
  ext,
  image,
  in: validate$8,
  ip,
  max,
  max_value,
  mimes,
  min,
  min_value,
  not_in: validate$9,
  numeric,
  regex,
  required,
  size,
  url
};

/**
 * Gets the data attribute. the name must be kebab-case.
 */
const getDataAttribute = (el, name) => el.getAttribute(`data-vv-${name}`);

/**
 * Sets the data attribute.
 * @param {*} el
 * @param {String} name
 * @param {String} value
 */
const setDataAttribute = (el, name, value) => el.setAttribute(`data-vv-${name}`, value);

/**
 * Shallow object comparison.
 *
 * @param {*} lhs 
 * @param {*} rhs 
 * @return {Boolean}
 */
const isEqual = (lhs, rhs) => {
  if (lhs instanceof RegExp && rhs instanceof RegExp) {
    return isEqual(lhs.source, rhs.source) && isEqual(lhs.flags, rhs.flags);
  }

  // if both are objects, compare each key recursively.
  if (isObject(lhs) && isObject(rhs)) {
    return Object.keys(lhs).every(key => {
      return isEqual(lhs[key], rhs[key]);
    }) && Object.keys(rhs).every(key => {
      return isEqual(lhs[key], rhs[key]);
    });
  }

  return lhs === rhs;
};

/**
 * Determines the input field scope.
 */
const getScope = (el) => {
  let scope = getDataAttribute(el, 'scope');
  if (! scope && el.form) {
    scope = getDataAttribute(el.form, 'scope');
  }

  return scope || null;
};

/**
 * Gets the value in an object safely.
 * @param {String} propPath
 * @param {Object} target
 * @param {*} def
 */
const getPath = (propPath, target, def = undefined) => {
  if (!propPath || !target) return def;
  let value = target;
  propPath.split('.').every(prop => {
    if (! Object.prototype.hasOwnProperty.call(value, prop) && value[prop] === undefined) {
      value = def;

      return false;
    }

    value = value[prop];

    return true;
  });

  return value;
};

/**
 * Checks if path exists within an object.
 *
 * @param {String} path
 * @param {Object} target
 */
const hasPath = (path, target) => {
  let obj = target;
  return path.split('.').every(prop => {
    if (! Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }

    obj = obj[prop];

    return true;
  });
};

/**
 * @param {String} rule
 */
const parseRule = (rule) => {
  let params = [];
  const name = rule.split(':')[0];

  if (~rule.indexOf(':')) {
    params = rule.split(':').slice(1).join(':').split(',');
  }

  return { name, params };
};

/**
 * Normalizes the given rules expression.
 *
 * @param {Object|String} rules
 */
const normalizeRules = (rules) => {
  // if falsy value return an empty object.
  if (!rules) {
    return {};
  }

  const validations = {};
  if (isObject(rules)) {
    Object.keys(rules).forEach(rule => {
      let params = [];
      if (rules[rule] === true) {
        params = [];
      } else if (Array.isArray(rules[rule])) {
        params = rules[rule];
      } else {
        params = [rules[rule]];
      }

      if (rules[rule] !== false) {
        validations[rule] = params;
      }
    });

    return validations;
  }

  rules.split('|').forEach(rule => {
    const parsedRule = parseRule(rule);
    if (! parsedRule.name) {
      return;
    }

    validations[parsedRule.name] = parsedRule.params;
  });

  return validations;
};

/**
 * Debounces a function.
 */
const debounce = (fn, wait = 0, immediate = false) => {
  if (wait === 0) {
    return fn;
  }

  let timeout;

  return (...args) => {
    const later = () => {
      timeout = null;
      if (!immediate) fn(...args);
    };
    /* istanbul ignore next */
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    /* istanbul ignore next */
    if (callNow) fn(...args);
  };
};

/**
 * Emits a warning to the console.
 */
const warn = (message) => {
  console.warn(`[vee-validate] ${message}`); // eslint-disable-line
};

/**
 * Creates a branded error object.
 * @param {String} message
 */
const createError = (message) => new Error(`[vee-validate] ${message}`);

/**
 * Checks if the value is an object.
 */
const isObject = (object) =>
  object !== null && object && typeof object === 'object' && ! Array.isArray(object);

/**
 * Checks if a function is callable.
 */
const isCallable = (func) => typeof func === 'function';

/**
 * Check if element has the css class on it.
 */
const hasClass = (el, className) => {
  if (el.classList) {
    return el.classList.contains(className);
  }

  return !!el.className.match(new RegExp(`(\\s|^)${className}(\\s|$)`));
};

/**
 * Adds the provided css className to the element.
 */
const addClass = (el, className) => {
  if (el.classList) {
    el.classList.add(className);
    return;
  }

  if (!hasClass(el, className)) {
    el.className += ` ${className}`;
  }
};

/**
 * Remove the provided css className from the element.
 */
const removeClass = (el, className) => {
  if (el.classList) {
    el.classList.remove(className);
    return;
  }

  if (hasClass(el, className)) {
    const reg = new RegExp(`(\\s|^)${className}(\\s|$)`);
    el.className = el.className.replace(reg, ' ');
  }
};

/**
 * Adds or removes a class name on the input depending on the status flag.
 */
const toggleClass = (el, className, status) => {
  if (!el || !className) return;

  if (status) {
    return addClass(el, className);
  }

  removeClass(el, className);
};

/**
 * Converts an array-like object to array.
 * Simple polyfill for Array.from
 */
const toArray = (arrayLike) => {
  if (isCallable(Array.from)) {
    return Array.from(arrayLike);
  }

  const array = [];
  const length = arrayLike.length;
  for (let i = 0; i < length; i++) {
    array.push(arrayLike[i]);
  }

  return array;
};

/**
 * Assign polyfill from the mdn.
 * @param {Object} target
 * @return {Object}
 */
const assign = (target, ...others) => {
  /* istanbul ignore else */
  if (isCallable(Object.assign)) {
    return Object.assign(target, ...others);
  }

  /* istanbul ignore next */
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  /* istanbul ignore next */
  const to = Object(target);
  /* istanbul ignore next */
  others.forEach(arg => {
    // Skip over if undefined or null
    if (arg != null) {
      Object.keys(arg).forEach(key => {
        to[key] = arg[key];
      });
    }
  });
  /* istanbul ignore next */
  return to;
};

/**
 * Generates a unique id.
 * @return {String}
 */
const uniqId = () => `_${Math.random().toString(36).substr(2, 9)}`;

/**
 * polyfills array.find
 * @param {Array} array
 * @param {Function} predicate
 */
const find = (array, predicate) => {
  if (isObject(array)) {
    array = toArray(array);
  }
  if (array.find) {
    return array.find(predicate);
  }
  let result;
  array.some(item => {
    if (predicate(item)) {
      result = item;
      return true;
    }

    return false;
  });

  return result;
};

const getInputEventName = (el) => {
  if (el && (el.tagName === 'SELECT' || ~['radio', 'checkbox', 'file'].indexOf(el.type))) {
    return 'change';
  }

  return 'input';
};

class ErrorBag {
  constructor () {
    this.items = [];
  }

  /**
     * Adds an error to the internal array.
     *
     * @param {Object} error The error object.
     */
  add (error) {
    // handle old signature.
    if (arguments.length > 1) {
      error = {
        field: arguments[0],
        msg: arguments[1],
        rule: arguments[2],
        scope: arguments[3] || null
      };
    }

    error.scope = error.scope || null;
    this.items.push(error);
  }

  /**
   * Updates a field error with the new field scope.
   *
   * @param {String} id 
   * @param {Object} error 
   */
  update (id, error) {
    const item = find(this.items, i => i.id === id);
    if (!item) {
      return;
    }

    const idx = this.items.indexOf(item);
    this.items.splice(idx, 1);
    item.scope = error.scope;
    this.items.push(item);
  }

  /**
     * Gets all error messages from the internal array.
     *
     * @param {String} scope The Scope name, optional.
     * @return {Array} errors Array of all error messages.
     */
  all (scope) {
    if (! scope) {
      return this.items.map(e => e.msg);
    }

    return this.items.filter(e => e.scope === scope).map(e => e.msg);
  }

  /**
     * Checks if there are any errors in the internal array.
     * @param {String} scope The Scope name, optional.
     * @return {boolean} result True if there was at least one error, false otherwise.
     */
  any (scope) {
    if (! scope) {
      return !! this.items.length;
    }

    return !! this.items.filter(e => e.scope === scope).length;
  }

  /**
     * Removes all items from the internal array.
     *
     * @param {String} scope The Scope name, optional.
     */
  clear (scope) {
    if (! scope) {
      scope = null;
    }

    const removeCondition = e => e.scope === scope;

    for (let i = 0; i < this.items.length; ++i) {
      if (removeCondition(this.items[i])) {
        this.items.splice(i, 1);
        --i;
      }
    }
  }

  /**
     * Collects errors into groups or for a specific field.
     *
     * @param  {string} field The field name.
     * @param  {string} scope The scope name.
     * @param {Boolean} map If it should map the errors to strings instead of objects.
     * @return {Array} errors The errors for the specified field.
     */
  collect (field, scope, map = true) {
    if (! field) {
      const collection = {};
      this.items.forEach(e => {
        if (! collection[e.field]) {
          collection[e.field] = [];
        }

        collection[e.field].push(map ? e.msg : e);
      });

      return collection;
    }

    if (! scope) {
      return this.items.filter(e => e.field === field).map(e => (map ? e.msg : e));
    }

    return this.items.filter(e => e.field === field && e.scope === scope)
      .map(e => (map ? e.msg : e));
  }
  /**
     * Gets the internal array length.
     *
     * @return {Number} length The internal array length.
     */
  count () {
    return this.items.length;
  }

  /**
   * Finds and fetches the first error message for the specified field id.
   *
   * @param {String} id 
   */
  firstById (id) {
    const error = find(this.items, i => i.id === id);

    return error ? error.msg : null;
  }

  /**
     * Gets the first error message for a specific field.
     *
     * @param  {string} field The field name.
     * @return {string|null} message The error message.
     */
  first (field, scope = null) {
    const selector = this._selector(field);
    const scoped = this._scope(field);

    if (scoped) {
      const result = this.first(scoped.name, scoped.scope);
      // if such result exist, return it. otherwise it could be a field.
      // with dot in its name.
      if (result) {
        return result;
      }
    }

    if (selector) {
      return this.firstByRule(selector.name, selector.rule, scope);
    }

    for (let i = 0; i < this.items.length; ++i) {
      if (this.items[i].field === field && (this.items[i].scope === scope)) {
        return this.items[i].msg;
      }
    }

    return null;
  }

  /**
     * Returns the first error rule for the specified field
     *
     * @param {string} field The specified field.
     * @return {string|null} First error rule on the specified field if one is found, otherwise null
     */
  firstRule (field, scope) {
    const errors = this.collect(field, scope, false);

    return (errors.length && errors[0].rule) || null;
  }

  /**
     * Checks if the internal array has at least one error for the specified field.
     *
     * @param  {string} field The specified field.
     * @return {Boolean} result True if at least one error is found, false otherwise.
     */
  has (field, scope = null) {
    return !! this.first(field, scope);
  }

  /**
     * Gets the first error message for a specific field and a rule.
     * @param {String} name The name of the field.
     * @param {String} rule The name of the rule.
     * @param {String} scope The name of the scope (optional).
     */
  firstByRule (name, rule, scope) {
    const error = this.collect(name, scope, false).filter(e => e.rule === rule)[0];

    return (error && error.msg) || null;
  }

  /**
   * Removes errors by matching against the id.
   * @param {String} id 
   */
  removeById (id) {
    for (let i = 0; i < this.items.length; ++i) {
      if (this.items[i].id === id) {
        this.items.splice(i, 1);
        --i;
      }
    }
  }

  /**
     * Removes all error messages associated with a specific field.
     *
     * @param  {string} field The field which messages are to be removed.
     * @param {String} scope The Scope name, optional.
     */
  remove (field, scope) {
    const removeCondition = scope ? e => e.field === field && e.scope === scope
      : e => e.field === field && e.scope === null;

    for (let i = 0; i < this.items.length; ++i) {
      if (removeCondition(this.items[i])) {
        this.items.splice(i, 1);
        --i;
      }
    }
  }

  /**
     * Get the field attributes if there's a rule selector.
     *
     * @param  {string} field The specified field.
     * @return {Object|null}
     */
  _selector (field) {
    if (field.indexOf(':') > -1) {
      const [name, rule] = field.split(':');

      return { name, rule };
    }

    return null;
  }

  /**
     * Get the field scope if specified using dot notation.
     *
     * @param {string} field the specifie field.
     * @return {Object|null}
     */
  _scope (field) {
    if (field.indexOf('.') > -1) {
      const [scope, name] = field.split('.');

      return { name, scope };
    }

    return null;
  }
}

class Dictionary {
  constructor (dictionary = {}) {
    this.container = {};
    this.merge(dictionary);
  }

  hasLocale (locale) {
    return !! this.container[locale];
  }

  setDateFormat (locale, format) {
    if (!this.container[locale]) {
      this.container[locale] = {};
    }

    this.container[locale].dateFormat = format;
  }

  getDateFormat (locale) {
    if (!this.container[locale]) {
      return undefined;
    }

    return this.container[locale].dateFormat;
  }

  getMessage (locale, key, fallback) {
    if (! this.hasMessage(locale, key)) {
      return fallback || this._getDefaultMessage(locale);
    }

    return this.container[locale].messages[key];
  }

  /**
   * Gets a specific message for field. fallsback to the rule message.
   *
   * @param {String} locale
   * @param {String} field
   * @param {String} key
   */
  getFieldMessage (locale, field, key) {
    if (! this.hasLocale(locale)) {
      return this.getMessage(locale, key);
    }

    const dict = this.container[locale].custom && this.container[locale].custom[field];
    if (! dict || ! dict[key]) {
      return this.getMessage(locale, key);
    }

    return dict[key];
  }

  _getDefaultMessage (locale) {
    if (this.hasMessage(locale, '_default')) {
      return this.container[locale].messages._default;
    }

    return this.container.en.messages._default;
  }

  getAttribute (locale, key, fallback = '') {
    if (! this.hasAttribute(locale, key)) {
      return fallback;
    }

    return this.container[locale].attributes[key];
  }

  hasMessage (locale, key) {
    return !! (
      this.hasLocale(locale) &&
            this.container[locale].messages &&
            this.container[locale].messages[key]
    );
  }

  hasAttribute (locale, key) {
    return !! (
      this.hasLocale(locale) &&
            this.container[locale].attributes &&
            this.container[locale].attributes[key]
    );
  }

  merge (dictionary) {
    this._merge(this.container, dictionary);
  }

  setMessage (locale, key, message) {
    if (! this.hasLocale(locale)) {
      this.container[locale] = {
        messages: {},
        attributes: {}
      };
    }

    this.container[locale].messages[key] = message;
  }

  setAttribute (locale, key, attribute) {
    if (! this.hasLocale(locale)) {
      this.container[locale] = {
        messages: {},
        attributes: {}
      };
    }

    this.container[locale].attributes[key] = attribute;
  }

  _merge (target, source) {
    if (! (isObject(target) && isObject(source))) {
      return target;
    }

    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (! target[key]) {
          assign(target, { [key]: {} });
        }

        this._merge(target[key], source[key]);
        return;
      }

      assign(target, { [key]: source[key] });
    });

    return target;
  }
}

var messages = {
  _default: (field) => `The ${field} value is not valid.`,
  alpha_dash: (field) => `The ${field} field may contain alpha-numeric characters as well as dashes and underscores.`,
  alpha_num: (field) => `The ${field} field may only contain alpha-numeric characters.`,
  alpha_spaces: (field) => `The ${field} field may only contain alphabetic characters as well as spaces.`,
  alpha: (field) => `The ${field} field may only contain alphabetic characters.`,
  between: (field, [min, max]) => `The ${field} field must be between ${min} and ${max}.`,
  confirmed: (field) => `The ${field} confirmation does not match.`,
  credit_card: (field) => `The ${field} field is invalid.`,
  decimal: (field, [decimals] = ['*']) => `The ${field} field must be numeric and may contain ${!decimals || decimals === '*' ? '' : decimals} decimal points.`,
  digits: (field, [length]) => `The ${field} field must be numeric and exactly contain ${length} digits.`,
  dimensions: (field, [width, height]) => `The ${field} field must be ${width} pixels by ${height} pixels.`,
  email: (field) => `The ${field} field must be a valid email.`,
  ext: (field) => `The ${field} field must be a valid file.`,
  image: (field) => `The ${field} field must be an image.`,
  in: (field) => `The ${field} field must be a valid value.`,
  ip: (field) => `The ${field} field must be a valid ip address.`,
  max: (field, [length]) => `The ${field} field may not be greater than ${length} characters.`,
  max_value: (field, [max]) => `The ${field} field must be ${max} or less.`,
  mimes: (field) => `The ${field} field must have a valid file type.`,
  min: (field, [length]) => `The ${field} field must be at least ${length} characters.`,
  min_value: (field, [min]) => `The ${field} field must be ${min} or more.`,
  not_in: (field) => `The ${field} field must be a valid value.`,
  numeric: (field) => `The ${field} field may only contain numeric characters.`,
  regex: (field) => `The ${field} field format is invalid.`,
  required: (field) => `The ${field} field is required.`,
  size: (field, [size]) => `The ${field} field must be less than ${size} KB.`,
  url: (field) => `The ${field} field is not a valid URL.`
};

/**
 * Generates the options required to construct a field.
 */
class Generator {
  static generate (el, binding, vnode, options = {}) {
    const model = Generator.resolveModel(binding, vnode);

    return {
      name: Generator.resolveName(el, vnode),
      el: el,
      listen: !binding.modifiers.disable,
      scope: Generator.resolveScope(el, binding, vnode),
      vm: Generator.makeVM(vnode.context),
      expression: binding.value,
      component: vnode.child,
      classes: options.classes,
      classNames: options.classNames,
      getter: Generator.resolveGetter(el, vnode, model),
      events: Generator.resolveEvents(el, vnode) || options.events,
      model,
      delay: Generator.resolveDelay(el, vnode, options),
      rules: Generator.resolveRules(el, binding),
      initial: !!binding.modifiers.initial,
      alias: Generator.resolveAlias(el, vnode),
      validity: options.validity,
      aria: options.aria
    };
  }

  /**
   * 
   * @param {*} el 
   * @param {*} binding 
   */
  static resolveRules (el, binding) {
    if (!binding || !binding.expression) {
      return getDataAttribute(el, 'rules');
    }

    if (typeof binding.value === 'string') {
      return binding.value;
    }

    if (~['string', 'object'].indexOf(typeof binding.value.rules)) {
      return binding.value.rules;
    }

    return binding.value;
  }

  /**
   * Creates a non-circular partial VM instance from a Vue instance.
   * @param {*} vm 
   */
  static makeVM (vm) {
    return {
      get $el () {
        return vm.$el;
      },
      get $refs () {
        return vm.$refs;
      },
      $watch: vm.$watch ? vm.$watch.bind(vm) : () => {},
      $validator: vm.$validator ? {
        errors: vm.$validator.errors,
        validate: vm.$validator.validate.bind(vm.$validator)
      } : null
    };
  }

  /**
   * Resolves the delay value.
   * @param {*} el
   * @param {*} vnode
   * @param {Object} options
   */
  static resolveDelay (el, vnode, options = {}) {
    return getDataAttribute(el, 'delay') || (vnode.child && vnode.child.$attrs && vnode.child.$attrs['data-vv-delay']) || options.delay;
  }

  /**
   * Resolves the alias for the field.
   * @param {*} el 
   * @param {*} vnode 
   */
  static resolveAlias (el, vnode) {
    return getDataAttribute(el, 'as') || (vnode.child && vnode.child.$attrs && vnode.child.$attrs['data-vv-as']) || el.title || null;
  }

  /**
   * Resolves the events to validate in response to.
   * @param {*} el
   * @param {*} vnode
   */
  static resolveEvents (el, vnode) {
    if (vnode.child) {
      return getDataAttribute(el, 'validate-on') || (vnode.child.$attrs && vnode.child.$attrs['data-vv-validate-on']);
    }

    return getDataAttribute(el, 'validate-on');
  }

  /**
   * Resolves the scope for the field.
   * @param {*} el
   * @param {*} binding
   */
  static resolveScope (el, binding, vnode = {}) {
    let scope = null;
    if (isObject(binding.value)) {
      scope = binding.value.scope;
    }

    if (vnode.child && !scope) {
      scope = vnode.child.$attrs && vnode.child.$attrs['data-vv-scope'];
    }

    return scope || getScope(el);
  }

  /**
   * Checks if the node directives contains a v-model or a specified arg.
   * Args take priority over models.
   *
   * @return {Object}
   */
  static resolveModel (binding, vnode) {
    if (binding.arg) {
      return binding.arg;
    }

    if (isObject(binding.value) && binding.value.arg) {
      return binding.value.arg;
    }

    const model = vnode.data.model || find(vnode.data.directives, d => d.name === 'model');
    if (!model) {
      return null;
    }

    const watchable = /^[a-z_]+[0-9]*(\w*\.[a-z_]\w*)*$/i.test(model.expression) && hasPath(model.expression, vnode.context);

    if (!watchable) {
      return null;
    }

    return model.expression;
  }

  /**
     * Resolves the field name to trigger validations.
     * @return {String} The field name.
     */
  static resolveName (el, vnode) {
    if (vnode.child) {
      return getDataAttribute(el, 'name') || (vnode.child.$attrs && (vnode.child.$attrs['data-vv-name'] || vnode.child.$attrs['name'])) || vnode.child.name;
    }

    return getDataAttribute(el, 'name') || el.name;
  }

  /**
   * Returns a value getter input type.
   */
  static resolveGetter (el, vnode, model) {
    if (model) {
      return () => {
        return getPath(model, vnode.context);
      };
    }

    if (vnode.child) {
      return () => {
        const path = getDataAttribute(el, 'value-path') || (vnode.child.$attrs && vnode.child.$attrs['data-vv-value-path']);
        if (path) {
          return getPath(path, vnode.child);
        }
        return vnode.child.value;
      };
    }

    switch (el.type) {
    case 'checkbox': return () => {
      let els = document.querySelectorAll(`input[name="${el.name}"]`);

      els = toArray(els).filter(el => el.checked);
      if (!els.length) return undefined;

      return els.map(checkbox => checkbox.value);
    };
    case 'radio': return () => {
      const els = document.querySelectorAll(`input[name="${el.name}"]`);
      const elm = find(els, el => el.checked);

      return elm && elm.value;
    };
    case 'file': return (context) => {
      return toArray(el.files);
    };
    case 'select-multiple': return () => {
      return toArray(el.options).filter(opt => opt.selected).map(opt => opt.value);
    };
    default: return () => {
      return el && el.value;
    };
    }
  }
}

const DEFAULT_OPTIONS = {
  targetOf: null,
  initial: false,
  scope: null,
  listen: true,
  name: null,
  active: true,
  required: false,
  rules: {},
  vm: null,
  classes: false,
  validity: true,
  aria: true,
  events: 'input|blur',
  delay: 0,
  classNames: {
    touched: 'touched', // the control has been blurred
    untouched: 'untouched', // the control hasn't been blurred
    valid: 'valid', // model is valid
    invalid: 'invalid', // model is invalid
    pristine: 'pristine', // control has not been interacted with
    dirty: 'dirty' // control has been interacted with
  }
};

/**
 * Generates the default flags for the field.
 * @param {Object} options
 */
const generateFlags = (options) => ({
  untouched: true,
  touched: false,
  dirty: false,
  pristine: true,
  valid: null,
  invalid: null,
  validated: false,
  pending: false,
  required: !!options.rules.required
});

class Field {
  constructor (el, options = {}) {
    this.id = uniqId();
    this.el = el;
    this.updated = false;
    this.dependencies = [];
    this.watchers = [];
    this.events = [];
    this.rules = {};
    if (!this.isHeadless && !(this.targetOf || options.targetOf)) {
      setDataAttribute(this.el, 'id', this.id); // cache field id if it is independent and has a root element.
    }
    options = assign({}, DEFAULT_OPTIONS, options);
    this.validity = options.validity;
    this.aria = options.aria;
    this.flags = generateFlags(options);
    this.vm = options.vm || this.vm;
    this.component = options.component || this.component;
    this.update(options);
    this.updated = false;
  }

  get isVue () {
    return !!this.component;
  }

  get validator () {
    if (!this.vm || !this.vm.$validator) {
      warn('No validator instance detected.');
      return { validate: () => {} };
    }

    return this.vm.$validator;
  }

  get isRequired () {
    return !!this.rules.required;
  }

  get isDisabled () {
    return (this.isVue && this.component.disabled) || (this.el && this.el.disabled);
  }

  get isHeadless () {
    return !this.el;
  }

  /**
   * Gets the display name (user-friendly name).
   * @return {String}
   */
  get displayName () {
    return this.alias;
  }

  /**
   * Gets the input value.
   * @return {*}
   */
  get value () {
    if (!isCallable(this.getter)) {
      return undefined;
    }

    return this.getter();
  }

  /**
   * If the field rejects false as a valid value for the required rule. 
   */
  get rejectsFalse () {
    if (this.isVue || this.isHeadless) {
      return false;
    }

    return this.el.type === 'checkbox';
  }

  /**
   * Determines if the instance matches the options provided.
   * @param {Object} options The matching options.
   */
  matches (options) {
    if (options.id) {
      return this.id === options.id;
    }

    if (options.name === undefined && options.scope === undefined) {
      return true;
    }

    if (options.scope === undefined) {
      return this.name === options.name;
    }

    if (options.name === undefined) {
      return this.scope === options.scope;
    }

    return options.name === this.name && options.scope === this.scope;
  }

  /**
   *
   * @param {Object} options
   */
  update (options) {
    this.targetOf = options.targetOf || null;
    this.initial = options.initial || this.initial || false;

    // update errors scope if the field scope was changed.
    if (options.scope && options.scope !== this.scope && this.validator.errors && isCallable(this.validator.errors.update)) {
      this.validator.errors.update(this.id, { scope: options.scope });
    }
    this.scope = options.scope || this.scope || null;
    this.name = options.name || this.name || null;
    this.rules = options.rules !== undefined ? normalizeRules(options.rules) : this.rules;
    this.model = options.model || this.model;
    this.listen = options.listen !== undefined ? options.listen : this.listen;
    this.classes = options.classes || this.classes || false;
    this.classNames = options.classNames || this.classNames || DEFAULT_OPTIONS.classNames;
    this.alias = options.alias || this.alias;
    this.getter = isCallable(options.getter) ? options.getter : this.getter;
    this.delay = options.delay || this.delay || 0;
    this.events = typeof options.events === 'string' && options.events.length ? options.events.split('|') : this.events;
    this.updateDependencies();
    this.addActionListeners();

    // validate if it was validated before and field was updated and there was a rules mutation.
    if (this.flags.validated && options.rules && this.updated) {
      this.validator.validate(`#${this.id}`);
    }

    this.updated = true;

    // no need to continue.
    if (this.isHeadless) {
      return;
    }

    this.updateClasses();
    this.addValueListeners();
    this.updateAriaAttrs();
  }

  /**
   * Determines if the field requires references to target fields.
  */
  updateDependencies () {
    // reset dependencies.
    this.dependencies.forEach(d => d.field.destroy());
    this.dependencies = [];

    // we get the selectors for each field.
    const fields = Object.keys(this.rules).reduce((prev, r) => {
      if (r === 'confirmed') {
        prev.push({ selector: this.rules[r][0] || `${this.name}_confirmation`, name: r });
      } else if (/after|before/.test(r)) {
        prev.push({ selector: this.rules[r][0], name: r });
      }

      return prev;
    }, []);

    if (!fields.length || !this.vm || !this.vm.$el) return;

    // must be contained within the same component, so we use the vm root element constrain our dom search.
    fields.forEach(({ selector, name }) => {
      let el = null;
      // vue ref selector.
      if (selector[0] === '$') {
        el = this.vm.$refs[selector.slice(1)];
      } else {
        // try a query selection.
        el = this.vm.$el.querySelector(selector);
      }

      if (!el) {
        // try a name selector
        el = this.vm.$el.querySelector(`input[name="${selector}"]`);
      }

      if (!el) {
        return;
      }

      const options = {
        vm: this.vm,
        classes: this.classes,
        classNames: this.classNames,
        delay: this.delay,
        scope: this.scope,
        events: this.events.join('|'),
        initial: this.initial,
        targetOf: this.id
      };

      // probably a component.
      if (isCallable(el.$watch)) {
        options.component = el;
        options.el = el.$el;
        options.getter = Generator.resolveGetter(el.$el, { child: el });
      } else {
        options.el = el;
        options.getter = Generator.resolveGetter(el, {});
      }

      this.dependencies.push({ name, field: new Field(options.el, options) });
    });
  }

  /**
   * Removes listeners.
   * @param {RegExp} tag
   */
  unwatch (tag) {
    if (!tag) {
      this.watchers.forEach(w => w.unwatch());
      this.watchers = [];
      return;
    }
    this.watchers.filter(w => tag.test(w.tag)).forEach(w => w.unwatch());
    this.watchers = this.watchers.filter(w => !tag.test(w.tag));
  }

  /**
   * Updates the element classes depending on each field flag status.
   */
  updateClasses () {
    if (!this.classes) return;

    toggleClass(this.el, this.classNames.dirty, this.flags.dirty);
    toggleClass(this.el, this.classNames.pristine, this.flags.pristine);
    toggleClass(this.el, this.classNames.valid, !!this.flags.valid);
    toggleClass(this.el, this.classNames.invalid, !!this.flags.invalid);
    toggleClass(this.el, this.classNames.touched, this.flags.touched);
    toggleClass(this.el, this.classNames.untouched, this.flags.untouched);
  }

  /**
   * Adds the listeners required for automatic classes and some flags.
   */
  addActionListeners () {
    // remove previous listeners.
    this.unwatch(/class/);

    const onBlur = () => {
      this.flags.touched = true;
      this.flags.untouched = false;
      if (this.classes) {
        toggleClass(this.el, this.classNames.touched, true);
        toggleClass(this.el, this.classNames.untouched, false);
      }

      // only needed once.
      this.unwatch(/^class_blur$/);
    };

    const inputEvent = getInputEventName(this.el);
    const onInput = () => {
      this.flags.dirty = true;
      this.flags.pristine = false;
      if (this.classes) {
        toggleClass(this.el, this.classNames.pristine, false);
        toggleClass(this.el, this.classNames.dirty, true);
      }

      // only needed once.
      this.unwatch(/^class_input$/);
    };

    if (this.isVue && isCallable(this.component.$once)) {
      this.component.$once('input', onInput);
      this.component.$once('blur', onBlur);
      this.watchers.push({
        tag: 'class_input',
        unwatch: () => {
          this.component.$off('input', onInput);
        }
      });
      this.watchers.push({
        tag: 'class_blur',
        unwatch: () => {
          this.component.$off('blur', onBlur);
        }
      });
      return;
    }

    if (this.isHeadless) return;

    this.el.addEventListener(inputEvent, onInput);
    // Checkboxes and radio buttons on Mac don't emit blur naturally, so we listen on click instead.
    const blurEvent = ['radio', 'checkbox'].indexOf(this.el.type) === -1 ? 'blur' : 'click';
    this.el.addEventListener(blurEvent, onBlur);
    this.watchers.push({
      tag: 'class_input',
      unwatch: () => {
        this.el.removeEventListener(inputEvent, onInput);
      }
    });

    this.watchers.push({
      tag: 'class_blur',
      unwatch: () => {
        this.el.removeEventListener(blurEvent, onBlur);
      }
    });
  }

  /**
   * Adds the listeners required for validation.
   */
  addValueListeners () {
    this.unwatch(/^input_.+/);
    if (!this.listen) return;

    let fn = null;
    if (this.targetOf) {
      fn = () => {
        this.validator.validate(`#${this.targetOf}`);
      };
    } else {
      fn = (...args) => {
        if (args.length === 0 || (isCallable(Event) && args[0] instanceof Event)) {
          args[0] = this.value;
        }
        this.validator.validate(`#${this.id}`, args[0]);
      };
    }
    const validate = debounce(fn, this.delay);

    const inputEvent = getInputEventName(this.el);
    // replace input event with suitable one.
    let events = this.events.map(e => {
      return e === 'input' ? inputEvent : e;
    });

    // if there is a watchable model and an on input validation is requested.
    if (this.model && events.indexOf(inputEvent) !== -1) {
      const unwatch = this.vm.$watch(this.model, validate);
      this.watchers.push({
        tag: 'input_model',
        unwatch
      });
      // filter out input event as it is already handled by the watcher API.
      events = events.filter(e => e !== inputEvent);
    }

    // Add events.
    events.forEach(e => {
      if (this.isVue) {
        this.component.$on(e, validate);
        this.watchers.push({
          tag: 'input_vue',
          unwatch: () => {
            this.component.$off(e, validate);
          }
        });
        return;
      }

      if (~['radio', 'checkbox'].indexOf(this.el.type)) {
        const els = document.querySelectorAll(`input[name="${this.el.name}"]`);
        toArray(els).forEach(el => {
          el.addEventListener(e, validate);
          this.watchers.push({
            tag: 'input_native',
            unwatch: () => {
              el.removeEventListener(e, validate);
            }
          });
        });

        return;
      }

      this.el.addEventListener(e, validate);
      this.watchers.push({
        tag: 'input_native',
        unwatch: () => {
          this.el.removeEventListener(e, validate);
        }
      });
    });
  }

  /**
   * Updates aria attributes on the element.
   */
  updateAriaAttrs () {
    if (!this.aria || this.isHeadless || !isCallable(this.el.setAttribute)) return;

    this.el.setAttribute('aria-required', this.isRequired ? 'true' : 'false');
    this.el.setAttribute('aria-invalid', this.flags.invalid ? 'true' : 'false');
  }

  /**
   * Updates the custom validity for the field.
   */
  updateCustomValidity () {
    if (!this.validity || this.isHeadless || !isCallable(this.el.setCustomValidity)) return;

    this.el.setCustomValidity(this.flags.valid ? '' : (this.validator.errors.firstById(this.id) || ''));
  }

  /**
   * Removes all listeners.
   */
  destroy () {
    this.watchers.forEach(w => w.unwatch());
    this.watchers = [];
    this.dependencies.forEach(d => d.field.destroy());
    this.dependencies = [];
  }
}

class FieldBag {
  constructor () {
    this.items = [];
  }

  /**
   * @return {Number} The current collection length.
   */
  get length () {
    return this.items.length;
  }

  /**
   * Finds the first field that matches the provided matcher object.
   * @param {Object} matcher
   * @return {Field|undefined} The first matching item.
   */
  find (matcher) {
    return find(this.items, item => item.matches(matcher));
  }

  /**
   * @param {Object|Array} matcher
   * @return {Array} Array of matching field items.
   */
  filter (matcher) {
    // multiple matchers to be tried.
    if (Array.isArray(matcher)) {
      return this.items.filter(item => matcher.some(m => item.matches(m)));
    }

    return this.items.filter(item => item.matches(matcher));
  }

  /**
   * Maps the field items using the mapping function.
   *
   * @param {Function} mapper
   */
  map (mapper) {
    return this.items.map(mapper);
  }

  /**
   * Finds and removes the first field that matches the provided matcher object, returns the removed item.
   * @param {Object|Field} matcher
   * @return {Field|null}
   */
  remove (matcher) {
    let item = null;
    if (matcher instanceof Field) {
      item = matcher;
    } else {
      item = this.find(matcher);
    }

    if (!item) return null;

    const index = this.items.indexOf(item);
    this.items.splice(index, 1);

    return item;
  }

  /**
   * Adds a field item to the list.
   *
   * @param {Field} item
   */
  push (item) {
    if (! (item instanceof Field)) {
      throw createError('FieldBag only accepts instances of Field that has an id defined.');
    }

    if (!item.id) {
      throw createError('Field id must be defined.');
    }

    if (this.find({ id: item.id })) {
      throw createError(`Field with id ${item.id} is already added.`);
    }

    this.items.push(item);
  }
}

var after = (moment) => (value, [other, inclusion, format]) => {
  if (typeof format === 'undefined') {
    format = inclusion;
    inclusion = false;
  }

  const dateValue = moment(value, format, true);
  const otherValue = moment(other, format, true);

  // if either is not valid.
  if (! dateValue.isValid() || ! otherValue.isValid()) {
    return false;
  }

  return dateValue.isAfter(otherValue) || (inclusion && dateValue.isSame(otherValue));
};

var before = (moment) => (value, [other, inclusion, format]) => {
  if (typeof format === 'undefined') {
    format = inclusion;
    inclusion = false;
  }
  const dateValue = moment(value, format, true);
  const otherValue = moment(other, format, true);

  // if either is not valid.
  if (! dateValue.isValid() || ! otherValue.isValid()) {
    return false;
  }

  return dateValue.isBefore(otherValue) || (inclusion && dateValue.isSame(otherValue));
};

var date_format = (moment) => (value, [format]) => moment(value, format, true).isValid();

var date_between = (moment) => (value, params) => {
  let min;
  let max;
  let format;
  let inclusivity = '()';

  if (params.length > 3) {
    [min, max, inclusivity, format] = params;
  } else {
    [min, max, format] = params;
  }

  const minDate = moment(min, format, true);
  const maxDate = moment(max, format, true);
  const dateVal = moment(value, format, true);

  if (! (minDate.isValid() && maxDate.isValid() && dateVal.isValid())) {
    return false;
  }

  return dateVal.isBetween(minDate, maxDate, 'days', inclusivity);
};

var messages$1 = {
  after: (field, [target, inclusion]) => `The ${field} must be after ${inclusion ? 'or equal to ' : ''}${target}.`,
  before: (field, [target, inclusion]) => `The ${field} must be before ${inclusion ? 'or equal to ' : ''}${target}.`,
  date_between: (field, [min, max]) => `The ${field} must be between ${min} and ${max}.`,
  date_format: (field, [format]) => `The ${field} must be in the format ${format}.`
};

var date = {
  make: (moment) => ({
    date_format: date_format(moment),
    after: after(moment),
    before: before(moment),
    date_between: date_between(moment)
  }),
  messages: messages$1,
  installed: false
};

let LOCALE = 'en';
let STRICT_MODE = true;
const DICTIONARY = new Dictionary({
  en: {
    messages,
    attributes: {},
    custom: {}
  }
});

class Validator {
  constructor (validations, options = { vm: null, fastExit: true }) {
    this.strict = STRICT_MODE;
    this.errors = new ErrorBag();
    this.fields = new FieldBag();
    this.fieldBag = {};
    this._createFields(validations);
    this.paused = false;
    this.fastExit = options.fastExit || false;
    this.ownerId = options.vm && options.vm._uid;
    // create it statically since we don't need constant access to the vm.
    this.clean = options.vm && isCallable(options.vm.$nextTick) ? () => {
      options.vm.$nextTick(() => {
        this.errors.clear();
      });
    } : () => {
      this.errors.clear();
    };

    // if momentjs is present, install the validators.
    if (typeof moment === 'function') {
      // eslint-disable-next-line
      this.installDateTimeValidators(moment);
    }
  }

  /**
   * @return {Dictionary}
   */
  get dictionary () {
    return DICTIONARY;
  }

  /**
   * @return {Dictionary}
   */
  static get dictionary () {
    return DICTIONARY;
  }

  /**
   * @return {String}
   */
  get locale () {
    return LOCALE;
  }

  /**
   * @return {Object}
   */
  get rules () {
    return Rules;
  }

  /**
   * @return {Object}
   */
  static get rules () {
    return Rules;
  }

  /**
   * Merges a validator object into the Rules and Messages.
   *
   * @param  {string} name The name of the validator.
   * @param  {function|object} validator The validator object.
   */
  static _merge (name, validator) {
    if (isCallable(validator)) {
      Rules[name] = validator;
      return;
    }

    Rules[name] = validator.validate;
    if (isCallable(validator.getMessage)) {
      DICTIONARY.setMessage(LOCALE, name, validator.getMessage);
    }

    if (validator.messages) {
      DICTIONARY.merge(
        Object.keys(validator.messages).reduce((prev, curr) => {
          const dict = prev;
          dict[curr] = {
            messages: {
              [name]: validator.messages[curr]
            }
          };

          return dict;
        }, {})
      );
    }
  }

  /**
   * Guards from extnsion violations.
   *
   * @param  {string} name name of the validation rule.
   * @param  {object} validator a validation rule object.
   */
  static _guardExtend (name, validator) {
    if (isCallable(validator)) {
      return;
    }

    if (! isCallable(validator.validate)) {
      throw createError(
        // eslint-disable-next-line
        `Extension Error: The validator '${name}' must be a function or have a 'validate' method.`
      );
    }

    if (! isCallable(validator.getMessage) && ! isObject(validator.messages)) {
      throw createError(
        // eslint-disable-next-line
        `Extension Error: The validator '${name}' must have a 'getMessage' method or have a 'messages' object.`
      );
    }
  }

  /**
   * Static constructor.
   *
   * @param  {object} validations The validations object.
   * @return {Validator} validator A validator object.
   */
  static create (validations, options) {
    return new Validator(validations, options);
  }

  /**
   * Adds a custom validator to the list of validation rules.
   *
   * @param  {string} name The name of the validator.
   * @param  {object|function} validator The validator object/function.
   */
  static extend (name, validator) {
    Validator._guardExtend(name, validator);
    Validator._merge(name, validator);
  }

  /**
   * Installs the datetime validators and the messages.
   */
  static installDateTimeValidators (moment) {
    if (typeof moment !== 'function') {
      warn('To use the date-time validators you must provide moment reference.');

      return false;
    }

    if (date.installed) {
      return true;
    }

    const validators = date.make(moment);
    Object.keys(validators).forEach(name => {
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

  /**
   * Removes a rule from the list of validators.
   * @param {String} name The name of the validator/rule.
   */
  static remove (name) {
    delete Rules[name];
  }

  /**
   * Sets the default locale for all validators.
   *
   * @param {String} language The locale id.
   */
  static setLocale (language = 'en') {
    /* istanbul ignore if */
    if (! DICTIONARY.hasLocale(language)) {
      // eslint-disable-next-line
      warn('You are setting the validator locale to a locale that is not defined in the dicitionary. English messages may still be generated.');
    }

    LOCALE = language;
  }

  /**
   * Sets the operating mode for all newly created validators.
   * strictMode = true: Values without a rule are invalid and cause failure.
   * strictMode = false: Values without a rule are valid and are skipped.
   * @param {Boolean} strictMode.
   */
  static setStrictMode (strictMode = true) {
    STRICT_MODE = strictMode;
  }

  /**
   * Updates the dicitionary, overwriting existing values and adding new ones.
   *
   * @param  {object} data The dictionary object.
   */
  static updateDictionary (data) {
    DICTIONARY.merge(data);
  }

  static addLocale (locale) {
    if (! locale.name) {
      warn('Your locale must have a name property');
      return;
    }

    this.updateDictionary({
      [locale.name]: locale
    });
  }

  addLocale (locale) {
    Validator.addLocale(locale);
  }

  /**
   * Creates the fields to be validated.
   *
   * @param  {object} validations
   * @return {object} Normalized object.
   */
  _createFields (validations) {
    if (! validations) return;

    Object.keys(validations).forEach(field => {
      const options = assign({}, { name: field, rules: validations[field] });
      this.attach(options);
    });
  }

  /**
   * Date rules need the existance of a format, so date_format must be supplied.
   * @param {String} name The rule name.
   * @param {Array} validations the field validations.
   */
  _getDateFormat (validations) {
    let format = null;
    if (validations.date_format && Array.isArray(validations.date_format)) {
      format = validations.date_format[0];
    }

    return format || this.dictionary.getDateFormat(this.locale);
  }

  /**
   * Checks if the passed rule is a date rule.
   */
  _isADateRule (rule) {
    return !! ~['after', 'before', 'date_between', 'date_format'].indexOf(rule);
  }

  /**
   * Formats an error message for field and a rule.
   *
   * @param  {Field} field The field object.
   * @param  {object} rule Normalized rule object.
   * @param {object} data Additional Information about the validation result.
   * @return {string} Formatted error message.
   */
  _formatErrorMessage (field, rule, data = {}) {
    const name = this._getFieldDisplayName(field);
    const params = this._getLocalizedParams(rule);
    // Defaults to english message.
    if (! this.dictionary.hasLocale(LOCALE)) {
      const msg = this.dictionary.getFieldMessage('en', field.name, rule.name);

      return isCallable(msg) ? msg(name, params, data) : msg;
    }

    const msg = this.dictionary.getFieldMessage(LOCALE, field.name, rule.name);

    return isCallable(msg) ? msg(name, params, data) : msg;
  }

  /**
   * Translates the parameters passed to the rule (mainly for target fields).
   */
  _getLocalizedParams (rule) {
    if (~ ['after', 'before', 'confirmed'].indexOf(rule.name) && rule.params && rule.params[0]) {
      if (rule.params.length > 1) {
        return [this.dictionary.getAttribute(LOCALE, rule.params[0], rule.params[0]), rule.params[1]];
      } else {
        return [this.dictionary.getAttribute(LOCALE, rule.params[0], rule.params[0])];
      }
    }

    return rule.params;
  }

  /**
   * Resolves an appropiate display name, first checking 'data-as' or the registered 'prettyName'
   * Then the dictionary, then fallsback to field name.
   * @param {Field} field The field object.
   * @return {String} The name to be used in the errors.
   */
  _getFieldDisplayName (field) {
    return field.displayName || this.dictionary.getAttribute(LOCALE, field.name, field.name);
  }

  /**
   * Tests a single input value against a rule.
   *
   * @param  {Field} field The field under validation.
   * @param  {*} value  the value of the field.
   * @param  {object} rule the rule object.
   * @return {boolean} Whether it passes the check.
   */
  _test (field, value, rule) {
    const validator = Rules[rule.name];
    let params = Array.isArray(rule.params) ? toArray(rule.params) : [];
    if (! validator || typeof validator !== 'function') {
      throw createError(`No such validator '${rule.name}' exists.`);
    }

    // has field depenencies
    if (/(confirmed|after|before)/.test(rule.name)) {
      const target = find(field.dependencies, d => d.name === rule.name);
      if (target) {
        if (params.length > 1) {
          params = [target.field.value, params[1]];
        } else {
          params = [target.field.value];
        }
      }
    } else if (rule.name === 'required' && field.rejectsFalse) {
      // invalidate false if no args were specified and the field rejects false by default.
      params = params.length ? params : [true];
    }

    if (date.installed && this._isADateRule(rule.name)) {
      const dateFormat = this._getDateFormat(field.rules);
      if (rule.name !== 'date_format') {
        params.push(dateFormat);
      }
    }

    let result = validator(value, params);

    // If it is a promise.
    if (isCallable(result.then)) {
      return result.then(values => {
        let allValid = true;
        let data = {};
        if (Array.isArray(values)) {
          allValid = values.every(t => (isObject(t) ? t.valid : t));
        } else { // Is a single object/boolean.
          allValid = isObject(values) ? values.valid : values;
          data = values.data;
        }

        if (! allValid) {
          this.errors.add({
            id: field.id,
            field: field.name,
            msg: this._formatErrorMessage(field, rule, data),
            rule: rule.name,
            scope: field.scope
          });
        }

        return allValid;
      });
    }

    if (! isObject(result)) {
      result = { valid: result, data: {} };
    }

    if (! result.valid) {
      this.errors.add({
        id: field.id,
        field: field.name,
        msg: this._formatErrorMessage(field, rule, result.data),
        rule: rule.name,
        scope: field.scope
      });
    }

    return result.valid;
  }

  /**
   * Registers a field to be validated.
   *
   * @param  {Field|Object} name The field name.
   * @return {Field}
   */
  attach (field) {
    // deprecate: handle old signature.
    if (arguments.length > 1) {
      field = assign({}, {
        name: arguments[0],
        rules: arguments[1]
      }, arguments[2] || { vm: { $validator: this } });
    }

    if (!(field instanceof Field)) {
      field = new Field(field.el || null, field);
    }

    this.fields.push(field);
    // validate if initial.
    if (field.initial) {
      this.validate(`#${field.id}`, field.value);
    }
    if (!field.scope) {
      this.fieldBag = assign({}, this.fieldBag, { [`${field.name}`]: field.flags });
      return field;
    }

    const scopeObj = assign({}, this.fieldBag[`$${field.scope}`] || {}, { [`${field.name}`]: field.flags });
    this.fieldBag = assign({}, this.fieldBag, { [`$${field.scope}`]: scopeObj });

    return field;
  }

  /**
   * Sets the flags on a field.
   *
   * @param {String} name
   * @param {Object} flags
   */
  flag (name, flags) {
    const field = this._resolveField(name);
    if (! field) {
      return;
    }

    Object.keys(field.flags).forEach(flag => {
      field.flags[flag] = flags[flag] !== undefined ? flags[flag] : field.flags[flag];
    });
    if (field.classes) {
      field.updateClasses();
    }
  }

  /**
   * Removes a field from the validator.
   *
   * @param  {String} name The name of the field.
   * @param {String} scope The name of the field scope.
   */
  detach (name, scope) {
    let field = name instanceof Field ? name : this._resolveField(name, scope);
    if (field) {
      field.destroy();
      this.errors.removeById(field.id);
      this.fields.remove(field);
    }
  }

  /**
   * Adds a custom validator to the list of validation rules.
   *
   * @param  {string} name The name of the validator.
   * @param  {object|function} validator The validator object/function.
   */
  extend (name, validator) {
    Validator.extend(name, validator);
  }

  /**
   * Just an alias to the static method for convienece.
   */
  installDateTimeValidators (moment) {
    Validator.installDateTimeValidators(moment);
  }

  /**
   * Removes a rule from the list of validators.
   * @param {String} name The name of the validator/rule.
   */
  remove (name) {
    Validator.remove(name);
  }

  /**
   * Sets the validator current langauge.
   *
   * @param {string} language locale or language id.
   */
  setLocale (language) {
    /* istanbul ignore if */
    if (! this.dictionary.hasLocale(language)) {
      // eslint-disable-next-line
      warn('You are setting the validator locale to a locale that is not defined in the dicitionary. English messages may still be generated.');
    }

    LOCALE = language;
  }

  /**
   * Updates the messages dicitionary, overwriting existing values and adding new ones.
   *
   * @param  {object} data The messages object.
   */
  updateDictionary (data) {
    Validator.updateDictionary(data);
  }

  /**
   * Tries different strategies to find a field.
   * @param {String} name
   * @param {String} scope
   * @return {Field}
   */
  _resolveField (name, scope) {
    if (scope) {
      return this.fields.find({ name, scope });
    }

    if (name[0] === '#') {
      return this.fields.find({ id: name.slice(1) });
    }

    if (name.indexOf('.') > -1) {
      const parts = name.split('.');
      const field = this.fields.find({ name: parts[1], scope: parts[0] });
      if (field) {
        return field;
      }
    }

    return this.fields.find({ name, scope: null });
  }

  /**
   * Handles when a field is not found depending on the strict flag.
   *
   * @param {String} name
   * @param {String} scope
   */
  _handleFieldNotFound (name, scope) {
    if (! this.strict) return Promise.resolve(true);

    const fullName = scope ? name : `${scope ? scope + '.' : ''}${name}`;
    throw createError(
      `Validating a non-existant field: "${fullName}". Use "attach()" first.`
    );
  }

  /**
   * Starts the validation process.
   *
   * @param {Field} field
   * @param {Promise} value
   */
  _validate (field, value) {
    if (! field.isRequired && ~[null, undefined, ''].indexOf(value)) {
      return Promise.resolve(true);
    }

    const promises = [];
    let isExitEarly = false;
    // use of '.some()' is to break iteration in middle by returning true
    Object.keys(field.rules).some(rule => {
      const result = this._test(
        field,
        value,
        { name: rule, params: field.rules[rule] }
      );

      if (isCallable(result.then)) {
        promises.push(result);
      } else if (this.fastExit && !result) {
        isExitEarly = true;
      } else {
        const resultAsPromise = new Promise(resolve => {
          resolve(result);
        });
        promises.push(resultAsPromise);
      }

      return isExitEarly;
    });

    if (isExitEarly) return Promise.resolve(false);

    return Promise.all(promises).then(values => {
      const valid = values.every(t => t);
      return valid;
    });
  }

  /**
   * Validates a value against a registered field validations.
   *
   * @param  {string} name the field name.
   * @param  {*} value The value to be validated.
   * @param {String} scope The scope of the field.
   * @return {Promise}
   */
  validate (name, value, scope = null) {
    if (this.paused) return Promise.resolve(true);

    // overload to validate all.
    if (arguments.length === 0) {
      return this.validateScopes();
    }

    // overload to validate scopeless fields.
    if (arguments.length === 1 && arguments[0] === '*') {
      return this.validateAll();
    }

    // overload to validate a scope.
    if (arguments.length === 1 && typeof arguments[0] === 'string' && /^(.+)\.\*$/.test(arguments[0])) {
      const matched = arguments[0].match(/^(.+)\.\*$/)[1];
      return this.validateAll(matched);
    }

    const field = this._resolveField(name, scope);
    if (!field) {
      return this._handleFieldNotFound(name, scope);
    }
    this.errors.removeById(field.id);
    if (field.isDisabled) {
      return Promise.resolve(true);
    }
    field.flags.pending = true;
    if (arguments.length === 1) {
      value = field.value;
    }

    return this._validate(field, value).then(result => {
      field.flags.pending = false;
      field.flags.valid = result;
      field.flags.invalid = !result;
      field.flags.validated = true;
      field.updateAriaAttrs();
      field.updateCustomValidity();
      field.updateClasses();

      return result;
    });
  }

  /**
   * Pauses the validator.
   *
   * @return {Validator}
   */
  pause () {
    this.paused = true;

    return this;
  }

  /**
   * Resumes the validator.
   *
   * @return {Validator}
   */
  resume () {
    this.paused = false;

    return this;
  }

  /**
   * Validates each value against the corresponding field validations.
   * @param  {Object|String} values The values to be validated.
   * @return {Promise} Returns a promise with the validation result.
   */
  validateAll (values) {
    if (this.paused) return Promise.resolve(true);

    let matcher = null;
    let providedValues = false;

    if (typeof values === 'string') {
      matcher = { scope: values };
    } else if (isObject(values)) {
      matcher = Object.keys(values).map(key => {
        return { name: key, scope: arguments[1] || null };
      });
      providedValues = true;
    } else if (arguments.length === 0) {
      matcher = { scope: null }; // global scope.
    }

    const promises = this.fields.filter(matcher).map(field => this.validate(
      `#${field.id}`,
      providedValues ? values[field.name] : field.value
    ));

    return Promise.all(promises).then(results => results.every(t => t));
  }

  /**
   * Validates all scopes.
   *
   * @returns {Promise} All promises resulted from each scope.
   */
  validateScopes () {
    if (this.paused) return Promise.resolve(true);

    const promises = this.fields.map(field => this.validate(
      `#${field.id}`,
      field.value
    ));

    return Promise.all(promises).then(results => results.every(t => t));
  }
}

/**
 * Checks if a parent validator instance was requested.
 * @param {Object|Array} injections
 */
const requestsValidator = (injections) => {
  if (! injections) {
    return false;
  }

  /* istanbul ignore next */
  if (Array.isArray(injections) && ~injections.indexOf('$validator')) {
    return true;
  }

  if (isObject(injections) && injections.$validator) {
    return true;
  }

  return false;
};

/**
 * Creates a validator instance.
 * @param {Vue} vm
 * @param {Object} options
 */
const createValidator = (vm, options) => new Validator(null, {
  init: false,
  vm,
  fastExit: options.fastExit
});

var makeMixin = (Vue, options = {}) => {
  const mixin = {};
  mixin.provide = function providesValidator () {
    if (this.$validator) {
      return {
        $validator: this.$validator
      };
    }

    return {};
  };

  mixin.beforeCreate = function beforeCreate () {
    // if its a root instance, inject anyways, or if it requested a new instance.
    if (this.$options.$validates || !this.$parent) {
      this.$validator = createValidator(this, options);
    }

    const requested = requestsValidator(this.$options.inject);

    // if automatic injection is enabled and no instance was requested.
    if (! this.$validator && options.inject && !requested) {
      this.$validator = createValidator(this, options);
    }

    // don't inject errors or fieldBag as no validator was resolved.
    if (! requested && ! this.$validator) {
      return;
    }

    // There is a validator but it isn't injected, mark as reactive.
    if (! requested && this.$validator) {
      Vue.util.defineReactive(this.$validator, 'errors', this.$validator.errors);
      Vue.util.defineReactive(this.$validator, 'fieldBag', this.$validator.fieldBag);
    }

    if (! this.$options.computed) {
      this.$options.computed = {};
    }

    this.$options.computed[options.errorBagName || 'errors'] = function errorBagGetter () {
      return this.$validator.errors;
    };
    this.$options.computed[options.fieldsBagName || 'fields'] = function fieldBagGetter () {
      return this.$validator.fieldBag;
    };
  };

  mixin.beforeDestroy = function beforeDestroy () {
    // mark the validator paused to prevent delayed validation.
    if (this.$validator && this.$validator.ownerId === this._uid && isCallable(this.$validator.pause)) {
      this.$validator.pause();
    }
  };

  return mixin;
};

var config = {
  locale: 'en',
  delay: 0,
  errorBagName: 'errors',
  dictionary: null,
  strict: true,
  fieldsBagName: 'fields',
  classes: false,
  classNames: undefined,
  events: 'input|blur',
  inject: true,
  fastExit: true,
  aria: true,
  validity: true
};

/**
 * 
 * 
 * Finds the requested field by id from the context object.
 * @param {Object} context
 * @return {Field|null}
 */
const findField = (el, context) => {
  if (!context || !context.$validator) {
    return null;
  }

  return context.$validator.fields.find({ id: getDataAttribute(el, 'id') });
};

const createDirective = options => {
  options = assign({}, config, options);

  return {
    bind (el, binding, vnode) {
      const validator = vnode.context.$validator;
      if (! validator) {
        warn(`No validator instance is present on vm, did you forget to inject '$validator'?`);
        return;
      }
      const fieldOptions = Generator.generate(el, binding, vnode, options);
      validator.attach(fieldOptions);
    },
    inserted: (el, binding, vnode) => {
      const field = findField(el, vnode.context);
      const scope = Generator.resolveScope(el, binding, vnode);

      // skip if scope hasn't changed.
      if (!field || scope === field.scope) return;

      // only update scope.
      field.update({ scope });

      // allows the field to re-evaluated once more in the update hook.
      field.updated = false;
    },
    update: (el, binding, vnode) => {
      const field = findField(el, vnode.context);

      // make sure we don't do uneccessary work if no important change was done.
      if (!field || (field.updated && isEqual(binding.value, binding.oldValue))) return;
      const scope = Generator.resolveScope(el, binding, vnode);
      const rules = Generator.resolveRules(el, binding);

      field.update({
        scope,
        rules
      });
    },
    unbind (el, binding, { context }) {
      const field = findField(el, context);
      if (!field) return;

      context.$validator.detach(field);
    }
  };
};

const normalize = (fields) => {
  if (Array.isArray(fields)) {
    return fields.reduce((prev, curr) => {
      if (~curr.indexOf('.')) {
        prev[curr.split('.')[1]] = curr;
      } else {
        prev[curr] = curr;
      }

      return prev;
    }, {});
  }

  return fields;
};

/**
 * Maps fields to computed functions.
 *
 * @param {Array|Object} fields
 */
const mapFields = (fields) => {
  const normalized = normalize(fields);
  return Object.keys(normalized).reduce((prev, curr) => {
    const field = normalized[curr];
    prev[curr] = function mappedField () {
      if (this.$validator.fieldBag[field]) {
        return this.$validator.fieldBag[field];
      }

      const index = field.indexOf('.');
      if (index <= 0) {
        return {};
      }
      const [scope, name] = field.split('.');

      return getPath(`$${scope}.${name}`, this.$validator.fieldBag, {});
    };

    return prev;
  }, {});
};

let Vue;

const install = (_Vue, options) => {
  if (Vue) {
    warn('already installed, Vue.use(VeeValidate) should only be called once.');
    return;
  }

  Vue = _Vue;
  const config$$1 = assign({}, config, options);
  if (config$$1.dictionary) {
    Validator.updateDictionary(config$$1.dictionary);
  }

  Validator.setLocale(config$$1.locale);
  Validator.setStrictMode(config$$1.strict);

  Vue.mixin(makeMixin(Vue, config$$1));
  Vue.directive('validate', createDirective(config$$1));
};

var index = {
  install,
  mapFields,
  Validator,
  ErrorBag,
  Rules,
  version: '2.0.0-rc.13'
};

export default index;
