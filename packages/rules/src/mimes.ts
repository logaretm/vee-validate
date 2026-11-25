import { isEmpty } from './utils';

const ADDED_MIME_RE = /\+(.+)?/;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildMimePattern(mime: string) {
  return escapeRegExp(mime).replace(/\\\*/g, '.+');
}

function buildRegExp(mime: string) {
  let strPattern = buildMimePattern(mime);
  if (ADDED_MIME_RE.test(mime)) {
    const [base, suffix = ''] = mime.split('+');
    strPattern = `${buildMimePattern(base || '')}(\\+${buildMimePattern(suffix)})?`;
  }

  return new RegExp(`^${strPattern}$`, 'i');
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
