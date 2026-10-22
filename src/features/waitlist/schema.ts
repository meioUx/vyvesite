import { z } from 'zod';
const attribution = z.string().trim().max(120).optional();
export const waitlistSchema = z.object({
  name: z.string().trim().max(80, 'Use até 80 caracteres.').optional(),
  email: z.string().trim().toLowerCase().max(254).pipe(z.email('Digite um e-mail válido.')),
  consent: z
    .boolean()
    .refine((value) => value, 'Aceite a Política de Privacidade para participar.'),
  marketingConsent: z.boolean().optional().default(false),
  referralCode: z.string().uuid().optional(),
  website: z.string().max(200).optional(),
  source: attribution,
  campaign: attribution,
  medium: attribution,
});
export type WaitlistInput = z.input<typeof waitlistSchema>;
