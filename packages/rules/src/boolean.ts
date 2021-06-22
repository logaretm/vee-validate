import { isNullOrUndefined } from '../../shared';

const booleanValidator = (value: unknown) => {
  if (isNullOrUndefined(value) || !getBoolean(value)) {
    return false;
  }

  return !!String(value).trim().length;
};

function getBoolean(value: unknown) {
  switch (value) {
    case true:
    case 'true':
    case 'false':
    case false:
    case 't':
    case 'f':
    case 0:
    case '0':
    case 1:
    case '1':
    case 'on':
    case 'off':
    case 'yes':
    case 'no':
      return true;
    default:
      return false;
  }
}
export default booleanValidator;
