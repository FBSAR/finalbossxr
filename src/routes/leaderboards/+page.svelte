<script lang="ts">
  import { page } from '$app/stores';
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
</script>

<div class="mx-auto w-1/2">
  <h1 class="jersey-font page-header green-header-text mt-4 mb-6">
    <img 
      src="https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/logos/Coz_Logo_Final_w_Text-NoBG.png" 
      class="inline h-32" 
      alt="Cosmic Collisions Logo"
    >
    Leaderboards
  </h1>

  <!-- Tabs -->
  <div class="flex border-b border-gray-700 mb-4">
    <button
      class="px-4 py-2 -mb-px font-semibold border-b-2"
      class:border-green-500={activeTab === "survival"}
      class:border-transparent={activeTab !== "survival"}
      on:click={() => selectTab("survival")}
    >
      Survival Mode
    </button>
    <button
      class="px-4 py-2 -mb-px font-semibold border-b-2"
      class:border-green-500={activeTab === "flight"}
      class:border-transparent={activeTab !== "flight"}
      on:click={() => selectTab("flight")}
    >
      Flight Mode
    </button>
  </div>

  <!-- Survival Leaderboard -->
  {#if activeTab === "survival"}
    <section>
      <table class="w-full border-collapse mb-6">
        <thead>
          <tr>
            <th class="border gold-header-text jersey-font text-2xl px-2 py-1">Username</th>
            <th class="border gold-header-text jersey-font text-2xl px-2 py-1">Points</th>
            <th class="border gold-header-text jersey-font text-2xl px-2 py-1">Wave</th>
            <th class="border gold-header-text jersey-font text-2xl px-2 py-1">Time</th>
            <th class="border gold-header-text jersey-font text-2xl px-2 py-1">Recorded</th>
          </tr>
        </thead>
        <tbody>
          {#each data.survivalLeaderboard as entry}
            <tr class="text-white">
              <td class="border px-2 py-1 font-bold">{entry.username}</td>
              <td class="border px-2 py-1">{entry.points}</td>
              <td class="border px-2 py-1">{entry.wave}</td>
              <td class="border px-2 py-1">{entry.time}</td>
              <td class="border px-2 py-1">{timeAgo(entry.createdAt)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </section>
  {/if}

  <!-- Flight Leaderboard -->
  {#if activeTab === "flight"}
    <section>
      <table class="w-full border-collapse mb-6">
        <thead>
          <tr>
            <th class="border gold-header-text jersey-font text-2xl px-2 py-1">Username</th>
            <th class="border gold-header-text jersey-font text-2xl px-2 py-1">Time (s)</th>
            <th class="border gold-header-text jersey-font text-2xl px-2 py-1">Recorded</th>
          </tr>
        </thead>
        <tbody>
          {#each data.flightLeaderboard as entry}
            <tr class="text-white">
              <td class="border px-2 py-1 font-bold">{entry.username}</td>
              <td class="border px-2 py-1">{entry.time}</td>
              <td class="border px-2 py-1">{timeAgo(entry.createdAt)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </section>
  {/if}
</div>

<style>
  button {
    background: none;
    color: white;
  }

  button:hover {
    color: #4ade80; /* green-400 */
  }

  button:focus {
    outline: none;
  }
</style>
