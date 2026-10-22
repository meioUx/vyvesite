/** Conservative alias deduplication. Never use this value as a delivery address. */
export function emailIdentity(email: string) {
  const [local, rawDomain] = email.trim().toLowerCase().split('@');
  const domain = rawDomain === 'googlemail.com' ? 'gmail.com' : rawDomain;
  let mailbox = local.split('+')[0];
  if (domain === 'gmail.com') mailbox = mailbox.replaceAll('.', '');
  return `${mailbox}@${domain}`;
}
