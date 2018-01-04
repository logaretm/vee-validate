import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  after: (field, [target]) => `Câmpul ${field} trebuie să fie după ${target}.`,
  alpha_dash: (field) => `Câmpul ${field} poate conține caracter alfanumerice, cât și caracterele "-" sau "_".`,
  alpha_num: (field) => `Câmpul ${field} poate conține doar caracter alfanumerice.`,
  alpha_spaces: (field) => `Câmpul ${field} poate conține literele alfabetului cât și spații.`,
  alpha: (field) => `Câmpul ${field} poate conține doar literele alfabetului.`,
  before: (field, [target]) => `Câmpul ${field} trebuie să fie după ${target}.`,
  between: (field, [min, max]) => `Câmpul ${field} trebuie să fie între ${min} și ${max}.`,
  confirmed: (field) => `Câmpul ${field} nu coincide.`,
  credit_card: (field) => `Câmpul ${field} este invalid.`,
  date_between: (field, [min, max]) => `Câmpul ${field} trebuie să fie între ${min} și ${max}.`,
  date_format: (field, [format]) => `Câmpul ${field} trebuie să fie în următorul format ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `Câmpul ${field} trebuie să fie numberic și poate conține ${decimals === '*' ? '' : decimale} zecimale.`,
  digits: (field, [length]) => `Câmpul ${field} trebuie să fie numeric și să conțină exact ${length} caractere.`,
  dimensions: (field, [width, height]) => `Câmpul ${field} trebuie să fie ${width} pixeli lungime și ${height} pixeli înălțime.`,
  email: (field) => `Câmpul ${field} trebuie să conțină un email valid.`,
  ext: (field) => `Câmpul ${field} trebuie să fie un nume de fișier valid.`,
  image: (field) => `Câmpul ${field} trebuie să fie o imagine.`,
  in: (field) => `Câmpul ${field} trebuie să conțină o valoare validă.`,
  ip: (field) => `Câmpul ${field} trebuie să conțină o adresa IP vaidă.`,
  max: (field, [length]) => `Câmpul ${field} nu poate fi mai mare de ${length} caractere.`,
  max_value: (field, [max]) => `Câmpul ${field} trebuie să fie maxim ${max}.`,
  mimes: (field) => `Câmpul ${field} trebuie să conțină un fișier cu extensie validă.`,
  min: (field, [length]) => `Câmpul ${field} trebuie să fie cel puțin ${length} caractere.`,
  min_value: (field, [min]) => `Câmpul ${field}trebuie să fie cel puțin ${min}.`,
  not_in: (field) => `Câmpul ${field} trebuie să conțină o valoare validă.`,
  numeric: (field) => `Câmpul ${field} poate conține doar valori numerice.`,
  regex: (field) => `Formatul câmpului ${field} este invalid.`,
  required: (field) => `Câmpul ${field} este necesar.`,
  size: (field, [size]) => `Câmpul ${field} nu trebuie să depășească ${formatFileSize(size)}.`,
  url: (field) => `Câmpul ${field} nu este un URL valid.`
};

const locale = {
  name: 'ro',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
