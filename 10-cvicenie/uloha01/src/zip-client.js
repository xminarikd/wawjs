const fs = require('fs')
const {
    pipeline
} = require("stream");
const http = require('http')
const path = require('path')

const myClient = (port, filePath) => {

    const request = http.request({
        host: 'localhost',
        port,
        method: 'POST',
    });

    //https://nodejs.org/api/fs.html#fs_fs_existssync_path
    if (!fs.existsSync(filePath)) {
        // console.error("No such file or directory");
        // return request;
        throw new Error("No such file or directory");
    }

    let filename = path.basename(filePath);
    let fileDir = `${path.dirname(filePath)}`;

    const readStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(`${fileDir}/${filename}.gz`);

    request.setHeader('filename', filename);

    readStream.pipe(request).on('error', (err) => {
        console.log('Error: request error');
        fs.unlinkSync(`${fileDir}/${filename}.gz`);
    });

    request.on('response', res => {
        pipeline(
            res,
            writeStream,
            err => {
                if (err) {
                    console.debug('Failed write file', err);
                }
            }
        );
    });

    return request;
}

module.exports = myClient;