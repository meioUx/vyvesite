import { getDb } from '@/lib/db';
import { member, json } from '@/lib/security';
export async function GET(request: Request) {
  try {
    const entry = await member(request);
    if (!entry) return json({}, 401);
    const count = await getDb().challengeDay.count({ where: { entryId: entry.id } });
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#15151d"/><circle cx="1020" cy="120" r="260" fill="#302a50"/><g fill="#f7f5ff" font-family="Arial,sans-serif"><text x="80" y="110" font-size="42" font-weight="bold">VYVE</text><text x="80" y="240" font-size="52">Meu desafio de movimento</text><text x="80" y="380" font-size="100" fill="#bbff57">${count} / 30 dias</text><text x="80" y="470" font-size="28">Progresso pessoal registrado por mim.</text><text x="80" y="540" font-size="22">Desafio do site • sem classificação competitiva</text></g></svg>`;
    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Disposition': 'attachment; filename="vyve-progresso.svg"',
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex',
        'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      },
    });
  } catch {
    return json({}, 503);
  }
}
