import { z } from 'zod';
import { getDb } from '@/lib/db';
import { eventNames, tools, sourceBucket } from '@/features/analytics/events';
import { digest, input, json, rateLimit } from '@/lib/security';
export async function POST(request: Request) {
  try {
    if (!(await rateLimit(request, 'analytics', 120))) return json({}, 429);
    const body = z
      .object({
        name: z.enum(eventNames),
        source: z.enum([
          'google',
          'instagram',
          'tiktok',
          'youtube',
          'facebook',
          'referral',
          'email',
          'other',
          'direct',
        ]),
        tool: z.enum(tools).optional(),
        consent: z.literal(true),
        visitor: z.string().uuid(),
      })
      .strict()
      .parse(await input(request));
    // Verification events are authoritative server-only events.
    if (body.name === 'waitlist_email_verified' || body.name === 'referral_signup_verified')
      return json({}, 400);
    await getDb().analyticsEvent.create({
      data: {
        name: body.name,
        visitor: digest(body.visitor),
        source: sourceBucket(body.source === 'direct' ? null : body.source),
        tool: body.tool,
      },
    });
    return json({});
  } catch {
    return json({}, 400);
  }
}
export async function DELETE(request: Request) {
  try {
    const body = z
      .object({ visitor: z.string().uuid() })
      .strict()
      .parse(await input(request));
    if (!(await rateLimit(request, 'analytics-delete', 10))) return json({}, 429);
    await getDb().analyticsEvent.deleteMany({ where: { visitor: digest(body.visitor) } });
    return json({});
  } catch {
    return json({}, 400);
  }
}
