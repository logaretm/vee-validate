const validateImage = (file, width, height) => {
    const URL = window.URL || window.webkitURL;
    return new Promise(resolve => {
        const image = new Image();
        image.onerror = () => resolve({ name: file.name, valid: false });

        image.onload = () => {
            let valid = true;

            // Validate exact dimensions.
            valid = image.width === Number(width) && image.height === Number(height);

            resolve({
                name: file.name,
                valid
            });
        };

        image.src = URL.createObjectURL(file);
    });
};

export default (files, [width, height]) => {
    const list = [];
    for (let i = 0; i < files.length; i++) {
        // if file is not an image, reject.
        if (! files[i].name.match(/\.(jpg|svg|jpeg|png|bmp|gif)$/i)) {
            return false;
        }

        list.push(files[i]);
    }

    return Promise.all(list.map(file => validateImage(file, width, height)));
};
