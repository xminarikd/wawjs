const bom = require("../../src/bom/");
const assert = require("assert");
const fs = require("fs");

describe("bom.js tests", function () {


  const bomBuffer = Buffer.from([0xEF, 0xBB, 0xBF])

  it("add bom - shell add bom to empty file", function (done) {

    var chunks = [];

    let file = `${__dirname}/data/without-bom-empty.txt`;
    fs.createReadStream(file)
      .pipe(bom.add())
      .on("error", done)
      .on("data", (chunk) => chunks.push(chunk))
      .on("finish", () => {

        let chunk = Buffer.concat(chunks);

        assert.equal(chunk.indexOf(bomBuffer), 0);
        assert.equal(chunk.length, 3);

        done();
      });
  });

  it("remove bom - shell not remove from empty file", function (done) {

    var chunks = [];

    let file = `${__dirname}/data/without-bom-empty.txt`;
    fs.createReadStream(file)
      .pipe(bom.remove())
      .on("error", done)
      .on("data", (chunk) => chunks.push(chunk))
      .on("finish", () => {

        let chunk = Buffer.concat(chunks);

        assert.equal(!chunk.indexOf(bomBuffer), 0);
        assert.equal(chunk.length, 0);

        done();
      });
  });
});