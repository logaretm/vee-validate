import { formatFileSize, isDefinedGlobally } from './utils';

const localizeSize = (size) => {
  const map = {
    Byte: 'بايت',
    KB: 'كيلوبايت',
    GB: 'جيجابايت',
    PB: 'بيتابايت'
  };

  return formatFileSize(size).replace(/(Byte|KB|GB|PB)/, m => {
    return map[m];
  });
};

const messages = {
  after: (field, [target]) => `${field} باید بعد از تاریخ ${target} باشد.`,
  alpha_dash: (field) => `${field} فقط می تواند از حروف، اعداد، خط فاصله و زیرخط تشکیل شود.`,
  alpha_num: (field) => `${field} فقط میتواند از حروف و اعداد تشکیل شود.`,
  alpha_spaces: (field) => `${field} فقط می تواند از حروف و فاصله تشکیل شود.`,
  alpha: (field) => `${field} فقط می تواند از حروف تشکیل شود.`,
  before: (field, [target]) => `${field} باید قبل از تاریخ ${target} باشد.`,
  between: (field, [min, max]) => `${field} باید بین ${min} و ${max} کارکتر باشد.`,
  confirmed: (field) => `${field} با تاییدیه اش مطابقت ندارد.`,
  credit_card: (field) => `${field} غیر معتبر است.`,
  date_between: (field, [min, max]) => `${field} باید بین تاریخ ${min} and ${max} باشد.`,
  date_format: (field, [format]) => `${field} باید در قالب ${format} باشد.`,
  decimal: (field, [decimals = '*'] = []) => `${field} باید یک مقدار عددی ${decimals === '*' ? '' : ' با حداکثر ' + decimals + ' اعشار'} باشد.`,
  digits: (field, [length]) => `${field} باید یک مقدار عددی و دقیقاً ${length} رقم باشد.`,
  dimensions: (field, [width, height]) => `${field} باید در اندازه ${width} پیکسل عرض و ${height} پیکسل ارتفاع باشد.`,
  email: (field) => `${field} باید یک پست الکترونیک معتبر باشد.`,
  ext: (field) => `${field} باید یک فایل معتبر باشد.`,
  image: (field) => `${field} باید یک تصویر باشد.`,
  in: (field) => `${field} باید یک مقدار معتبر باشد.`,
  ip: (field) => `${field} باید یک آدرس آی پی معتبر باشد.`,
  max: (field, [length]) => `${field} نباید بیشتر از ${length} کارکتر باشد.`,
  max_value: (field, [max]) => `مقدار ${field} باید ${max} یا کمتر باشد.`,
  mimes: (field) => `${field} باید از نوع معتبر باشد.`,
  min: (field, [length]) => `${field} باید حداقل ${length} کارکتر باشد.`,
  min_value: (field, [min]) => `مقدار ${field} باید ${min} یا بیشتر باشد.`,
  not_in: (field) => `${field}باید یک مقدار معتبر باشد.`,
  numeric: (field) => `${field} فقط می تواند عددی باشد.`,
  regex: (field) => `قالب ${field} قابل قبول نیست.`,
  required: (field) => `${field} الزامی است.`,
  size: (field, [size]) => `حجم ${field} کمتر از ${localizeSize(size)} باشد.`,
  url: (field) => `${field} باید یک تارنمای معتبر باشد.`
};

const locale = {
  name: 'fa',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
