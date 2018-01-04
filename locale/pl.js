import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  after: (field, [target]) => `Pole ${field} musi być po polu ${target}.`,
  alpha_dash: (field) => `Pole ${field} może zawierać litery, cyfry oraz myślnik lub podkreślnik.`,
  alpha_num: (field) => `Pole ${field} może zawierać tylko litery i cyfry.`,
  alpha_spaces: (field) => `Pole ${field} może zawierać tylko litery oraz spacje.`,
  alpha: (field) => `Pole ${field} może zawierać tylko litery.`,
  before: (field, [target]) => `Pole ${field} musi być przed ${target}.`,
  between: (field, [min, max]) => `Pole ${field} must be between ${min} and ${max}.`,
  confirmed: (field, [confirmedField]) => `Pole ${field} nie zgadza się z polem potwierdzającym ${confirmedField}.`,
  date_between: (field, [min, max]) => `Pole ${field} musi zawierać się między ${min} a ${max}.`,
  date_format: (field, [format]) => `Pole ${field} musi pasować do formatu ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `Pole ${field} musi być liczbą i może zawierać ${decimals === '*' ? '' : decimals} miejsca po przecinku.`,
  digits: (field, [length]) => `Pole ${field} musi być liczbą i dokładnie ${length} cyfr.`,
  dimensions: (field, [width, height]) => `Obraz ${field} musi być szeroki na ${width} pikseli i wysoki na ${height} pikseli.`,
  email: (field) => `Pole ${field} musi być poprawnym adresem email.`,
  ext: (field) => `Plik ${field} musi być poprawnym plikiem.`,
  image: (field) => `Pole ${field} musi być obrazem.`,
  in: (field) => `Pole ${field} musi być poprawną wartością.`,
  ip: (field) => `Pole ${field} musi być poprawnym adresem IP.`,
  max: (field, [length]) => `Pole ${field} nie może być dłuższe niż ${length} znaków.`,
  mimes: (field) => `Plik ${field} musi posiadać poprawne rozszerzenie.`,
  min: (field, [length]) => `Pole ${field} musi być długie na co najmniej ${length} znaków.`,
  not_in: (field) => `Pole ${field} musi być poprawną wartością.`,
  numeric: (field) => `Pole ${field} może zawierać tylko cyfry.`,
  regex: (field) => `Format pola ${field} jest nieodpowiedni.`,
  required: (field) => `Pole ${field} jest wymagane.`,
  size: (field, [size]) => `Plik ${field} musi być mniejszy niż ${formatFileSize(size)}.`,
  url: (field) => `Pole ${field} nie jest poprawnym URL.`
};

const locale = {
  name: 'pl',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
