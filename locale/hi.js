import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `यह ${field} मान मान्य नहीं है`,
  after: (field, [target]) =>  `यह ${field} का ${target} के बाद होना आवश्यक है  `,
  alpha: (field) => `यह ${field} फील्ड में केवल वर्णानुक्रमक वर्ण हो सकते हैं`,
  alpha_dash: (field) => `यह ${field} फील्ड में अल्फ़ान्यूमेरिक वर्ण और साथ ही डैश और अंडरस्कोर हो सकते हैं`,
  alpha_num: (field) => `यह ${field} फील्ड में केवल अल्फा-न्यूमेरिक वर्ण वर्ण शामिल हैं`,
  alpha_spaces: (field) => `यह ${field} फील्ड में केवल अल्फा-न्यूमेरिक वर्ण वर्ण शामिल हैं`,
  before: (field, [target]) => `यह ${field} का ${target} के पहले होना आवश्यक है `,
  between: (field, [min, max]) => `यह ${field} फील्ड का ${min} और ${max} के बीच होना आवश्यक है `,
  confirmed: (field) => `यह ${field} पुष्टि मेल नहीं खाती`,
  credit_card: (field) => `यह ${field} फील्ड अमान्य है`,
  date_between: (field, [min, max]) => `यह ${field} का ${min} और ${max} के बीच होना आवश्यक है `,
  date_format: (field, [format]) => `यह ${field} का प्रारूप ${format} में होना आवश्यक है `,
  decimal: (field, [decimals = '*'] = []) => `यह ${field} फ़ील्ड का संख्यात्मक होना आवश्यक है और इसमें ${!decimals || decimals === '*' ? '' : decimals} दशमलव बिंदु शामिल हो सकते हैं `,
  digits: (field, [length]) => `यह ${field} फ़ील्ड का संख्यात्मक होना आवश्यक है और इसे पूरी तरह से ${length} अंक का होना चाहिए`,
  dimensions: (field, [width, height]) => `यह ${field} फ़ील्ड की ${width} पिक्सेल बाई ${height} पिक्सेल का होना आवश्यक है`,
  email: (field) => `यह  ${field} फ़ील्ड एक मान्य ईमेल होना चाहिए`,
  excluded: (field) => `यह ${field} फ़ील्ड का एक मान्य मूल्य होना चाहिए`,
  ext: (field) => `यह ${field} फ़ील्ड एक मान्य फ़ाइल होनी चाहिए`,
  image: (field) => `यह ${field} फ़ील्ड एक छवि होनी चाहिए`,
  included: (field) => `यह ${field} फ़ील्ड एक मान्य मूल्य का होना चाहिए`,
  integer: (field) => `यह ${field} फ़ील्ड एक पूर्णांकका होना चाहिए`,
  ip: (field) => `यह ${field} फ़ील्ड  एक मान्य आईपी पते का होना चाहिए`,
  ip_or_fqdn: (field) => `यह ${field} फ़ील्ड एक मान्य आईपी पते या FQDN होना चाहिए`,
  length: (field, [length, max]) => {
    if (max) {
      return `यह ${field}  की लंबाई ${length} और ${max} के बीच होनी चाहिए`;
    }

    return `यह ${field}  की लंबाई ${length} की होनी चाहिए`;
  },
  max: (field, [length]) => `यह ${field} फ़ील्ड ${length} वर्णों से अधिक नहीं हो सकती है`,
  max_value: (field, [max]) => `यह ${field} फ़ील्ड ${max} या उससे कम का होना चाहिए`,
  mimes: (field) => `यह ${field} फ़ील्ड एक मान्य फ़ाइल प्रकार का होना चाहिए`,
  min: (field, [length]) => `यह ${field} फ़ील्ड कम से कम ${length} वर्ण का होना चाहिए`,
  min_value: (field, [min]) => `यह ${field} फ़ील्ड ${min} या अधिक का होना चाहिए`,
  numeric: (field) => `यह ${field} फ़ील्ड में केवल संख्यात्मक वर्ण हो सकते हैं`,
  regex: (field) => `यह ${field} फ़ील्ड प्रारूप अमान्य है`,
  required: (field) => `यह ${field} फ़ील्ड की आवश्यकता है`,
  required_if: (field, [target]) => `यह ${field} फ़ील्ड की आवश्यकता तब होती है जब ${target} फ़ील्ड का यह मान होता है`,
  size: (field, [size]) => `यह ${field} फ़ील्ड का आकार ${formatFileSize(size)} से कम होना चाहिए`,
  url: (field) => `यह ${field}फ़ील्ड एक मान्य URL नहीं है.`
};

const locale = {
  name: 'hi',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  // eslint-disable-next-line
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
