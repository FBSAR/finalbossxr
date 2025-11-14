import type { PageServerLoad } from './$types';

const API_BASE =
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}` // when running on Vercel, prefer same origin
    : (process.env.COSMIC_API_BASE ?? 'https://cosmic-server.vercel.app');

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const [survivalRes, flightRes] = await Promise.all([
      fetch(`${API_BASE}/api/leaderboards/survival`, { cache: 'no-store' }),
      fetch(`${API_BASE}/api/leaderboards/flight`,   { cache: 'no-store' })
    ]);

    if (!survivalRes.ok || !flightRes.ok) throw new Error('Failed to fetch leaderboards');

    const [survivalLeaderboard, flightLeaderboard] = await Promise.all([
      survivalRes.json(),
      flightRes.json()
    ]);

    return { survivalLeaderboard, flightLeaderboard };
  } catch (err) {
    console.error('Error fetching leaderboards:', err);
    return { survivalLeaderboard: [], flightLeaderboard: [] };
  }
};
