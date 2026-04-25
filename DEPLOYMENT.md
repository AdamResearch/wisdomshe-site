# wisdomshe.com 前台上线清单

## 目标结构

- `https://wisdomshe.com/`
- `https://wisdomshe.com/industry/`
- `https://wisdomshe.com/portfolio/`
- `https://wisdomshe.com/admin/`

## 仓库要求

- 使用一个新的正式 GitHub 仓库
- 以本目录作为仓库根目录
- 保留：
  - `CNAME`
  - `.nojekyll`
  - `robots.txt`
  - `sitemap.xml`

## GitHub Pages 设置

1. 推送到 `main`
2. 在仓库 Settings -> Pages 中选择 `Deploy from a branch`
3. Branch 选择 `main`
4. Folder 选择 `/ (root)`
5. 保存后等待 GitHub Pages 完成首次构建

## DNS 设置

### 根域

先删除当前旧 A 记录：

- `115.190.218.50`
- `43.139.254.27`

再把 `wisdomshe.com` 指向 GitHub Pages 官方 A 记录：

- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

### www

- 先删除旧 CNAME：`5j9r9s2x9x.coze-dns-01.com`
- 新增：`www.wisdomshe.com CNAME AdamResearch.github.io`

### admin

- `admin.wisdomshe.com` 不指向 GitHub Pages
- 该子域应在后台 Railway 部署完成后，单独指向 Railway 分配的默认域名

## 上线后检查

- `https://wisdomshe.com/` 正常打开
- `https://wisdomshe.com/industry/` 正常打开
- `https://wisdomshe.com/portfolio/` 正常打开
- `https://wisdomshe.com/admin/` 能跳到 `https://admin.wisdomshe.com/login`
- `https://wisdomshe.com/robots.txt` 可访问
- `https://wisdomshe.com/sitemap.xml` 可访问
