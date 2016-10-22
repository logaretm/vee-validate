import jsdom from 'jsdom';

export default {
    jsdom(el, callback) {
        const html = el ? `<input name="${el.name}" type="text" value="${el.value}">` : '';
        jsdom.env(html, [], callback);
    },
    file: (name, type, size = 1) => ({
        name,
        type,
        size: size * 1024
    }),
    dimensionsTest: (dimensions, fails = false) => {
        global.window.URL = {
            createObjectURL() {
                return 'data:image/png;base64,AAAAAAA';
            }
        };

        global.Image = class Image {
            // eslint-disable-next-line
            set src(value) {
                this.width = dimensions.width;
                this.height = dimensions.height;

                this[fails ? 'onerror' : 'onload']();
            }
        };
    }
};
