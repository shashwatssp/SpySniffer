import * as cheerio from "cheerio"

export interface ScrapingResult {
  html: string
  text: string
  title: string
  technologies: string[]
  metadata: {
    description?: string
    keywords?: string
    [key: string]: string | undefined
  }
  timestamp: string
}

export async function scrapeWebsite(url: string): Promise<ScrapingResult> {
  try {
    // Fetch the website content
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
    }

    const html = await response.text()

    // Parse the HTML with cheerio
    const $ = cheerio.load(html)

    // Extract the text content
    const text = $("body").text().replace(/\s+/g, " ").trim()

    // Extract the title
    const title = $("title").text().trim()

    // Extract metadata
    const metadata: { [key: string]: string } = {}
    $("meta").each((_, element) => {
      const name = $(element).attr("name") || $(element).attr("property")
      const content = $(element).attr("content")
      if (name && content) {
        metadata[name] = content
      }
    })

    // Mock technology detection (in a real app, this would use a service like Wappalyzer or BuiltWith API)
    const technologies = detectTechnologies($)

    return {
      html,
      text,
      title,
      technologies,
      metadata,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error(`Error scraping ${url}:`, error)
    throw error
  }
}

function detectTechnologies($: cheerio.CheerioAPI): string[] {
  const technologies: string[] = []

  // Check for common technologies based on HTML patterns
  if ($('meta[name="generator"][content*="WordPress"]').length) {
    technologies.push("WordPress")
  }

  if ($('link[href*="wp-content"]').length || $('script[src*="wp-content"]').length) {
    technologies.push("WordPress")
  }

  if ($('meta[name="generator"][content*="Shopify"]').length) {
    technologies.push("Shopify")
  }

  if ($('link[href*="shopify"]').length || $('script[src*="shopify"]').length) {
    technologies.push("Shopify")
  }

  if ($('script[src*="react"]').length) {
    technologies.push("React")
  }

  if ($('script[src*="angular"]').length) {
    technologies.push("Angular")
  }

  if ($('script[src*="vue"]').length) {
    technologies.push("Vue.js")
  }

  if ($('script[src*="jquery"]').length) {
    technologies.push("jQuery")
  }

  if ($('script[src*="bootstrap"]').length || $('link[href*="bootstrap"]').length) {
    technologies.push("Bootstrap")
  }

  if ($('script[src*="tailwind"]').length || $('link[href*="tailwind"]').length) {
    technologies.push("Tailwind CSS")
  }

  // Remove duplicates
  return [...new Set(technologies)]
}
