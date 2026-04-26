# shedatahk limited 官网系统

这套站点现在按 `一个公司总首页 + 一个业务展示区里的双标签切换 + 一个共享后台` 组织。

## 对外结构

- `/`
  公司总首页。先讲 `shedatahk limited`、团队与相关资料，再在同一张公开单页里通过双标签切换两条业务线。
- `/industry/`
  医药项目与实业 IP 服务的快捷入口。会收口到首页中的 `实业 IP / 医药项目线` 标签。
- `/portfolio/`
  投资组合管理业务线的快捷入口。会收口到首页中的 `投资组合管理 / 香港功能地产线` 标签。
- `/admin/`
  后台入口页。会跳转或指向真正的内部管理后台登录地址。

旧的 `services / contact / about / methods / books / membership / payment / credentials` 等路径仍保留地址，但会继续收口到公司总首页的对应标签或锚点。

## 共享后台

官网前台表单不再主打邮箱跳板，而是直接写入 `/Users/adamlei/.openclaw/workspace/strategic-office-saas` 的后台 API：

- `POST /api/applications`

两条业务线会带上这些关键字段：

- `business_line`
- `source_page`
- `service_interest`
- `project_stage`
- `current_issue`

后台再按 `industry / capital` 分流给不同团队处理，但仍在同一个后台里看客户、订单、付款和待办。

## 本地预览

### 1. 跑后台

```bash
cd /Users/adamlei/.openclaw/workspace/strategic-office-saas
python3 app.py
```

默认后台地址：

- `http://127.0.0.1:8801/login`

### 2. 跑官网静态页

```bash
cd /Users/adamlei/.openclaw/workspace/codex
python3 -m http.server 8080
```

然后访问：

- `http://127.0.0.1:8080/`

## 运行时配置

静态站使用：

- `/Users/adamlei/.openclaw/workspace/codex/assets/js/runtime-config.js`

默认策略：

- 本地 `file://` 或 `localhost` 预览时，前台自动连到 `http://127.0.0.1:8801`
- 正式部署时，前台默认直连 `https://admin.wisdomshe.com`

示例：

```js
window.WISDOMSHE_CONFIG = {
  apiOrigin: "https://admin.wisdomshe.com",
  adminOrigin: "https://admin.wisdomshe.com",
};
```

## 联系方式

- WhatsApp / 微信 / 电话：`+852 5535 7390`
- 邮箱：`adam@wisdomshe.com`

## 正式上线结构

- 前台：`https://wisdomshe.com`
- 前台备用域：`https://www.wisdomshe.com`
- 后台：`https://admin.wisdomshe.com`

## GitHub Pages 部署

1. 为前台创建一个新的正式 GitHub 仓库，不复用旧的 `adam-profile`
2. 把本目录作为仓库根目录推到 `main`
3. 在 GitHub Pages 中把发布来源设为 `Deploy from a branch`
4. 选择：
   - Branch: `main`
   - Folder: `/ (root)`
5. 保留：
   - `CNAME`
   - `.nojekyll`
5. 在域名 DNS 中配置：
   - `wisdomshe.com` 指向 GitHub Pages 的 A 记录
   - `www.wisdomshe.com` 做 `CNAME -> wisdomshe.com`

## 与后台联通

前台已经默认指向：

- `apiOrigin = https://admin.wisdomshe.com`
- `adminOrigin = https://admin.wisdomshe.com`

因此正式发布时不需要再手动改代码，只需要让后台在 Railway 上线并把 `admin.wisdomshe.com` 绑定过去。

如果后面你想改回 GitHub Actions 发布，也可以在更换带 `workflow` scope 的 GitHub 凭证后再把 workflow 文件补回去。

站内已包含：

- `robots.txt`
- `sitemap.xml`
- `CNAME`
- `404.html`
- 基础 `canonical / OG meta`
