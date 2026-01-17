import type { PageServerLoad } from './$types';

const API_BASE = 'https://cosmic-server.vercel.app';

export const load: PageServerLoad = async ({ fetch, url }) => {
  try {
    // Get pagination params from URL
    const survivalPage = parseInt(url.searchParams.get('survivalPage') || '1');
    const flightPage = parseInt(url.searchParams.get('flightPage') || '1');
    const limit = 10;

    const [survivalRes, flightRes] = await Promise.all([
      fetch(`${API_BASE}/api/leaderboards/survival?page=${survivalPage}&limit=${limit}`, { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      }),
      fetch(`${API_BASE}/api/leaderboards/flight?page=${flightPage}&limit=${limit}`, { 
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
        survivalLeaderboard: { data: [], pagination: null }, 
        flightLeaderboard: { data: [], pagination: null },
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
      survivalLeaderboard: { data: [], pagination: null }, 
      flightLeaderboard: { data: [], pagination: null },
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    };
  }
};
