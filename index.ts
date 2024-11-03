/**
 * AI News Aggregator CLI
 * 
 * This script fetches and scrapes AI-related news from various sources,
 * filters the content based on relevance keywords, and writes the
 * aggregated updates as well-formatted .mdx files into a specified directory.
 */

import Parser from 'rss-parser';
import * as cheerio from 'cheerio';

import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

// Initialize RSS Parser with custom options
const parser = new Parser({
  customFields: {
    item: ['title', 'description', 'link', 'pubDate']
  }
});

// Define logging utility
const log = {
  info: (msg: any) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
  error: (msg: any) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`),
};

// Directory to store MDX files
const OUTPUT_DIR = 'ai_news_updates';

// Function to sanitize filenames
const sanitizeFilename = (filename: string) => {
  return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};

// Fetch and parse RSS feeds
const fetchRSS = async (url: string) => {
  log.info(`Fetching RSS from ${url}`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const xmlText = await response.text();
    const feed = await parser.parseString(xmlText);
    
    // Handle different RSS feed structures
    const items = feed.items || feed.entries || [];
    const results = items.slice(0, 10).map((item: any) => {
      return {
        title: item.title || 'No Title',
        description: item.description || item.contentSnippet || item.content || 'No Description',
        link: item.link || url,
        pubDate: item.pubDate ? new Date(item.pubDate) : new Date()
      };
    });

    // Clean up descriptions (remove HTML and limit length)
    return results.map(item => ({
      ...item,
      description: item.description
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .slice(0, 200) + (item.description.length > 200 ? '...' : '')
    }));
  } catch (error: any) {
    log.error(`Error fetching RSS from ${url}: ${error.message}`);
    return [];
  }
};

// Scrape websites using selectors
const scrapeWebsite = async (
  url: string,
  selectors: { article: string; title: string; description: string; link: string; }
) => {
  log.info(`Scraping website ${url}`);
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    const articles = selectors.article ? $(selectors.article).slice(0, 10) : $.root();

    const results = articles.map((_: any, elem: any) => {
      const element = $(elem);
      const title = selectors.title ? element.find(selectors.title).text().trim() : 'No Title';
      let description = selectors.description
        ? element.find(selectors.description).text().trim()
        : 'No Description';
      if (description.length > 200) {
        description = description.slice(0, 200) + '...';
      }
      let link = selectors.link ? element.find(selectors.link).attr('href') : url;
      if (link && typeof link === 'string' && !link.startsWith('http')) {
        link = new URL(link, url).href;
      }
      const pubDate = new Date(); // Scraped content may not have a publication date
      return { title, description, link, pubDate };
    }).get();

    return results;
  } catch (error: any) {
    log.error(`Error scraping website ${url}: ${error.message}`);
    return [];
  }
};

// Check if content is relevant based on keywords
const isRelevant = (text: string, keywords: any[]) => {
  const lowerText = text.toLowerCase();
  return keywords.some((keyword: string) => lowerText.includes(keyword.toLowerCase()));
};

// Main function to aggregate news
const main = async () => {
  log.info("Starting AI news aggregation");

  // Ensure the output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    try {
      await mkdir(OUTPUT_DIR, { recursive: true });
      log.info(`Created directory: ${OUTPUT_DIR}`);
    } catch (error: any) {
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
  let allNews: any[] = [];

  // Process each source
  for (const source of sources) {
    log.info(`Processing source: ${source.url}`);

    let content: any[] = [];
    if (source.type === 'rss') {
      content = await fetchRSS(source.url);
    } else if (source.type === 'scrape' && source.selectors) {
      content = await scrapeWebsite(source.url, source.selectors);
    }

    // Filter content based on relevance
    const relevantContent = content.filter((item: { title: any; description: any; }) => isRelevant(`${item.title} ${item.description}`, keywords));

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
    } catch (error: any) {
      log.error(`Failed to write file ${filePath}: ${error.message}`);
    }
  }

  log.info(`AI news aggregation completed. ${allNews.length} articles written to the '${OUTPUT_DIR}' directory.`);
};

// Execute the main function
main().catch((error: any) => {
  log.error(`An unexpected error occurred: ${error.message}`);
  process.exit(1);
});
