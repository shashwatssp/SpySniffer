import { type NextRequest, NextResponse } from "next/server"
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore"
import { firestore } from "@/lib/firebase"
import { scrapeWebsite } from "@/lib/scraper-service"
import { analyzeChanges } from "@/lib/ai-service"

export async function POST(request: NextRequest) {
  try {
    const { competitorId, userId } = await request.json()

    if (!competitorId || !userId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Get competitor data from Firestore
    const competitorRef = doc(firestore, "competitors", competitorId)
    const competitorSnap = await getDoc(competitorRef)

    if (!competitorSnap.exists()) {
      return NextResponse.json({ error: "Competitor not found" }, { status: 404 })
    }

    const competitor = competitorSnap.data()

    // Verify the competitor belongs to the user
    if (competitor.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Scrape the website
    const scrapeResult = await scrapeWebsite(competitor.url)

    // Store the scrape result in Firestore instead of Realtime Database
    const scrapeId = Date.now().toString()
    await addDoc(collection(firestore, "scrapes"), {
      competitorId,
      scrapeId,
      timestamp: scrapeResult.timestamp,
      ...scrapeResult,
    })

    // Update the competitor's last scan time
    await updateDoc(competitorRef, {
      lastScan: scrapeResult.timestamp,
      technologies: scrapeResult.technologies,
    })

    // Get the previous scrape from Firestore
    const previousScrapesQuery = collection(firestore, "scrapes")
    const previousScrapesSnapshot = await getDoc(doc(previousScrapesQuery, competitorId))
    const previousScrape = previousScrapesSnapshot.exists() ? previousScrapesSnapshot.data() : null

    let changeAnalysis = null

    // If there's a previous scrape, analyze the changes
    if (previousScrape) {
      changeAnalysis = await analyzeChanges(previousScrape.html, scrapeResult.html, competitor.url)

      // If changes were detected, store the analysis
      if (changeAnalysis.summary !== "No significant changes detected") {
        // Add to changes collection in Firestore
        await addDoc(collection(firestore, "changes"), {
          competitorId,
          userId,
          competitorName: competitor.name,
          url: competitor.url,
          previousScrapeId: previousScrape.scrapeId,
          currentScrapeId: scrapeId,
          timestamp: scrapeResult.timestamp,
          ...changeAnalysis,
        })

        // Update the changes count for the competitor
        await updateDoc(competitorRef, {
          changesCount: (competitor.changesCount || 0) + 1,
        })
      }
    }

    return NextResponse.json({
      success: true,
      scrapeId,
      changeAnalysis,
    })
  } catch (error) {
    console.error("Error in scrape API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
