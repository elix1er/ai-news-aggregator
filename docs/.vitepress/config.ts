import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AI News Aggregator',
  description: 'Your comprehensive source for AI news and updates',
  
  // Clean URLs
  cleanUrls: true,
  
  // GitHub Pages base (adjust if repo name is different)
  base: '/ai-news-aggregator/',
  
  // Theme configuration
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Latest Articles', link: '/articles/' },
      { text: 'About', link: '/about' },
      { text: 'GitHub', link: 'https://github.com/elix1er/ai-news-aggregator' }
    ],

    sidebar: {
      '/articles/': [
        {
          text: 'Recent Articles',
          items: [
            { text: 'Loading articles...', link: '/articles/' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/elix1er/ai-news-aggregator' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: 'AI News Aggregator - Powered by VitePress',
      copyright: 'Copyright © 2024-present'
    }
  },

  // Markdown configuration
  markdown: {
    theme: 'github-dark',
    lineNumbers: true
  }
})