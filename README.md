# AI News Aggregator

A comprehensive, automated AI news aggregation system that fetches the latest artificial intelligence news from trusted sources and presents them in a beautiful, searchable website.

## 🌟 Features

- **Automated Collection**: Fetches news every 3 hours from 20+ trusted AI sources
- **Smart Filtering**: Articles filtered for AI relevance using keyword matching
- **Modern Interface**: Beautiful VitePress-powered website with search functionality
- **Mobile Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Lightning Fast**: Static site generation for optimal performance
- **SEO Optimized**: Built-in SEO features for better search engine visibility

## 🚀 Live Site

Visit the live site at: https://elix1er.github.io/ai-news-aggregator/

## 📰 Data Sources

We aggregate content from:

- TechCrunch AI
- The Verge AI  
- OpenAI Blog
- Google AI Blog
- NVIDIA Blog
- AWS Machine Learning Blog
- MIT Technology Review
- Academic publications
- And many more...

## 🛠️ Technology Stack

- **Backend**: TypeScript with Bun/Node.js runtime
- **Frontend**: VitePress (Vue.js based static site generator)
- **Hosting**: GitHub Pages
- **Automation**: GitHub Actions for CI/CD
- **Content**: MDX files with frontmatter metadata

## 🏃‍♂️ Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/elix1er/ai-news-aggregator.git
   cd ai-news-aggregator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run docs:dev
   ```

4. **Build for production**
   ```bash
   npm run docs:build
   ```

## 📝 Scripts

- `npm run docs:dev` - Start VitePress development server
- `npm run docs:build` - Build static site for production
- `npm run docs:preview` - Preview production build locally
- `npm run fetch-news` - Manually run news fetcher

## 🤖 Automation

The system automatically:
1. **Fetches News**: Every 3 hours via GitHub Actions
2. **Processes Content**: Extracts and filters relevant articles
3. **Updates Site**: Rebuilds and deploys when new content is available
4. **Maintains Archive**: Keeps historical articles organized by date

## 📁 Project Structure

```
├── .github/workflows/     # GitHub Actions workflows
│   ├── deploy.yml        # VitePress deployment
│   └── fetcher.yml       # News fetching automation
├── docs/                 # VitePress documentation
│   ├── .vitepress/       # VitePress configuration
│   ├── articles/         # Article listing and data
│   ├── about.md          # About page
│   └── index.md          # Homepage
├── ai_news_updates/      # Generated MDX articles
├── index.ts              # News fetcher script
└── package.json          # Dependencies and scripts
```

## 🤝 Contributing

Contributions are welcome! Please feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- [Live Website](https://elix1er.github.io/ai-news-aggregator/)
- [GitHub Repository](https://github.com/elix1er/ai-news-aggregator)
- [Issues](https://github.com/elix1er/ai-news-aggregator/issues)

---

Built with ❤️ for the AI community