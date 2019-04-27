import { isNullOrUndefined, toArray } from "../utils";
import { RuleParamSchema } from "../types";

const compare = (value: any[] | string, length: number, max?: number) => {
  if (max === undefined) {
    return value.length === length;
  }

  // cast to number.
  max = Number(max);

  return value.length >= length && value.length <= max;
};

const validate = (value: any, { length, max }: any) => {
  if (isNullOrUndefined(value)) {
    return false;
  }

  length = Number(length);
  if (typeof value === "number") {
    value = String(value);
  }

  if (!value.length) {
    value = toArray(value);
  }

  return compare(value, length, max);
};

const params: RuleParamSchema[] = [
  {
    name: 'length',
    cast (value) {
      return Number(value);
    }
  },
  {
    name: 'max',
    cast (value) {
      if (value === undefined) {
        return value;
      }

      return Number(value);
    }
  }
];

export { validate, params };

export default {
  validate,
  params
};
