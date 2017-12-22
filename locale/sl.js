import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `Vrednost polja ${field} ni veljavna.`,
  after: (field, [target]) => `Polje ${field} mora biti za ${target}.`,
  alpha_dash: (field) => `Polje ${field} lahko vsebuje le alfanumerične znake kot tudi vezaje in podčrtaje.`,
  alpha_num: (field) => `Polje ${field} lahko vsebuje le alfanumerične znake.`,
  alpha_spaces: (field) => `Polje ${field} lahko vsebuje le črkovne znake in presledke.`,
  alpha: (field) => `Polje ${field} lahko vsebuje le črkovne znake.`,
  before: (field, [target]) => `Polje ${field} mora biti pred ${target}.`,
  between: (field, [min, max]) => `Polje ${field} mora biti med ${min} in ${max}.`,
  confirmed: (field) => `Polje ${field} se ne ujema.`,
  credit_card: (field) => `Polje ${field} ni veljavno.`,
  date_between: (field, [min, max]) => `Datum v polju ${field} mora biti med ${min} in ${max}.`,
  date_format: (field, [format]) => `Datum v polju ${field} mora biti sledečega formata: ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `Polje ${field} mora biti numerično in lahko vsebuje ${decimals === '*' ? '' : decimals} decimalnih mest.`,
  digits: (field, [length]) => `Vrednost polja ${field} mora biti numerična in vsebovati natančno ${length} številk.`,
  dimensions: (field, [width, height]) => `Slika ${field} mora biti široka ${width} slikovnih točk in visoka ${height} slikovnih točk.`,
  email: (field) => `Vrednost polja ${field} mora biti ustrezen e-naslov.`,
  ext: (field) => `Datoteka polja ${field} mora biti ustrezna.`,
  image: (field) => `Datoteka polja ${field} mora biti slika.`,
  in: (field) => `Polje ${field} mora biti ustrezne vrednosti.`,
  ip: (field) => `Vrednost polja ${field} mora biti ustrezen IP naslov.`,
  max: (field, [length]) => `Dolžina polja ${field} ne sme biti večja od ${length} znakov.`,
  max_value: (field, [max]) => `Vrednost polja ${field} mora biti ${max} ali manj.`,
  mimes: (field) => `Datoteka polja ${field} mora biti ustreznega tipa.`,
  min: (field, [length]) => `Dolžina polja ${field} mora biti vsaj ${length} znakov.`,
  min_value: (field, [min]) => `Vrednost polja ${field} mora biti ${min} ali več.`,
  not_in: (field) => `Polje ${field} mora biti ustrezne vrednosti.`,
  numeric: (field) => `Polje ${field} lahko vsebuje le numerične znake.`,
  regex: (field) => `Vrednost polja ${field} ni v ustreznem formatu.`,
  required: (field) => `Polje ${field} je obvezno.`,
  size: (field, [size]) => `Velikost datoteke ${field} mora biti manjša kot ${formatFileSize(size)}.`,
  url: (field) => `Vrednost polja ${field} ni veljavni URL naslov.`
};

const locale = {
  name: 'sl',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
