const bom = require("../../src/bom/");
const assert = require("assert");
const fs = require("fs");

describe("bom.js tests", function () {


  const bomBuffer = Buffer.from([0xEF, 0xBB, 0xBF])

  it("[BUG] shall not buffer all until _flush", (done) => {

    let called = 0;

    let file = `${__dirname}/data/with-bom.txt`;
    fs.createReadStream(file, {
        highWaterMark: 1
      })
      .pipe(bom.add())
      .on("error", done)
      .on("data", (chunk) => {
        called++;

      })
      .on("finish", () => {
        //assert(called===1, "all buffered before")
        assert(called === 1 + "// with".length)
        done();
      });
  });

  it("[BUG] shall be called x times", (done) => {

    let called = 0;
    let chunks = [];

    let file = `${__dirname}/data/with-bom.txt`;
    fs.createReadStream(file, {
        highWaterMark: 1
      })
      .pipe(bom.remove())
      .on("error", done)
      .on("data", (chunk) => {
        called++;
        chunks.push(chunk);
        //console.log(`${chunk} -- ${called}`);

      })
      .on("finish", () => {
        //assert(called===1, "all buffered before")
        let chunk = Buffer.concat(chunks);
        //console.log(chunk);
        assert(called === "// with".length)
        done();
      });
  });

});