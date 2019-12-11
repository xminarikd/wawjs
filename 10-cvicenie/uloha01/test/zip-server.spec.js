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
const fotofile = './test/test4kfoto.jpg';
const filename = 'testFile.txt';
const port = process.env.PORT || 3030;


describe("Client <--> Server correctness of sending files", function () {

    it("Filed sent - same server file as sent", function (done) {
        this.timeout(2000);

        const server = zipServer('test').listen(port);

        client(port, file).on('close', () => {
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

        client(port, fotofile).on('close', () => {
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
            fs.unlinkSync(`./test/${path.basename(fotofile)}.gz`);
        });
    });
});

describe("Client <--> Server server crash", function () {

    it("close server during request", function (done) {
        this.timeout(20000);

        // Large file - z prednasky 10, len mensi lebo heap
        /*
        const largeFileStream = fs
            .createWriteStream(`${__dirname}/../big.file`);

            for (let i = 0; i < 1e6; i++) {
                largeFileStream.write(
                    `${i}\tLorem ipsum dolor sit amet\n
        `);
            }
        largeFileStream.end();
        */

        const server = zipServer('test').listen(port);

        setTimeout(function () {
            server.close();
        }, 10);


        client(port, `${__dirname}/../big.file`).on('close', () => {
            done();
        });
    });
});

describe("Client <--> Server client error", function () {

    it("close client during request", function () {
        this.timeout(20000);

        // Large file - z prednasky 10, len mensi lebo heap
        /*
        const largeFileStream = fs
            .createWriteStream(`${__dirname}/../big.file`);

            for (let i = 0; i < 1e6; i++) {
                largeFileStream.write(
                    `${i}\tLorem ipsum dolor sit amet\n
        `);
            }
        largeFileStream.end();
        */

        const server = zipServer('test').listen(port);

        const myClient = client(port, `${__dirname}/../big.file`).on('close', () => {
            server.close();
        });

        setTimeout(function () {
            myClient.destroy();
        }, 10);

    });

});