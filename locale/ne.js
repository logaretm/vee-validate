import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `यो ${field} फिल्ड मान्य छैन`,
  after: (field, [target, inclusion]) => `${field} ${target} भन्दा पछि  ${inclusion ? 'वा बराबर' : ''} हुनु पर्छ`,
  alpha: (field) => `${field} फिल्डले वर्णमाला अक्षरहरू मात्र समावेश गर्न सक्छ`,
  alpha_dash: (field) => `${field} फील्डलमा वर्ण-संख्या अक्षरहरू साथै ड्याश र अन्डरसेर्सहरू समावेश गर्न सक्छ`,
  alpha_num: (field) => `${field} फील्डमा वर्ण-संख्या अक्षरहरू मात्र समावेश गर्न सक्छ`,
  alpha_spaces: (field) => `${field} फिल्डमा वर्णमाला अक्षरहरू र स्पेसहरूमा मात्र समावेश गर्न सक्छ`,
  before: (field, [target, inclusion]) => `${field} ${target} भन्दा अघि  ${inclusion ? 'वा बराबर' : ''} हुनु पर्छ`,
  between: (field, [min, max]) => `${field} फिल्ड ${min} र ${max} को बीच हुनुपर्दछ`,
  confirmed: (field) => `${field} पुष्टिकरण मेल खाँदैन`,
  credit_card: (field) => `${field} फिल्ड मान्य छैन`,
  date_between: (field, [min, max]) => `${field} ${min} र ${max} को बीच हुनुपर्दछ`,
  date_format: (field, [format]) => `${field} ढाँचा ${format} मा हुनुपर्दछ`,
  decimal: (field, [decimals = '*'] = []) => `${field} फिल्ड संख्यात्मक हुनुपर्छ र ${!decimals || decimals === '*' ? '' : decimals} दशमलव अंक हुन सक्छ`,
  digits: (field, [length]) => `${field} फिल्ड संख्यात्मक हुनुपर्छ र ${length} अङ्क समावेश गर्दछ`,
  dimensions: (field, [width, height]) => `${field} फिल्ड ${width} पिक्सेलमा ${height} पिक्सेल हुनु पर्दछ`,
  email: (field) => `${field} फिल्ड मान्य ईमेल हुनु पर्छ`,
  excluded: (field) => `${field} फिल्ड मान्य मान हुनुपर्छ`,
  ext: (field) => `${field} फिल्ड मान्य फाइल हुनु पर्छ`,
  image: (field) => `${field} फिल्ड मान्य फोटो हुनु पर्छ`,
  included: (field) => `${field} फिल्ड मान्य परिमाण हुनु पर्छ`,
  integer: (field) => `${field} फिल्ड मान्य पूर्णांक हुनु पर्छ`,
  ip: (field) => `${field} फिल्ड मान्य आईपी ठेगाना हुनु पर्छ`,
  length: (field, [length, max]) => {
    if (max) {
      return `${field} लम्बाई ${length} र ${max} बीचमा हुनुपर्दछ`;
    }

    return `${field} लम्बाई ${length} हुनुपर्दछ`;
  },
  max: (field, [length]) => `${field} फिल्ड ${length} अक्षरहरू भन्दा ठूलो हुन सक्छ`,
  max_value: (field, [max]) => `${field} फिल्ड ${max} वा कम हुनुपर्दछ`,
  mimes: (field) => `${field} फिल्ड मान्य फाइल प्रकार हुनु पर्दछ`,
  min: (field, [length]) => `${field} फिल्ड कम्तिमा ${length} अक्षरहरू हुनुपर्दछ`,
  min_value: (field, [min]) => `${field} इमेल फिल्ड ${min} वा बढी हुनुपर्दछ`,
  numeric: (field) => `${field} फिल्डले संख्यात्मक अक्षरहरूमा मात्र समावेश गर्न सक्छ`,
  regex: (field) => `${field} फिल्ड ढाँचा अमान्य छ`,
  required: (field) => `${field} फिल्ड आवश्यक छ`,
  size: (field, [size]) => `${field} परिणाम ${formatFileSize(size)} भन्दा कम हुनुपर्दछ`,
  url: (field) => `${field} फिल्ड मान्य यूआरएल होइन`
};

const locale = {
  name: 'ne',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  // eslint-disable-next-line
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
