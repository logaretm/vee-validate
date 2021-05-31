import { validate } from '@/validate';
import { extend } from '@/extend';
import { between, confirmed, excluded } from '@/rules';

describe('target field placeholder', () => {
  extend('confirmed', {
    ...confirmed,
    message: '{_field_} must match {target}'
  });

  const names = { foo: 'Foo', bar: 'Bar', baz: 'Baz' };

  test('uses target field name, if supplied in options', async () => {
    const values = { foo: 10, bar: 20 };
    const rules = 'confirmed:foo';
    const options = {
      name: names.bar,
      values,
      names
    };
    const result = await validate(values.bar, rules, options);
    expect(result.errors[0]).toEqual('Bar must match Foo');
  });

  test('uses target field key, if target field name not supplied in options', async () => {
    const values = { foo: 10, bar: 20 };
    const rules = 'confirmed:foo';
    const options = {
      name: names.bar,
      values
    };
    const result = await validate(values.bar, rules, options);
    expect(result.errors[0]).toEqual('Bar must match foo');
  });

  test('works for multiple targets', async () => {
    extend('sum_of', {
      message: '{_field_} must be the sum of {a} and {b}',
      // eslint-disable-next-line prettier/prettier
      params: [
        { name: 'a', isTarget: true },
        { name: 'b', isTarget: true }
      ],
      validate: (value, { a, b }) => value === parseInt(a, 10) + parseInt(b, 10)
    });

    const values = { foo: 10, bar: 10, baz: 10 };
    const names = { foo: 'Foo', bar: 'Bar', baz: 'Baz' };
    const rules = 'sum_of:bar,baz';
    const options = {
      name: names.foo,
      values,
      names
    };

    const result = await validate(values.foo, rules, options);
    expect(result.errors[0]).toEqual('Foo must be the sum of Bar and Baz');
  });
});

describe('cross-field syntax', () => {
  extend('between', {
    ...between,
    message: '{_field_} must be between {min} and {max}'
  });

  const values = { value: 20, maxValue: 15 };
  const names = { value: 'Value', maxValue: 'Max Value' };
  const rules = 'between:0,@maxValue';
  const options = {
    name: names.value,
    values
  };

  describe('should validate and generate the correct message', () => {
    test('without options.names', async () => {
      const result = await validate(values.value, rules, options);
      expect(result.errors[0]).toEqual('Value must be between 0 and maxValue');
    });

    test('with options.names', async () => {
      const result = await validate(values.value, rules, { ...options, names });
      expect(result.errors[0]).toEqual('Value must be between 0 and Max Value');
    });

    test('with options.customMessages string', async () => {
      const customMessages = {
        between: 'The Value field must be more than {min} but less than {max}'
      };
      const result = await validate(values.value, rules, { ...options, customMessages, names });
      expect(result.errors[0]).toEqual('The Value field must be more than 0 but less than Max Value');
    });

    test('with options.customMessages function', async () => {
      const customMessages = {
        between(field, { min, max }) {
          return `Must be more than ${min} and less than ${max}`;
        }
      };
      const result = await validate(values.value, rules, { ...options, customMessages, names });
      expect(result.errors[0]).toEqual('Must be more than 0 and less than Max Value');
    });
  });

  test('should cast values of the resolved targets', async () => {
    extend('isEven', {
      params: [{ name: 'target', cast: val => val % 2 }],
      validate(val, { target }) {
        return target === 0;
      }
    });

    let result = await validate('watever', 'isEven:@field', {
      values: {
        field: 2
      }
    });

    expect(result.valid).toBe(true);
    result = await validate('watever', 'isEven:@field', {
      values: {
        field: 3
      }
    });
    expect(result.valid).toBe(false);
  });

  test('infinite params value swapping', async () => {
    extend('excluded', excluded);
    let result = await validate(1, 'excluded:@v1,@v2,@v3', {
      values: {
        v1: 1,
        v2: 3,
        v3: 4
      }
    });
    expect(result.valid).toBe(false);

    result = await validate(3, 'excluded:@v1,@v2,@v3', {
      values: {
        v1: 1,
        v2: 3,
        v3: 4
      }
    });
    expect(result.valid).toBe(false);

    result = await validate(4, 'excluded:@v1,@v2,@v3', {
      values: {
        v1: 1,
        v2: 3,
        v3: 4
      }
    });
    expect(result.valid).toBe(false);

    result = await validate(5, 'excluded:@v1,@v2,@v3', {
      values: {
        v1: 1,
        v2: 3,
        v3: 4
      }
    });
    expect(result.valid).toBe(true);
  });

  test('should change required flag state', async () => {
    extend('requiredIf', {
      params: ['target'],
      validate(val, { target }) {
        console.log(target, val, 'target, val');
        return {
          valid: target === val,
          required: !!target
        };
      },
      computesRequired: true
    });

    let result = await validate('text', 'requiredIf:@field', {
      values: {
        field: ''
      }
    });

    expect(result.required).toBe(false);

    result = await validate('text', 'requiredIf:@field', {
      values: {
        field: 'text'
      }
    });

    expect(result.required).toBe(true);
  });
});
