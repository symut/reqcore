import { sql } from 'drizzle-orm'
import { job } from '../../../database/schema'

interface NominatimResult {
  lat?: string
  lon?: string
}

async function geocodeLocation(location: string): Promise<{ lat: number, lon: number } | null> {
  const query = /\bindonesia\b/i.test(location) ? location : `${location}, Indonesia`
  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('limit', '1')
  url.searchParams.set('addressdetails', '1')

  const response = await fetch(url, {
    headers: {
      'Accept-Language': 'id',
      'User-Agent': 'Jobfire-Untidar/1.0 (+https://untidar.ac.id)',
    },
  })

  if (!response.ok) return null

  const data = await response.json() as NominatimResult[]
  if (!Array.isArray(data) || data.length === 0) return null

  const lat = Number.parseFloat(data[0]?.lat ?? '')
  const lon = Number.parseFloat(data[0]?.lon ?? '')

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null

  return { lat, lon }
}

/**
 * GET /api/public/jobs/map
 * Returns a list of open job counts grouped by location for the map distribution.
 */
export default defineEventHandler(async () => {
  const data = await db
    .select({
      location: job.location,
      count: sql<number>`cast(count(${job.id}) as int)`
    })
    .from(job)
    .where(
      sql`${job.status} = 'open' AND ${job.isTest} = false AND ${job.location} IS NOT NULL AND ${job.location} != ''`
    )
    .groupBy(job.location)

  const results: Array<{ location: string, count: number, lat?: number, lon?: number }> = []

  for (const row of data) {
    if (!row.location) continue

    const coords = await geocodeLocation(row.location)
    results.push({
      location: row.location,
      count: Number(row.count),
      ...(coords ? { lat: coords.lat, lon: coords.lon } : {}),
    })

    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return results
})
