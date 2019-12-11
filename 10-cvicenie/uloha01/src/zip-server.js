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
                        console.debug('Pipeline failed - closing writestream');
                    }
                }
            );

            pipeline(
                req,
                zlib.createGzip(),
                res,
                (err) => {
                    if (err) {
                        console.debug('Pipeline failed - closing zlib, res');
                        res.statusCode = 500;
                        res.end();
                    }
                }
            );

            writeStream.on('close', () => {
                console.debug('SERVER: writestream is closed');
            })

        })
        .on('error', err => {
            return console.debug('ERROR: create server', err);
        });
}

module.exports = myServer;