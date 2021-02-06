type BetweenParams = [string | number, string | number] | { min: number | string; max: number | string };

function getParams(params: BetweenParams) {
  if (!params) {
    return {
      min: 0,
      max: 0,
    };
  }

  if (Array.isArray(params)) {
    return { min: params[0], max: params[1] };
  }

  return params;
}

const betweenValidator = (value: string | number, params: BetweenParams): boolean => {
  const { min, max } = getParams(params);
  if (Array.isArray(value)) {
    return value.every(val => !!betweenValidator(val, { min, max }));
  }

  return Number(min) <= value && Number(max) >= value;
};

export default betweenValidator;
