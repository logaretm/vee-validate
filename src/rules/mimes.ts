const validate = (files, mimes) => {
  const regex = new RegExp(`${mimes.join('|').replace('*', '.+')}$`, 'i');

  return files.every(file => regex.test(file.type));
};

export {
  validate
};

export default {
  validate
};
