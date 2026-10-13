const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')

const repoRoot = path.resolve(__dirname, '../..')
const toolsRoot = process.env.NORTHSTAR_SHARE_TOOLS_ROOT
const dependencyPath = (environmentName, moduleName) => process.env[environmentName] ||
  (toolsRoot ? path.join(toolsRoot, 'node_modules', moduleName) : moduleName)
const simpleIconsPath = dependencyPath('NORTHSTAR_SIMPLE_ICONS_MODULE', 'simple-icons')
const icons = require(simpleIconsPath)
const qrcode = require(dependencyPath('NORTHSTAR_QRCODE_MODULE', 'qrcode'))
const { PNG } = require(dependencyPath('NORTHSTAR_PNGJS_MODULE', 'pngjs'))
const jsqr = require(dependencyPath('NORTHSTAR_JSQR_MODULE', 'jsqr'))
const outputDir = path.join(repoRoot, 'website/assets/share')
const websiteUrl = 'https://godcin.com/'

async function main() {
  await fs.mkdir(outputDir, { recursive: true })
  for (const [filename, icon] of [
    ['x', icons.siX],
    ['reddit', icons.siReddit],
    ['facebook', icons.siFacebook],
    ['wechat', icons.siWechat],
    ['weibo', icons.siSinaweibo],
  ]) {
    assert.ok(icon, `Missing Simple Icons asset: ${filename}`)
    const svg = icon.svg.replace('<svg ', '<svg fill="#9b9ca6" ')
    await fs.writeFile(path.join(outputDir, `${filename}.svg`), `${svg}\n`)
    console.log(`${filename}.svg: ${Buffer.byteLength(`${svg}\n`)} bytes; Simple Icons ${icon.title}`)
  }

  const licensePath = path.join(path.dirname(require.resolve(simpleIconsPath)), 'LICENSE.md')
  await fs.copyFile(licensePath, path.join(outputDir, 'simple-icons-LICENSE.md'))
  const qrPath = path.join(outputDir, 'wechat-qr.png')
  await qrcode.toFile(qrPath, websiteUrl, {
    type: 'png', width: 296, margin: 4, errorCorrectionLevel: 'H',
    color: { dark: '#0d0e11ff', light: '#ffffffff' },
  })

  const png = PNG.sync.read(await fs.readFile(qrPath))
  assert.equal(png.width, 296)
  assert.equal(png.height, 296)
  const decoded = jsqr(new Uint8ClampedArray(png.data), png.width, png.height)
  assert.equal(decoded?.data, websiteUrl, 'QR code must decode to the canonical homepage')
  for (let x = 0; x < png.width; x++) {
    for (const y of [0, png.height - 1]) {
      assert.deepEqual([...png.data.subarray((y * png.width + x) * 4, (y * png.width + x) * 4 + 4)], [255, 255, 255, 255])
    }
  }
  console.log(`wechat-qr.png: ${(await fs.stat(qrPath)).size} bytes; ${png.width} x ${png.height}; decoded ${decoded.data}`)
}

main().catch(error => { console.error(error); process.exitCode = 1 })
