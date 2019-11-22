import { RuleParamSchema } from '../types';

const validateImage = (file: File, width: number, height: number): Promise<boolean> => {
  const URL = window.URL || (window as any).webkitURL;

  return new Promise(resolve => {
    const image = new Image();
    image.onerror = () => resolve(false);
    image.onload = () => resolve(image.width === width && image.height === height);

    image.src = URL.createObjectURL(file);
  });
};

const validate = (files: File | File[], { width, height }: Record<string, any>) => {
  const list = [];
  files = Array.isArray(files) ? files : [files];
  for (let i = 0; i < files.length; i++) {
    // if file is not an image, reject.
    if (!/\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(files[i].name)) {
      return Promise.resolve(false);
    }

    list.push(files[i]);
  }

  return Promise.all(list.map(file => validateImage(file, width, height))).then(values => {
    return values.every(v => v);
  });
};

const params: RuleParamSchema[] = [
  {
    name: 'width',
    cast(value) {
      return Number(value);
    }
  },
  {
    name: 'height',
    cast(value) {
      return Number(value);
    }
  }
];

export { validate, params };

export default {
  validate,
  params
};
