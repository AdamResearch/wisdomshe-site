# wisdomshe.com / admin.wisdomshe.com 技术部交接单

## 当前事实

- 前台仓库：`AdamResearch/wisdomshe-site`
- 后台仓库：`AdamResearch/wisdomshe-admin`
- 根域自定义域名已在 GitHub Pages 配置为：`wisdomshe.com`
- 当前 `wisdomshe.com` 的 DNS 托管在 DNSPod / 腾讯云侧
- 当前公开解析仍是旧记录，尚未切到本次新站

## 当前旧解析

### 根域 `wisdomshe.com`

- `A 115.190.218.50`
- `A 43.139.254.27`

### `www.wisdomshe.com`

- `CNAME 5j9r9s2x9x.coze-dns-01.com`

### `admin.wisdomshe.com`

- 尚未切到本次后台

## 目标结构

- `https://wisdomshe.com/`
- `https://wisdomshe.com/industry/`（快捷入口，最终收口到同一张公开首页）
- `https://wisdomshe.com/portfolio/`（快捷入口，最终收口到同一张公开首页）
- `https://wisdomshe.com/admin/`
- `https://admin.wisdomshe.com/login`

## 一、前台 DNS 切换

### 1. 删除旧记录

删除根域现有旧 A 记录：

- `115.190.218.50`
- `43.139.254.27`

删除 `www` 现有旧 CNAME：

- `5j9r9s2x9x.coze-dns-01.com`

### 2. 新增根域 GitHub Pages A 记录

为 `wisdomshe.com` 新增：

- `A 185.199.108.153`
- `A 185.199.109.153`
- `A 185.199.110.153`
- `A 185.199.111.153`

### 3. 新增 `www`

为 `www.wisdomshe.com` 新增：

- `CNAME AdamResearch.github.io`

### 4. 保持 DNS 为直连

如果 DNS 平台支持代理/CDN 开关，首次切换建议保持 `DNS only`，不要先套代理。

## 二、后台 Railway 部署

### 1. 部署源

- GitHub 仓库：`AdamResearch/wisdomshe-admin`
- 运行方式：Railway 自动读取仓库内 `Procfile`
- 数据库：Railway Postgres

### 2. 必填环境变量

```env
APP_ENV=production
FLASK_SECRET_KEY=<长随机值>
ADMIN_AUTH_SECRET=<后台登录密码>
DATABASE_URL=<Railway Postgres 提供值>
PUBLIC_SITE_ORIGIN=https://wisdomshe.com
ALLOWED_ORIGINS=https://wisdomshe.com,https://www.wisdomshe.com
ADMIN_SITE_ORIGIN=https://admin.wisdomshe.com
```

### 3. 可选支付环境变量

```env
PAYMENT_LINK_STRATEGIC_DIAGNOSTIC_HKD=
PAYMENT_LINK_STRATEGIC_DIAGNOSTIC_CNY=
PAYMENT_LINK_MEMBERSHIP_HKD=
PAYMENT_LINK_MEMBERSHIP_CNY=
```

### 4. 绑定后台域名

- 在 Railway 服务中绑定：`admin.wisdomshe.com`
- Railway 会给出一个默认域名
- 在 DNSPod 中把：
  - `admin.wisdomshe.com`
  - 配置为
  - `CNAME -> Railway 默认域名`

## 三、验收标准

### 前台

- `https://wisdomshe.com/` 正常打开
- `https://wisdomshe.com/industry/` 正常打开，并切到首页中的医药项目区
- `https://wisdomshe.com/portfolio/` 正常打开，并切到首页中的投资组合管理区
- `https://wisdomshe.com/admin/` 自动引导到后台登录入口

### 后台

- `https://admin.wisdomshe.com/login` 正常打开
- `https://admin.wisdomshe.com/api/health` 返回成功
- 前台两条业务线表单都能写入后台
- 后台能区分 `industry` 与 `capital`

## 四、补充说明

- 这次不需要购买域名的主账号密码才能推进；只需要 DNS 解析修改权和 Railway 部署权。
- 如果技术部不愿共享主账号，按本交接单代改即可。
