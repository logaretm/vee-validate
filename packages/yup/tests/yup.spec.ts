import * as yup from 'yup';
import { wrap, wrapSchema } from '@vee-validate/yup';

test('converts a yup field rule to a vee-validate inline rule', async () => {
  const password = wrap(yup.string().required().min(8));
  expect(typeof password).toBe('function');

  expect(typeof (await password('123'))).toBe('string');
  expect(await password('12345678')).toBe(true);
});

test('converts a yup object schema rule to vee-validate validation schema', async () => {
  const schema = wrapSchema(
    yup.object().shape({
      email: yup.string().email(),
      password: yup.string().required().min(8),
    })
  );
  expect(typeof schema).toBe('object');
  expect(typeof schema.email).toBe('function');
  expect(typeof schema.password).toBe('function');

  expect(typeof (await schema.email('123'))).toBe('string');
  expect(await schema.email('example@exmaple.com')).toBe(true);

  expect(typeof (await schema.password('123'))).toBe('string');
  expect(await schema.password('12345678')).toBe(true);
});
