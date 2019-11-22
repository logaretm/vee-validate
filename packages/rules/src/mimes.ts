const validate = (files: File | File[], mimes: string[] | Record<string, any>) => {
  const regex = new RegExp(`${mimes.join('|').replace('*', '.+')}$`, 'i');
  if (Array.isArray(files)) {
    return files.every(file => regex.test(file.type));
  }

  return regex.test(files.type);
};

export { validate };

export default {
  validate
};
