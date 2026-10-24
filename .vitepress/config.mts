import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'N.E.K.O. ⇄ DeepSeek Harness',
  description: '把 DeepSeek Harness (dsh) 的 agent 能力桥接到 N.E.K.O. 的双向插件文档',

  // 部署根路径。
  // GitHub Pages 走仓库子路径（baixiangyuan.github.io/neko-dsh-bridge-docs/），
  // 所以这里必须是 /neko-dsh-bridge-docs/。
  // 改用自定义域名 / Cloudflare Pages 项目域名时，改回 '/'。
  base: '/neko-dsh-bridge-docs/',

  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,

  // 注意 base 不自动作用于 head：这里的 href 要写完整路径，
  // 换成别的部署路径时记得同步改。
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/neko-dsh-bridge-docs/logo.svg' }],
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: 'N.E.K.O. ⇄ DSH 桥接',

    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/install', activeMatch: '/guide/' },
      { text: '协议', link: '/protocol' },
      { text: 'GitHub', link: 'https://github.com/baixiangyuan/n.e.k.o_plugin_deepseekharness_bridge' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '安装', link: '/guide/install' },
            { text: '配置', link: '/guide/config' },
            { text: '模型', link: '/guide/models' },
            { text: '文件权限（沙箱）', link: '/guide/sandbox' },
            { text: '运行与验证', link: '/guide/run' },
            { text: '故障排查', link: '/guide/troubleshooting' },
          ],
        },
      ],
    },

    outline: {
      level: [2, 3],
      label: '本页目录',
    },

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    lastUpdated: {
      text: '最后更新',
    },

    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    externalLinkIcon: true,
  },
})
