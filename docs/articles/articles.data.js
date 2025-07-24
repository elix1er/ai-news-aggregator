import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

export default {
  load() {
    try {
      const articlesDir = join(process.cwd(), 'ai_news_updates')
      const files = readdirSync(articlesDir)
        .filter(file => file.endsWith('.mdx'))
        .sort((a, b) => b.localeCompare(a)) // Sort by filename (newest first)
        .slice(0, 100) // Limit to recent 100 articles for performance

      return files.map(file => {
        const filePath = join(articlesDir, file)
        const content = readFileSync(filePath, 'utf-8')
        const { data, content: articleContent } = matter(content)
        
        // Extract description from content (first 200 chars, remove markdown)
        const description = articleContent
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links
          .replace(/[#*_`]/g, '') // Remove markdown formatting
          .trim()
          .substring(0, 200)
          .replace(/\s+/g, ' ') + (articleContent.length > 200 ? '...' : '')
        
        return {
          title: data.title || 'Untitled',
          link: data.link || '#',
          date: data.date || new Date().toISOString(),
          description: description || 'No description available'
        }
      })
    } catch (error) {
      console.error('Error loading articles:', error)
      return []
    }
  }
}