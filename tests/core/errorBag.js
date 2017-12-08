import ErrorBag from './../../src/core/errorBag';

test('adds errors to the collection', () => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1');
  expect(errors.first('name')).toBe('The name is invalid');

  // scoped field.
  errors.add('name', 'The scoped name is invalid', 'rule1', 'scope1');
  expect(errors.first('name', 'scope1')).toBe('The scoped name is invalid');

  // test object form
  errors.add({
    field: 'name',
    msg: 'Hey',
    rule: 'r1',
    scope: 's1'
  })
  expect(errors.first('name', 's1')).toBe('Hey');
});

test('updates error objects by matching against field id', () => {
  const errors = new ErrorBag();
  errors.add({
    id: 'myId',
    field: 'name',
    msg: 'Hey',
    rule: 'r1',
    scope: 's1'
  });
  expect(errors.first('name', 's1')).toBe('Hey');
  errors.update('myId', { scope: 's2' });
  expect(errors.has('name', 's1')).toBe(false);
  expect(errors.first('name', 's2')).toBe('Hey');

  // silent failure
  errors.update('myId1', { scope: 's2' });
  expect(errors.count()).toBe(1);
});

test('finds error messages by matching against field id', () => {
  const errors = new ErrorBag();
  errors.add({
    id: 'myId',
    field: 'name',
    msg: 'Hey',
    rule: 'r1',
    scope: 's1'
  });
  expect(errors.firstById('someId')).toBe(null);
  expect(errors.firstById('myId')).toBe('Hey');
});

test('removes errors for a specific field', () => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1');
  errors.add('email', 'The email is invalid', 'rule1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1');

  expect(errors.count()).toBe(3);
  errors.remove('name');
  expect(errors.count()).toBe(2);
  errors.remove('email');
  expect(errors.count()).toBe(0);
});

test('removes errors by matching against the field id', () => {
  const errors = new ErrorBag();
  errors.add({
    id: 'myId',
    field: 'name',
    msg: 'Hey',
    rule: 'r1',
    scope: 's1'
  })
  expect(errors.count()).toBe(1);
  errors.removeById('myId');
  expect(errors.count()).toBe(0);
});

test('removes errors for a specific field and scope', () => {
  let errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1', 'scope1');
  errors.add('email', 'The email is invalid', 'rule1', 'scope1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1', 'scope2');

  expect(errors.count()).toBe(3);
  errors.remove('email', 'scope1'); // remove the scope1 scoped field called email.
  expect(errors.count()).toBe(2);
  expect(errors.first('email', 'scope2')).toBe('The email is shorter than 3 chars.');

  errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1');
  errors.add('email', 'The email is invalid', 'rule1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1', 'scope1');

  errors.remove('name');
  expect(errors.count()).toBe(2);
});

test('clears the errors', () => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1');
  errors.add('email', 'The email is invalid', 'rule1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1');
  expect(errors.count()).toBe(3);
  errors.clear();
  expect(errors.count()).toBe(0);
});

test('clears the errors within a scope', () => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1', 'scope1');
  errors.add('email', 'The email is invalid', 'rule1', 'scope1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1', 'scope2');
  expect(errors.count()).toBe(3);
  errors.clear('scope1');
  expect(errors.count()).toBe(1);
});

test('checks for field selector existence', () => {
  const errors = new ErrorBag();

  expect(errors._selector('name:rule').name).toBe('name');
  expect(errors._selector('name:rule').rule).toBe('rule');
  expect(errors._selector('name')).toBe(null);
});

test('checks for field error existence', () => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1');
  expect(errors.has('name')).toBe(true);
  expect(errors.has('name:rule1')).toBe(true);
  expect(errors.has('name:rule2')).toBe(false);
  expect(errors.has('email')).toBe(false);
});

test('checks for scoped field error existence', () => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1', 'scope1');

  expect(errors.has('name')).toBe(false);
  expect(errors.has('name', 'scope1')).toBe(true);
  expect(errors.has('name', 'scope2')).toBe(false); // no such scoped field.
});

test('fetches the errors count/length', () => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1');
  errors.add('email', 'The email is invalid', 'rule1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1');

  expect(errors.count()).toBe(3);
});

test('fetches the first error message for a specific field', () => {
  const errors = new ErrorBag();
  errors.add('email', 'The email is invalid', 'rule1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1');

  errors.add('email', 'This is the third rule', 'rule2');
  errors.add('email', 'This is the forth rule', 'rule2');

  // test colon notation.
  expect(errors.first('email')).toBe('The email is invalid');
  expect(errors.first('email:rule2')).toBe('This is the third rule');

  errors.clear();
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1');

  expect(errors.first('email')).toBe('The email is shorter than 3 chars.');
  expect(errors.first('name')).toBe(null);

  // test dot notation.
  errors.add('email', 'nah', 'rule2', 'scope1');
  errors.add('email', 'bah', 'rule1', 'scope2');
  errors.add('email', 'mah', 'rule2', 'scope2');
  expect(errors.first('scope1.email')).toBe('nah');
  expect(errors.first('scope2.email:rule2')).toBe('mah');
});

test('fetches the first error message for a specific field that not match the rule', () => {
  const errors = new ErrorBag();
  errors.add('email', 'The email is required', 'required');

  errors.add('email', 'The email is invalid', 'rule1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1');

  errors.add('email', 'This is the third rule', 'rule2');
  errors.add('email', 'This is the forth rule', 'rule2');

  expect(errors.firstNot('email')).toBe('The email is invalid');
  expect(errors.firstNot('email', 'rule1')).toBe('The email is required');
});

test('fetches the first error rule for a specific field', () => {
  const errors = new ErrorBag();
  errors.add('email', 'The email is invalid', 'rule1');
  errors.add('name', 'Your name is required', 'rule2');

  expect(errors.firstRule('email')).toBe('rule1');
  expect(errors.firstRule('name')).toBe('rule2');
  expect(errors.firstRule('email', 'scope3')).toBe(null);
  expect(errors.firstRule('password')).toBe(null);
});

test('fetches the first error message for a specific scoped field', () => {
  const errors = new ErrorBag();
  errors.add('email', 'The email is invalid', 'rule1', 'scope1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1', 'scope2');

  expect(errors.first('email', 'scope1')).toBe('The email is invalid');
  expect(errors.first('email', 'scope2')).toBe('The email is shorter than 3 chars.');
  expect(errors.first('email', 'scope3')).toBe(null);
});

test('returns all errors in an array', () => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1');
  errors.add('email', 'The email is invalid', 'rule1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1');

  expect(Array.isArray(errors.all())).toBe(true);
  expect(errors.all()).toEqual([
    'The name is invalid',
    'The email is invalid',
    'The email is shorter than 3 chars.'
  ]);
});

test('returns all scoped errors in an array', () => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1', 'scope1');
  errors.add('email', 'The email is invalid', 'rule1', 'scope1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1', 'scope2');

  expect(Array.isArray(errors.all())).toBe(true);
  expect(errors.all('scope1')).toEqual([
    'The name is invalid',
    'The email is invalid'
  ]);
});

test('collects errors for a specific field in an array', () => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1');
  errors.add('email', 'The email is invalid', 'rule1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1');

  expect(errors.collect('email')).toEqual([
    'The email is invalid',
    'The email is shorter than 3 chars.'
  ]);
  expect(~errors.collect('name').indexOf('The name is invalid')).toBeTruthy();
});

test('collects all errors across scopes if no scope is defined', () => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1');
  errors.add('name', 'The name is invalid', 'rule1', 'scope1');
  errors.add('name', 'The name is invalid', 'rule1', 'scope2');

  expect(errors.collect('name').length).toBe(3);
  expect(errors.collect('name', 'scope2').length).toBe(1);
});

test('collects errors for a specific field and scope', () => {
  const errors = new ErrorBag();
  errors.add('email', 'The email is not email.', 'rule1', 'scope1');
  errors.add('email', 'The email is invalid', 'rule1', 'scope1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1', 'scope2');

  expect(errors.collect('email', 'scope1')).toEqual([
    'The email is not email.',
    'The email is invalid',
  ]);
  expect(
    ~errors.collect('email', 'scope2').indexOf('The email is shorter than 3 chars.')
  ).toBeTruthy();
});

test('groups errors by field name', () => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1');
  errors.add('email', 'The email is invalid', 'rule1');
  errors.add('email', 'The email is shorter than 3 chars.', 'rule1');

  expect(errors.collect()).toEqual({
    email: [
      'The email is invalid',
      'The email is shorter than 3 chars.'
    ],
    name: [
      'The name is invalid'
    ]
  });
  expect(errors.collect(null, undefined, false)).toEqual({
    email: [
      { field: 'email', msg: 'The email is invalid', scope: null, rule: 'rule1', regenerate: null },
      { field: 'email', msg: 'The email is shorter than 3 chars.', scope: null, rule: 'rule1', regenerate: null },
    ],
    name: [
      { field: 'name', msg: 'The name is invalid', scope: null, rule: 'rule1', regenerate: null },
    ]
  });
});

test('checks if there are any errors in the array', () => {
  const errors = new ErrorBag();
  expect(errors.any()).toBe(false);
  errors.add('name', 'The name is invalid', 'rule1');
  expect(errors.any()).toBe(true);
});

test('checks if there are any errors within a scope in the array', () => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1', 'scope1');
  errors.add('email', 'The email is invalid', 'rule1', 'scope1');

  expect(errors.any('scope3')).toBe(false);
  expect(errors.any('scope1')).toBe(true);
});

test('can get a specific error message for a specific rule', () => {
  const errors = new ErrorBag();
  errors.add('name', 'The name is invalid', 'rule1');
  errors.add('name', 'The name is really invalid', 'rule2');

  expect(errors.firstByRule('name', 'rule1')).toBe('The name is invalid');
  expect(errors.firstByRule('name', 'rule2')).toBe('The name is really invalid');
  expect(errors.firstByRule('email', 'rule1')).toBe(null);
});

test('fetches both scoped names and names with dots', () => {
  const errors = new ErrorBag();
  errors.add('name.example', 'The name is invalid', 'rule1');
  errors.add('name', 'The name is really invalid', 'rule2', 'example');
  expect(errors.first('name.example')).toBe('The name is invalid');
  expect(errors.first('example.name')).toBe('The name is really invalid');
});

test('fields with multiple dots in their names are matched correctly', () => {
  const errors = new ErrorBag();
  errors.add({
    field: 'dot.name',
    scope: 'very-long-scope',
    msg: 'something is wrong'
  });

  expect(errors.has('very-long-scope.dot.name')).toBe(true);
});

test('can regenerate error messages', () => {
  const errors = new ErrorBag();
  const fakeDictionary = {
    toggle: true,
    make () {
      return 'Product is {0}'.replace('{0}', this.toggle ? 'Alpha' : 'Beta')
    }
  };

  const generator = () => {
    return fakeDictionary.make();
  };

  errors.add({
    field: 'field',
    msg: generator(),
    regenerate: generator
  });

  fakeDictionary.toggle = false;
  expect(errors.first('field')).toBe('Product is Alpha');
  errors.regenerate();
  expect(errors.first('field')).toBe('Product is Beta');
});