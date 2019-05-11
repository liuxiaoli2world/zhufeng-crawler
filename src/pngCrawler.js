/**
 *  爬取制定网站图片资源到本地
 *  axios 请求数据 stream 格式写入本地
 */
const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
var currentNumber = 1;

async function run(url) {
  console.log("Start to crawl girl's pictures...");
  const browser = await puppeteer.launch({
    // headless: false
  });
  const page = await browser.newPage();
  await page.goto(url, {
    timeout: 160000
  });

  // 模拟滚轮 加载所有图片
  for (let i = 0; i < 30; i++) {
    await page.evaluate(i => {
      window.scrollTo(0, i * 65);
    }, i);
    // await timeout(50);
    await page.waitFor(500);
  }

  let imgURL = await page.evaluate(() => {
    let imgURL = [];
    // let selector = '.waterfall img';
    let selector = 'a.pic img';
    let imgUrlList = [...document.querySelectorAll(selector)];
    imgUrlList.forEach(e => {
      let src = e.src;
      if (src.endsWith('jpg')) {
        imgURL.push(src);
      }
    });
    return imgURL;
  });
  // console.log(imgURL);
  imgURL.forEach((e, i) => {
    // console.log(e);
    if (currentNumber === 40) {
      browser.close();
      console.log('All pictures downloaded complete!');
      return;
    }
    axios
      .get(e, {
        responseType: 'stream'
      })
      .then(res => {
        res.data.pipe(
          fs.createWriteStream(
            `./pics/${currentNumber}.${e.substr(e.length - 3)}`
          )
        );
        currentNumber++;
      });
  });
  let nextPage = await page.evaluate(() => {
    let nodes = document.querySelectorAll(
      '.list-pager-v2 a.next_page.next_page2'
    );
    let href = (nodes && nodes[0].href) || null;
    return href;
  });
  console.log('OK!');
  setTimeout(function() {
    if (nextPage) {
      run(nextPage);
    }
  }, 3000);
}
run('http://www.cxtuku.com/search.php?q=3d%E5%B0%8F%E4%BA%BA');
