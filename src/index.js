const puppeteer = require('puppeteer');
const url = require('url');
const { indexUrl } = require('./config');
const { saveFile } = require('./writeFile');

const getPage = async (browser, links) => {
  links.map(async pageUrl => {
    const page = await browser.newPage();
    await page.goto(pageUrl);
    const { name } = url.parse(pageUrl);
    const content = await page.content();
    await saveFile(pageUrl, content);
  });
};

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(indexUrl);

  const links = await page.evaluate(() => {
    const as = Array.from(document.querySelectorAll('.nav a'));
    let hrefs = [];
    as.map((item, index) => {
      const href = $(item).attr('href');
      hrefs.push('http://www.zhufengpeixun.cn/architecture/' + href);
    });
    return hrefs;
  });

  await getPage(browser, links); 
  // saveFile('links.json',JSON.stringify(links))
  await page.close();
})();
