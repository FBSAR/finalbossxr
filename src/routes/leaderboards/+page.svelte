<script lang="ts">
  import { page } from '$app/stores';
    import ContactForm from '$lib/components/ContactForm.svelte';
  import { get } from 'svelte/store';

  type SurvivalEntry = {
    id: number;
    username: string;
    points: number;
    wave: number;
    time: number;
    createdAt: string;
  };

  type FlightEntry = {
    id: number;
    username: string;
    time: number;
    createdAt: string;
  };

   export let data: {
    survivalLeaderboard: SurvivalEntry[];
    flightLeaderboard: FlightEntry[];
  };

  let activeTab: "survival" | "flight" = "survival";

  const selectTab = (tab: "survival" | "flight") => {
    activeTab = tab;
  };

  const timeAgo = (isoDate: string) => {
    const date = new Date(isoDate);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals: [number, Intl.RelativeTimeFormatUnit][] = [
      [60, 'seconds'],
      [60, 'minutes'],
      [24, 'hours'],
      [30, 'days'],
      [12, 'months'],
      [Number.POSITIVE_INFINITY, 'years']
    ];

    let value = seconds;
    let unit: Intl.RelativeTimeFormatUnit = 'seconds';

    for (let [limit, u] of intervals) {
      if (Math.abs(value) < limit) {
        unit = u;
        break;
      }
      value /= limit;
    }

    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(Math.floor(-value), unit);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return 'rank-default';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };
</script>

<div class="leaderboard-container">
  <!-- Header -->
  <div class="header-section">
    <div class="header-row">
      <img 
        src="https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/logos/Coz_Logo_Final_w_Text-NoBG.png" 
        class="logo" 
        alt="Cosmic Collisions Logo"
      />
      <h1 class="jersey-font page-header green-header-text">Leaderboards</h1>
    </div>
  </div>

  <!-- Tab Switcher -->
  <div class="tab-container">
    <button
      class="tab-button"
      class:active={activeTab === "survival"}
      on:click={() => selectTab("survival")}
    >
      <span class="tab-icon">🎯</span>
      <span class="tab-text">Survival</span>
    </button>
    <button
      class="tab-button"
      class:active={activeTab === "flight"}
      on:click={() => selectTab("flight")}
    >
      <span class="tab-icon">🚀</span>
      <span class="tab-text">Flight</span>
    </button>
  </div>

  <!-- Leaderboard Content -->
  <div class="leaderboard-content">
    {#if activeTab === "survival"}
      <!-- Coming Soon State -->
      <div class="coming-soon-card">
        <div class="coming-soon-icon">🎮</div>
        <h2 class="gold-header-text coming-soon-title">Coming Soon!</h2>
        <p class="coming-soon-text">Survival mode leaderboards are on their way. Stay tuned!</p>
      </div>

      <!-- Uncomment below when data is ready -->
      <!-- 
      {#if data.survivalLeaderboard.length === 0}
        <div class="empty-state">
          <div class="empty-icon">🏆</div>
          <p>No scores yet. Be the first to claim the top spot!</p>
        </div>
      {:else}
        <div class="leaderboard-list">
          {#each data.survivalLeaderboard as entry, index}
            <div class="leaderboard-card {getRankStyle(index + 1)}">
              <div class="rank-badge {getRankStyle(index + 1)}">
                <span class="rank-text">{getRankIcon(index + 1)}</span>
              </div>
              
              <div class="player-info">
                <div class="player-avatar">
                  {entry.username.charAt(0).toUpperCase()}
                </div>
                <div class="player-details">
                  <span class="player-name">{entry.username}</span>
                  <span class="player-time">{timeAgo(entry.createdAt)}</span>
                </div>
              </div>

              <div class="stats-container">
                <div class="stat-item">
                  <span class="stat-value gold-header-text">{entry.points.toLocaleString()}</span>
                  <span class="stat-label">Points</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <span class="stat-value green-header-text">{entry.wave}</span>
                  <span class="stat-label">Wave</span>
                </div>
                <div class="stat-divider hidden md:block"></div>
                <div class="stat-item hidden md:flex">
                  <span class="stat-value">{formatTime(entry.time)}</span>
                  <span class="stat-label">Time</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
      -->
    {/if}

    {#if activeTab === "flight"}
      <!-- Coming Soon State -->
      <div class="coming-soon-card">
        <div class="coming-soon-icon">✈️</div>
        <h2 class="gold-header-text coming-soon-title">Coming Soon!</h2>
        <p class="coming-soon-text">Flight mode leaderboards are on their way. Stay tuned!</p>
      </div>

      <!-- Uncomment below when data is ready -->
      <!--
      {#if data.flightLeaderboard.length === 0}
        <div class="empty-state">
          <div class="empty-icon">🏆</div>
          <p>No scores yet. Be the first to claim the top spot!</p>
        </div>
      {:else}
        <div class="leaderboard-list">
          {#each data.flightLeaderboard as entry, index}
            <div class="leaderboard-card {getRankStyle(index + 1)}">
              <div class="rank-badge {getRankStyle(index + 1)}">
                <span class="rank-text">{getRankIcon(index + 1)}</span>
              </div>
              
              <div class="player-info">
                <div class="player-avatar">
                  {entry.username.charAt(0).toUpperCase()}
                </div>
                <div class="player-details">
                  <span class="player-name">{entry.username}</span>
                  <span class="player-time">{timeAgo(entry.createdAt)}</span>
                </div>
              </div>

              <div class="stats-container">
                <div class="stat-item highlight">
                  <span class="stat-value green-header-text">{formatTime(entry.time)}</span>
                  <span class="stat-label">Best Time</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
      -->
    {/if}
  </div>
</div>

<!-- Spacer -->
<div class="h-10"></div>
<ContactForm />

<style>
  /* Container */
  .leaderboard-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }

  /* Header */
  .header-section {
    text-align: center;
    margin-bottom: 2rem;
  }

  .header-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .logo {
    height: 100px;
  }

  .page-header {
    font-size: 3rem;
    margin: 0;
  }

  /* Tab Switcher */
  .tab-container {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    padding: 0.5rem;
    border-radius: 1rem;
  }

  .tab-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.875rem 1.5rem;
    background: transparent;
    border: none;
    border-radius: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .tab-button:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }

  .tab-button.active {
    background: linear-gradient(135deg, #00c400 0%, #006600 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(0, 196, 0, 0.3);
  }

  .tab-icon {
    font-size: 1.25rem;
  }

  /* Coming Soon Card */
  .coming-soon-card {
    background: linear-gradient(145deg, rgba(0, 196, 0, 0.1) 0%, rgba(0, 100, 0, 0.05) 100%);
    border: 1px solid rgba(0, 196, 0, 0.3);
    border-radius: 1.5rem;
    padding: 3rem 2rem;
    text-align: center;
    backdrop-filter: blur(10px);
  }

  .coming-soon-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: pulse 2s infinite;
  }

  .coming-soon-title {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .coming-soon-text {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  /* Leaderboard List */
  .leaderboard-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  /* Leaderboard Card */
  .leaderboard-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    transition: all 0.3s ease;
  }

  .leaderboard-card:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 196, 0, 0.4);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }

  .leaderboard-card.rank-gold {
    background: linear-gradient(145deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.05) 100%);
    border-color: rgba(255, 215, 0, 0.4);
  }

  .leaderboard-card.rank-silver {
    background: linear-gradient(145deg, rgba(192, 192, 192, 0.15) 0%, rgba(192, 192, 192, 0.05) 100%);
    border-color: rgba(192, 192, 192, 0.4);
  }

  .leaderboard-card.rank-bronze {
    background: linear-gradient(145deg, rgba(205, 127, 50, 0.15) 0%, rgba(205, 127, 50, 0.05) 100%);
    border-color: rgba(205, 127, 50, 0.4);
  }

  /* Rank Badge */
  .rank-badge {
    min-width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    background: rgba(255, 255, 255, 0.1);
    font-weight: bold;
  }

  .rank-badge.rank-gold {
    background: linear-gradient(145deg, #FFD700, #DAA520);
    color: #000;
  }

  .rank-badge.rank-silver {
    background: linear-gradient(145deg, #E8E8E8, #B0B0B0);
    color: #000;
  }

  .rank-badge.rank-bronze {
    background: linear-gradient(145deg, #CD7F32, #8B4513);
    color: #fff;
  }

  .rank-text {
    font-size: 1.25rem;
  }

  /* Player Info */
  .player-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;
  }

  .player-avatar {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background: linear-gradient(145deg, #00c400, #006600);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.25rem;
    color: white;
    flex-shrink: 0;
  }

  .player-details {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .player-name {
    color: white;
    font-weight: 600;
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .player-time {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.75rem;
  }

  /* Stats Container */
  .stats-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-width: 60px;
  }

  .stat-value {
    font-size: 1.25rem;
    font-weight: bold;
    color: white;
  }

  .stat-label {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-divider {
    width: 1px;
    height: 2rem;
    background: rgba(255, 255, 255, 0.2);
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 3rem 2rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    border: 1px dashed rgba(255, 255, 255, 0.2);
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .empty-state p {
    color: rgba(255, 255, 255, 0.6);
  }

  /* Mobile Responsive */
  @media (max-width: 640px) {
    .leaderboard-container {
      padding: 0.75rem;
    }

    .header-row {
      flex-direction: column;
      gap: 0.5rem;
    }

    .logo {
      height: 70px;
    }

    .page-header {
      font-size: 2rem;
    }

    .tab-container {
      padding: 0.375rem;
      border-radius: 0.875rem;
    }

    .tab-button {
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      flex-direction: column;
      gap: 0.25rem;
    }

    .tab-icon {
      font-size: 1.5rem;
    }

    .tab-text {
      font-size: 0.75rem;
    }

    .coming-soon-card {
      padding: 2rem 1.25rem;
      border-radius: 1rem;
    }

    .coming-soon-icon {
      font-size: 3rem;
    }

    .coming-soon-title {
      font-size: 1.75rem;
    }

    .leaderboard-card {
      flex-wrap: wrap;
      padding: 0.875rem;
      gap: 0.75rem;
    }

    .rank-badge {
      min-width: 2.5rem;
      height: 2.5rem;
    }

    .rank-text {
      font-size: 1rem;
    }

    .player-avatar {
      width: 2.25rem;
      height: 2.25rem;
      font-size: 1rem;
    }

    .player-name {
      font-size: 0.9rem;
    }

    .stats-container {
      width: 100%;
      justify-content: center;
      padding-top: 0.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      gap: 1.5rem;
    }

    .stat-item {
      min-width: auto;
    }

    .stat-value {
      font-size: 1.1rem;
    }

    .stat-label {
      font-size: 0.65rem;
    }

    .stat-divider {
      height: 1.5rem;
    }
  }

  /* Tablet */
  @media (min-width: 641px) and (max-width: 1024px) {
    .leaderboard-container {
      padding: 1.5rem;
    }

    .logo {
      height: 85px;
    }
  }

  /* Utility classes for hidden on mobile */
  @media (max-width: 768px) {
    .hidden {
      display: none !important;
    }
  }

  @media (min-width: 769px) {
    .md\:block {
      display: block !important;
    }
    .md\:flex {
      display: flex !important;
    }
  }
</style>
