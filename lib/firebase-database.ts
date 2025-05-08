"use client"

import { getDatabase } from "firebase/database"
import { app } from "./firebase"

// This function should only be called on the client side
export function getFirebaseDatabase() {
  try {
    return getDatabase(app)
  } catch (error) {
    console.error("Database initialization error:", error)
    return null
  }
}
