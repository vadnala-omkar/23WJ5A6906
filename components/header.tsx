import { Link2 } from "lucide-react"

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-3">
          <Link2 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">URL Shortener</h1>
            <p className="text-sm text-gray-600">Create short links and track analytics</p>
          </div>
        </div>
      </div>
    </header>
  )
}
