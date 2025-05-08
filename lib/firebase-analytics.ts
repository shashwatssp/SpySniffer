"use client"

import { getApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"

// This function should only be called on the client side
export function initializeAnalytics() {
  try {
    const app = getApp()
    const analytics = getAnalytics(app)
    return analytics
  } catch (error) {
    console.error("Analytics initialization error:", error)
    return null
  }
}
