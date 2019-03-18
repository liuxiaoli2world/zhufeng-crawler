const fs = require('fs');
const util = require('util');

const { extName } = require('./config');

exports.saveFile = async ({ title, content }) => {
  let fileName = `${title}.${extName}`;
  let staticStr = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href='./index.css' rel="stylesheet">
    <title>{title}</title>
  </head>
  <body>
    <h1>{title}</h1>
    <div class="article-holder unable-reprint">
    {body}
    </div>
  </body>
  </html>`;

  title = title.replace('哔哩哔哩', '').trim();
  const htmlStr = staticStr
    .replace(/{title}/g, title)
    .replace(/{body}/g, content);

  await util.promisify(fs.writeFile)(fileName, htmlStr);
};
