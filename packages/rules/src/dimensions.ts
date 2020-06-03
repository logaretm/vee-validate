import { ValidationRuleFunction } from '@vee-validate/shared';

const validateImage = (file: any, width: number, height: number): Promise<boolean> => {
  const URL = window.URL || (window as any).webkitURL;

  return new Promise(resolve => {
    const image = new Image();
    image.onerror = () => resolve(false);
    image.onload = () => resolve(image.width === width && image.height === height);

    image.src = URL.createObjectURL(file);
  });
};

function getParams(params?: any[] | Record<string, any>) {
  if (!params) {
    return { width: 0, height: 0 };
  }

  if (Array.isArray(params)) {
    return { width: Number(params[0]), height: Number(params[1]) };
  }

  return {
    width: Number(params.width),
    height: Number(params.height),
  };
}

const dimensionsValidator: ValidationRuleFunction = (files: any, params) => {
  const { width, height } = getParams(params);
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

export default dimensionsValidator;
