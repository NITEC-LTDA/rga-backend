import { randomBytes } from 'node:crypto'

export function generateRga(length: number) {
  const rb = randomBytes(Math.ceil((length * 3) / 4)) // Adjust length to account for base64 encoding
  const randomBase64 = rb.toString('base64')

  // Replace non-alphanumeric characters and take the first 'length' characters
  return randomBase64.replace(/[^A-Za-z0-9]/g, '').substring(0, length)
}
