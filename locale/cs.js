import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `Pole ${field} není vyplněno správně.`,
  after: (field, [target, inclusion]) => `${field} musí být později než ${inclusion ? 'nebo se rovnat ' : ''}${target}.`,
  alpha_dash: (field) => `Pole ${field} může obsahovat pouze alfanumerické znaky, pomlčky nebo podtržítka.`,
  alpha_num: (field) => `Pole ${field} může obsahovat pouze alfanumerické znaky.`,
  alpha_spaces: (field) => `Pole ${field} může obsahovat pouze alfanumerické znaky a mezery.`,
  alpha: (field) => `Pole ${field} může obsahovat pouze písmena.`,
  before: (field, [target, inclusion]) => `${field} musí být dříve než ${inclusion ? 'nebo se rovnat ' : ''}${target}.`,
  between: (field, [min, max]) => `Pole ${field} musí být mezi ${min} a ${max}.`,
  confirmed: (field) => `Kontrola pole ${field} se neshoduje.`,
  credit_card: (field) => `Pole ${field} není vyplněno správně.`,
  date_between: (field, [min, max]) => `Pole ${field} musí být mezi ${min} a ${max}.`,
  date_format: (field, [format]) => `Pole ${field} musí být ve formátu ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `Pole ${field} musí být číslo a může obsahovat ${decimals === '*' ? '' : decimals} desetinných míst.`,
  digits: (field, [length]) => `Pole ${field} musí být číslo a musí obshovat přesně ${length} číslic.`,
  dimensions: (field, [width, height]) => `${field} musí mít ${width} pixelů na ${height} pixelů.`,
  email: (field) => `Pole ${field} musí být validní email.`,
  ext: (field) => `${field} musí být validní soubor.`,
  image: (field) => `${field} musí být obrázek.`,
  in: (field) => `${field} musí být správná hodnota.`,
  ip: (field) => `${field} musí být ip addresa.`,
  max: (field, [length]) => `${field} nesmí být delší než ${length} znaků.`,
  max_value: (field, [max]) => `Pole ${field} musí být ${max}, nebo mensí.`,
  mimes: (field) => `Pole ${field} musí být správný typ souboru.`,
  min: (field, [length]) => `Pole ${field} musí obsahovat alespoň ${length} znaků.`,
  min_value: (field, [min]) => `Pole ${field} musí být ${min}, nebo více.`,
  not_in: (field) => `${field} musí být správná hodnota.`,
  numeric: (field) => `Pole ${field} může obsahovat pouze číslice.`,
  regex: (field) => `Pole ${field} není vyplněno správně.`,
  required: (field) => `Pole ${field} je povinné.`,
  size: (field, [size]) => `${field} musí být menší než ${formatFileSize(size)}.`,
  url: (field) => `${field} není platná URL adresa.`
};

const locale = {
  name: 'cs',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
