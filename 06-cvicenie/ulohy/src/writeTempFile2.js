module.exports = writeTempFile;

const fs = require("fs");
const os = require("os");
const path = require("path");
const async = require("async");

function writeTempFile(fileName, ...args /* data, options, callback*/) {
  let cb = args.pop();

  async.waterfall(
    [
      cb => {
        let tempDir = path.join(os.tmpdir(), `${process.pid}-`);
        fs.mkdtemp(tempDir, cb);
      },
      (folder, cb) => {
        try {
          const filePath = path.join(folder, fileName);
          fs.writeFile(filePath, ...args, err => {
            cb(err, filePath);
          });
        } catch (err) {
          cb(err);
        }
      }
    ],
    cb
  );
}
