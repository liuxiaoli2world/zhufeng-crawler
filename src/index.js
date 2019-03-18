const puppeteer = require('puppeteer');
const url = require('url');
const { indexUrl, selector } = require('./config');
const { saveFile } = require('./writeFile');

const getPage = async (browser, links) => {
  for (let i = 0, len = links.length; i < len; i++) {
    let { title, url } = links[i];
    const page = await browser.newPage();
    await page.goto(url);

    await page.waitForSelector('.article-holder');
    const content = await page.evaluate(() => {
      let $ = window.$;
      let content = $('.article-holder')
        .html()
        .replace(/\/\/www/g, 'https://www');
      return content;
    });
    await page.close();
    await saveFile({ title, content });
  }
};

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(indexUrl);

  await page.waitForSelector('.articlelist-list');
  const links = await page.evaluate(() => {
    const as = Array.from(document.querySelectorAll('.article-title-holder'));
    let hrefs = [];
    as.map(item => {
      const title = $(item)
        .find('span')
        .text();
      const url = $(item)
        .attr('href')
        .replace(/\/\/www/g, 'https://www');
      hrefs.push({ url, title });
    });
    return Array.from(new Set(hrefs));
  });

  // saveFile('links.json', JSON.stringify(links));
  await getPage(browser, links);
  await page.close();
})();
