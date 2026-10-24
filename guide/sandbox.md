# 文件权限（沙箱）

沙箱决定 harness 能读写哪些文件。面板「文件权限」卡片可切，选中立即生效。

## 三档权限

| 值 | 名称 | 能做什么 |
| --- | --- | --- |
| `read-only` | 只读 | 只能查看和分析文件，**不能改动任何文件** |
| `workspace-write` | 工作区可写（默认） | 可读写工作区目录内的文件，其他位置仍只读 |
| `danger-full-access` | 完全访问 | 不限制文件位置 |

工作区目录由配置里的 `workspace` 决定，见[配置](/guide/config)。

## 只读就是只读

**选 `read-only`，harness 就真的只能读。**

插件在生成的 patch 里显式声明了全部三个档位为合法的 permission preset，
并把默认预设指向你选中的那一档：

```yaml
- id: permission-presets
  config:
    presets:
      read-only:
        sandbox: read-only
        approval: never
      workspace-write:
        sandbox: workspace-write
        approval: never
      danger-full-access:
        sandbox: danger-full-access
        approval: never
    defaultPreset: read-only      # ← 跟着你的选择走
```

::: tip 为什么需要显式声明
DSH 原生的预设表里**只有** `workspace-write` 和 `danger-full-access` 两档，
没有 `read-only`。缺了这一档时，DSH 启动会报
`permission: composed sandbox and approval defaults match no preset`。

早期版本为了绕开这个报错，会把用户选的只读**偷偷改写成工作区可写**——
那等于权限选择失效。现在三档都补齐了，你的选择被原样应用。
:::

## 审批策略为什么是 never

三档预设的 `approval` 都是 `never`，这是**刻意**的，不是漏配：

- 插件以一次性 CLI 方式调 harness，**没有审批应答通道**；
- DSH 的 `ask` 策略在没有应答方时会 fail closed——所有升级请求一律拒绝，
  任务直接失败；
- `never` 让需要审批的操作自动放行，同时沙箱边界仍然由 `sandbox` 强制执行。

也就是说：**权限边界靠沙箱模式保证，不靠弹窗**。想让 harness 完全碰不到某些文件，
就用 `read-only` 或收窄 `workspace`，而不是指望审批。

## 切换权限

面板「文件权限」卡片点目标档位，或调 `panel_set_sandbox` 入口：

```json
{"mode": "read-only"}
```

填未知值会被拒绝并提示可用值，不会静默回退。

## 怎么确认真的生效

跑一个要写文件的任务（比如「在当前目录创建一个 test.txt」）：

- `read-only` 下应当失败，并报告无法写入；
- `workspace-write` 下应当在**工作区目录内**创建成功；
- 在工作区目录**之外**创建，任何模式下都应失败。

如果 `read-only` 下文件被写成功了，那是 bug，请反馈。
