const fsPromises = require('fs/promises');
const path = require('path');

const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const assetsFolder = path.join(__dirname, 'assets');
const stylesFolder = path.join(__dirname, 'styles');

const output = path.join(__dirname, 'project-dist');
const outputHTML = path.join(output, 'index.html');
const outputCSS = path.join(output, 'style.css');
const outputAssets = path.join(output, 'assets');

const createBuild = async () => {
  await fsPromises.rm(output, { force: true, recursive: true });
  await fsPromises.mkdir(output, { recursive: true });
  await createHtml(componentsPath, templatePath, outputHTML);
  await bundleCss(stylesFolder, outputCSS);
  await copyDir(assetsFolder, outputAssets);
};

createBuild();

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

const copyDir = async (originFolderPath, copyFolderPath) => {
  if (!originFolderPath || !copyFolderPath) return;

  const folderContent = await fsPromises.readdir(originFolderPath, {
    encoding: 'utf-8',
    withFileTypes: true,
  });

  await fsPromises.rm(copyFolderPath, { force: true, recursive: true });
  await fsPromises.mkdir(copyFolderPath, { recursive: true });

  folderContent.forEach((content) => {
    const originContentPath = path.join(originFolderPath, content.name);
    const copyContentPath = path.join(copyFolderPath, content.name);
    content.isDirectory()
      ? copyDir(originContentPath, copyContentPath)
      : fsPromises.copyFile(originContentPath, copyContentPath);
  });
};

async function createHtml(folderPath, inputHTML, outputHTML) {
  let newHTML = '';
  const componentFiles = await fsPromises.readdir(folderPath, {
    withFileTypes: true,
  });

  newHTML = await fsPromises.readFile(inputHTML, { encoding: 'utf-8' });

  componentFiles.forEach(async (file, id) => {
    const fileExtension = path.extname(file.name);

    if (fileExtension === '.html') {
      const componentHTML = await fsPromises.readFile(
        path.join(folderPath, file.name),
        {
          encoding: 'utf-8',
        }
      );
      newHTML = newHTML.replace(
        `{{${path.parse(file.name).name}}}`,
        componentHTML
      );

      if (id === componentFiles.length - 1) {
        await fsPromises.writeFile(outputHTML, newHTML);
      }
    }
  });
}
