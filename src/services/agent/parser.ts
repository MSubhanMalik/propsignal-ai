import type { ZodSchema } from 'zod'

export function parseJSON<T>(raw: string, schema: ZodSchema<T>): T {
  const cleaned = raw.replace(/```json|```/g, '').trim()
  const json = JSON.parse(cleaned)
  return schema.parse(json)
}
