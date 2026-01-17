import type { PageServerLoad } from './$types';

const API_BASE = 'https://cosmic-server.vercel.app';

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const [survivalRes, flightRes] = await Promise.all([
      fetch(`${API_BASE}/api/leaderboards/survival`, { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      }),
      fetch(`${API_BASE}/api/leaderboards/flight`, { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      })
    ]);

    // Log response status for debugging
    console.log('Survival API status:', survivalRes.status);
    console.log('Flight API status:', flightRes.status);

    if (!survivalRes.ok) {
      const errorText = await survivalRes.text();
      console.error('Survival API error:', errorText);
    }
    
    if (!flightRes.ok) {
      const errorText = await flightRes.text();
      console.error('Flight API error:', errorText);
    }

    if (!survivalRes.ok || !flightRes.ok) {
      return { 
        survivalLeaderboard: [], 
        flightLeaderboard: [],
        error: 'Failed to fetch leaderboard data from server'
      };
    }

    const [survivalLeaderboard, flightLeaderboard] = await Promise.all([
      survivalRes.json(),
      flightRes.json()
    ]);

    return { survivalLeaderboard, flightLeaderboard, error: null };
  } catch (err) {
    console.error('Error fetching leaderboards:', err);
    return { 
      survivalLeaderboard: [], 
      flightLeaderboard: [],
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    };
  }
};
