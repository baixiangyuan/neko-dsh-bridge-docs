# 故障排查

## 启动时报 `permission: composed sandbox and approval defaults match no preset`

**原因：** DSH 原生的预设表里没有 `read-only` 这一档，选只读时组合匹配不上就抛这个错。

**状态：** 已在 0.2.3 修复。插件现在会显式声明三档预设，见[沙箱](/guide/sandbox)。

**临时规避：** 先把文件权限切到「工作区可写」再启动。

## 任务失败，报 `UNSUPPORTED_REASONING_EFFORT`

**原因：** 思考强度填了 DSH Messages 路径不接受的值。合法集合只有
`off` / `low` / `high` / `max`，`minimal` 和 `medium` 会直接被拒。

**修复：** 在面板「思考强度」里重新选一档，或把配置改成合法值。见[配置](/guide/config)。

## 输出里只看到模型列表那一行，没有答案

日志里出现 `[llm-deepseek-account] model listing ... loaded 2 model(s)` 之后再没动静，
说明任务在**会话创建阶段**就挂了，没走到生成答案那一步。

先看这行之后有没有上面的报错。这条本身是 `console.info` 打到 stdout 的正常输出，
不是错误——真正的问题在它后面。

## `status` 说 SDK 和 CLI 都不可用

按顺序查：

1. Python 环境里能否 `import deepseek_harness`（SDK 路径需要）；
2. PATH 里能否找到 `dsh`，或配置的 `repo_path` / `dsh_executable` 是否指对；
3. 装的是 DSH 桌面版的话，插件会自动找它内嵌的 CLI，确认安装路径没有改过。

三者都没有时插件会明确报告缺什么，不会静默失败。

## 面板「DSH 侧桥接」显示未就绪

可能的值和含义：

| 显示 | 含义 |
| --- | --- |
| 已就绪 / 已自动修复 / 已自动安装 | 正常 |
| 未检测到 DSH | 机器上没装 DSH，或插件没找到它 |
| 缺少内嵌 bundle | 安装包不完整 |
| 自动安装失败 | 看插件日志里的具体错误 |
| 尚未检查 | 插件还没启动完 |

## 任务能跑，但写不了文件

- `read-only` 下这是**预期行为**，不是故障；
- `workspace-write` 下确认目标文件在 `workspace` 目录**内部**，目录外仍然只读；
- 改了 `workspace` 配置后要让它生效，必要时重载插件。

## 会话延续失效

会话 ID 由 DSH 自己维护，本插件只透传，不额外保存状态。
DSH 侧清了 session 之后，历史会话就找不回来了。

## CLI 回退路径参数不匹配

CLI 路径依赖 `dsh` 的具体参数形状，DSH 还在快速迭代（官方明确说会有破坏性变更）。
如果你的 DSH 版本参数不同，请改用 Python SDK 路径——那是最稳的一条。

## 还有问题？

带上这些信息提 issue：DSH 版本、Python 版本、面板「任务详情」里的错误输出、
`<log_dir>/runs.jsonl` 的对应行。**日志里不含任务正文和模型回复**，可以放心贴。
