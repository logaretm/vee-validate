import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  after: (field, [target]) => ` ${field}必须在${target}之后`,
  alpha_dash: (field) => ` ${field}能够包含字母数字字符，包括破折号、下划线`,
  alpha_num: (field) => `${field} 只能包含字母数字字符.`,
  alpha_spaces: (field) => ` ${field} 只能包含字母字符，包括空格.`,
  alpha: (field) => ` ${field} 只能包含字母字符.`,
  before: (field, [target]) => ` ${field} 必须在${target} 之前.`,
  between: (field, [min, max]) => ` ${field} 必须在${min} ${max}之间.`,
  confirmed: (field, [confirmedField]) => ` ${field} 不能和${confirmedField}匹配.`,
  date_between: (field, [min, max]) => ` ${field}必须在${min}和${max}之间.`,
  date_format: (field, [format]) => ` ${field}必须在在${format}格式中.`,
  decimal: (field, [decimals = '*'] = []) => ` ${field} 必须是数字的而且能够包含${decimals === '*' ? '' : decimals} 小数点.`,
  digits: (field, [length]) => ` ${field} 必须是数字，且精确到 ${length}数`,
  dimensions: (field, [width, height]) => ` ${field}必须是 ${width} 像素到 ${height} 像素.`,
  email: (field) => ` ${field} 必须是有效的邮箱.`,
  ext: (field) => ` ${field} 必须是有效的文件.`,
  image: (field) => ` ${field} 必须是图片.`,
  in: (field) => ` ${field} 必须是一个有效值.`,
  ip: (field) => ` ${field} 必须是一个有效的地址.`,
  max: (field, [length]) => ` ${field} 不能大于${length}字符.`,
  max_value: (field, [max]) => ` ${field} 必须小于或等于${max}.`,  
  mimes: (field) => ` ${field} 必须是有效的文件类型.`,
  min: (field, [length]) => ` ${field} 必须至少有 ${length} 字符.`,
  min_value: (field, [min]) => ` ${field} 必须大于或等于${min}.`,
  not_in: (field) => ` ${field}必须是一个有效值.`,
  numeric: (field) => ` ${field} 只能包含数字字符.`,
  regex: (field) => ` ${field} 格式无效.`,
  required: (field) => `${field} 是必须的.`,
  size: (field, [size]) => ` ${field} 必须小于 ${formatFileSize(size)}.`,
  url: (field) => ` ${field}不是有效的url.`
};

const locale = {
  name: 'zh_CN',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
