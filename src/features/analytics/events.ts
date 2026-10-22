export const eventNames = [
  'page_view',
  'hero_cta_click',
  'how_it_works_view',
  'league_section_view',
  'medal_section_view',
  'waitlist_form_start',
  'waitlist_submit_success',
  'waitlist_submit_error',
  'faq_open',
  'generate_lead',
  'share',
  'challenge_started',
  'challenge_day_completed',
  'achievement_card_generated',
  'referral_link_copied',
  'referral_signup_verified',
  'waitlist_email_verified',
] as const;
export type EventName = (typeof eventNames)[number];
export const tools = ['referral', 'challenge', 'achievement_card', 'league', 'medals'] as const;
export function sourceBucket(value: string | null) {
  return ['google', 'instagram', 'tiktok', 'youtube', 'facebook', 'referral', 'email'].includes(
    value || '',
  )
    ? value!
    : value
      ? 'other'
      : 'direct';
}
