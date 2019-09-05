import { RuleParamSchema } from '../types';

const validate = (value: string, { target }: Record<string, any>) => String(value) === String(target);

const params: RuleParamSchema[] = [
  {
    name: 'target',
    isTarget: true
  }
];

export { validate, params };

export default {
  validate,
  params
};
