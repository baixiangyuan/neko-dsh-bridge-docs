# 桥接协议

两个插件之间**没有私有协议**：它们复用 N.E.K.O. 自己文档化的运行时工具 API。
这条 API 是本地集成协议，只接受回环地址客户端，回调 URL 也必须是回环地址。

## 数据流

```
 N.E.K.O. 侧 (deepseekharness_bridge 插件)                DSH 侧 (neko-bridge 插件)
 ┌──────────────────────────┐                ┌──────────────────────────┐
 │ @llm_tool dsh_run_task   │                │ ctx.tools.register(...)  │
 │   ↓ 启动 dsh 子进程       │                │   ↓ 轮询 /api/tools      │
 │ dsh --profile headless   │ ─────────────► │   ↓ 发现 plugin:* 工具    │
 │   (harness 跑任务)        │   轮询注册表    │   ↓ 镜像为 neko_<name>   │
 └──────────────────────────┘                └──────────────────────────┘
              ▲                                            │
              │        回调 POST callback_url              │
              └────────────────────────────────────────────┘
                        N.E.K.O. main server :48911
```

两个方向各自独立，互不依赖：

| 方向 | 谁调用谁 | 走哪条 API |
| --- | --- | --- |
| **DSH → N.E.K.O.** | dsh agent 调 N.E.K.O. 工具 | `GET /api/tools` 读注册表 + `POST callback_url` 执行 |
| **N.E.K.O. → DSH** | 猫娘让 harness 跑任务 | 本地起 `dsh` 子进程，读它的最终回复 |

## 方向一：DSH 调用 N.E.K.O.

N.E.K.O. 主服务器在 `/api/tools` 提供四个路由：

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| `POST` | `/api/tools/register` | 注册或替换一个远程模型工具 |
| `POST` | `/api/tools/unregister` | 按名称移除工具 |
| `POST` | `/api/tools/clear` | 移除具有指定 `source` 标签的工具 |
| `GET` | `/api/tools` | 列出当前注册项 |

DSH 插件只读注册表，然后 POST 到每个工具的 `callback_url`。

### 注册表示例

`GET /api/tools` 返回按角色分组的工具：

```json
{
  "ok": true,
  "tools_by_role": {
    "YUI": [
      {
        "name": "shell_cmd_run",
        "description": "执行一条 Shell 命令……",
        "source": "plugin:shell_cmd",
        "callback_url": "http://127.0.0.1:48916/api/llm-tools/callback/shell_cmd/shell_cmd_run",
        "is_remote": true
      }
    ]
  }
}
```

### 为什么过滤 `source`

`source: "builtin"` 的工具（如 `recall_memory`）是猫娘自己对话里就有的能力。
把它们镜像进 dsh 会和 dsh 自己的文件、shell 工具重名冲突。所以插件默认
只镜像 `plugin:` 前缀的工具——这正是桥接能补上的那部分能力。

### 参数格式转换

两边参数格式不同，插件负责翻译：

| | N.E.K.O. (JSON Schema) | DSH (扁平参数表) |
| --- | --- | --- |
| 类型 | `{"type": "object", "properties": {...}}` | `{ name: { type: 'string' } }` |
| 必填 | 顶层 `"required": ["a"]` 数组 | 每个属性 `required: true` |
| 描述 | 属性内 `description` | 属性内 `description` |
| 自由参数 | `additionalProperties` | `{ type: 'json' }` |

N.E.K.O. 声明的 JSON Schema 会被转成 dsh 的扁平形式；无法精确对应的类型
（如 `null`、缺省 type）降级为 `json` 原样透传，保证工具仍能加载。

## 方向二：N.E.K.O. 调用 DSH

DSH 侧没有插件 API 需要实现，`deepseekharness_bridge` 直接把 harness 当本地进程跑。
优先级：

1. **Python SDK**（`deepseek_harness.DeepSeekHarness`）——子进程由 SDK 托管
2. **`dsh` CLI**——一次性子进程，任务经临时文件传，不进 argv
3. 都不可用时返回可读错误，不静默失败

CLI 路径下任务通过 `--patch` 覆盖层配置账号栈、模型、思考强度和沙箱，
任务正文经临时文件传入，不进命令行参数。

## 安全边界

- 所有通信限定在 `127.0.0.1` / `::1`。N.E.K.O. 的 `/api/tools` 对非回环
  客户端返回 `403`，非回环 `callback_url` 返回 `422`。
- 不要把 N.E.K.O. 主服务器暴露到局域网或公网：这条 API 是本地集成协议，
  不是远程管理 API。
- DSH 插件不会把凭据写进日志，也不会记录任务正文。
- N.E.K.O. 插件的运行日志只记会话 ID、任务长度、耗时和调用模式。
