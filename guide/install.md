# 安装

整个桥接由两个独立插件组成，方向相反：

| 方向 | 插件 | 技术栈 | 效果 |
| --- | --- | --- | --- |
| N.E.K.O. → DSH | `plugin/plugins/deepseekharness_bridge/` | Python | 猫娘能把长任务、代码类任务交给本地 harness 执行 |
| DSH → N.E.K.O. | `dsh-plugin-neko/` | TypeScript / Cordis | dsh agent 能调用 N.E.K.O. 的插件工具 |

两边各自符合对方的官方规范（N.E.K.O. 的 `plugin.toml` 契约、DSH 的 Cordis 插件契约），
通信只复用 N.E.K.O. 文档化的 `/api/tools` 本地集成协议，详见[桥接协议](/protocol)。

## 前置条件

| | 需要 |
| --- | --- |
| N.E.K.O. | 主服务器运行中（默认 `http://127.0.0.1:48911`） |
| DSH | 已安装。用 Python SDK 路径需要 `pip install deepseek-harness-sdk`；用 CLI 路径需要 `dsh` 在 PATH 或配置了 `repo_path` |
| Python | 3.10+（N.E.K.O. 插件运行环境） |

## 安装 N.E.K.O. 侧插件

用安装版的「开发模式」最省事，不用克隆 N.E.K.O. 主仓库：

1. 打开 N.E.K.O. 的插件管理器，点左侧「服务器日志」下方的**开发模式**，开启开关。
2. 点**加载未打包插件**，选择 `plugin/plugins/deepseekharness_bridge/` 目录
   （网页端要填**运行后端的机器**上的绝对路径）。
3. 点**校验**，核对名称、ID、版本、入口，再点**加载未打包插件**。
4. 在插件列表里启动 `deepseekharness_bridge`。
5. 改代码后点卡片上的**重载**；改依赖需要重启插件。

> **分发注意：** 源码目录名必须与插件 ID 一致。这里目录名已经是
> `deepseekharness_bridge`，与 `[plugin].id` 匹配，可以直接打包成 `.neko-plugin`。

### 启动时自动完成的事

插件启动时**不需要你做任何额外配置**：

- 探测 Python SDK 与 `dsh` 可执行文件，决定走哪条调用路径；
- 自动把 DSH 侧 bundle 安装/修复到位（面板的「DSH 侧桥接」会显示 `已就绪`）；
- 生成账号 patch 覆盖层，把 headless 关掉的账号栈重新打开。

也就是说：**启动这个插件是唯一需要人工做的步骤**。

## 安装 DSH 侧插件

DSH 的 bundle 分两种装法，选一种。上面的自动安装覆盖的是正式 bundle 路线；
如果你在改 DSH 侧源码，用本地开发路线更快。

### A. 本地开发（快，推荐先这样试）

用 patch 覆盖层直接挂载 TypeScript 源码，不需要打包。在 DSH 仓库检出根目录：

```powershell
# 路径改成实际的绝对路径
@"
- insert:
    - id: neko-bridge
      name: 'C:\...\neko-dsh-bridge\dsh-plugin-neko\src\neko-bridge.ts'
      config:
        baseUrl: 'http://127.0.0.1:48911'
"@ | Out-File -Encoding utf8 scratch-neko-cordis.yml

pnpm dsh web --patch ./scratch-neko-cordis.yml
```

启动时终端会打印 `[neko-bridge] 已镜像 N.E.K.O. 工具 xxx`。
看到这行就说明桥接成功了。

### B. 正式 bundle 安装

先构建（`prepare` 脚本会把 TS 编译成 `lib/`，DSH 只认构建产物）：

```powershell
cd dsh-plugin-neko
pnpm install
pnpm run build
```

然后装进 profile：

```powershell
$env:DSH_HOME = "C:\...\dsh-home"
dsh --profile web --dump-default-config | Out-Null
dsh plugin --profile web add file:C:/.../neko-dsh-bridge/dsh-plugin-neko
```

装完先不启动，确认 layer 挂上了：

```powershell
dsh --profile web --dump-config   # 应看到 "# == dsh-plugin-neko" 这一段
```

看到这段再 `dsh --profile web` 启动。

::: warning 为什么必须构建
DSH 的 git 安装只取源码、不跑 build，TypeScript 包会因缺少 `lib/` 输出而加载失败。
本地 `file:` link 会跑 `prepare`，所以先 `pnpm run build` 或直接 `pnpm install`
都能得到产物。这也是为什么 `package.json` 的 `main` 指向 `lib/index.js` 而不是 `src/`。
:::

## 下一步

- [配置说明](/guide/config) — 账号路由、模型、思考强度、沙箱
- [运行与验证](/guide/run) — 怎么确认两个方向都通了
