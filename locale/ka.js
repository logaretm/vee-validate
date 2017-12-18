import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  after: (field, [target]) => `${field} უნდა იყოს ${target}(ი)ს შემდეგ.`,
  alpha_dash: (field) => `${field} უნდა შესაძლებელია შეიცავდეს ციფრებს, ასოებს და პუნქტუაციის ნიშნებს.`,
  alpha_num: (field) => `${field} უნდა შეიცავდეს მხოლოდ ციფრებს.`,
  alpha_spaces: (field) => `${field} უნდა შეიცავდეს მხოლოდ ასოებსა და ცარიელ სივრცეებს.`,
  alpha: (field) => `${field} უნდა შეიცავდეს მხოლოდ ასოებს.`,
  before: (field, [target]) => `${field} უნდა იყოს ${target}მდე.`,
  between: (field, [min, max]) => `${field} უნდა იყოს ${min} და ${max}ს შორის.`,
  confirmed: (field, [confirmedField]) => `${field} არ ემთხვევა ${confirmedField}(ი)ს.`,
  date_between: (field, [min, max]) => `${field} უნდა უნდა იყოს ${min} და ${max}-ს შორის.`,
  date_format: (field, [format]) => `${field} უნდა იყოს ${format} ფორმატში.`,
  decimal: (field, [decimals = '*'] = []) => `${field} უნდა შეიცავდეს ციფრებსა და ${decimals === '*' ? '' : decimals} მთელ რიცხვებს.`,
  digits: (field, [length]) => `${field} უნდა შეიცავდეს ციფრებს და უნდა იყოს ზუსტად ${length}-ნიშნა.`,
  dimensions: (field, [width, height]) => `${field} უნდა იყოს ${width}x${height} ზომის (pixel).`,
  email: (field) => `${field}-ს უნდა ჰქონდეს ელ-ფოსტის სწორი ფორმატი.`,
  ext: (field) => `${field} უნდა იყოს ფაილი.`,
  image: (field) => `${field} უნდა იყოს სურათი.`,
  in: (field) => `${field} უნდა იყოს სწორი მნიშვნელობა.`,
  ip: (field) => `${field} უნდა იყოს სწორი ip მისამართი.`,
  max: (field, [length]) => `${field} არ უნდა იყოს ${length} სიმბოლოზე მეტი.`,
  max_value: (field, [max]) => `${field} უნდა შეიცავდეს ${max} სიმბოლოს ან ნაკლებს.`,
  mimes: (field) => `${field}ს უნდა ჰქონდეს სწორი ფაილის ფორმატი.`,
  min: (field, [length]) => `${field} უნდა შეიცავდეს მინიმუმ ${length} სიმბოლოს.`,
  min_value: (field, [min]) => `${field} უნდა შეიცავდეს ${min} ან მეტ სიმბოლოს.`,
  not_in: (field) => `${field} უნდა იყოს სწორი მნიშვნელობა.`,
  numeric: (field) => `${field} უნდა შეიცავდეს ციფრებს.`,
  regex: (field) => `${field}-(ი)ს ფორმატი არასწორია.`,
  required: (field) => `${field} აუცილებელია.`,
  size: (field, [size]) => `${field} უნდა იყოს ${formatFileSize(size)}-ზე ნაკლები.`,
  url: (field) => `${field}-(ი)ს არ აქვს სწორი მისამართის ფორმატი`
};

const locale = {
  name: 'ka',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
