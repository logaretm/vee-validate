import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  after: (field, [target]) => `Câmpul ${field} trebuie să fie după ${target}`,
  alpha: (field) => `Câmpul ${field} poate conține doar literele alfabetului`,
  alpha_dash: (field) => `Câmpul ${field} poate conține litere și caracterele "-" sau "_"`,
  alpha_num: (field) => `Câmpul ${field} poate conține doar caractere alfanumerice`,
  alpha_spaces: (field) => `Câmpul ${field} poate conține literele și spații`,
  before: (field, [target]) => `Câmpul ${field} trebuie să fie după ${target}`,
  between: (field, [min, max]) => `Valoare câmpului ${field} trebuie să fie între ${min} și ${max}`,
  confirmed: (field) => `Câmpul ${field} nu coincide`,
  credit_card: (field) => `Valoarea câmpului ${field} nu este un număr de card valid`,
  date_between: (field, [min, max]) => `Data introdusă în ${field} trebuie să fie între ${min} și ${max}`,
  date_format: (field, [format]) => `Respectați următorul format: ${format} în câmpul ${field}`,
  decimal: (field, [decimals = '*'] = []) => `Câmpul ${field} trebuie să fie numberic și poate conține ${!decimals || decimals === '*' ? '' : ' ' + decimals} zecimale`,
  digits: (field, [length]) => `Câmpul ${field} trebuie să fie numeric și să conțină exact ${length} caractere`,
  dimensions: (field, [width, height]) => `Câmpul ${field} trebuie să fie ${width} pixeli lungime și ${height} pixeli înălțime`,
  email: (field) => `Câmpul ${field} trebuie să conțină un email valid`,
  excluded: (field) => `Câmpul ${field} trebuie să conțină o valoare validă`,
  ext: (field) => `Câmpul ${field} trebuie să fie un nume de fișier valid`,
  image: (field) => `Câmpul ${field} trebuie să fie o imagine`,
  included: (field) => `Câmpul ${field} trebuie să conțină o valoare validă`,
  ip: (field) => `Câmpul ${field} trebuie să conțină o adresă IP validă`,
  max: (field, [length]) => `Câmpul ${field} nu poate conține mai mult de ${length} caractere`,
  max_value: (field, [max]) => `Valoarea câmpului ${field} trebuie să fie maxim ${max}`,
  mimes: (field) => `Câmpul ${field} trebuie să conțină un fișier cu extensie validă`,
  min: (field, [length]) => `Câmpul ${field} trebuie să conțină cel puțin ${length} caractere`,
  min_value: (field, [min]) => `Valoarea câmpului ${field} trebuie să fie mai mare de ${min}`,
  numeric: (field) => `Câmpul ${field} poate conține doar valori numerice`,
  regex: (field) => `Formatul câmpului ${field} este invalid`,
  required: (field) => `Câmpul ${field} este obligatoriu`,
  size: (field, [size]) => `Câmpul ${field} nu trebuie să depășească ${formatFileSize(size)}`,
  url: (field) => `Câmpul ${field} nu este o adresă URL validă`
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
