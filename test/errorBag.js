import test from 'ava';
import ErrorBag from './../src/errorBag';

test('adds errors to the collection', t => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1');
  t.is(errors.first('name'), 'The name is invalid');

  // scoped field.
  errors.add('name', 'The scoped name is invalid', 'rule1', 'scope1');
  t.is(errors.first('name', 'scope1'), 'The scoped name is invalid');
});

test('removes errors for a specific field', t => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1');
  errors.add('email', 'The email is invalid', 'rule1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1');

  t.is(errors.count(), 3);
  errors.remove('name');
  t.is(errors.count(), 2);
  errors.remove('email');
  t.is(errors.count(), 0);
});

test('removes errors for a specific field and scope', t => {
  let errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1', 'scope1');
  errors.add('email', 'The email is invalid', 'rule1', 'scope1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1', 'scope2');

  t.is(errors.count(), 3);
  errors.remove('email', 'scope1'); // remove the scope1 scoped field called email.
  t.is(errors.count(), 2);
  t.is(errors.first('email', 'scope2'), 'The email is shorter than 3 chars.');

  errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1');
  errors.add('email', 'The email is invalid', 'rule1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1', 'scope1');

  errors.remove('name');
  t.is(errors.count(), 2);
});

test('clears the errors', t => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1');
  errors.add('email', 'The email is invalid', 'rule1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1');
  t.is(errors.count(), 3);
  errors.clear();
  t.is(errors.count(), 0);
});

test('clears the errors within a scope', t => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1', 'scope1');
  errors.add('email', 'The email is invalid', 'rule1', 'scope1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1', 'scope2');
  t.is(errors.count(), 3);
  errors.clear('scope1');
  t.is(errors.count(), 1);
});

test('checks for field selector existence', t => {
  const errors = new ErrorBag();

  t.is(errors._selector('name:rule').name, 'name');
  t.is(errors._selector('name:rule').rule, 'rule');
  t.is(errors._selector('name'), null);
});

test('checks for field error existence', t => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1');
  t.is(errors.has('name'), true);
  t.is(errors.has('name:rule1'), true);
  t.is(errors.has('name:rule2'), false);
  t.is(errors.has('email'), false);
});

test('checks for scoped field error existence', t => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1', 'scope1');

  t.is(errors.has('name'), false);
  t.is(errors.has('name', 'scope1'), true);
  t.is(errors.has('name', 'scope2'), false); // no such scoped field.
});

test('fetches the errors count/length', t => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1');
  errors.add('email', 'The email is invalid', 'rule1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1');

  t.is(errors.count(), 3);
});

test('fetches the first error message for a specific field', t => {
  const errors = new ErrorBag();
  errors.add('email', 'The email is invalid', 'rule1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1');

  errors.add('email', 'This is the third rule', 'rule2');
  errors.add('email', 'This is the forth rule', 'rule2');

  // test colon notation.
  t.is(errors.first('email'), 'The email is invalid');
  t.is(errors.first('email:rule2'), 'This is the third rule');

  errors.clear();
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1');

  t.is(errors.first('email'), 'The email is shorter than 3 chars.');
  t.is(errors.first('name'), null);

  // test dot notation.
  errors.add('email', 'nah', 'rule2', 'scope1');
  errors.add('email', 'bah', 'rule1', 'scope2');
  errors.add('email', 'mah', 'rule2', 'scope2');
  t.is(errors.first('scope1.email'), 'nah');
  t.is(errors.first('scope2.email:rule2'), 'mah');
});

test('fetches the first error rule for a specific field', t => {
  const errors = new ErrorBag();
  errors.add('email', 'The email is invalid', 'rule1');
  errors.add('name', 'Your name is required', 'rule2');

  t.is(errors.firstRule('email'), 'rule1');
  t.is(errors.firstRule('name'), 'rule2');
  t.is(errors.firstRule('email', 'scope3'), null);
  t.is(errors.firstRule('password'), null);
});

test('fetches the first error message for a specific scoped field', t => {
  const errors = new ErrorBag();
  errors.add('email', 'The email is invalid', 'rule1', 'scope1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1', 'scope2');

  t.is(errors.first('email', 'scope1'), 'The email is invalid');
  t.is(errors.first('email', 'scope2'), 'The email is shorter than 3 chars.');
  t.is(errors.first('email', 'scope3'), null);
});

test('returns all errors in an array', t => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1');
  errors.add('email', 'The email is invalid', 'rule1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1');

  t.is(Array.isArray(errors.all()), true);
  t.deepEqual(errors.all(), [
    'The name is invalid',
    'The email is invalid',
    'The email is shorter than 3 chars.'
  ]);
});

test('returns all scoped errors in an array', t => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1', 'scope1');
  errors.add('email', 'The email is invalid', 'rule1', 'scope1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1', 'scope2');

  t.is(Array.isArray(errors.all()), true);
  t.deepEqual(errors.all('scope1'), [
    'The name is invalid',
    'The email is invalid'
  ]);
});

test('collects errors for a specific field in an array', t => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1');
  errors.add('email', 'The email is invalid', 'rule1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1');

  t.deepEqual(errors.collect('email'), [
    'The email is invalid',
    'The email is shorter than 3 chars.'
  ]);
  t.truthy(~errors.collect('name').indexOf('The name is invalid'));
});

test('collects all errors across scopes if no scope is defined', t => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1');
  errors.add('name', 'The name is invalid', 'rule1', 'scope1');
  errors.add('name', 'The name is invalid', 'rule1', 'scope2');

  t.is(errors.collect('name').length, 3);
  t.is(errors.collect('name', 'scope2').length, 1);
});

test('collects errors for a specific field and scope', t => {
  const errors = new ErrorBag();
  errors.add('email', 'The email is not email.', 'rule1', 'scope1');
  errors.add('email', 'The email is invalid', 'rule1', 'scope1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1', 'scope2');

  t.deepEqual(errors.collect('email', 'scope1'), [
    'The email is not email.',
    'The email is invalid',
  ]);
  t.truthy(~errors.collect('email', 'scope2').indexOf('The email is shorter than 3 chars.'));
});

test('groups errors by field name', t => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1');
  errors.add('email', 'The email is invalid', 'rule1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1');

  t.deepEqual(errors.collect(), {
    email: [
      'The email is invalid',
      'The email is shorter than 3 chars.'
    ],
    name: [
      'The name is invalid'
    ]
  });
});

test('checks if there are any errors in the array', t => {
  const errors = new ErrorBag();
  t.is(errors.any(), false);
  errors.add('name', 'The name is invalid', 'rule1');
  t.is(errors.any(), true);
});

test('checks if there are any errors within a scope in the array', t => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1', 'scope1');
  errors.add('email', 'The email is invalid', 'rule1', 'scope1');

  t.is(errors.any('scope3'), false);
  t.is(errors.any('scope1'), true);
});

test('can get a specific error message for a specific rule', t => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1');
  errors.add('name', 'The name is really invalid', 'rule2');

  t.is(errors.firstByRule('name', 'rule1'), 'The name is invalid');
  t.is(errors.firstByRule('name', 'rule2'), 'The name is really invalid');
  t.is(errors.firstByRule('email', 'rule1'), null);
});

test('fetches both scoped names and names with dots', t => {
  const errors = new ErrorBag();
  errors.add('name.example', 'The name is invalid', 'rule1');
  errors.add('name', 'The name is really invalid', 'rule2', 'example');
  t.is(errors.first('name.example'), 'The name is invalid');
  t.is(errors.first('example.name'), 'The name is really invalid');
});

