import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `${field} reikšmė netinkama.`,
  after: (field, [target]) => `Laukelyje ${field} turi būti po ${target}.`,
  alpha_dash: (field) => `Laukelyje ${field} leidžiamos tik raidės, skaičiai bei brūkšneliai.`,
  alpha_num: (field) => `Laukelyje ${field} leidžiamos tik raidės ir skaičiai.`,
  alpha_spaces: (field) => `Laukelyje ${field} leidžiamos tik raidės ir tarpai.`,
  alpha: (field) => `Laukelyje ${field} leidžiamos tik raidės.`,
  before: (field, [target]) => `${field} turi būti prieš ${target}.`,
  between: (field, [min, max]) => `Laukelio ${field} reikšmė turi būti tarp ${min} ir ${max}.`,
  confirmed: (field) => `Laukelio ${field} patvirtinimas nesutampa.`,
  credit_card: (field) => `Laukelis ${field} neteisingas.`,
  date_between: (field, [min, max]) => `Laukelio ${field} reikšmė turi būti tarp ${min} ir ${max}.`,
  date_format: (field, [format]) => `Laukelio ${field} formatas privalo būti toks - ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `Laukelis ${field} turi būti skaitmuo su ${decimals === '*' ? '' : decimals} skaičium(-ias) po kablelio.`,
  digits: (field, [length]) => `Lauklio ${field} reikšmė turi buti ${length} ženklų(-o) skaitmuo.`,
  dimensions: (field, [width, height]) => `${field} turi būti ${width} px x ${height} px.`,
  email: (field) => `Laukelis ${field} turi būti teisinga el. pašto adresas.`,
  ext: (field) => `${field} turi būti tinkamas failas.`,
  image: (field) => `${field} turi būti paveikslėlis.`,
  in: (field) => `${field} reikšmė nėra leidžiama.`,
  ip: (field) => `${field} turi būti ip adresas.`,
  max: (field, [length]) => `${field} negali būti ilgesnis nei ${length}.`,
  max_value: (field, [max]) => `${field} turi būti ${max} arba mažiau.`,
  mimes: (field) => `${field} privalo turėti tinkmą failo tipą.`,
  min: (field, [length]) => `${field} ilgis privalo būti bent ${length}.`,
  min_value: (field, [min]) => `${field} turi būti ${min} arba daugiau.`,
  not_in: (field) => `${field} reikšmė nėra leidžiama.`,
  numeric: (field) => `${field} turi būti tik skaitmenys.`,
  regex: (field) => `Laukelio ${field} formatas netinkamas.`,
  required: (field) => `Laukelis ${field} privalomas.`,
  size: (field, [size]) => `${field} turi būti mažesnis nei ${formatFileSize(size)}.`,
  url: (field) => `${field} turi būti internetinis adresas.`
};

const locale = {
  name: 'en',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
