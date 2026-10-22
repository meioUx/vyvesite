import { getDb } from '@/lib/db';
export async function report() {
  const db = getDb();
  const [totals, sources, weeks, toolUsage, shares, retention] = await Promise.all([
    db.$queryRaw<
      { total: number; verified: number; referrals: number; converted: number }[]
    >`SELECT COUNT(*)::int AS total, COUNT("verifiedAt")::int AS verified, COUNT("referredById")::int AS referrals, COUNT(*) FILTER (WHERE "referredById" IS NOT NULL AND "verifiedAt" IS NOT NULL)::int AS converted FROM "WaitlistEntry"`,
    db.$queryRaw<
      { source: string; visitors: number }[]
    >`SELECT source, COUNT(DISTINCT visitor)::int AS visitors FROM "AnalyticsEvent" WHERE name = 'page_view' AND "createdAt" > NOW() - INTERVAL '90 days' GROUP BY source ORDER BY visitors DESC`,
    db.$queryRaw<
      { week: Date; verified: number }[]
    >`SELECT weeks.week, COUNT(e.id)::int AS verified FROM generate_series(date_trunc('week', NOW()) - INTERVAL '11 weeks', date_trunc('week', NOW()), INTERVAL '1 week') AS weeks(week) LEFT JOIN "WaitlistEntry" e ON e."verifiedAt" >= weeks.week AND e."verifiedAt" < weeks.week + INTERVAL '1 week' GROUP BY weeks.week ORDER BY weeks.week`,
    db.$queryRaw<
      { tool: string; uses: number }[]
    >`SELECT tool, COUNT(*)::int AS uses FROM "AnalyticsEvent" WHERE tool IS NOT NULL AND "createdAt" > NOW() - INTERVAL '90 days' GROUP BY tool ORDER BY uses DESC`,
    db.analyticsEvent.count({
      where: { name: 'share', createdAt: { gte: new Date(Date.now() - 90 * 86400000) } },
    }),
    db.$queryRaw<
      { eligible: number; retained: number }[]
    >`WITH first_seen AS (SELECT visitor, MIN("createdAt")::date AS first_day FROM "AnalyticsEvent" WHERE visitor IS NOT NULL GROUP BY visitor), cohort AS (SELECT * FROM first_seen WHERE first_day <= CURRENT_DATE - 7) SELECT COUNT(*)::int AS eligible, COUNT(*) FILTER (WHERE EXISTS (SELECT 1 FROM "AnalyticsEvent" e WHERE e.visitor = cohort.visitor AND e."createdAt"::date = cohort.first_day + 7))::int AS retained FROM cohort`,
  ]);
  const [funnel] = await db.$queryRaw<
    { visitors: number; leads: number }[]
  >`SELECT COUNT(DISTINCT visitor) FILTER (WHERE name = 'page_view')::int AS visitors, COUNT(DISTINCT visitor) FILTER (WHERE name = 'generate_lead')::int AS leads FROM "AnalyticsEvent" WHERE "createdAt" > NOW() - INTERVAL '90 days'`;
  return {
    totals: totals[0],
    sources,
    weeks,
    toolUsage,
    shares,
    visitors: funnel.visitors,
    leads: funnel.leads,
    retention: retention[0],
  };
}
