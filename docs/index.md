---
layout: home

hero:
  name: "AI News Aggregator"
  text: "Your comprehensive source for AI news"
  tagline: "Automatically aggregated from trusted sources, updated every 3 hours"
  actions:
    - theme: brand
      text: Browse Latest Articles
      link: /articles/
    - theme: alt
      text: About This Project
      link: /about

features:
  - title: 🚀 Always Fresh
    details: Automatically updated every 3 hours with the latest AI news from multiple trusted sources
  - title: 🔍 Smart Filtering
    details: Articles are filtered for AI relevance using intelligent keyword matching
  - title: 📱 Mobile Friendly
    details: Responsive design that works perfectly on desktop, tablet, and mobile devices
  - title: 🔎 Searchable
    details: Find specific topics quickly with built-in search functionality
  - title: 🌟 Open Source
    details: Fully open source project hosted on GitHub with automated deployments
  - title: ⚡ Fast Loading
    details: Static site generation for lightning-fast performance and SEO optimization
---

<script setup>
import { data as articles } from './articles/articles.data.js'

const recentArticles = articles.slice(0, 6)
</script>

## Latest Articles

<div class="recent-articles">
  <div v-for="article in recentArticles" :key="article.link" class="article-card">
    <h3><a :href="article.link" target="_blank" rel="noopener noreferrer">{{ article.title }}</a></h3>
    <p class="article-date">{{ new Date(article.date).toLocaleDateString() }}</p>
    <p class="article-description">{{ article.description }}</p>
  </div>
</div>

<div class="view-all">
  <a href="/articles/" class="view-all-link">View All Articles →</a>
</div>

## Data Sources

Our aggregator pulls from these trusted sources:

- **TechCrunch AI** - Latest AI startup and industry news
- **The Verge AI** - Consumer AI technology updates  
- **OpenAI Blog** - Official updates from OpenAI
- **Google AI Blog** - Research and product announcements
- **NVIDIA Blog** - AI hardware and software developments
- **AWS ML Blog** - Cloud AI services and tutorials
- **Academic Sources** - Research papers and breakthroughs
- **AI Publications** - Professional analysis and insights

<style>
.recent-articles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.article-card {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  transition: all 0.2s ease;
}

.article-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.article-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  line-height: 1.4;
}

.article-card h3 a {
  text-decoration: none;
  color: var(--vp-c-text-1);
}

.article-card h3 a:hover {
  color: var(--vp-c-brand-1);
}

.article-date {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
}

.article-description {
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin: 0;
}

.view-all {
  text-align: center;
  margin: 2rem 0;
}

.view-all-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--vp-c-brand-1);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.view-all-link:hover {
  background: var(--vp-c-brand-2);
}
</style>