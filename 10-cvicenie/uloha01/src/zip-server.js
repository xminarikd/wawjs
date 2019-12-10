const fs = require('fs')
const zlib = require('zlib')
const {
    pipeline
} = require("stream");
const http = require('http')

const myServer = (path) => {

    return http.createServer((req, res) => {

        let fileDir = `${path}/serverFile`;
        fs.existsSync(fileDir) || fs.mkdirSync(fileDir);
        const filename = req.headers['filename'];
        const writeStream = fs.createWriteStream(`${fileDir}/${filename}`);

        pipeline(
            req,
            writeStream,
            (err) => {
                if (err) {
                    console.debug('Pipeline failed', err);
                } else {
                    console.log('Zapísane na servery');
                }
            }
        );

        pipeline(req,
            zlib.createGzip(),
            res,
            (err) => {
                if (err) {
                    console.debug('Pipeline failed', err);
                } else {
                    console.log('Zip sended');
                }
            }
        );

    })
    .on('error', err => {
        return console.debug('ERROR: create server', err);
    });
}

module.exports = myServer;