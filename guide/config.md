# 配置

配置写在运行配置的 `[deepseekharness_bridge]` 段。所有键在面板上都有对应控件，
正常情况下不需要手改文件。

## 配置项

| 键 | 默认 | 说明 |
| --- | --- | --- |
| `repo_path` | `""` | DeepSeek Harness 源码检出路径；SDK 模式下作为隔离 home 的根 |
| `dsh_executable` | `""` | 显式指定 `dsh` 可执行文件。留空则从 PATH 找，找不到再找 DSH 桌面版内嵌的 CLI |
| `provider` | `deepseek-account` | 凭据路由，见下 |
| `model` | `deepseek-flash` | 模型 ID，面板下拉可切 |
| `reasoning_effort` | `max` | 思考强度，见下 |
| `sandbox_mode` | `workspace-write` | 文件权限，见[沙箱](/guide/sandbox) |
| `profile` | `headless` | 传给 `dsh` 的 profile。桌面端装法下 `desktop` 被 Electron 独占，只能用 `headless` |
| `workspace` | `""` | harness 的工作目录。留空 = 插件自己的存储目录，任务只能碰里面的文件 |
| `task_timeout` | `600` | 单次任务超时（秒） |
| `log_dir` | `""` | 运行日志目录，默认 `storage_dir/runs` |

## 凭据路由

默认走 **DeepSeek 账号**，直接复用你已经在 DSH 里完成的登录，**不需要 API key**。

headless profile 原本把 `credentials` / `authorization` / `deepseek-account`
三项都设成 `disabled: true`，所以插件每次运行会生成一个 patch 覆盖层把它们
重新打开。这是 cordis 后层覆盖前层的正常用法，不改 DSH 自身，也不动你的登录状态。

想改用 API key 的话，把 `provider` 设成 `deepseek-official`，并提供 `DEEPSEEK_API_KEY`：

```toml
[deepseekharness_bridge]
provider = "deepseek-official"
```

## 思考强度

面板「思考强度」卡片可切，选中立即对之后的任务生效。

| 值 | 说明 |
| --- | --- |
| `off` | 不推理，最快最省，质量最低 |
| `low` | 轻量推理，适合简单任务 |
| `high` | 更深入推理，耗时更长 |
| `max` | 默认，最强推理，最慢最贵 |

::: warning 只有这四个值
DSH 的 Messages 路径只接受 `off` / `low` / `high` / `max`。
`minimal` 和 `medium` 会直接报 `UNSUPPORTED_REASONING_EFFORT` 让任务失败——
面板列表已经按这个集合裁剪过了，手改配置时也别填那两个值。
:::

## 工作目录

`workspace` 留空时，harness 跑在插件自己的存储目录下。这个目录就是沙箱根，
`workspace-write` 模式下任务只能读写这里面的文件。

想让 harness 操作别的目录，把 `workspace` 指过去——**注意这会同时放宽它能写的范围**。

## 运行时覆盖

面板上切的模型、思考强度、沙箱会写进内存覆盖层，**优先于配置文件**，
所以点一下立刻生效，不用重启插件。重启后回到配置文件的默认值。
