import email from './email';
import In from './in';
import required from './required';
import min from './min';
import max from './max';
import not_in from './notIn'; // eslint-disable-line
import alpha from './alpha'; // eslint-disable-line
import alpha_num from './alpha_num'; // eslint-disable-line
import alpha_dash from './alpha_dash'; // eslint-disable-line
import numeric from './numeric'; // eslint-disable-line
import regex from './regex';
import ip from './ip';
import ext from './ext';
import mimes from './mimes';
import size from './size';
import digits from './digits';
import image from './image';
import dimensions from './dimensions';
import between from './between';
import confirmed from './confirmed';
import url from './url';
import decimal from './decimal';

export default {
    email,
    min,
    max,
    required,
    in: In,
    not_in,
    alpha,
    alpha_num,
    alpha_dash,
    numeric,
    regex,
    ip,
    ext,
    mimes,
    size,
    digits,
    image,
    dimensions,
    between,
    confirmed,
    url,
    decimal
};
