import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `Το πεδίο ${field} δεν είναι έγκυρο.`,
  after: (field, [target]) => `Το πεδίο ${field} πρέπει να είναι μετά ${target}.`,
  alpha_dash: (field) => `Το πεδίο ${field} μπορεί να περιέχει αλφαριθμητικούς χαρακτήρες, παύλες και κάτω παύλες.`,
  alpha_num: (field) => `Το πεδίο ${field} πρέπει να περιέχει μόνο αλφαριθμητικούς χαρακτήρες.`,
  alpha_spaces: (field) => `Το πεδίο ${field} μπορεί να περιέχει μόνο αλφαβητικούς χαρακτήρες και κενά.`,
  alpha: (field) => `Το πεδίο ${field} πρέπει να περιέχει μόνο αλφαβητικούς χαρακτήρες.`,
  before: (field, [target]) => `Το πεδίο ${field} πρέπει να είναι πρίν ${target}.`,
  between: (field, [min, max]) => `Το πεδίο ${field} πρέπει να είναι μεταξύ ${min} καί ${max}.`,
  confirmed: (field, [confirmedField]) => `Το πεδίο ${field} δεν ταιριάζει με ${confirmedField}.`,
  credit_card: (field) => `Το πεδίο ${field} πρέπει να είναι έγκυρη πιστωτική κάρτα.`,
  date_between: (field, [min, max]) => `Το πεδίο ${field} πρέπει να είναι μεταξύ ${min} καί ${max}.`,
  date_format: (field, [format]) => `Το πεδίο ${field} πρέπει να είναι σε μορφή ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `Το πεδίο ${field} πρέπει να είναι αριθμός και να περιέχει ${decimals === '*' ? '' : decimals} δεκαδικά ψηφία.`,
  digits: (field, [length]) => `Το πεδίο ${field} πρέπει να είναι αριθμός και να περιέχει ${length} ψηφία.`,
  dimensions: (field, [width, height]) => `Το πεδίο ${field} πρέπει να είναι ${width} pixels επί ${height} pixels.`,
  email: (field) => `Το πεδίο ${field} πρέπει να είναι έγκυρο email.`,
  ext: (field) => `Το πεδίο ${field} πρέπει να είναι έγκυρο αρχείο.`,
  image: (field) => `Το πεδίο ${field} πρέπει να είναι εικόνα.`,
  in: (field) => `Το πεδίο ${field} πρέπει να είναι έγκυρη τιμή.`,
  ip: (field) => `Το πεδίο ${field} πρέπει να είναι έγκυρη διεύθυνση IP.`,
  max: (field, [length]) => `Το πεδίο ${field} δεν πρέπει να υπερβαίνει τους ${length} χαρακτήρες.`,
  max_value: (field, [max]) => `Το πεδίο ${field} πρέπει να είναι ${max} ή λιγότερο.`,
  mimes: (field) => `Το πεδίο ${field} πρέπει να είναι έγκυρο αρχείο ΜΙΜΕ.`,
  min: (field, [length]) => `Το πεδίο ${field} πρέπει να είναι τουλάχιστον ${length} χαρακτήρες.`,
  min_value: (field, [min]) => `Το πεδίο ${field} πρέπει να είναι ${min} ή περισσότερο.`,
  not_in: (field) => `Το πεδίο ${field} πρέπει να είναι έγκυρη τιμή.`,
  numeric: (field) => `Το πεδίο ${field} πρέπει να περιέχει μόνο αριθμούς.`,
  regex: (field) => `Το πεδίο ${field} δεν είναι έγκυρο.`,
  required: (field) => `Το πεδίο ${field} δεν έχει συμπληρωθεί.`,
  size: (field, [size]) => `Το μέγεθος του πεδίο ${field} πρέπει να μην υπερβαίνει τα ${formatFileSize(size)}.`,
  url: (field) => `Το πεδίο ${field} πρέπει να είναι έγκυρη διεύθυνση URL.`
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
