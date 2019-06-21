import { extend } from '@/index.full';

test('passing a non-function as the validate method will throw', () => {
  expect(() => {
    extend('noFn', {
      validate: ''
    });
  }).toThrow();
});
