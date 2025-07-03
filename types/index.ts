export interface ClickData {
  timestamp: Date
  source: string
  location: string
}

export interface ShortenedURL {
  id: string
  originalUrl: string
  shortcode: string
  createdAt: Date
  expiryDate: Date
  validityPeriod: number
  clicks: ClickData[]
}

export interface URLFormData {
  originalUrl: string
  customShortcode: string
  validityPeriod: string
}
