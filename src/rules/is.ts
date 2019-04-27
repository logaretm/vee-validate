import { RuleParamSchema } from "../types";

const validate = (value: any, { other }: any) => {
  return value === other;
};

const params: RuleParamSchema[] = [
  {
    name: 'other'
  }
];

export {
  validate,
  params
};

export default {
  validate,
  params
};
