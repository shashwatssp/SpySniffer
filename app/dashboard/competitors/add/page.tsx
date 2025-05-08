"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { doc, setDoc } from "firebase/firestore"
import { ref, set } from "firebase/database"
import { v4 as uuidv4 } from "uuid"
import { firestore } from "@/lib/firebase"
import { getFirebaseDatabase } from "@/lib/firebase-database"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

export default function AddCompetitorPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url)
      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:"
    } catch (error) {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a competitor",
        variant: "destructive",
      })
      return
    }

    if (!validateUrl(formData.url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const competitorId = uuidv4()
      const competitor = {
        id: competitorId,
        name: formData.name,
        url: formData.url,
        notes: formData.notes,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        lastScan: null,
        changesCount: 0,
        technologies: [],
      }

      // Add to Firestore for structured data
      await setDoc(doc(firestore, "competitors", competitorId), competitor)

      // Add to Realtime Database for scraping queue (only if database is available)
      const database = getFirebaseDatabase()
      if (database) {
        await set(ref(database, `scrapeQueue/${competitorId}`), {
          url: formData.url,
          userId: user.uid,
          status: "pending",
          createdAt: new Date().toISOString(),
        })
      }

      toast({
        title: "Competitor added",
        description: `${formData.name} has been added to your monitoring list.`,
      })

      router.push("/dashboard/competitors")
    } catch (error) {
      console.error("Error adding competitor:", error)
      toast({
        title: "Error",
        description: "Failed to add competitor. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Competitor</h1>
        <p className="text-muted-foreground">Add a new competitor to monitor for changes.</p>
      </div>

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Competitor Details</CardTitle>
            <CardDescription>Enter the details of the competitor you want to monitor.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Competitor Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Acme Inc."
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                name="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">Enter the full URL including https://</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Add any notes about this competitor..."
                value={formData.notes}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/competitors")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Competitor"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
