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
  defineRule('confirmed', (value: string, { target }: any) => {
    return value === target ? true : 'must match';
  });

  let result = await validate('test', { confirmed: { target: '@other' } }, { values: { other: '' } });
  expect(result.errors).toHaveLength(1);

  result = await validate('test', { confirmed: { target: '@other' } }, { values: { other: 'test' } });
  expect(result.errors).toHaveLength(0);
});

// #3077
test('target params are filled in the params in message context', async () => {
  defineRule('lessThan', (value: number, params: any) => Number(value) < Number(params[0]));
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

// #5025
test('global and local rules can be combined in object syntax', async () => {
  defineRule('required', (value: any) => {
    if (!value && value !== 0) {
      return 'This field is required';
    }
    return true;
  });

  const myLocalRule = (value: any) => {
    if (typeof value === 'string' && value.length < 3) {
      return 'Must be at least 3 characters';
    }
    return true;
  };

  // Both global and local rules should run - valid value
  let result = await validate('hello', { required: true, myLocalRule } as any);
  expect(result.valid).toBe(true);
  expect(result.errors).toHaveLength(0);

  // Global rule fails
  result = await validate('', { required: true, myLocalRule } as any);
  expect(result.valid).toBe(false);
  expect(result.errors).toContain('This field is required');

  // Local rule fails (bails: false to see both errors)
  result = await validate('ab', { required: true, myLocalRule } as any, { bails: false });
  expect(result.valid).toBe(false);
  expect(result.errors).toContain('Must be at least 3 characters');

  // Both rules pass
  result = await validate('abc', { required: true, myLocalRule } as any);
  expect(result.valid).toBe(true);
});

// #5025
test('global and local rules can be combined in array syntax', async () => {
  defineRule('required', (value: any) => {
    if (!value && value !== 0) {
      return 'This field is required';
    }
    return true;
  });

  const myLocalRule = (value: any) => {
    if (typeof value === 'string' && value.length < 3) {
      return 'Must be at least 3 characters';
    }
    return true;
  };

  // Both string global rules and function local rules in an array
  let result = await validate('hello', ['required', myLocalRule] as any);
  expect(result.valid).toBe(true);
  expect(result.errors).toHaveLength(0);

  // Global rule fails
  result = await validate('', ['required', myLocalRule] as any);
  expect(result.valid).toBe(false);
  expect(result.errors).toContain('This field is required');

  // Local rule fails
  result = await validate('ab', ['required', myLocalRule] as any, { bails: false });
  expect(result.valid).toBe(false);
  expect(result.errors).toContain('Must be at least 3 characters');
});
