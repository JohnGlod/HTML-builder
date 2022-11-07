const fs = require('fs');
const path = require('path');

const stream = fs.createReadStream(path.resolve(__dirname, 'text.txt'), {
  encoding: 'utf-8',
});

stream.on('data', (chank) => {
  console.log(chank);
});

stream.on('error', (error) => {
  console.log(error);
});
