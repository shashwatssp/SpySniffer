"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BarChart, Target, AlertTriangle, ArrowRight, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  // Mock data for the dashboard
  const stats = [
    {
      title: "Monitored Competitors",
      value: "0",
      description: "Add your first competitor",
      icon: Target,
      change: "neutral",
    },
    {
      title: "Detected Changes",
      value: "0",
      description: "No changes detected yet",
      icon: AlertTriangle,
      change: "neutral",
    },
    {
      title: "Critical Updates",
      value: "0",
      description: "No critical updates",
      icon: BarChart,
      change: "neutral",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting}, {user?.displayName?.split(" ")[0] || "there"}
        </h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your competitors today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>No recent activity to display.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
              <div className="flex flex-col items-center gap-2 text-center">
                <Target className="h-10 w-10 text-muted-foreground" />
                <h3 className="text-lg font-semibold">No competitors added yet</h3>
                <p className="text-sm text-muted-foreground max-w-[20rem]">
                  Add your first competitor to start monitoring changes and get insights.
                </p>
                <Link href="/dashboard/competitors/add">
                  <Button className="mt-2">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Competitor
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Complete these steps to set up your account</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-4 rounded-md border p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">1</div>
              <div className="flex-1">
                <h3 className="font-medium">Add your first competitor</h3>
                <p className="text-sm text-muted-foreground">Start monitoring your competitors</p>
              </div>
              <Link href="/dashboard/competitors/add">
                <Button variant="ghost" size="icon">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-4 rounded-md border p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">2</div>
              <div className="flex-1">
                <h3 className="font-medium">Set up notifications</h3>
                <p className="text-sm text-muted-foreground">Configure how you want to be notified</p>
              </div>
              <Link href="/dashboard/settings/notifications">
                <Button variant="ghost" size="icon">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-4 rounded-md border p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">3</div>
              <div className="flex-1">
                <h3 className="font-medium">Complete your profile</h3>
                <p className="text-sm text-muted-foreground">Add more details about your business</p>
              </div>
              <Link href="/dashboard/settings/profile">
                <Button variant="ghost" size="icon">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
