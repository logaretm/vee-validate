import test from 'ava';
import validate from './../../src/rules/dimensions';
import mocks from './../helpers';

// eslint-disable-next-line
test('it validates image dimensions', async t => {
    const params = [150, 100];
    // Prepares Calls to window and Image objects.
    mocks.dimensionsTest({ width: 150, height: 100 });

    // TODO: maybe add acutal file to be tested properly.
    let value = await validate([mocks.file('file.jpg', 'image/jpeg', 10)], params);
    t.true(value[0].valid);

    // mock a failing Image, even with the right dimensions.
    mocks.dimensionsTest({ width: 150, height: 100}, true);
    value = await validate([mocks.file('file.jpg', 'image/jpeg', 10)], params);
    t.false(value[0].valid);

    // not an image.
    value = await validate([mocks.file('file.pdf', 'application/pdf', 10)], params);
    t.false(value);

    // wrong dimensions.
    mocks.dimensionsTest({ width: 30, height: 20});
    value = await validate([mocks.file('file.jpg', 'image/jpeg', 10)], params);
    t.false(value[0].valid);
});
