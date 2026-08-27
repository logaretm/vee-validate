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

describe('custom messages', () => {
  test('overrides the messages returned by the rule', async () => {
    defineRule('truthy', (value: unknown) => (value ? true : 'Original Message'));

    const result = await validate(false, 'truthy', {
      customMessages: {
        truthy: 'Custom Message',
      },
    });

    expect(result.errors).toEqual(['Custom Message']);
  });

  test('overrides the globally generated messages', async () => {
    defineRule('falsy', (value: unknown) => !value);

    const result = await validate(true, 'falsy', {
      customMessages: {
        falsy: 'Custom Message',
      },
    });

    expect(result.errors).toEqual(['Custom Message']);
  });

  test('only overrides the messages of the rules it defines', async () => {
    defineRule('truthy', (value: unknown) => (value ? true : 'Original Message'));
    defineRule('lengthy', (value: unknown) => (Array.isArray(value) ? true : 'Original Lengthy Message'));

    const result = await validate(false, 'truthy|lengthy', {
      bails: false,
      customMessages: {
        truthy: 'Custom Message',
      },
    });

    expect(result.errors).toEqual(['Custom Message', 'Original Lengthy Message']);
  });

  test('ignores non-string custom messages', async () => {
    defineRule('truthy', (value: unknown) => (value ? true : 'Original Message'));

    const result = await validate(false, 'truthy', {
      customMessages: {
        truthy: undefined as unknown as string,
      },
    });

    expect(result.errors).toEqual(['Original Message']);
  });
});
