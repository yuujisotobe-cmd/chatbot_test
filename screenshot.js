const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000');
  
  await page.type('#name', 'テストユーザー');
  
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  
  await browser.close();
  console.log('Screenshot saved as screenshot.png');
})();
