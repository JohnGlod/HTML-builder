const fs = require('fs');
const path = require('path');

fs.readdirSync(path.join(path.resolve(__dirname), 'secret-folder'), {
  withFileTypes: true,
})
  .filter((item) => !item.isDirectory())
  .forEach((item) => {
    const filePath = path.join(
      path.resolve(__dirname),
      'secret-folder',
      item.name
    );

    const stats = fs.statSync(filePath);

    console.log(
      `${item.name} - ${path.extname(filePath).slice(1)} - ${
        stats.size / 1000
      }kb`
    );
  });
