import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'N.E.K.O. ⇄ DeepSeek Harness',
  description: '把 DeepSeek Harness (dsh) 的 agent 能力桥接到 N.E.K.O. 的双向插件文档',

  // 部署到 Cloudflare Pages / GitHub Pages 的根路径。
  // 自定义域名下用 "/"；仓库子路径（xxx.github.io/repo/）时改成 "/repo/"。
  base: '/',

  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
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
