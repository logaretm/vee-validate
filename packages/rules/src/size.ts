const validate = (files: any, { size }: Record<string, any>) => {
  size = Number(size);
  if (isNaN(size)) {
    return false;
  }

  const nSize = size * 1024;
  if (!Array.isArray(files)) {
    return files.size <= nSize;
  }

  for (let i = 0; i < files.length; i++) {
    if (files[i].size > nSize) {
      return false;
    }
  }

  return true;
};

const params = ['size'];

export { validate, params };

export default {
  validate,
  params,
};
