"use client"

import { useState, useEffect } from "react"

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

const STORAGE_KEY = "url-shortener-data"

export function useURLStore() {
  const [urls, setUrls] = useState<ShortenedURL[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Convert date strings back to Date objects
        const urlsWithDates = parsed.map((url: any) => ({
          ...url,
          createdAt: new Date(url.createdAt),
          expiryDate: new Date(url.expiryDate),
          clicks: url.clicks.map((click: any) => ({
            ...click,
            timestamp: new Date(click.timestamp),
          })),
        }))
        setUrls(urlsWithDates)
      }
    } catch (error) {
      console.error("Error loading URLs from storage:", error)
    }
  }, [])

  // Save to localStorage whenever urls change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(urls))
    } catch (error) {
      console.error("Error saving URLs to storage:", error)
    }
  }, [urls])

  const addURL = (urlData: Omit<ShortenedURL, "id" | "createdAt" | "clicks">) => {
    const newUrl: ShortenedURL = {
      ...urlData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      clicks: [],
    }
    setUrls((prev) => [newUrl, ...prev])
  }

  const incrementClick = (urlId: string, clickData: ClickData) => {
    setUrls((prev) => prev.map((url) => (url.id === urlId ? { ...url, clicks: [...url.clicks, clickData] } : url)))
  }

  const removeURL = (urlId: string) => {
    setUrls((prev) => prev.filter((url) => url.id !== urlId))
  }

  return {
    urls,
    addURL,
    incrementClick,
    removeURL,
  }
}
