const mimesValidator = (files: File | File[], mimes: string[]) => {
  if (!files) {
    return true;
  }

  if (!mimes) {
    mimes = [];
  }

  const regex = new RegExp(`${mimes.join('|').replace('*', '.+')}$`, 'i');
  if (Array.isArray(files)) {
    return files.every(file => regex.test(file.type));
  }

  return regex.test(files.type);
};

export default mimesValidator;
