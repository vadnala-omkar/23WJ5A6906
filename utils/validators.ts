export function validateURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function validateShortcode(shortcode: string): boolean {
  // Alphanumeric, 3-10 characters
  const regex = /^[a-zA-Z0-9]{3,10}$/
  return regex.test(shortcode)
}

export function validateValidity(minutes: number): boolean {
  return Number.isInteger(minutes) && minutes > 0
}
