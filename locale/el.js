import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `${field} πρέπει να είναι έγκυρη τιμή.`,
  after: (field, [target]) => `${field} πρέπει να είναι μετά ${target}.`,
  alpha: (field) => `${field} πρέπει να περιέχει μόνο αλφαβητικούς χαρακτήρες.`,
  alpha_dash: (field) => `${field} μπορεί να περιέχει αλφαριθμητικούς χαρακτήρες, παύλες και κάτω παύλες.`,
  alpha_num: (field) => `${field} πρέπει να περιέχει μόνο αλφαριθμητικούς χαρακτήρες.`,
  alpha_spaces: (field) => `${field} μπορεί να περιέχει μόνο αλφαβητικούς χαρακτήρες και κενά.`,
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
  excluded: (field) => `${field} πρέπει να είναι έγκυρη τιμή.`,
  ext: (field) => `${field} πρέπει να είναι έγκυρο αρχείο.`,
  image: (field) => `${field} πρέπει να είναι εικόνα.`,
  included: (field) => `${field} πρέπει να είναι έγκυρη τιμή.`,
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
  // eslint-disable-next-line
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
