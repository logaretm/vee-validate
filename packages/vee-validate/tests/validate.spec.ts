import { validate, defineRule, configure } from '@/vee-validate';
import { numeric } from '@/rules';
import { getConfig } from '../src/config';

test('allows empty rules for the string format', async () => {
  defineRule('numeric', numeric);
  let result = await validate(100, '|numeric');
  expect(result.errors).toHaveLength(0);

  result = await validate(100, '||||numeric');
  expect(result.errors).toHaveLength(0);
});

test('handles targets expressed in objects', async () => {
  defineRule('confirmed', (value, { target }: any) => {
    return value === target ? true : 'must match';
  });

  let result = await validate('test', { confirmed: { target: '@other' } }, { values: { other: '' } });
  expect(result.errors).toHaveLength(1);

  result = await validate('test', { confirmed: { target: '@other' } }, { values: { other: 'test' } });
  expect(result.errors).toHaveLength(0);
});

// #3077
test('target params are filled in the params in message context', async () => {
  defineRule('lessThan', (value, params: any) => Number(value) < Number(params[0]));
  const { generateMessage: original } = getConfig();
  configure({
    generateMessage: context => {
      const params = context.rule?.params as any;
      return `This value must be less than ${params[0]}`;
    },
  });

  const result = await validate(2, 'lessThan:@other', { values: { other: 1 } });
  expect(result.errors).toContain(`This value must be less than 1`);

  configure({
    generateMessage: original,
  });
});
