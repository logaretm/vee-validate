import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  after: (field, [target]) => `Fältet ${field} måste vara efter ${target}.`,
  alpha_dash: (field) => `Fältet ${field} får bara innehålla alfanumeriska tecken såväl som snedstreck och understreck.`,
  alpha_num: (field) => `Fältet ${field} får bara innehålla alfanumeriska tecken.`,
  alpha_spaces: (field) => `Fältet ${field} får bara innehålla alfabetiska tecken och mellanslag.`,
  alpha: (field) => `Fältet ${field} får bara innehålla alfabetiska tecken.`,
  before: (field, [target]) => `Fältet ${field} måste vara tidigare än ${target}.`,
  between: (field, [min, max]) => `Fältet ${field} måste vara mellan ${min} och ${max}.`,
  confirmed: (field, [target]) => `Fältet ${field} matchar inte ${target}.`,
  date_between: (field, [min, max]) => `Fältet ${field} måste vara mellan ${min} och ${max}.`,
  date_format: (field, [target]) => `Fältet ${field} måste ha formatatet ${target}.`,
  decimal: (field, [decimals = '*'] = []) => `Fältet ${field} måste vara numeriskt och får innehålla ${(decimals === '*' ? '' : decimals)} decimaltecken.`,
  digits: (field, [length]) => `Fältet ${field} måste vara numeriskt och innehålla exakt ${length} siffor.`,
  dimensions: (field, [width, height]) => `Fältet ${field} måste vara ${width} pixlar bred och ${height} pixlar hög.`,
  email: (field) => `Fältet ${field} måste vara en giltig e-postadress.`,
  ext: (field) => `Fältet ${field} måste vara en godkänd fil.`,
  image: (field) => `Fältet ${field} måste vara en bildfil.`,
  in: (field) => `Fältet ${field} måste vara ett godkänt alternativ.`,
  ip: (field) => `Fältet ${field} måste vara en godkänd ip-adress.`,
  max: (field, [max]) => `Fältet ${field} får inte vara längre än ${max} tecken.`,
  mimes: (field) => `Fältet ${field} måste ha en filändelse.`,
  min: (field, [min]) => `Fältet ${field} måste minst vara ${min} tecken.`,
  not_in: (field) => `Fältet ${field} måste vara ett godkänt alternativ.`,
  numeric: (field) => `Fältet ${field} får bara innehålla numeriska tecken.`,
  regex: (field) => `Fältet ${field} har en felaktig formatering.`,
  required: (field) => `Fältet ${field} är obligatoriskt.`,
  size: (field, [size]) => `Fältet ${field} måste vara mindre än ${formatFileSize(size)}.`,
  url: (field) => `Fältet ${field} är inte en godkänd URL.`
};

const locale = {
  name: 'sv',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.addLocale(locale);
}

export default locale;
