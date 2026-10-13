# Northstar Public Website

Northstar / NS 的对外介绍页，纯静态 HTML、CSS 和 JavaScript，无构建步骤。

## 本地预览

直接在浏览器打开 `index.html`。所有资源都使用相对路径，支持本地文件和 GitHub Pages 项目路径。

## GitHub Pages

在 `godcin/ns` 的 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**。
将本分支合入 `main` 后，`pages.yml` 发布 `website/`；也可从 Actions 手动运行该工作流。
网址为 `https://godcin.com/`。工作流只上传 `website/`，不发布产品源码。

## PM 产品交互流程演示视频

首页的 PM 演示使用真实 Northstar Desktop 会话录像，展示 `media-harbor` 从需求调研、逐项确认、补充约束，到 PRD 生成、评审修订和 PM 签核的过程。公开版本时长 29:42，分辨率 1920 × 1080。点击真实封面、观看入口或章节时间，在 B 站观看对应视频。

- 视频：https://www.bilibili.com/video/BV1XupR6NEgL/
- 封面：`assets/video/pm-product-workflow-poster.webp`，从录像中提取真实画面。

仓库只提交页面、链接和真实封面；原始 `.mov` 和本地生成的 MP4 保留在本地，由 `.gitignore` 排除，不随网站发布。

## Dev 技术交互流程演示视频

技术演示接续 PM 签核后的需求，包含技术调研、TD 编写与评审、需求异议收口、同步 TD、再评审与技术收敛，以及实现步骤确认。

- 视频：https://www.bilibili.com/video/BV16Qp962E1v/
- 封面：`assets/video/dev-technical-workflow-poster.webp`，从真实录像的实现步骤确认界面提取。

首页使用同一展示区切换 PM 和 Dev 演示，支持角色标签、左右箭头、标签键盘导航及触屏横向滑动。每段演示保留各自的标题、真实封面、B 站观看入口和章节链接。

## 可选 Viewer 视频

将视频放入 `assets/`，在 `site-config.js` 中设置相对路径：

```js
window.NORTHSTAR_SITE = Object.freeze({ demoVideo: "assets/northstar-demo.mp4" });
```

也可使用 HTTPS 视频地址。配置后，Viewer 演示区使用原生视频播放器和现有封面；播放失败时显示错误并恢复角色截图。
空配置默认展示 PM / Dev / QA 的 Viewer 截图。此配置不影响独立的 PM 交互流程录像。

## 演示图片

页面内的 Viewer 截图使用隔离的示例项目数据，仅用于说明界面结构，不代表线上服务或真实用户验收记录。
已生成的图片位于 `assets/`，页面运行时不请求项目服务或用户数据。

## 链接预览

首页在静态 HTML 的 `<head>` 中提供 Open Graph 和 Twitter Card 信息，供支持链接预览的聊天与社交平台抓取，不依赖 JavaScript。分享图为公开的 `assets/northstar-share.jpg`，1200 × 630，使用真实 Desktop 录像封面。

同时提供方形 `assets/northstar-icon.png`、PNG/ICO 网站图标和 Apple Touch Icon，兼容不读取 OG 图片或不支持 SVG 图标的客户端。以上资源均由现有 Northstar 图标生成。微信是否采用这些图标由客户端决定；它们不会改变微信聊天卡片的点击行为。

重新生成分享图：

```sh
NORTHSTAR_CHROMIUM="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node website/scripts/generate-share-assets.cjs
```

生成工具沿用 Viewer 图片脚本的 `NORTHSTAR_AGENT_ROOT` 与 `NORTHSTAR_PLAYWRIGHT_MODULE` 配置，仅在本地生成资源，网站运行无需这些依赖。

微信聊天直接粘贴普通网址可能只显示文本链接。页面元信息无法强制微信生成卡片；需要先在微信内打开网页，再使用右上角分享入口试验。定制微信分享内容通常需要有相应权限的公众号、JS 接口安全域名、微信 JS-SDK 和服务端签名，当前静态站点尚未接入。各平台会缓存预览，已经发送的消息不一定会随网站更新。

分享标题包含“AI 研发协作，从需求到交付”，使只展示标题的卡片也能传达产品用途。微信朋友圈的 `updateTimelineShareData` 接口没有 `desc` 字段，不单独设置简介；Mac 微信原生分享入口是否采用网页简介由客户端决定。好友分享接口 `updateAppMessageShareData` 才提供 `desc`，详见 [微信 JS-SDK 使用说明](https://developers.weixin.qq.com/doc/service/guide/h5/jssdk.html)。

## 图标

`vendor/lucide.min.js` 为本地固定版本的 Lucide 0.468.0，ISC 许可证见 `vendor/lucide-LICENSE`。页面无需访问第三方 CDN。
