const fsPromises = require('fs/promises');
const path = require('path');

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

const folderPath = path.resolve(__dirname, 'files');
const folderPathCopy = path.resolve(__dirname, 'files-copy');

copyDir(folderPath, folderPathCopy);
