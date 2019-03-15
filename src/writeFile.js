const fs = require('fs');
const path = require('path');
exports.saveFile = async (pageUrl, content) => {
  const pathObj = path.parse(pageUrl);

  fs.writeFile(pathObj.base, content, () => {
    console.log('success');
  });
};
