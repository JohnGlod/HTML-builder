const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });

const writeStream = fs.createWriteStream(
  path.join(path.resolve(__dirname), 'output.txt')
);

const endOfWrite = () => {
  rl.close();
  writeStream.end();
  console.log('Все предыдущие сообщения успешно записаны в output.txt');
};

const writeFile = (text) => text === 'exit' ? endOfWrite() : writeStream.write(text);

rl.question('Введите ваше сообщение! \n', (answer) => writeFile(answer));

rl.on('line', (answer) => writeFile(answer));

rl.on('SIGINT', () => writeFile('exit'));
