const async = require("async");
const fs = require("fs");
module.exports = saveSomewhere;

function saveSomewhere(paths, data, cb) {
  const tasks = paths.map(pat => cb =>
    fs.writeFile(pat, data, err => {
      cb(err, pat);
    })
  );
  async.tryEach(tasks, cb);
}
