
const file = require("fs");
const fileP = file.promises;
const fileConfig = require("../configs/file.config");
exports.deleteFile = async (path) => {
    try {
        const filePath = fileConfig.deleteUrl;
        const result = await fileP.unlink(`${filePath}${path}`);
        console.log('Successfully removed file!');
        return result;
    } catch (err) {
        console.log(err);
    }
};