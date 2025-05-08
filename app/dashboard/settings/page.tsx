"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

const industries = [
  "E-commerce",
  "SaaS",
  "Finance",
  "Healthcare",
  "Education",
  "Real Estate",
  "Travel",
  "Food & Beverage",
  "Manufacturing",
  "Other",
]

export default function SettingsPage() {
  const { user, updateProfile } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)
  const [profileData, setProfileData] = useState({
    businessName: user?.businessName || "",
    industry: user?.industry || "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    emailCritical: true,
    emailMajor: true,
    emailMinor: false,
    pushNotifications: true,
    pushCritical: true,
    pushMajor: true,
    pushMinor: false,
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleIndustryChange = (value: string) => {
    setProfileData((prev) => ({ ...prev, industry: value }))
  }

  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      await updateProfile(profileData)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      // In a real app, this would save to Firestore
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved.",
      })
    } catch (error) {
      console.error("Error updating notification settings:", error)
      toast({
        title: "Error",
        description: "Failed to update notification settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="max-w-3xl">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <form onSubmit={handleProfileSubmit}>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your business information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email || ""} disabled />
                  <p className="text-xs text-muted-foreground">
                    Your email address is associated with your Google account.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={profileData.businessName}
                    onChange={handleProfileChange}
                    placeholder="Acme Inc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={profileData.industry} onValueChange={handleIndustryChange}>
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <form onSubmit={handleNotificationSubmit}>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how and when you want to be notified about changes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                    />
                  </div>

                  {notificationSettings.emailNotifications && (
                    <div className="ml-6 space-y-3 border-l pl-6">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emailCritical" className="flex-1">
                          Critical changes
                        </Label>
                        <Switch
                          id="emailCritical"
                          checked={notificationSettings.emailCritical}
                          onCheckedChange={(checked) => handleNotificationChange("emailCritical", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emailMajor" className="flex-1">
                          Major changes
                        </Label>
                        <Switch
                          id="emailMajor"
                          checked={notificationSettings.emailMajor}
                          onCheckedChange={(checked) => handleNotificationChange("emailMajor", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emailMinor" className="flex-1">
                          Minor changes
                        </Label>
                        <Switch
                          id="emailMinor"
                          checked={notificationSettings.emailMinor}
                          onCheckedChange={(checked) => handleNotificationChange("emailMinor", checked)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Push Notifications</h3>
                      <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                    />
                  </div>

                  {notificationSettings.pushNotifications && (
                    <div className="ml-6 space-y-3 border-l pl-6">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pushCritical" className="flex-1">
                          Critical changes
                        </Label>
                        <Switch
                          id="pushCritical"
                          checked={notificationSettings.pushCritical}
                          onCheckedChange={(checked) => handleNotificationChange("pushCritical", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pushMajor" className="flex-1">
                          Major changes
                        </Label>
                        <Switch
                          id="pushMajor"
                          checked={notificationSettings.pushMajor}
                          onCheckedChange={(checked) => handleNotificationChange("pushMajor", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pushMinor" className="flex-1">
                          Minor changes
                        </Label>
                        <Switch
                          id="pushMinor"
                          checked={notificationSettings.pushMinor}
                          onCheckedChange={(checked) => handleNotificationChange("pushMinor", checked)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Manage your subscription plan and billing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Current Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      {user?.subscriptionTier === "pro"
                        ? "Pro"
                        : user?.subscriptionTier === "enterprise"
                          ? "Enterprise"
                          : "Free"}
                    </p>
                  </div>
                  <Badge variant={user?.subscriptionTier === "free" ? "outline" : "default"}>
                    {user?.subscriptionTier === "pro"
                      ? "Pro"
                      : user?.subscriptionTier === "enterprise"
                        ? "Enterprise"
                        : "Free"}
                  </Badge>
                </div>
                <div className="mt-4">
                  <p className="text-sm">
                    {user?.subscriptionTier === "free"
                      ? "You are currently on the Free plan. Upgrade to Pro for more features."
                      : "You are on a paid plan with premium features."}
                  </p>
                </div>
              </div>

              {user?.subscriptionTier === "free" && (
                <div className="rounded-lg border p-4 bg-muted/50">
                  <h3 className="font-medium">Upgrade to Pro</h3>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 text-primary flex-shrink-0 mr-2"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Monitor up to 10 competitors</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 text-primary flex-shrink-0 mr-2"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Daily scans</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 text-primary flex-shrink-0 mr-2"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Advanced AI analysis</span>
                    </li>
                  </ul>
                  <Button className="mt-4 w-full">Upgrade to Pro</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
