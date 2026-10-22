import 'dotenv/config';
import { getDb } from '../src/lib/db';
const db = getDb();
try {
  const now = new Date();
  await db.$transaction([
    db.accessToken.deleteMany({ where: { expiresAt: { lt: now } } }),
    db.memberSession.deleteMany({ where: { expiresAt: { lt: now } } }),
    db.rateLimitBucket.deleteMany({ where: { expiresAt: { lt: now } } }),
    db.mailMessage.deleteMany({
      where: { createdAt: { lt: new Date(Date.now() - 7 * 86400000) } },
    }),
    db.analyticsEvent.deleteMany({
      where: { createdAt: { lt: new Date(Date.now() - 90 * 86400000) } },
    }),
    db.waitlistEntry.deleteMany({
      where: { verifiedAt: null, createdAt: { lt: new Date(Date.now() - 30 * 86400000) } },
    }),
  ]);
  console.log('Retention completed.');
} finally {
  await db.$disconnect();
}
