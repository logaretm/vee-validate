import after from './after';
import before from './before';
import date_format from './date_format'; // eslint-disable-line
import date_between from './date_between'; // eslint-disable-line
import messages from './messages';

const installDate = ({ Validator }, { moment }) => {
  if (installDate.installed) return;

  Validator.extend('after', after(moment));
  Validator.extend('before', before(moment));
  Validator.extend('date_format', date_format(moment));
  Validator.extend('date_between', date_between(moment));
  Validator.updateDictionary({ en: { messages } });
  installDate.installed = true;
};

installDate.installed = false;

export default installDate;
