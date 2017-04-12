const messages = {
  _default: (field) => `قيمة الحقل ${field} غير صحيحة.`,
  after: (field, [target]) => `${field} يجب ان يكون بعد ${target}.`,
  alpha_dash: (field) => `${field} قد يحتوي على حروف او الرموز - و _.`,
  alpha_num: (field) => `${field} قد يحتوي فقط على حروف وارقام.`,
  alpha_spaces: (field) => `${field} قد يحتوي فقط على حروف ومسافات.`,
  alpha: (field) => `${field} يجب ان يحتوي على حروف فقط.`,
  before: (field, [target]) => `${field} يجب ان يكون قبل ${target}.`,
  between: (field, [min, max]) => `قيمة ${field} يجب ان تكون ما بين ${min} و ${max}.`,
  confirmed: (field) => `${field} لا يماثل التأكيد.`,
  credit_card: (field) => `الحقل ${field} غير صحيح.`,
  date_between: (field, [min, max]) => `${field} يجب ان يكون ما بين ${min} و ${max}.`,
  date_format: (field, [format]) => `${field} يجب ان يكون على هيئة ${format}.`,
  decimal: (field, [decimals] = ['*']) => `${field} يجب ان يكون قيمة رقمية وقد يحتوي على ${decimals === '*' ? '' : decimals} ارقام عشرية.`,
  digits: (field, [length]) => `${field} يجب ان تحتوي فقط على ارقام والا يزيد عددها عن ${length} رقم.`,
  dimensions: (field, [width, height]) => `${field} يجب ان تكون بمقاس ${width} بكسل في ${height} بكسل.`,
  email: (field) => `${field} يجب ان يكون بريدا اليكتروني صحيح.`,
  ext: (field) => `نوع ملف ${field} غير صحيح.`,
  image: (field) => `${field} يجب ان تكون صورة.`,
  in: (field) => `الحقل ${field} يجب ان يكون قيمة صحيحة.`,
  ip: (field) => `${field} يجب ان يكون ip صحيح.`,
  max: (field, [length]) => `الحقل ${field} يجب ان يحتوي على ${length} حروف على الأكثر.`,
  max_value: (field, [min]) => `قيمة الحقل ${field} يجب ان تكون اصغر من ${min} او تساويها.`,
  mimes: (field) => `نوع ملف ${field} غير صحيح.`,
  min: (field, [length]) => `الحقل ${field} يجب ان يحتوي على ${length} حروف على الأقل.`,
  min_value: (field, [min]) => `قيمة الحقل ${field} يجب ان تكون اكبر من ${min} او تساويها.`,
  not_in: (field) => `الحقل ${field} غير صحيح.`,
  numeric: (field) => `${field} يمكن ان يحتوي فقط على ارقام.`,
  regex: (field) => `الحقل ${field} غير صحيح.`,
  required: (field) => `${field} مطلوب.`,
  size: (field, [size]) => `${field} يجب ان يكون اقل من ${size} كيلوبايت.`,
  url: (field) => `الحقل ${field} يجب ان يكون رابطاً صحيحاً.`
};

const locale = {
  name: 'ar',
  messages,
  attributes: {}
};

if (typeof VeeValidate !== 'undefined' && VeeValidate && typeof VeeValidate.Validator) {
  VeeValidate.Validator.addLocale(locale);
}

export default locale;
