import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `${field}的值无效`,
  after: (field, [target, inclusion]) => `${field}必须在${target}之后${inclusion ? '或等于' + target : ''}`,
  alpha: (field) => `${field}只能包含字母字符`,
  alpha_dash: (field) => `${field}能够包含字母数字字符、破折号和下划线`,
  alpha_num: (field) => `${field}只能包含字母数字字符`,
  alpha_spaces: (field) => `${field}只能包含字母字符和空格`,
  before: (field, [target, inclusion]) => `${field}必须在${target}之前${inclusion ? '或等于' + target : ''}`,
  between: (field, [min, max]) => `${field}必须在${min}与${max}之间`,
  confirmed: (field, [confirmedField]) => `${field}不能和${confirmedField}匹配`,
  credit_card: (field) => `${field}的格式错误`,
  date_between: (field, [min, max]) => `${field}必须在${min}和${max}之间`,
  date_format: (field, [format]) => `${field}必须符合${format}格式`,
  decimal: (field, [decimals = '*'] = []) => `${field}必须是数字，且能够保留${decimals === '*' ? '' : decimals}位小数`,
  digits: (field, [length]) => `${field}必须是数字，且精确到${length}位数`,
  dimensions: (field, [width, height]) => `${field}必须在${width}像素与${height}像素之间`,
  email: (field) => `${field}不是一个有效的邮箱`,
  excluded: (field) => `${field}不是一个有效值`,
  ext: (field) => `${field}不是一个有效的文件`,
  image: (field) => `${field}不是一张有效的图片`,
  included: (field) => `${field}不是一个有效值`,
  integer: (field) => `${field}必须是整数`,
  ip: (field) => `${field}不是一个有效的地址`,
  length: (field, [length, max]) => {
    if (max) {
      return `${field}长度必须在${length}到${max}之间`
    }

    return `${field}长度必须为${length}`
  },
  max: (field, [length]) => `${field}不能超过${length}个字符`,
  max_value: (field, [max]) => `${field}必须小于或等于${max}`,
  mimes: (field) => `${field}不是一个有效的文件类型`,
  min: (field, [length]) => `${field}必须至少有${length}个字符`,
  min_value: (field, [min]) => `${field}必须大于或等于${min}`,
  numeric: (field) => `${field}只能包含数字字符`,
  regex: (field) => `${field}格式无效`,
  required: (field) => `${field}是必须的`,
  size: (field, [size]) => `${field}必须小于${formatFileSize(size)}`,
  url: (field) => `${field}不是一个有效的url`
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
