import { getDb } from '@/lib/db';
import { subscribe } from '@/features/waitlist/service';
import { saveSubscription } from '@/features/waitlist/persistence';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  return subscribe(
    request,
    {
      async limit(key, expiresAt) {
        const db = getDb();
        await db.rateLimitBucket.deleteMany({ where: { expiresAt: { lt: new Date() } } });
        const bucket = await db.rateLimitBucket.upsert({
          where: { key },
          create: { key, expiresAt },
          update: { count: { increment: 1 } },
        });
        return bucket.count;
      },
      save: saveSubscription,
    },
    { secret: process.env.RATE_LIMIT_SECRET || '', trustProxy: process.env.TRUST_PROXY === 'true' },
  );
}
