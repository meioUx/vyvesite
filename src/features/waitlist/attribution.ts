export function acquisition() {
  const params = new URLSearchParams(location.search);
  const incoming = {
    source: params.get('utm_source')?.slice(0, 120),
    medium: params.get('utm_medium')?.slice(0, 120),
    campaign: params.get('utm_campaign')?.slice(0, 120),
    referralCode: /^[0-9a-f-]{36}$/i.test(params.get('ref') || '') ? params.get('ref') : undefined,
  };
  try {
    const saved = sessionStorage.getItem('vyve-acquisition');
    if (saved) return JSON.parse(saved) as typeof incoming;
    if (Object.values(incoming).some(Boolean))
      sessionStorage.setItem('vyve-acquisition', JSON.stringify(incoming));
  } catch {
    /* Attribution still works on the current URL when storage is unavailable. */
  }
  return incoming;
}
