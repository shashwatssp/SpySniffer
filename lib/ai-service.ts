import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export interface ChangeAnalysisResult {
  summary: string
  severity: "minor" | "major" | "critical"
  details: string
  impactAreas: string[]
}

export async function analyzeChanges(
  previousHtml: string,
  currentHtml: string,
  url: string,
): Promise<ChangeAnalysisResult> {
  try {
    // Truncate HTML if too large
    const truncatedPrevious = previousHtml.length > 10000 ? previousHtml.substring(0, 10000) + "..." : previousHtml
    const truncatedCurrent = currentHtml.length > 10000 ? currentHtml.substring(0, 10000) + "..." : currentHtml

    // Create a prompt for the AI
    const prompt = `
      Analyze the differences between these two versions of a webpage from ${url}.
      
      PREVIOUS VERSION:
      ${truncatedPrevious}
      
      CURRENT VERSION:
      ${truncatedCurrent}
      
      Provide a detailed analysis of the changes in JSON format with the following structure:
      {
        "summary": "A brief summary of the main changes",
        "severity": "minor|major|critical",
        "details": "Detailed explanation of what changed",
        "impactAreas": ["area1", "area2"]
      }
      
      Severity levels:
      - minor: Small text changes, image updates, or style modifications
      - major: New sections, product changes, or significant content updates
      - critical: Price changes, policy updates, or major product/service modifications
      
      Impact areas could include: pricing, products, services, policies, contact info, etc.
      
      Only return the JSON object, nothing else.
    `

    // Use the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const result = await model.generateContent(prompt)
    const response = result.response.text()

    // Parse the JSON response
    try {
      // Extract JSON if it's wrapped in markdown code blocks
      const jsonMatch = response.match(/```json\n([\s\S]*)\n```/) ||
        response.match(/```\n([\s\S]*)\n```/) || [null, response]

      const jsonStr = jsonMatch[1] || response
      const analysis = JSON.parse(jsonStr)

      return {
        summary: analysis.summary || "No significant changes detected",
        severity: analysis.severity || "minor",
        details: analysis.details || "No detailed analysis available",
        impactAreas: analysis.impactAreas || [],
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError)
      return {
        summary: "Error analyzing changes",
        severity: "minor",
        details: "The system encountered an error while analyzing the changes.",
        impactAreas: [],
      }
    }
  } catch (error) {
    console.error("Error in AI analysis:", error)
    return {
      summary: "Error analyzing changes",
      severity: "minor",
      details: "The system encountered an error while analyzing the changes.",
      impactAreas: [],
    }
  }
}
