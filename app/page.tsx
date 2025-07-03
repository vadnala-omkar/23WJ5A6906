"use client"
import { Header } from "@/components/header"
import { URLForm } from "@/components/url-form"
import { URLList } from "@/components/url-list"
import { StatsTable } from "@/components/stats-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useURLStore } from "@/hooks/use-url-store"

export default function URLShortenerApp() {
  const { urls } = useURLStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="shortener" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="shortener">URL Shortener</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="shortener" className="space-y-8">
            <div className="max-w-2xl mx-auto">
              <URLForm />
              <URLList />
            </div>
          </TabsContent>

          <TabsContent value="statistics">
            <StatsTable />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
