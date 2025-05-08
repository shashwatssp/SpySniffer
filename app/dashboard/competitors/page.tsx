"use client"

import Link from "next/link"
import { PlusCircle, Target, MoreHorizontal, ExternalLink, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function CompetitorsPage() {
  // Mock data - in a real app, this would come from Firebase
  const competitors: any[] = []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Competitors</h1>
          <p className="text-muted-foreground">Monitor and track changes on your competitors&apos; websites.</p>
        </div>
        <Link href="/dashboard/competitors/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Competitor
          </Button>
        </Link>
      </div>

      {competitors.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No competitors added yet</CardTitle>
            <CardDescription>Add your first competitor to start monitoring changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
              <div className="flex flex-col items-center gap-2 text-center">
                <Target className="h-10 w-10 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Start monitoring competitors</h3>
                <p className="text-sm text-muted-foreground max-w-[20rem]">
                  Add your competitors&apos; websites to track changes and get AI-powered insights.
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
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {competitors.map((competitor) => (
            <Card key={competitor.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle>{competitor.name}</CardTitle>
                  <CardDescription className="mt-1">
                    <a
                      href={competitor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm hover:underline"
                    >
                      {new URL(competitor.url).hostname}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit website
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last scan</span>
                      <span>{competitor.lastScan || "Never"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Changes detected</span>
                      <span>{competitor.changesCount || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Technologies</span>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {competitor.technologies?.slice(0, 3).map((tech: string) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {(competitor.technologies?.length || 0) > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{(competitor.technologies?.length || 0) - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Link href={`/dashboard/competitors/${competitor.id}`}>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
