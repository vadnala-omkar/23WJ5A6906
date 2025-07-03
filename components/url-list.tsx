"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, Clock, MousePointer } from "lucide-react"
import { useURLStore } from "@/hooks/use-url-store"
import { formatDistanceToNow } from "date-fns"

export function URLList() {
  const { urls, incrementClick } = useURLStore()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = async (shortUrl: string, id: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleShortUrlClick = (url: any) => {
    // Simulate click tracking
    incrementClick(url.id, {
      timestamp: new Date(),
      source: "direct",
      location: "Unknown",
    })

    // Redirect to original URL
    window.open(url.originalUrl, "_blank")
  }

  const isExpired = (expiryDate: Date) => {
    return new Date() > new Date(expiryDate)
  }

  if (urls.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No URLs shortened yet. Create your first short link above!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Short URLs</CardTitle>
        <CardDescription>Click on short URLs to test redirection</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {urls.map((url) => {
          const shortUrl = `http://localhost:3000/${url.shortcode}`
          const expired = isExpired(url.expiryDate)

          return (
            <div key={url.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <button
                      onClick={() => handleShortUrlClick(url)}
                      className="text-blue-600 hover:text-blue-800 font-medium truncate"
                      disabled={expired}
                    >
                      {shortUrl}
                    </button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(shortUrl, url.id)}
                      disabled={expired}
                    >
                      <Copy className="h-3 w-3" />
                      {copiedId === url.id ? "Copied!" : "Copy"}
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <ExternalLink className="h-3 w-3" />
                    <span className="truncate">{url.originalUrl}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {expired
                          ? "Expired"
                          : `Expires ${formatDistanceToNow(new Date(url.expiryDate), { addSuffix: true })}`}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MousePointer className="h-3 w-3" />
                      <span>{url.clicks.length} clicks</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <Badge variant={expired ? "destructive" : "default"}>{expired ? "Expired" : "Active"}</Badge>
                  <span className="text-xs text-gray-500">
                    Created {formatDistanceToNow(new Date(url.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
