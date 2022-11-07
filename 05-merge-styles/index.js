const fsPromises = require('fs/promises');
const path = require('path');

async function bundleCss(
  pathToDir,
  outputPath = path.join(__dirname, 'project-dist', 'bundle.css')
) {
  const dir = await fsPromises.readdir(pathToDir);

  const files = await Promise.all(
    dir.map((fileName) => {
      const filePath = path.join(pathToDir, fileName);
      const fileExtension = path.extname(filePath);
      if (fileExtension === '.css') {
        return fsPromises.readFile(filePath, {
          encoding: 'utf-8',
        });
      }
    })
  );
  const bundle = files.reduce((result, file) => [...result, file]);
  await fsPromises.writeFile(outputPath, bundle.join(''));
}

bundleCss(path.join(__dirname, 'styles'))
  .then(() => console.log('Bundle is ready!'))
  .catch((err) => console.log('Error: \n', err));
