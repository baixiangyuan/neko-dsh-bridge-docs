# N.E.K.O. ⇄ DeepSeek Harness 文档站

基于 [VitePress](https://vitepress.dev) 的插件文档站，可部署到 Cloudflare Pages / GitHub Pages。

## 本地开发

```powershell
npm install
npm run dev        # http://localhost:5173
```

## 构建

```powershell
npm run build      # 产物在 .vitepress/dist
npm run preview    # 本地预览构建产物
```

> VitePress 1.x 的输出目录是 `.vitepress/dist`，不是根目录的 `dist`。
> 配置部署平台时路径要写对。

## 目录结构

```
docs/
├── index.md                     # 首页
├── protocol.md                  # 桥接协议与安全边界
├── guide/
│   ├── install.md               # 安装
│   ├── config.md                # 配置项
│   ├── models.md                # 模型
│   ├── sandbox.md               # 文件权限（沙箱）
│   ├── run.md                   # 运行与验证
│   └── troubleshooting.md       # 故障排查
├── public/logo.svg
└── .vitepress/config.mts
```

## 部署

### Cloudflare Pages（推荐）

**方式一：Git 集成（自动部署）**

1. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
2. 选这个仓库，配置：
   - Framework preset: `None`
   - Build command: `npm run build`
   - Build output directory: `.vitepress/dist`
   - Node version: `20`
3. Save and Deploy

之后每次 push 到 main 会自动构建部署。

**方式二：直接上传（无 CI）**

```powershell
npm run build
npx wrangler pages deploy .vitepress/dist --project-name=neko-dsh-docs
```

### GitHub Pages

仓库已带 `.github/workflows/deploy-docs.yml`，push 到 main 后：

1. 仓库 Settings → Pages → Source 选 `GitHub Actions`
2. 等 workflow 跑完，访问 `https://<user>.github.io/<repo>/`

如果用仓库子路径，先把 `.vitepress/config.mts` 里的 `base` 从 `/` 改成 `/<repo>/`。

## base 路径说明

`base` 决定静态资源的引用前缀：

| 部署方式 | base |
| --- | --- |
| 自定义域名 / CF Pages 项目域名 | `/` |
| `xxx.github.io/<repo>/` | `/<repo>/` |

改完 `base` 必须重新 `npm run build`，否则资源 404。
