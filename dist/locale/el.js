<<<<<<< HEAD
import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `${field} πρέπει να είναι έγκυρη τιμή.`,
  after: (field, [target]) => `${field} πρέπει να είναι μετά ${target}.`,
  alpha_dash: (field) => `${field} μπορεί να περιέχει αλφαριθμητικούς χαρακτήρες, παύλες και κάτω παύλες.`,
  alpha_num: (field) => `${field} πρέπει να περιέχει μόνο αλφαριθμητικούς χαρακτήρες.`,
  alpha_spaces: (field) => `${field} μπορεί να περιέχει μόνο αλφαβητικούς χαρακτήρες και κενά.`,
  alpha: (field) => `${field} πρέπει να περιέχει μόνο αλφαβητικούς χαρακτήρες.`,
  before: (field, [target]) => `${field} πρέπει να είναι πρίν ${target}.`,
  between: (field, [min, max]) => `${field} πρέπει να είναι μεταξύ ${min} καί ${max}.`,
  confirmed: (field, [confirmedField]) => `${field} δεν ταιριάζει με ${confirmedField}.`,
  credit_card: (field) => `${field} πρέπει να είναι έγκυρη πιστωτική κάρτα.`,
  date_between: (field, [min, max]) => `${field} πρέπει να είναι μεταξύ ${min} καί ${max}.`,
  date_format: (field, [format]) => `${field} πρέπει να είναι σε μορφή ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `${field} πρέπει να είναι αριθμός και να περιέχει ${decimals === '*' ? '' : decimals} δεκαδικά ψηφία.`,
  digits: (field, [length]) => `${field} πρέπει να είναι αριθμός και να περιέχει ${length} ψηφία.`,
  dimensions: (field, [width, height]) => `${field} πρέπει να είναι ${width} pixels επί ${height} pixels.`,
  email: (field) => `${field} πρέπει να είναι έγκυρο email.`,
  ext: (field) => `${field} πρέπει να είναι έγκυρο αρχείο.`,
  image: (field) => `${field} πρέπει να είναι εικόνα.`,
  in: (field) => `${field} πρέπει να είναι έγκυρη τιμή.`,
  integer: (field) => `${field} πρέπει να είναι ακέραιος αριθμός.`,
  ip: (field) => `${field} πρέπει να είναι έγκυρη διεύθυνση IP.`,
  length: (field, [length, max]) => {
    if (max) {
      return `${field} πρέπει να είναι μεταξύ ${length} και ${max} χαρακτήρες.`;
    }

    return `${field} πρέπει να είναι ${length} χαρακτήρες.`;
  },
  max: (field, [length]) => `${field} δεν πρέπει να υπερβαίνει τους ${length} χαρακτήρες.`,
  max_value: (field, [max]) => `${field} πρέπει να είναι ${max} ή λιγότερο.`,
  mimes: (field) => `${field} πρέπει να είναι έγκυρο αρχείο ΜΙΜΕ.`,
  min: (field, [length]) => `${field} πρέπει να είναι τουλάχιστον ${length} χαρακτήρες.`,
  min_value: (field, [min]) => `${field} πρέπει να είναι ${min} ή περισσότερο.`,
  not_in: (field) => `${field} πρέπει να είναι έγκυρη τιμή.`,
  numeric: (field) => `${field} πρέπει να περιέχει μόνο αριθμούς.`,
  regex: (field) => `${field} δεν είναι έγκυρο.`,
  required: (field) => `${field} δεν έχει συμπληρωθεί.`,
  size: (field, [size]) => `${field} πρέπει να μην υπερβαίνει τα ${formatFileSize(size)}.`,
  url: (field) => `${field} πρέπει να είναι έγκυρη διεύθυνση URL.`
};

const locale = {
  name: 'el',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
=======
!function(n,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(n.__vee_validate_locale__el=n.__vee_validate_locale__el||{},n.__vee_validate_locale__el.js=e())}(this,function(){"use strict";var n={name:"el",messages:{after:function(n,e){return n+" πρέπει να είναι μετά "+e[0]+"."},alpha_dash:function(n){return n+" μπορεί να περιέχει αλφαριθμητικούς χαρακτήρες, παύλες και κάτω παύλες."},alpha_num:function(n){return n+" πρέπει να περιέχει μόνο αλφαριθμητικούς χαρακτήρες."},alpha_spaces:function(n){return n+" μπορεί να περιέχει μόνο αλφαβητικούς χαρακτήρες και κενά."},alpha:function(n){return n+" πρέπει να περιέχει μόνο αλφαβητικούς χαρακτήρες."},before:function(n,e){return n+" πρέπει να είναι πρίν "+e[0]+"."},between:function(n,e){return n+" πρέπει να είναι μεταξύ "+e[0]+" καί "+e[1]+"."},confirmed:function(n,e){return n+" δεν ταιριάζει με "+e[0]+"."},credit_card:function(n){return n+" πρέπει να είναι έγκυρη πιστωτική κάρτα."},date_between:function(n,e){return n+" πρέπει να είναι μεταξύ "+e[0]+" καί "+e[1]+"."},date_format:function(n,e){return n+" πρέπει να είναι σε μορφή "+e[0]+"."},decimal:function(n,e){void 0===e&&(e=[]);var t=e[0];return void 0===t&&(t="*"),n+" πρέπει να είναι αριθμός και να περιέχει "+("*"===t?"":t)+" δεκαδικά ψηφία."},digits:function(n,e){return n+" πρέπει να είναι αριθμός και να περιέχει "+e[0]+" ψηφία."},dimensions:function(n,e){return n+" πρέπει να είναι "+e[0]+" pixels επί "+e[1]+" pixels."},email:function(n){return n+" πρέπει να είναι έγκυρο email."},ext:function(n){return n+" πρέπει να είναι έγκυρο αρχείο."},image:function(n){return n+" πρέπει να είναι εικόνα."},in:function(n){return n+" πρέπει να είναι έγκυρη τιμή."},ip:function(n){return n+" πρέπει να είναι έγκυρη διεύθυνση IP."},max:function(n,e){return n+" δεν πρέπει να υπερβαίνει τους "+e[0]+" χαρακτήρες."},max_value:function(n,e){return n+" πρέπει να είναι "+e[0]+" ή λιγότερο."},mimes:function(n){return n+" πρέπει να είναι έγκυρο αρχείο ΜΙΜΕ."},min:function(n,e){return n+" πρέπει να είναι τουλάχιστον "+e[0]+" χαρακτήρες."},min_value:function(n,e){return n+" πρέπει να είναι "+e[0]+" ή περισσότερο."},not_in:function(n){return n+" πρέπει να είναι έγκυρη τιμή."},numeric:function(n){return n+" πρέπει να περιέχει μόνο αριθμούς."},regex:function(n){return n+" δεν είναι έγκυρο."},required:function(n){return n+" δεν έχει συμπληρωθεί."},size:function(n,e){return n+" πρέπει να μην υπερβαίνει τα "+function(n){var e=0==(n=1024*Number(n))?0:Math.floor(Math.log(n)/Math.log(1024));return 1*(n/Math.pow(1024,e)).toFixed(2)+" "+["Byte","KB","MB","GB","TB","PB","EB","ZB","YB"][e]}(e[0])+"."},url:function(n){return n+" πρέπει να είναι έγκυρη διεύθυνση URL."}},attributes:{}};if("undefined"!=typeof VeeValidate){VeeValidate.Validator.localize((e={},e[n.name]=n,e));var e}return n});
>>>>>>> upstream/master
