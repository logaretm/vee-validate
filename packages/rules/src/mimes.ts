const mimesValidator = (files: unknown, mimes: string[]) => {
  if (!files) {
    return true;
  }

  if (!mimes) {
    mimes = [];
  }

  const regex = new RegExp(`${mimes.join('|').replace('*', '.+')}$`, 'i');
  if (Array.isArray(files)) {
    return files.every(file => regex.test((file as File).type));
  }

  return regex.test((files as File).type);
};

export default mimesValidator;
