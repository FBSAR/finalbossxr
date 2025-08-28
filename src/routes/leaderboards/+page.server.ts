import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    // Server-side fetch to your Node API
    const [survivalRes, flightRes] = await Promise.all([
      fetch('http://ec2-54-174-124-249.compute-1.amazonaws.com:3000/api/leaderboard/survival'),
      fetch('http://ec2-54-174-124-249.compute-1.amazonaws.com:3000/api/leaderboard/flight')
    ]);

    if (!survivalRes.ok || !flightRes.ok) {
      throw new Error('Failed to fetch leaderboards');
    }

    const survivalLeaderboard = await survivalRes.json();
    const flightLeaderboard = await flightRes.json();

    return { survivalLeaderboard, flightLeaderboard };
  } catch (err) {
    console.error('Error fetching leaderboards:', err);
    return { survivalLeaderboard: [], flightLeaderboard: [] };
  }
};
