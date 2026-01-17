<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { navigating } from '$app/stores';
  import ContactForm from '$lib/components/ContactForm.svelte';
  import { get } from 'svelte/store';

  type SurvivalEntry = {
    id: number;
    rank: number;
    username: string;
    points: number;
    wave: number;
    time: number;
    createdAt: string;
  };

  type FlightEntry = {
    id: number;
    rank: number;
    username: string;
    time: number;
    createdAt: string;
  };

  type Pagination = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  export let data: {
    survivalLeaderboard: { data: SurvivalEntry[]; pagination: Pagination | null };
    flightLeaderboard: { data: FlightEntry[]; pagination: Pagination | null };
    error?: string | null;
  };

  let activeTab: "survival" | "flight" = "survival";

  // Loading state for navigation
  $: isLoading = $navigating !== null;

  const selectTab = (tab: "survival" | "flight") => {
    activeTab = tab;
  };

  const goToPage = (type: 'survival' | 'flight', pageNum: number) => {
    const currentUrl = new URL(window.location.href);
    if (type === 'survival') {
      currentUrl.searchParams.set('survivalPage', pageNum.toString());
    } else {
      currentUrl.searchParams.set('flightPage', pageNum.toString());
    }
    goto(currentUrl.pathname + currentUrl.search, { invalidateAll: true });
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

  // Helper to get survival entries
  $: survivalEntries = data.survivalLeaderboard?.data ?? [];
  $: survivalPagination = data.survivalLeaderboard?.pagination;
  $: flightEntries = data.flightLeaderboard?.data ?? [];
  $: flightPagination = data.flightLeaderboard?.pagination;
</script>

<div class="leaderboard-container">
  <!-- Header with Tabs -->
  <div class="header-section">
    <div class="header-row">
      <div class="header-left">
        <img 
          src="https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/logos/Coz_Logo_Final_w_Text-NoBG.png" 
          class="logo" 
          alt="Cosmic Collisions Logo"
        />
        <h1 class="jersey-font page-header green-header-text">Leaderboards</h1>
      </div>
      
      {#if !data.error}
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
      {/if}
    </div>
  </div>

  <!-- Leaderboard Content -->
  <div class="leaderboard-content">
    {#if data.error}
      <!-- Error State -->
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h2 class="error-title">Unable to Load Leaderboards</h2>
        <p class="error-message">{data.error}</p>
        <button class="retry-button" on:click={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    {:else if isLoading}
      <!-- Skeleton Loading State -->
      <div class="leaderboard-list">
        {#each Array(10) as _, i}
          <div class="leaderboard-card skeleton-card">
            <div class="rank-badge skeleton-badge">
              <span class="skeleton-text skeleton-rank"></span>
            </div>
            
            <div class="player-info">
              <div class="player-avatar skeleton-avatar"></div>
              <div class="player-details">
                <span class="skeleton-text skeleton-name"></span>
                <span class="skeleton-text skeleton-time-ago"></span>
              </div>
            </div>

            <div class="stats-container">
              <div class="stat-item">
                <span class="skeleton-text skeleton-stat-value"></span>
                <span class="skeleton-text skeleton-stat-label"></span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="skeleton-text skeleton-stat-value"></span>
                <span class="skeleton-text skeleton-stat-label"></span>
              </div>
              <div class="stat-divider hidden md:block"></div>
              <div class="stat-item hidden md:flex">
                <span class="skeleton-text skeleton-stat-value"></span>
                <span class="skeleton-text skeleton-stat-label"></span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {:else if activeTab === "survival"}
      {#if survivalEntries.length === 0}
        <div class="empty-state">
          <div class="empty-icon">🏆</div>
          <p>No scores yet. Be the first to claim the top spot!</p>
        </div>
      {:else}
        <div class="leaderboard-list">
          {#each survivalEntries as entry}
            <div class="leaderboard-card {getRankStyle(entry.rank)}">
              <div class="rank-badge {getRankStyle(entry.rank)}">
                <span class="rank-text">{getRankIcon(entry.rank)}</span>
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
        
        <!-- Survival Pagination -->
        {#if survivalPagination && survivalPagination.totalPages > 1}
          <div class="pagination">
            <button 
              class="page-btn" 
              disabled={!survivalPagination.hasPrev}
              on:click={() => goToPage('survival', survivalPagination.page - 1)}
            >
              ← Prev
            </button>
            <span class="page-info">
              Page {survivalPagination.page} of {survivalPagination.totalPages}
              <span class="total-count">({survivalPagination.total} players)</span>
            </span>
            <button 
              class="page-btn" 
              disabled={!survivalPagination.hasNext}
              on:click={() => goToPage('survival', survivalPagination.page + 1)}
            >
              Next →
            </button>
          </div>
        {/if}
      {/if}
    {/if}

    {#if activeTab === "flight"}
      {#if flightEntries.length === 0}
        <div class="empty-state">
          <div class="empty-icon">🏆</div>
          <p>No scores yet. Be the first to claim the top spot!</p>
        </div>
      {:else}
        <div class="leaderboard-list">
          {#each flightEntries as entry}
            <div class="leaderboard-card {getRankStyle(entry.rank)}">
              <div class="rank-badge {getRankStyle(entry.rank)}">
                <span class="rank-text">{getRankIcon(entry.rank)}</span>
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
        
        <!-- Flight Pagination -->
        {#if flightPagination && flightPagination.totalPages > 1}
          <div class="pagination">
            <button 
              class="page-btn" 
              disabled={!flightPagination.hasPrev}
              on:click={() => goToPage('flight', flightPagination.page - 1)}
            >
              ← Prev
            </button>
            <span class="page-info">
              Page {flightPagination.page} of {flightPagination.totalPages}
              <span class="total-count">({flightPagination.total} players)</span>
            </span>
            <button 
              class="page-btn" 
              disabled={!flightPagination.hasNext}
              on:click={() => goToPage('flight', flightPagination.page + 1)}
            >
              Next →
            </button>
          </div>
        {/if}
      {/if}
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
    margin-bottom: 1rem;
  }

  .header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .logo {
    height: 50px;
  }

  .page-header {
    font-size: 1.5rem;
    margin: 0;
  }

  /* Tab Switcher */
  .tab-container {
    display: flex;
    gap: 0.375rem;
    background: rgba(255, 255, 255, 0.05);
    padding: 0.25rem;
    border-radius: 0.5rem;
  }

  .tab-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.375rem 0.75rem;
    background: transparent;
    border: none;
    border-radius: 0.375rem;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 600;
    font-size: 0.75rem;
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
    font-size: 1rem;
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
    gap: 0.5rem;
  }

  /* Leaderboard Card */
  .leaderboard-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.875rem;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.625rem;
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
    min-width: 2.25rem;
    height: 2.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    font-weight: bold;
    color: rgba(255, 255, 255, 0.8);
  }

  .rank-badge.rank-gold {
    background: linear-gradient(145deg, rgba(255, 215, 0, 0.3), rgba(218, 165, 32, 0.2));
    border: 1px solid rgba(255, 215, 0, 0.5);
    color: #FFD700;
  }

  .rank-badge.rank-silver {
    background: linear-gradient(145deg, rgba(192, 192, 192, 0.3), rgba(160, 160, 160, 0.2));
    border: 1px solid rgba(192, 192, 192, 0.5);
    color: #E8E8E8;
  }

  .rank-badge.rank-bronze {
    background: linear-gradient(145deg, rgba(205, 127, 50, 0.3), rgba(139, 69, 19, 0.2));
    border: 1px solid rgba(205, 127, 50, 0.5);
    color: #CD9A6D;
  }

  .rank-text {
    font-size: 0.95rem;
  }

  /* Player Info */
  .player-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    min-width: 0;
  }

  .player-avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: linear-gradient(145deg, #00c400, #006600);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.9rem;
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
    font-size: 0.85rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .player-time {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.65rem;
  }

  /* Stats Container */
  .stats-container {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-width: 45px;
  }

  .stat-value {
    font-size: 1rem;
    font-weight: bold;
    color: white;
  }

  .stat-label {
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .stat-divider {
    width: 1px;
    height: 1.5rem;
    background: rgba(255, 255, 255, 0.2);
  }

  /* Skeleton Loading UI */
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  .skeleton-card {
    pointer-events: none;
  }

  .skeleton-text {
    display: block;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 0.25rem;
  }

  .skeleton-badge {
    background: rgba(255, 255, 255, 0.06) !important;
  }

  .skeleton-rank {
    width: 1.25rem;
    height: 1rem;
  }

  .skeleton-avatar {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    ) !important;
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-name {
    width: 80px;
    height: 0.85rem;
    margin-bottom: 0.25rem;
  }

  .skeleton-time-ago {
    width: 50px;
    height: 0.6rem;
  }

  .skeleton-stat-value {
    width: 40px;
    height: 1rem;
    margin-bottom: 0.25rem;
  }

  .skeleton-stat-label {
    width: 30px;
    height: 0.5rem;
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

  /* Error State */
  .error-state {
    text-align: center;
    padding: 3rem 2rem;
    background: rgba(239, 68, 68, 0.1);
    border-radius: 1rem;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  .error-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .error-title {
    color: #ef4444;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .error-message {
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 1.5rem;
  }

  .retry-button {
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .retry-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  }

  /* Mobile Responsive */
  @media (max-width: 640px) {
    .leaderboard-container {
      padding: 0.75rem;
    }

    .header-row {
      flex-direction: column;
      gap: 0.75rem;
    }

    .header-left {
      gap: 0.5rem;
    }

    .logo {
      height: 40px;
    }

    .page-header {
      font-size: 1.25rem;
    }

    .tab-container {
      width: 100%;
      justify-content: center;
    }

    .tab-button {
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
    }

    .tab-icon {
      font-size: 1rem;
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
      padding: 0.5rem 0.625rem;
      gap: 0.5rem;
    }

    .rank-badge {
      min-width: 2rem;
      height: 2rem;
    }

    .rank-text {
      font-size: 0.85rem;
    }

    .player-avatar {
      width: 1.75rem;
      height: 1.75rem;
      font-size: 0.8rem;
    }

    .player-name {
      font-size: 0.8rem;
    }

    .stats-container {
      width: 100%;
      justify-content: center;
      padding-top: 0.375rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      gap: 1rem;
    }

    .stat-item {
      min-width: auto;
    }

    .stat-value {
      font-size: 0.9rem;
    }

    .stat-label {
      font-size: 0.55rem;
    }

    .stat-divider {
      height: 1.25rem;
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

  /* Pagination */
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
  }

  .page-btn {
    padding: 0.625rem 1.25rem;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.5rem;
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .page-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  .page-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .page-info {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    font-weight: 500;
  }

  .total-count {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.8rem;
    margin-left: 0.5rem;
  }

  @media (max-width: 640px) {
    .pagination {
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .page-btn {
      padding: 0.5rem 1rem;
      font-size: 0.8rem;
    }

    .page-info {
      width: 100%;
      text-align: center;
      order: -1;
    }
  }
</style>
