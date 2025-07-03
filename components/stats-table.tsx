"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useURLStore } from "@/hooks/use-url-store"
import { formatDistanceToNow, format } from "date-fns"
import { ExternalLink, MousePointer, Clock, Calendar } from "lucide-react"

export function StatsTable() {
  const { urls } = useURLStore()

  const isExpired = (expiryDate: Date) => {
    return new Date() > new Date(expiryDate)
  }

  if (urls.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No URLs to display statistics for yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>URL Statistics</CardTitle>
          <CardDescription>
            Detailed analytics for all your shortened URLs including click data and timestamps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Short URL</TableHead>
                  <TableHead>Original URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Total Clicks</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {urls.map((url) => {
                  const expired = isExpired(url.expiryDate)
                  const shortUrl = `http://localhost:3000/${url.shortcode}`

                  return (
                    <TableRow key={url.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{url.shortcode}</code>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={url.originalUrl}>
                          {url.originalUrl}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={expired ? "destructive" : "default"}>{expired ? "Expired" : "Active"}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(url.createdAt), "MMM dd, yyyy")}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm">
                          <Clock className="h-3 w-3" />
                          <span>{formatDistanceToNow(new Date(url.expiryDate), { addSuffix: true })}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MousePointer className="h-3 w-3" />
                          <span className="font-medium">{url.clicks.length}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => window.open(url.originalUrl, "_blank")}
                          className="text-blue-600 hover:text-blue-800"
                          title="Visit original URL"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Click Data */}
      {urls.some((url) => url.clicks.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Click Analytics</CardTitle>
            <CardDescription>Individual click events with timestamps, sources, and locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {urls
                .filter((url) => url.clicks.length > 0)
                .map((url) => (
                  <div key={url.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">
                        {url.shortcode} → {url.originalUrl.substring(0, 50)}...
                      </h3>
                      <Badge variant="outline">{url.clicks.length} clicks</Badge>
                    </div>

                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Location</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {url.clicks.map((click, index) => (
                            <TableRow key={index}>
                              <TableCell>{format(new Date(click.timestamp), "MMM dd, yyyy HH:mm:ss")}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{click.source}</Badge>
                              </TableCell>
                              <TableCell>{click.location}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
