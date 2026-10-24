# 运行与验证

## 提交任务

在面板「运行任务」卡片里写任务内容，点「交给 harness 执行」。

**提交后会一直等到 harness 跑完**，然后直接显示最终回复、耗时和状态——
不会只丢给你一个会话 ID 让你自己去翻。任务长的可能要几分钟，面板会自动刷新进度。

想让模型在对话里直接调，用 LLM 工具 `dsh_run_task`：

> 用 dsh_run_task 总结一下当前工作区的结构

## 插件入口一览

| 入口 | 类型 | 用途 |
| --- | --- | --- |
| `run_task` | plugin entry | 执行一次 harness 任务，返回最终回复 |
| `status` | plugin entry | 报告 SDK / CLI 可用性与历史运行记录 |
| `dsh_run_task` | LLM tool | `run_task` 的对话版本，供模型直接调用 |
| `panel_refresh` | UI action | 重新读取 harness 可用性与运行记录 |
| `panel_run_task` | UI action | 面板运行任务 |
| `panel_set_model` | UI action | 切换模型 |
| `panel_set_effort` | UI action | 切换思考强度 |
| `panel_set_sandbox` | UI action | 切换文件权限 |

## 验证 N.E.K.O. → DSH

触发 `status` 入口，应返回：

```json
{"sdk_available": true, "dsh_executable": "...", "runs_recorded": 0}
```

`sdk_available` 为 `false` 但 `dsh_executable` 有值时走 CLI 回退路径，也能用。
两个都没有时，`status` 会明确告诉你缺什么。

再触发 `run_task`，例如让 harness「总结当前工作区」，返回的 `response`
就是 harness 的最终回复。

## 验证 DSH → N.E.K.O.

先在 N.E.K.O. 里确认有插件工具注册着：

```powershell
Invoke-RestMethod http://127.0.0.1:48911/api/tools |
  Select-Object -ExpandProperty tools_by_role |
  ForEach-Object { $_.Values } | Where-Object source -like 'plugin:*' |
  Select-Object name, source
```

然后在 DSH 里让模型用其中一个工具：

> 用 neko_shell_cmd_list_dir 看一下桌面有什么文件

返回内容说明调用链走通了。

## 日志

每次运行追加一行 JSON 到 `<log_dir>/runs.jsonl`，只记录会话 ID、任务长度、
耗时和调用模式，**不记录任务正文和模型回复**。
