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
        timeout: 1500
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

    request.on('close', () => {
        console.debug("req got closed!");
    });

    request.on('timeout', function () {
        console.log("timeout! " + (request.timeout / 1000) + " seconds expired");
        request.destroy();
    });

    request.on('error', function (e) {
        if (request.connection.destroyed) {
            console.log("got error, req.destroy() was called!");
            return;
        }
        console.debug("Request error - req not destroyed! ", e);
    });

    return request;
}

module.exports = myClient;