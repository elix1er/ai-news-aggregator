#!/usr/bin/env bun

/**
 * AI News Aggregator CLI
 * 
 * This script fetches and scrapes AI-related news from various sources,
 * filters the content based on relevance keywords, and writes the
 * aggregated updates as well-formatted .mdx files into a specified directory.
 */

import Parser from 'rss-parser';
import cheerio from 'cheerio';
import { writeFile, mkdir, existsSync } from 'fs/promises';
import { join } from 'path';

// Initialize RSS Parser
const parser = new Parser();

// Define logging utility
const log = {
  info: (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
  error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`),
};

// Directory to store MDX files
const OUTPUT_DIR = 'ai_news_updates';

// Function to sanitize filenames
const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};

// Fetch and parse RSS feeds
const fetchRSS = async (url) => {
  log.info(`Fetching RSS from ${url}`);
  try {
    const feed = await parser.parseURL(url);
    const results = feed.entries.slice(0, 10).map(entry => {
      const title = entry.title || 'No Title';
      const description = entry.contentSnippet
        ? entry.contentSnippet.slice(0, 200) + (entry.contentSnippet.length > 200 ? '...' : '')
        : 'No Description';
      const link = entry.link || url;
      const pubDate = entry.pubDate ? new Date(entry.pubDate) : new Date();
      return { title, description, link, pubDate };
    });
    return results;
  } catch (error) {
    log.error(`Error fetching RSS from ${url}: ${error.message}`);
    return [];
  }
};

// Scrape websites using selectors
const scrapeWebsite = async (url, selectors) => {
  log.info(`Scraping website ${url}`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    const articles = selectors.article ? $(selectors.article).slice(0, 10) : [$.root()];

    const results = articles.map((_, elem) => {
      const element = $(elem);
      const title = selectors.title ? element.find(selectors.title).text().trim() : 'No Title';
      let description = selectors.description
        ? element.find(selectors.description).text().trim()
        : 'No Description';
      if (description.length > 200) {
        description = description.slice(0, 200) + '...';
      }
      let link = selectors.link ? element.find(selectors.link).attr('href') : url;
      if (link && !link.startsWith('http')) {
        link = new URL(link, url).href;
      }
      const pubDate = new Date(); // Scraped content may not have a publication date
      return { title, description, link, pubDate };
    }).get();

    return results;
  } catch (error) {
    log.error(`Error scraping website ${url}: ${error.message}`);
    return [];
  }
};

// Check if content is relevant based on keywords
const isRelevant = (text, keywords) => {
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
};

// Main function to aggregate news
const main = async () => {
  log.info("Starting AI news aggregation");

  // Ensure the output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    try {
      await mkdir(OUTPUT_DIR, { recursive: true });
      log.info(`Created directory: ${OUTPUT_DIR}`);
    } catch (error) {
      log.error(`Failed to create directory ${OUTPUT_DIR}: ${error.message}`);
      return;
    }
  }

  // Define news sources
  const sources = [
    { type: "rss", url: "https://techcrunch.com/category/artificial-intelligence/feed/" },
    { type: "rss", url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml" },
    { 
      type: "scrape", 
      url: "https://www.wired.com/category/artificial-intelligence/", 
      selectors: { 
        article: "div.summary-item", 
        title: "h3", 
        description: "div.summary-item__dek", 
        link: "a" 
      }
    },
    { type: "rss", url: "https://blogs.nvidia.com/feed/" },
    { type: "rss", url: "https://openai.com/blog/rss.xml" },
    { type: "rss", url: "https://www.artificialintelligence-news.com/feed/" },
    { type: "rss", url: "https://www.ai-trends.com/feed/" },
    { type: "rss", url: "https://www.technologyreview.com/topic/artificial-intelligence/feed" },
    { type: "rss", url: "https://ai.googleblog.com/feeds/posts/default" },
    { type: "rss", url: "https://www.microsoft.com/en-us/ai/ai-blog-feed" },
    { type: "rss", url: "https://aws.amazon.com/blogs/machine-learning/feed/" },
    { type: "rss", url: "https://venturebeat.com/category/ai/feed/" },
    { type: "rss", url: "https://www.zdnet.com/topic/artificial-intelligence/rss.xml" },
    { type: "rss", url: "https://www.forbes.com/ai/feed/" },
    // AI-observer blogs
    { type: "rss", url: "https://www.oneusefulthingatime.com/feed" }, // Ethan Mollick's Substack
    { type: "rss", url: "https://garymarcus.substack.com/feed" }, // Gary Marcus's Substack
    { type: "rss", url: "https://www.aisnakeoil.com/feed" }, // AI Snake Oil blog
    // New sources
    { type: "rss", url: "https://www.sciencedaily.com/rss/computers_math/artificial_intelligence.xml" },
    { type: "rss", url: "https://www.newscientist.com/subject/technology/feed/" },
    { type: "rss", url: "https://www.infoworld.com/category/artificial-intelligence/index.rss" },
    { type: "rss", url: "https://www.nature.com/subjects/artificial-intelligence.rss" },
    { type: "rss", url: "https://www.reddit.com/r/artificial/top/.rss" },
    { 
      type: "scrape", 
      url: "https://aimagazine.com/ai-and-machine-learning",
      selectors: { 
        article: "div.article-card", 
        title: "h2", 
        description: "p", 
        link: "a" 
      }
    },
  ];

  // Define relevance keywords
  const keywords = [
    "artificial intelligence", "AI", "machine learning", "deep learning", "neural network", 
    "AI ethics", "AI legislation", "AI regulation", "AI risk", "AI safety",
    "AI progress", "AI capabilities", "AI limitations", "AI hype", "AI reality"
  ];

  // Collect all news items
  let allNews = [];

  // Process each source
  for (const source of sources) {
    log.info(`Processing source: ${source.url}`);

    let content = [];
    if (source.type === 'rss') {
      content = await fetchRSS(source.url);
    } else if (source.type === 'scrape') {
      content = await scrapeWebsite(source.url, source.selectors);
    }

    // Filter content based on relevance
    const relevantContent = content.filter(item => isRelevant(`${item.title} ${item.description}`, keywords));

    if (relevantContent.length === 0) {
      log.info(`No relevant content found for source: ${source.url}`);
      continue;
    }

    allNews = allNews.concat(relevantContent);
  }

  if (allNews.length === 0) {
    log.info("No relevant news found. Exiting.");
    return;
  }

  // Write each news item as a separate .mdx file
  for (const news of allNews) {
    const { title, description, link, pubDate } = news;
    const dateStr = pubDate.toISOString().split('T')[0];
    const filenameBase = sanitizeFilename(`${dateStr}-${title}`);
    const filename = `${filenameBase}.mdx`;
    const filePath = join(OUTPUT_DIR, filename);

    const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${pubDate.toISOString()}"
link: "${link}"
---

`;

    const contentBody = `${description}\n\n[Read more](${link})\n`;

    try {
      await writeFile(filePath, frontmatter + contentBody, 'utf-8');
      log.info(`Written: ${filePath}`);
    } catch (error) {
      log.error(`Failed to write file ${filePath}: ${error.message}`);
    }
  }

  log.info(`AI news aggregation completed. ${allNews.length} articles written to the '${OUTPUT_DIR}' directory.`);
};

// Execute the main function
main().catch(error => {
  log.error(`An unexpected error occurred: ${error.message}`);
  Bun.exit(1);
});
