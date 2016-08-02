import test from 'ava';
import Validator from './../src/validator';
import { mockFile } from './helpers';

const validator = new Validator({
    email: 'email',
    required: 'required',
    min: 'min:3',
    max: 'max:10',
    in: 'in:1,2,3,5',
    not_in: 'not_in:1,2,3,5',
    alpha: 'alpha',
    alpha_dash: 'alpha_dash',
    alpha_num: 'alpha_num',
    numeric: 'numeric',
    regex: 'regex:[0-9]+',
    regex2: 'regex:[a-z]+,i',
    ip: 'ip',
    ext: 'ext:jpg,txt,svg',
    mimes: 'mimes:image/*,text/plain',
    size: 'size:10',
    invalidSize: 'size:blabla',
    digits: 'digits:3',
    image: 'image',
    dimensions: 'dimensions:150,100'
});

test('it validates alpha', t => {
    t.true(validator.validate('alpha', 'abcdefgHijklMnOpqRsTUVwxYZ abc'));
    t.false(validator.validate('alpha', 'abcdefgHijklMnOpqRsTUVwxYZ abc1'));
    t.true(validator.validate('alpha', ''));
});

test('it validates alpha_num', t => {
    t.true(validator.validate('alpha_num', 'abcdefgHijklMnOpqRsTUVwxYZ abc 123'));
    t.true(validator.validate('alpha_num', ''));
    t.false(validator.validate('alpha_num', 'abcdefgHijklMnOpqRsTUVwxYZ -'));
});

test('it validates alpha_dash', t => {
    t.true(validator.validate('alpha_dash', 'abcdefgHijklMnOpqRsTUVwxYZ abc 123 _-'));
    t.true(validator.validate('alpha_dash', 'abcdefgHijklMnOpqRsTUVwxYZ abc'));
    t.true(validator.validate('alpha_dash', ''));
    t.false(validator.validate('alpha_dash', 'abcdefgHijklMnOpqRsTUVwxYZ @'));
});

test('it validates numeric', t => {
    t.true(validator.validate('numeric', '1234567890'));
    t.false(validator.validate('numeric', '123abc'));
    t.true(validator.validate('numeric', ''));
});

test('it validates emails', t => {
    t.true(validator.validate('email', 'foo.12@bar.co.uk'));
    t.false(validator.validate('email', 'foo.12@bar.c'));
});

test('it validates min', t => {
    t.true(validator.validate('min', 'wow'));
    t.false(validator.validate('min', 'wo'));
});

test('it validates max', t => {
    t.true(validator.validate('max', 'not long'));
    t.false(validator.validate('max', 'this is some very long text'));
});

test('it validates required', t => {
    t.true(validator.validate('required', 'asjdj'));
    t.true(validator.validate('required', 0));
    t.false(validator.validate('required', ''));
    t.false(validator.validate('required', []));
});

test('it validates in', t => {
    t.true(validator.validate('in', 1));
    t.true(validator.validate('in', 2));
    t.true(validator.validate('in', 3));
    t.true(validator.validate('in', 5));
    t.false(validator.validate('in', 4));
});

test('it validates not_in', t => {
    t.false(validator.validate('not_in', 1));
    t.false(validator.validate('not_in', 2));
    t.false(validator.validate('not_in', 3));
    t.false(validator.validate('not_in', 5));
    t.true(validator.validate('not_in', 4));
});


// TODO: A regex expression with a pipe '|' or a comma ',' will get shat on.
// fix this by supporting array syntax.
test('it validates regular expressions', t => {
    t.true(validator.validate('regex', '213213123123'));
    t.true(validator.validate('regex', 'ad1231231231'));
    t.false(validator.validate('regex', 'ads'));
    t.true(validator.validate('regex2', 'ABC'));
});


test('it validates ipv4 addresses', t => {
    t.true(validator.validate('ip', '192.168.1.1'));
    t.false(validator.validate('ip', '256.123.1.1'));
    t.true(validator.validate('ip', '44.44.44.44'));
    t.false(validator.validate('ip', '192.168.a.1'));
});


test('it validates files extensions', t => {
    const validFiles = [
        mockFile('file.txt', 'text/plain'),
        mockFile('file.jpg', 'image/jpeg'),
        mockFile('file.svg', 'image/svg'),
    ];

    t.true(validator.validate('ext', validFiles));

    t.false(validator.validate('ext', [mockFile('file.pdf', 'application/pdf')]));
});

test('it validates mime types', t => {
    const validFiles = [
        mockFile('file.txt', 'text/plain'),
        mockFile('file.jpg', 'image/jpeg'),
        mockFile('file.svg', 'image/svg'),
    ];

    t.true(validator.validate('mimes', validFiles));

    t.false(validator.validate('mimes', [mockFile('file.pdf', 'application/pdf')]));
});

test('it validates file size', t => {
    t.true(validator.validate('size', [mockFile('file.txt', 'text/plain', 10)]));
    t.false(validator.validate('size', [mockFile('file.txt', 'text/plain', 20)]));

    t.false(validator.validate('invalidSize', [mockFile('file.txt', 'text/plain', 10)]));
    t.false(validator.validate('invalidSize', [mockFile('file.txt', 'text/plain', 20)]));
});

test('it validates digits rule', t => {
    // must be numeric.
    t.false(validator.validate('digits', '12c'));

    // only 3 digits allowed.
    t.false(validator.validate('digits', '1234'));

    // is cool.
    t.true(validator.validate('digits', '123'));
});

test('it validates image files', t => {
    t.true(validator.validate('image', [mockFile('file.jpg', 'image/jpeg')]));
    t.true(validator.validate('image', [mockFile('file.jpeg', 'image/jpeg')]));
    t.true(validator.validate('image', [mockFile('file.svg', 'image/svg')]));
    t.true(validator.validate('image', [mockFile('file.bmp', 'image/bmp')]));
    t.true(validator.validate('image', [mockFile('file.png', 'image/png')]));
    t.true(validator.validate('image', [mockFile('file.gif', 'image/gif')]));

    t.false(validator.validate('image', [mockFile('file.pdf', 'application/pdf')]));
});
