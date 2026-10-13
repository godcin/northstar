const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')

const repoRoot = path.resolve(__dirname, '../..')
const agentRoot = path.resolve(process.env.NORTHSTAR_AGENT_ROOT || path.join(repoRoot, '../northstar-agent'))
const playwrightPath = process.env.NORTHSTAR_PLAYWRIGHT_MODULE || path.join(agentRoot, 'desktop/node_modules/playwright')
const { chromium } = require(playwrightPath)
const outputPath = path.join(repoRoot, 'website/assets/northstar-share.jpg')

async function main() {
  const screenshot = await fs.readFile(path.join(repoRoot, 'website/assets/video/pm-product-workflow-poster.webp'))
  const browser = await chromium.launch({ headless: true,
    ...(process.env.NORTHSTAR_CHROMIUM ? { executablePath: process.env.NORTHSTAR_CHROMIUM } : {}),
  })
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
    await page.setContent(`<!doctype html>
      <html lang="zh-CN">
        <head>
          <meta charset="utf-8">
          <title>Northstar Share Preview</title>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: #0d0e11; color: #f0f0f3; text-align: center; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif; letter-spacing: 0; }
            h1 { margin: 23px 0 0; font-size: 68px; font-weight: 600; line-height: 1.15; }
            p { margin: 10px 0 0; font-size: 28px; line-height: 1.4; color: #d5d5dc; }
            img { display: block; width: 784px; height: 441px; margin: 23px auto 0; object-fit: contain; border: 1px solid #35363d; }
          </style>
        </head>
        <body>
          <h1>Northstar</h1>
          <p>对话驱动的 AI 研发协作平台</p>
          <img src="data:image/webp;base64,${screenshot.toString('base64')}" alt="Northstar Desktop 真实产品需求会话">
        </body>
      </html>`)
    await page.evaluate(() => document.fonts.ready)
    await page.locator('img').evaluate(image => image.decode())
    assert.equal(await page.locator('img').evaluate(image => image.naturalWidth), 1920)
    assert.ok(await page.locator('body > *').evaluateAll(elements => elements.every(element => {
      const bounds = element.getBoundingClientRect()
      return bounds.left >= 0 && bounds.top >= 0 && bounds.right <= 1200 && bounds.bottom <= 630
    })), 'Share image content must fit within the exported image')
    await page.screenshot({ path: outputPath, type: 'jpeg', quality: 90, animations: 'disabled' })
    console.log(`${path.relative(repoRoot, outputPath)}: ${(await fs.stat(outputPath)).size} bytes; 1200 x 630`)
  } finally {
    await browser.close()
  }
}

main().catch(error => { console.error(error); process.exitCode = 1 })
