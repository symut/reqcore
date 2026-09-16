import { eq } from 'drizzle-orm'
import { organization, job, application } from '../../database/schema'

/**
 * GET /api/public/stats
 * Returns platform-wide statistics for the landing page.
 */
export default defineEventHandler(async () => {
  const [companies, jobs, applicants, hired] = await Promise.all([
    db.$count(organization),
    db.$count(job, eq(job.status, 'open')),
    db.$count(application),
    db.$count(application, eq(application.status, 'hired')),
  ])

  return {
    companies,
    jobs,
    applicants,
    hired,
  }
})
