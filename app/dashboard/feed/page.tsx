"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore"
import { firestore } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, AlertTriangle, AlertCircle, Info } from "lucide-react"

interface Change {
  id: string
  competitorId: string
  competitorName: string
  url: string
  timestamp: string
  summary: string
  severity: "minor" | "major" | "critical"
  details: string
  impactAreas: string[]
}

export default function FeedPage() {
  const { user } = useAuth()
  const [changes, setChanges] = useState<Change[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChanges = async () => {
      if (!user) return

      try {
        const changesQuery = query(
          collection(firestore, "changes"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc"),
          limit(20),
        )

        const querySnapshot = await getDocs(changesQuery)
        const changesData: Change[] = []

        querySnapshot.forEach((doc) => {
          changesData.push({
            id: doc.id,
            ...doc.data(),
          } as Change)
        })

        setChanges(changesData)
      } catch (error) {
        console.error("Error fetching changes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChanges()
  }, [user])

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-destructive" />
      case "major":
        return <AlertTriangle className="h-5 w-5 text-warning" />
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "major":
        return <Badge variant="default">Major</Badge>
      default:
        return <Badge variant="outline">Minor</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity Feed</h1>
        <p className="text-muted-foreground">Recent changes detected on your competitors&apos; websites.</p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Changes</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
          <TabsTrigger value="major">Major</TabsTrigger>
          <TabsTrigger value="minor">Minor</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          {renderChanges(changes)}
        </TabsContent>
        <TabsContent value="critical" className="mt-4">
          {renderChanges(changes.filter((change) => change.severity === "critical"))}
        </TabsContent>
        <TabsContent value="major" className="mt-4">
          {renderChanges(changes.filter((change) => change.severity === "major"))}
        </TabsContent>
        <TabsContent value="minor" className="mt-4">
          {renderChanges(changes.filter((change) => change.severity === "minor"))}
        </TabsContent>
      </Tabs>
    </div>
  )

  function renderChanges(changesToRender: Change[]) {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )
    }

    if (changesToRender.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Info className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No changes detected yet</h3>
            <p className="mt-2 text-center text-muted-foreground">
              We haven&apos;t detected any changes on your competitors&apos; websites yet.
              <br />
              Check back later or add more competitors to monitor.
            </p>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {changesToRender.map((change) => (
          <Card key={change.id}>
            <CardHeader className="flex flex-row items-start gap-4 pb-2">
              <div className="mt-1">{getSeverityIcon(change.severity)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{change.competitorName}</CardTitle>
                  {getSeverityBadge(change.severity)}
                </div>
                <CardDescription className="mt-1 flex items-center">
                  <a
                    href={change.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm hover:underline"
                  >
                    {new URL(change.url).hostname}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                  <span className="mx-2">•</span>
                  <span>{formatDate(change.timestamp)}</span>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{change.summary}</p>
                <p className="text-sm text-muted-foreground">{change.details}</p>
                {change.impactAreas && change.impactAreas.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {change.impactAreas.map((area) => (
                      <Badge key={area} variant="secondary" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/dashboard/competitors/${change.competitorId}`}>
                <Button variant="outline" size="sm">
                  View Competitor
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }
}
