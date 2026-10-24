---
layout: home

hero:
  name: 'N.E.K.O. ⇄ DeepSeek Harness'
  text: '双向插件桥接文档'
  tagline: 让 N.E.K.O. 的猫娘把长任务交给本地 DeepSeek Harness 执行，也让 dsh agent 反调 N.E.K.O. 的插件工具。
  actions:
    - theme: brand
      text: 开始安装
      link: /guide/install
    - theme: alt
      text: 桥接协议
      link: /protocol

features:
  - icon: 🧩
    title: 开箱即用
    details: 启动 N.E.K.O. 侧插件是唯一需要人工做的步骤——DSH 侧 bundle 会自动安装，harness 位置自动探测。
  - icon: 🔑
    title: 复用账号登录
    details: 默认走 DeepSeek 账号路由，直接复用你已在 DSH 里完成的登录，不需要 API key。
  - icon: 🗂️
    title: 权限可控
    details: 只读 / 工作区可写 / 完全访问三档沙箱。选只读就是只读，不会被悄悄改成别的模式。
  - icon: ⏳
    title: 提交即等结果
    details: 面板提交任务后会一直等到 harness 跑完，直接返回答案、耗时和状态，而不是丢给你一个会话 ID。
---
