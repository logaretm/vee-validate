export default {
    msg(name, [size]) {
        return `The ${name} must be less than ${size} KB.`;
    },
    validate(files, [size]) {
        if (isNaN(size)) {
            return false;
        }

        const nSize = Number(size) * 1024;
        for (let i = 0; i < files.length; i++) {
            if (files[i].size > nSize) {
                return false;
            }
        }

        return true;
    }
};
