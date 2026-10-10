const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const os = require('node:os')
const path = require('node:path')
const { execFileSync } = require('node:child_process')

const repoRoot = path.resolve(__dirname, '../..')
const agentRoot = path.resolve(process.argv[2] || process.env.NORTHSTAR_AGENT_ROOT || path.join(repoRoot, '../northstar-agent'))
const playwrightPath = process.env.NORTHSTAR_PLAYWRIGHT_MODULE || path.join(agentRoot, 'desktop/node_modules/playwright')
const { chromium } = require(playwrightPath)
const origin = 'https://northstar-demo.invalid'
const projectId = 'northstar-demo'
const requirementId = 'REQ-00042'
const outputDir = path.join(repoRoot, 'website/assets')

// All API responses are fictional, in-memory examples. No Viewer server or user storage is opened.
const requirements = [
  { id: requirementId, title: '需求工作台', state_label: '设计中', group: 'active' },
  { id: 'REQ-00043', title: '角色交接与待办', state_label: '开发中', group: 'active' },
  { id: 'REQ-00044', title: '质量证据追踪', state_label: '测试中', group: 'active' },
  { id: 'REQ-00045', title: '发布检查清单', state_label: '需求中', group: 'active' },
  { id: 'REQ-00046', title: '项目知识索引', state_label: '需求中', group: 'active' },
  { id: 'REQ-00047', title: '变更影响分析', state_label: '需求中', group: 'active' },
  { id: 'REQ-00048', title: '团队协作记录', state_label: '已发布', group: 'released' },
]
const availableDocs = { prd: true, research: true, td: true, tech_research: true, qa: true, test_report: true }
const tree = {
  product: { docs: { prd: true, td: true, qa: true } },
  requirements: requirements.map(item => ({ ...item, docs: availableDocs })),
  tasks: [{ title: '整理本周项目记录', state_label: '进行中', group: 'active' }],
  ingested: {
    pm: [{ slug: 'team-interview', title: '团队访谈 · 需求追踪' }, { slug: 'product-research', title: '产品调研 · 协作流程' }],
    dev: [{ slug: 'architecture-notes', title: '架构记录 · 状态与文档' }, { slug: 'api-design', title: '接口约定 · 工作台' }],
    qa: [{ slug: 'quality-strategy', title: '质量策略 · 角色交接' }, { slug: 'regression-matrix', title: '回归矩阵 · 文档切换' }],
  },
}
const documents = {
  prd: `# 需求工作台 · PRD

Northstar Demo / REQ-00042 · 设计中 · 示例项目

## 01 需求背景

从一个想法到可交付的需求，产品、开发和质量需要共享同一份项目事实。讨论发生在对话中，结论沉淀到文档，下一步交给正确的角色。

## 02 用户目标

- **产品经理**：把业务目标、范围与验收标准写清楚，持续跟踪待确认问题。
- **开发者**：在明确的产品约束下完成技术设计，将实现进展交回需求。
- **质量工程师**：依据验收标准编排测试，把问题与证据关联到需求。

## 03 本次交付范围

| 能力 | 用户价值 | 本次范围 |
| --- | --- | --- |
| 需求与文档 | 讨论有上下文，产物有归属 | PRD、TD、QA 按需求组织 |
| 角色工作区 | 每个角色看到自己的下一步 | PM / Dev / QA 文档与待办 |
| 状态与交接 | 让协作过程可以追踪 | 需求阶段、阻塞问题、交接记录 |
| 只读工作台 | 随时查看项目当前事实 | 文档阅读、需求看板、待办库存 |

## 04 验收标准

1. 切换角色后保留当前项目与需求位置。
2. 需求正文、阶段和待办来自同一份项目事实。
3. 未确认的问题可以明确交回负责角色。

## 05 待确认事项

外部协作者的可见范围、阶段通知频率与首期交付优先级仍待产品确认。`,
  td: `# 需求工作台 · TD

Northstar Demo / REQ-00042 · 技术设计 · 示例项目

## 01 设计目标

把对话、需求状态和工程产物连接起来。工作台读取已有项目事实，角色切换提供对应的文档和待办视角。

## 02 模块职责

| 模块 | 职责 | 产物 |
| --- | --- | --- |
| 会话与角色 | 保留对话上下文与角色待办 | PM / Dev / QA 工作区 |
| 需求状态机 | 校验操作条件、推进业务阶段 | 明确的阶段与交接记录 |
| Project Guide | 持久化项目与需求事实 | PRD、TD、QA 和发布记录 |
| Viewer | 提供只读的文档与待办投影 | 三栏工作台、需求看板 |

## 03 数据流

\`\`\`text
用户对话 → Agent Service → 角色职责与工具执行
                          ↓
                   需求状态与工程产物
                          ↓
              Project Guide → 只读工作台
\`\`\`

## 04 关键约束

- 状态推进由需求状态机校验，文档本身保留工程事实。
- PM 定义产品语义，Dev 负责设计与实现，QA 提供测试证据。
- 角色切换保留同一需求上下文，读取对应的正式产物。

## 05 实现计划

先实现文档导航与角色工作区，再验证阶段交接和异常分支。示例项目尚未执行构建或测试。`,
  qa: `# 需求工作台 · QA

Northstar Demo / REQ-00042 · 测试计划 · 示例项目

## 01 验证目标

依据 PRD 的验收标准，验证文档阅读、角色切换和需求交接是否保持一致。以下为计划样例，尚未执行测试。

## 02 验收矩阵

| 编号 | 验证场景 | 预期行为 | 状态 |
| --- | --- | --- | --- |
| AC-01 | 打开指定需求 | 显示需求对应的角色文档 | 待执行 |
| AC-02 | 从 PM 切换到 Dev | 保留需求位置，显示 TD | 待执行 |
| AC-03 | 从 Dev 切换到 QA | 保留需求位置，显示 QA | 待执行 |
| AC-04 | 查看阻塞问题 | 标明来源、负责角色与上下文 | 待执行 |
| AC-05 | 打开需求看板 | 显示阶段与文档可用性 | 待执行 |
| AC-06 | 文档暂不可用 | 显示明确的错误状态 | 待执行 |

## 03 测试分层

- **契约验证**：文档字段、阶段投影与角色待办保持一致。
- **界面验证**：三栏布局、长文档与角色切换在桌面视口可用。
- **交接验证**：问题交给负责角色，证据与需求保持关联。

## 04 证据计划

测试执行后记录用例结果、失败原因与复测证据。当前执行数为 **0**，本示例不包含真实测试或验收结论。

## 05 风险与待办

重点覆盖长标题、缺失文档、角色工作区恢复及跨阶段交接。`,
}
const inboxByRole = {
  pm: [
    { kind: '产品问题', content: '确认外部协作者的需求可见范围', from: 'Dev', detail: '需要明确首期开放范围：仅需求文档，还是同时包含阶段与待办。' },
    { kind: '范围确认', content: '明确角色交接的通知时机', from: 'QA', req: 'REQ-00043', title: '角色交接与待办' },
    { kind: '优先级', content: '确认发布检查清单的首期范围', from: 'Dev', req: 'REQ-00045', title: '发布检查清单' },
    { kind: '待评审', content: '评审需求工作台的验收标准', from: 'PM', detail: '本记录为演示待办，尚未进行真实评审或验收。' },
  ],
  dev: [
    { kind: '设计任务', content: '补充角色切换与文档导航设计', from: 'PM', detail: '保持需求上下文，明确缺失文档与不可用状态的处理方式。' },
    { kind: '实现任务', content: '实现角色待办的项目级投影', from: 'PM', req: 'REQ-00043', title: '角色交接与待办' },
    { kind: '测试准备', content: '提供质量证据存储接口说明', from: 'QA', req: 'REQ-00044', title: '质量证据追踪' },
    { kind: '发布准备', content: '整理部署步骤与回滚方案', from: 'PM', req: 'REQ-00045', title: '发布检查清单' },
  ],
  qa: [
    { kind: '测试设计', content: '覆盖 PM / Dev / QA 角色切换', from: 'PM', detail: '演示测试计划尚未执行。执行后应记录用例结果和实际证据。' },
    { kind: '边界场景', content: '补充文档缺失与长标题用例', from: 'Dev' },
    { kind: '质量证据', content: '制定失败记录与复测证据格式', from: 'Dev', req: 'REQ-00044', title: '质量证据追踪' },
    { kind: '发布检查', content: '确认上线前的验收清单', from: 'PM', req: 'REQ-00045', title: '发布检查清单' },
  ],
}

function demoApi(url) {
  const role = url.searchParams.get('role') || 'pm'
  if (url.pathname === '/api/state') return { state: null }
  if (url.pathname === '/api/overview') return {
    products: [
      { id: projectId, name: 'Northstar Demo', requirement_count: requirements.length, task_count: 1, has_overall_doc: true, inbox_count: 4 },
      { id: 'component-demo', name: '组件库 Demo', requirement_count: 3, has_overall_doc: true, inbox_count: 0 },
    ],
  }
  if (url.pathname === '/api/inbox') return {
    items: (inboxByRole[role] || []).map(item => ({ product_id: projectId, product: 'Northstar Demo', req: requirementId, title: '需求工作台', ...item })),
  }
  if (url.pathname === '/api/tree') return tree
  if (url.pathname === '/api/doc/hash') return { hash: 'isolated-demo-v1' }
  if (url.pathname === '/api/navigation/resolve') return { doc: { pm: 'prd', dev: 'td', qa: 'qa' }[role] }
  if (url.pathname === '/api/doc') return { content: documents[url.searchParams.get('doc')] || documents.prd }
  throw new Error(`Unexpected demo API: ${url.pathname}`)
}

async function main() {
  const html = await fs.readFile(path.join(agentRoot, 'viewer_service/index.html'), 'utf8')
  const temporaryDir = await fs.mkdtemp(path.join(os.tmpdir(), 'northstar-viewer-demo-'))
  const browser = await chromium.launch({ headless: true,
    ...(process.env.NORTHSTAR_CHROMIUM ? { executablePath: process.env.NORTHSTAR_CHROMIUM } : {}),
  })
  const errors = []
  try {
    await fs.mkdir(outputDir, { recursive: true })
    const context = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1, serviceWorkers: 'block' })
    const page = await context.newPage()
    page.on('pageerror', error => errors.push(error.message))
    await page.route('**/*', async route => {
      const url = new URL(route.request().url())
      assert.equal(url.origin, origin, 'Demo captures must never contact external services')
      if (route.request().isNavigationRequest()) {
        await route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html })
      } else if (url.pathname.startsWith('/api/')) {
        await route.fulfill({ status: 200, contentType: 'application/json; charset=utf-8', body: JSON.stringify(demoApi(url)) })
      } else {
        await route.fulfill({ status: 404, body: '' })
      }
    })
    for (const [role, kind] of Object.entries({ pm: 'prd', dev: 'td', qa: 'qa' })) {
      const query = new URLSearchParams({ project: projectId, req: requirementId, role, doc: kind })
      await page.goto(`${origin}/?${query}`, { waitUntil: 'networkidle' })
      await page.locator('#main h1').filter({ hasText: '需求工作台' }).waitFor()
      await page.evaluate(() => document.fonts.ready)
      assert.equal(await page.locator('#roles button[aria-pressed="true"]').getAttribute('data-role'), role)
      assert.equal(await page.locator('.inbox-item').count(), 4)
      assert.equal(await page.locator('#main table').count(), 1)
      const pngPath = path.join(temporaryDir, `workbench-${role}.png`)
      const webpPath = path.join(outputDir, `workbench-${role}.webp`)
      await page.screenshot({ path: pngPath, animations: 'disabled' })
      execFileSync(process.env.NORTHSTAR_CWEBP || 'cwebp', ['-quiet', '-q', '92', '-m', '6', pngPath, '-o', webpPath])
      console.log(`${path.relative(repoRoot, webpPath)}: ${(await fs.stat(webpPath)).size} bytes; 1600 x 1000; isolated ${role} demo`)
    }
    assert.deepEqual(errors, [])
    await fs.copyFile(path.join(outputDir, 'workbench-pm.webp'), path.join(outputDir, 'workbench.webp'))
  } finally {
    await browser.close()
    await fs.rm(temporaryDir, { recursive: true, force: true })
  }
}

main().catch(error => { console.error(error); process.exitCode = 1 })
