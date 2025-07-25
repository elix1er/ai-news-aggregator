# Latest Articles

Here are the most recent AI news articles from our aggregator:

<script setup>
import { data as articles } from './articles.data.js'
</script>

<div v-if="articles && articles.length > 0">
  <div v-for="article in articles.slice(0, 50)" :key="article.link" class="article-item">
    <h3><a :href="article.link" target="_blank" rel="noopener noreferrer">{{ article.title }}</a></h3>
    <p class="article-meta">{{ new Date(article.date).toLocaleDateString() }}</p>
    <p class="article-description">{{ article.description }}</p>
  </div>
</div>

<div v-else>
  <p>Loading articles...</p>
</div>

<style scoped>
.article-item {
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 1.5rem 0;
}

.article-item:last-child {
  border-bottom: none;
}

.article-item h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.article-item h3 a {
  text-decoration: none;
  color: var(--vp-c-brand-1);
}

.article-item h3 a:hover {
  text-decoration: underline;
}

.article-meta {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
}

.article-description {
  margin: 0;
  color: var(--vp-c-text-2);
}
</style>