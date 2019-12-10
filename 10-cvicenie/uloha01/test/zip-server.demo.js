const zipServer = require('../src/zip-server');
const client = require('../src/zip-client');
const assert = require("assert");
const fs = require('fs')
const path = require('path');
const {
    finished
} = require("stream");
const port = process.env.PORT || 3000;
const file = process.argv[2] || "./test/testFile.txt";


const server = zipServer('test').listen(port, () => {
    console.log("server started! at localhost at port = " + port);
});


client(port, file)
    .on('finish', () => {
        server.close();
    });