import { isEmpty } from './utils';

const ADDED_MIME_RE = /\+(.+)?/;

function buildRegExp(mime: string) {
  let strPattern = mime;
  if (ADDED_MIME_RE.test(mime)) {
    strPattern = mime.replace(ADDED_MIME_RE, '(\\+$1)?');
  }

  return new RegExp(strPattern.replace('*', '.+'), 'i');
}

const mimesValidator = (files: unknown, mimes: string[]) => {
  if (isEmpty(files)) {
    return true;
  }

  if (!mimes) {
    mimes = [];
  }

  const patterns = mimes.map(buildRegExp);
  if (Array.isArray(files)) {
    return files.every(file => patterns.some(p => p.test((file as File).type)));
  }

  return patterns.some(p => p.test((files as File).type));
};

export default mimesValidator;
