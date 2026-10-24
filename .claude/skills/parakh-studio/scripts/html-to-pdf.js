const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + process.argv[2], { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const fonts = await p.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight));
  console.log('fonts', JSON.stringify([...new Set(fonts)]));
  await p.pdf({ path: process.argv[3], preferCSSPageSize: true, printBackground: true });
  await p.setViewportSize({ width: 900, height: 1200 });
  await p.screenshot({ path: 'full.png', fullPage: true });
  await b.close();
})();
