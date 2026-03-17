"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function PortfolioPage() {
  const params = useParams()
  const subdomain = params.subdomain as string
  const [portfolioHTML, setPortfolioHTML] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // In a real app, this would be an API call to fetch the HTML from a database
    // For demo purposes, we're using localStorage
    try {
      const html = localStorage.getItem(`portfolioHTML:${subdomain}`)
      if (html) {
        setPortfolioHTML(html)
      } else {
        setError("Portfolio not found")
      }
    } catch (err) {
      console.error("Error loading portfolio:", err)
      setError("Failed to load portfolio")
    } finally {
      setLoading(false)
    }
  }, [subdomain])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        <span className="ml-2">Loading portfolio...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <iframe
        srcDoc={portfolioHTML}
        title={`${subdomain}'s Portfolio`}
        className="w-full h-screen border-0"
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  )
}

