const assert = require("assert");
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {
    pipeline
} = require("stream");
const zipServer = require('../src/zip-server');
const client = require('../src/zip-client');

const file = './test/testFile.txt';
const filename = 'testFile.txt';
const port = process.env.PORT || 3000;


describe("Client <--> Server <--> Zip test", function () {

    it("Filed sended - same server file as sent ", function (done) {
        this.timeout(2000);

        const server = zipServer('test').listen(port);

        client(port, file).on('finish', () => {
            server.close();
        });

        server.on('close', async () => {

            const hash2 = crypto.createHash('sha1');
            hash2.setEncoding('hex');

            const readStream = fs.createReadStream('./test/serverFile/testFile.txt');

            readStream.on('end', () => {
                hash2.end();
                let hash = hash2.read();

                assert.equal(hash, 'ac0770d64427ef765b34983e1a25684be317806f');
                done();
            });

            readStream.pipe(hash2);

            fs.unlinkSync(`./test/${path.basename(file)}.gz`);
        });
    });

    it("It should sent foto", function (done) {
        this.timeout(2000);

        const server = zipServer('test').listen(port);

        client(port, file).on('finish', () => {
            server.close();
        });

        server.on('close', async () => {

            const hash2 = crypto.createHash('sha1');
            hash2.setEncoding('hex');

            const readStream = fs.createReadStream('./test/serverFile/test4kfoto.jpg');

            readStream.on('end', () => {
                hash2.end();
                let hash = hash2.read();

                assert.equal(hash, '6b7269abb1eea1f7cd6064779e33f31235ab8e91');
                done();
            });

            readStream.pipe(hash2);

            fs.unlinkSync(`./test/${path.basename(file)}.gz`);
        });
    });

    //from lukino563
    it("Server is unreachable - should log error and delete created file", function (done) {

        client(port, file).on('close', () => {
            assert(!fs.existsSync(`./${path.basename(file)}.gz`));
            done();
        });
    });

});