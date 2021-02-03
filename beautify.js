/*
Beautifies the src directory recursively
*/
var beautify = require('js-beautify').js,
  fs = require('fs');
 /*
*/
const { resolve } = require('path');
const { readdir } = require('fs').promises;

async function getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}

getFiles("src").then(function(out) {
  for(var i = 0; i < out.length; i ++) {
    var data = fs.readFileSync(out[i], 'utf8');
    console.log("beautified " + data.length + " " + out[i])
    fs.writeFileSync(out[i], beautify(data, { indent_size: 2, space_in_empty_paren: true }))
  }


  getFiles("skills").then(function(out) {
    for(var i = 0; i < out.length; i ++) {
      var data = fs.readFileSync(out[i], 'utf8');
      console.log("beautified " + data.length + " " + out[i])
      fs.writeFileSync(out[i], beautify(data, { indent_size: 2, space_in_empty_paren: true }))
    }
  })
})
/*fs.readdirSync("src").forEach(file => {
  console.log(file);
});*/
