"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Plus } from "lucide-react"
import { useURLStore } from "@/hooks/use-url-store"
import { validateURL, validateShortcode, validateValidity } from "@/utils/validators"
import { generateShortcode } from "@/utils/api"

interface URLFormData {
  originalUrl: string
  customShortcode: string
  validityPeriod: string
}

export function URLForm() {
  const { urls, addURL } = useURLStore()
  const [forms, setForms] = useState<URLFormData[]>([{ originalUrl: "", customShortcode: "", validityPeriod: "30" }])
  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addForm = () => {
    if (forms.length < 5) {
      setForms([...forms, { originalUrl: "", customShortcode: "", validityPeriod: "30" }])
    }
  }

  const removeForm = (index: number) => {
    if (forms.length > 1) {
      const newForms = forms.filter((_, i) => i !== index)
      setForms(newForms)
      const newErrors = errors.filter((_, i) => i !== index)
      setErrors(newErrors)
    }
  }

  const updateForm = (index: number, field: keyof URLFormData, value: string) => {
    const newForms = [...forms]
    newForms[index][field] = value
    setForms(newForms)
  }

  const validateForms = (): boolean => {
    const newErrors: string[] = []

    forms.forEach((form, index) => {
      const formErrors: string[] = []

      if (!form.originalUrl.trim()) {
        formErrors.push("URL is required")
      } else if (!validateURL(form.originalUrl)) {
        formErrors.push("Invalid URL format")
      }

      if (form.customShortcode && !validateShortcode(form.customShortcode)) {
        formErrors.push("Invalid shortcode (alphanumeric, 3-10 characters)")
      }

      if (form.customShortcode) {
        const existingUrl = urls.find((url) => url.shortcode === form.customShortcode)
        if (existingUrl) {
          formErrors.push("Shortcode already exists")
        }
      }

      if (!validateValidity(Number.parseInt(form.validityPeriod))) {
        formErrors.push("Validity period must be a positive number")
      }

      newErrors[index] = formErrors.join(", ")
    })

    setErrors(newErrors)
    return newErrors.every((error) => !error)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForms()) {
      return
    }

    setIsSubmitting(true)

    try {
      forms.forEach((form) => {
        const shortcode = form.customShortcode || generateShortcode()
        const validityMinutes = Number.parseInt(form.validityPeriod)
        const expiryDate = new Date()
        expiryDate.setMinutes(expiryDate.getMinutes() + validityMinutes)

        addURL({
          originalUrl: form.originalUrl,
          shortcode,
          expiryDate,
          validityPeriod: validityMinutes,
        })
      })

      // Reset forms
      setForms([{ originalUrl: "", customShortcode: "", validityPeriod: "30" }])
      setErrors([])
    } catch (error) {
      console.error("Error creating short URLs:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Short URLs</CardTitle>
        <CardDescription>
          Shorten up to 5 URLs at once. Each URL can have a custom shortcode and validity period.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {forms.map((form, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg relative">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">URL {index + 1}</h3>
                {forms.length > 1 && (
                  <Button type="button" variant="outline" size="sm" onClick={() => removeForm(index)}>
                    Remove
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`url-${index}`}>Original URL *</Label>
                <Input
                  id={`url-${index}`}
                  type="url"
                  placeholder="https://example.com/very-long-url"
                  value={form.originalUrl}
                  onChange={(e) => updateForm(index, "originalUrl", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`shortcode-${index}`}>Custom Shortcode (optional)</Label>
                  <Input
                    id={`shortcode-${index}`}
                    placeholder="my-link"
                    value={form.customShortcode}
                    onChange={(e) => updateForm(index, "customShortcode", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`validity-${index}`}>Validity Period (minutes)</Label>
                  <Input
                    id={`validity-${index}`}
                    type="number"
                    min="1"
                    value={form.validityPeriod}
                    onChange={(e) => updateForm(index, "validityPeriod", e.target.value)}
                  />
                </div>
              </div>

              {errors[index] && (
                <Alert variant="destructive">
                  <AlertDescription>{errors[index]}</AlertDescription>
                </Alert>
              )}
            </div>
          ))}

          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={addForm}
              disabled={forms.length >= 5}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Another URL ({forms.length}/5)</span>
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Short URLs
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
