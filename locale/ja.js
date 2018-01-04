import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  after: (field, [target]) => `${field}は${target}の後でなければなりません`,
  alpha_dash: (field) => `${field}は英数字とハイフン、アンダースコアのみ使用できます`,
  alpha_num: (field) => `${field}は英数字のみ使用できます`,
  alpha_spaces: (field) => `${field}はアルファベットと空白のみ使用できます`,
  alpha: (field) => `${field}はアルファベットのみ使用できます`,
  before: (field, [target]) => `${field}は${target}よりも前でなければなりません`,
  between: (field, [min, max]) => `${field}は${min}から${max}の間でなければなりません`,
  confirmed: (field) => `${field}が一致しません`,
  credit_card: (field) => `${field}が正しくありません`,
  date_between: (field, [min, max]) => `${field}は${min}から${max}の間でなければなりません`,
  date_format: (field, [format]) => `${field}は${format}形式でなけれななりません`,
  decimal: (field, [decimals = '*'] = []) => `${field}は整数及び小数点以下${decimals === '*' ? '' : decimals}桁までの数字にしてください`,
  digits: (field, [length]) => `${field}は${length}桁の数字でなければなりません`,
  dimensions: (field, [width, height]) => `${field}は幅${width}px、高さ${height}px以内でなければなりません`,
  email: (field) => `${field}は有効なメールアドレスではありません`,
  ext: (field) => `${field}は有効なファイル形式ではありません`,
  image: (field) => `${field}は有効な画像形式ではありません`,
  in: (field) => `${field}は有効な値ではありません`,
  ip: (field) => `${field}は有効なIPアドレスではありません`,
  max: (field, [length]) => `${field}は${length}文字以内にしてください`,
  max_value: (field, [max]) => `${field}は${max}以下でなければなりません`,
  mimes: (field) => `${field}は有効なファイル形式ではありません`,
  min: (field, [length]) => `${field}は${length}文字以上でなければなりません`,
  min_value: (field, [min]) => `${field}は${min}以上でなければなりません`,
  not_in: (field) => `${field}は不正な値です`,
  numeric: (field) => `${field}は数字のみ使用できます`,
  regex: (field) => `${field}が正しくありません`,
  required: (field) => `${field}は必須項目です`,
  size: (field, [size]) => `${field}は${formatFileSize(size)}以内でなければなりません`,
  url: (field) => `${field}が正しくありません`
};

const locale = {
  name: 'ja',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
