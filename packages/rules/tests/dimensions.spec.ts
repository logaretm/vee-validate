import validate from '../src/dimensions';
import helpers from './helpers';

let fails = false;

beforeEach(() => {
  window.URL.createObjectURL = () => {
    return 'data:image/png;base64,AAAAAAA';
  };

  (window as any).webkitURL = {
    createObjectURL() {
      return 'data:image/png;base64,AAAAAAA';
    },
  };

  (window as any).Image = class Image {
    get src() {
      return 'test';
    }

    set src(_: any) {
      (this as any).width = 150;
      (this as any).height = 100;

      (this as any)[fails ? 'onerror' : 'onload']();
    }
  };
});

test('validates image dimensions', async () => {
  let result = await validate(helpers.file('file.jpg', 'image/jpeg', 10), { width: 150, height: 100 });
  expect(result).toBe(true);

  // mock a failing Image, even with the right dimensions.
  fails = true;
  result = await validate([helpers.file('file.jpg', 'image/jpeg', 10)], { width: 150, height: 100 });
  expect(result).toBe(false);

  fails = false;
  // not an image.
  result = await validate([helpers.file('file.pdf', 'application/pdf', 10)], { width: 150, height: 100 });
  expect(result).toBe(false);

  // wrong dimensions.
  result = await validate([helpers.file('file.jpg', 'image/jpeg', 10)], { width: 15, height: 10 });
  expect(result).toBe(false);

  (window as any).URL = undefined; // test webkit fallback.
  result = await validate([helpers.file('file.jpg', 'image/jpeg', 10)], { width: 150, height: 100 });
  expect(result).toBe(true);
});
