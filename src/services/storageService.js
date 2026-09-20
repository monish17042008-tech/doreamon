import { charactersData } from "../data/charactersData";

const VOTES_STORAGE_KEY = "doraemon_character_votes_v2";
const LEADERBOARD_STORAGE_KEY = "doraemon_sky_catch_leaderboard_v2";

// Initialize default votes from charactersData
function getDefaultVotes() {
  const votes = {};
  charactersData.forEach((char) => {
    votes[char.id] = char.initialVotes || 1000;
  });
  return votes;
}

// Default pre-seeded realistic leaderboard
const DEFAULT_LEADERBOARD = [
  { id: "score-1", playerName: "Dekisugi_Ace", score: 1840, dorayakis: 78, rank: 1, date: "2024-03-05", badge: "Legend" },
  { id: "score-2", playerName: "Sewashi_2112", score: 1620, dorayakis: 69, rank: 2, date: "2024-03-04", badge: "Master" },
  { id: "score-3", playerName: "Dorami_Genius", score: 1450, dorayakis: 62, rank: 3, date: "2024-03-03", badge: "Master" },
  { id: "score-4", playerName: "Shizuka_Violin", score: 1190, dorayakis: 51, rank: 4, date: "2024-03-02", badge: "Expert" },
  { id: "score-5", playerName: "Suneo_RC_King", score: 980, dorayakis: 42, rank: 5, date: "2024-03-01", badge: "Pro" },
  { id: "score-6", playerName: "Gian_Recital", score: 820, dorayakis: 35, rank: 6, date: "2024-02-28", badge: "Challenger" },
  { id: "score-7", playerName: "Nobita_NapHero", score: 650, dorayakis: 28, rank: 7, date: "2024-02-27", badge: "Novice" }
];

export const storageService = {
  // --- CHARACTER VOTES ---
  getVotes() {
    try {
      const stored = localStorage.getItem(VOTES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Local storage error:", e);
    }
    const defaults = getDefaultVotes();
    this.saveVotes(defaults);
    return defaults;
  },

  saveVotes(votes) {
    try {
      localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(votes));
      window.dispatchEvent(new CustomEvent("doraemon_votes_updated", { detail: votes }));
    } catch (e) {
      console.warn("Failed to persist votes:", e);
    }
  },

  castVote(characterId) {
    const currentVotes = this.getVotes();
    const updatedCount = (currentVotes[characterId] || 0) + 1;
    const updatedVotes = {
      ...currentVotes,
      [characterId]: updatedCount
    };
    this.saveVotes(updatedVotes);
    return updatedVotes;
  },

  subscribeVotes(callback) {
    const handler = (event) => callback(event.detail);
    window.addEventListener("doraemon_votes_updated", handler);
    return () => window.removeEventListener("doraemon_votes_updated", handler);
  },

  // --- GAME LEADERBOARD ---
  getLeaderboard() {
    try {
      const stored = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a, b) => b.score - a.score);
        }
      }
    } catch (e) {
      console.warn("Local storage error:", e);
    }
    this.saveLeaderboard(DEFAULT_LEADERBOARD);
    return DEFAULT_LEADERBOARD;
  },

  saveLeaderboard(entries) {
    try {
      localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(entries));
      window.dispatchEvent(new CustomEvent("doraemon_leaderboard_updated", { detail: entries }));
    } catch (e) {
      console.warn("Failed to persist leaderboard:", e);
    }
  },

  submitScore({ playerName, score, dorayakis }) {
    const currentList = this.getLeaderboard();
    const newEntry = {
      id: "score-" + Date.now(),
      playerName: playerName.trim() || "Anonymous Pilot",
      score: Math.max(0, score),
      dorayakis: dorayakis || 0,
      date: new Date().toISOString().split("T")[0],
      badge: score >= 1500 ? "Legend" : score >= 1000 ? "Master" : score >= 600 ? "Expert" : "Pilot"
    };

    const combined = [...currentList, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 15) // Top 15 scores
      .map((item, index) => ({
        ...item,
        rank: index + 1
      }));

    this.saveLeaderboard(combined);
    return combined;
  },

  subscribeLeaderboard(callback) {
    const handler = (event) => callback(event.detail);
    window.addEventListener("doraemon_leaderboard_updated", handler);
    return () => window.removeEventListener("doraemon_leaderboard_updated", handler);
  }
};
