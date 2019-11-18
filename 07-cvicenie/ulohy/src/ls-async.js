const fs = require("fs").promises;
const path = require("path");

module.exports = lsRescursive;

async function lsRescursive(dirName) {
  let dirs = await ls(dirName);
  dirs = dirsOnly(dirs).map(({ name }) => name);
  console.log(dirs);
  dirs = dirs.map(name => path.resolve(dirName, name));
  console.log(dirs);
  let files = await Promise.all(dirs.map(ls));
  files = [].concat(...files);
  files = filesOnly(files);
  files = files.map(({ name }) => name);
  console.log(files);
  return files;
}

async function ls(dirName) {
  return fs.readdir(dirName, {
    withFileTypes: true
  });
}

function dirsOnly(files) {
  return files.filter(f => f.isDirectory());
}

function filesOnly(files) {
  return files.filter(f => f.isFile());
}

lsRescursive("..");
