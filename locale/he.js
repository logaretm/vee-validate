import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  after: (field, [target]) => `השדה ${field} חייב להכיל תאריך לאחר ${target}.`,
  alpha_dash: (field) => `השדה ${field} יכול להכיל רק אותיות, מספרים ומקפים.`,
  alpha_num: (field) => `השדה ${field} יכול להכיל רק אותיות ומספרים..`,
  alpha_spaces: (field) => `השדה ${field} יכול להכיל רק אותיות ורווחים.`,
  alpha: (field) => `השדה ${field} יכול להכיל רק אותיות.`,
  before: (field, [target]) => `השדה ${field} חייב להכיל תאריך לפני ${target}.`,
  between: (field, [min, max]) => `הערך ${field} חייב להיות בין ${min} ל- ${max}.`,
  confirmed: (field) => `הערכים של ${field} חייבים להיות זהים.`,
  date_between: (field, [min, max]) => `השדה ${field} חייב להיות בין התאריכים ${min} ו- ${max}.`,
  date_format: (field, [format]) => `השדה ${field} חייב להיות בפורמט ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `השדה ${field} חייב להיות מספרי ולהכיל ${decimals === '*' ? '' : decimals} נקודות עשרוניות.`,
  digits: (field, [length]) => `השדה ${field} חייב להיות מספר ולהכיל ${length} ספרות בדיוק.`,
  dimensions: (field, [width, height]) => `השדה ${field} חייב להיות ${width} פיקסלים על ${height} פיקסלים.`,
  email: (field) => `השדה ${field} חייב להכיל כתובת אימייל תקינה.`,
  ext: (field) => `השדה ${field} חייב להכיל קובץ תקין.`,
  image: (field) => `השדה ${field} חייב להכיל תמונה.`,
  in: (field) => `השדה ${field} חייב להיות בעל ערך תקין.`,
  ip: (field) => `השדה ${field} חייב להכיל כתובת IP תקינה.`,
  max: (field, [length]) => `השדה ${field} לא יכול להכיל יותר מ- ${length} תווים.`,
  max_value: (field, [max]) => `השדה ${field} יכול להיות ${max} לכל היותר.`,
  mimes: () => 'הקובץ חייב להיות מסוג תקין.',
  min: (field, [length]) => `השדה ${field} חייב להכיל ${length} תווים לפחות.`,
  min_value: (field, [min]) => `הערך של ${field} חייב להיות לפחות ${min}.`,
  not_in: (field) => `השדה ${field} חייב להכיל ערך תקין.`,
  numeric: (field) => `השדה ${field} יכול להכיל ספרות בלבד.`,
  regex: (field) => `הפורמט של ${field} אינו תקין.`,
  required: (field) => `חובה למלא את השדה ${field}.`,
  size: (field, [size]) => `השדה ${field} חייב לשקול פחות מ ${formatFileSize(size)}.`,
  url: (field) => `${field} אינו מכיל כתובת אינטרנט תקינה.`
};

const locale = {
  name: 'he',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
