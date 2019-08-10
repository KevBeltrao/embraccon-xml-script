const fs = require('fs');

require.extensions['.ofx'] = (module, filename) => {
  module.exports = fs.readFileSync(filename, 'utf8');
};

let text = require("./01 2017.ofx");

const tags = [];
const allTags = [];
let word = '';
let result = '';
let isGetting = false;
const tagsAbertas = [];

let i = 0;

const tratarTag = (tag, index) => {
  if (tag[1] === '/') {
    for (let j = tagsAbertas.length - 1; j >= 0; j--) {
      if (tagsAbertas[j][0].replace('<', '</') === tag) {
        tagsAbertas.splice(j, 1);
      }
    }
  }
  else {
    tagsAbertas.push([tag, index]);
  }
}

for (letter of text) {
  if (letter === '<') {
    isGetting = true;
  }

  if (isGetting) {
    word += letter;
  }

  if (letter === '>') {
    isGetting = false;
    tratarTag(word, i);
    word = '';
  }
  i++;
}

for (tag of tagsAbertas.reverse()) {
  for(let i = tag[1]; true; i++){
    if(text[i] === '<'){
      text = text.substring(0, i) + tag[0].replace('<', '</') +text.substring(i);
      break;
    }
  }
}

fs.writeFile('./result.ofx', text, (err) => {
  console.log('ok');
});
