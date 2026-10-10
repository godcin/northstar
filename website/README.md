# Northstar Public Website

Northstar / NS 的对外介绍页，纯静态 HTML、CSS 和 JavaScript，无构建步骤。

## 本地预览

直接在浏览器打开 `index.html`。所有资源都使用相对路径，支持本地文件和 GitHub Pages 项目路径。

## GitHub Pages

在 `godcin/northstar` 的 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**。
将本分支合入 `main` 后，`pages.yml` 发布 `website/`；也可从 Actions 手动运行该工作流。
默认网址为 `https://godcin.github.io/northstar/`。工作流只上传 `website/`，不发布产品源码。

## 接入视频

将视频放入 `assets/`，在 `site-config.js` 中设置相对路径：

```js
window.NORTHSTAR_SITE = Object.freeze({ demoVideo: "assets/northstar-demo.mp4" });
```

也可使用 HTTPS 视频地址。配置后，演示区使用原生视频播放器和现有封面；播放失败时显示错误并恢复角色截图。
空配置默认展示 PM / Dev / QA 的 Viewer 截图。

## 演示图片

页面内的 Viewer 截图使用隔离的示例项目数据，仅用于说明界面结构，不代表线上服务或真实用户验收记录。
已生成的图片位于 `assets/`，页面运行时不请求项目服务或用户数据。

## 图标

`vendor/lucide.min.js` 为本地固定版本的 Lucide 0.468.0，ISC 许可证见 `vendor/lucide-LICENSE`。页面无需访问第三方 CDN。
