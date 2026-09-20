import { charactersData } from "../data/charactersData.js";
import { rtdb } from "./firebase.js";
import {
  ref,
  get,
  set,
  push,
  onValue,
  runTransaction
} from "firebase/database";

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

let isVotesListening = false;
let isLeaderboardListening = false;

export const storageService = {
  // Check live connection
  async checkConnection() {
    try {
      const start = Date.now();
      const votesRef = ref(rtdb, "votes");
      await get(votesRef);
      const latency = Date.now() - start;
      return {
        connected: true,
        database: "Firebase Realtime Database",
        url: "https://doreamon-web-default-rtdb.firebaseio.com",
        latency: `${latency}ms`
      };
    } catch (err) {
      return {
        connected: false,
        error: err.message
      };
    }
  },

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
    this.saveVotes(defaults, false);
    return defaults;
  },

  saveVotes(votes, syncToRemote = false) {
    try {
      localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(votes));
      window.dispatchEvent(new CustomEvent("doraemon_votes_updated", { detail: votes }));
    } catch (e) {
      console.warn("Failed to persist votes locally:", e);
    }

    if (syncToRemote && rtdb) {
      set(ref(rtdb, "votes"), votes).catch((err) => {
        console.warn("Firebase votes sync notice:", err.message);
      });
    }
  },

  castVote(characterId) {
    const currentVotes = this.getVotes();
    const updatedCount = (currentVotes[characterId] || 0) + 1;
    const updatedVotes = {
      ...currentVotes,
      [characterId]: updatedCount
    };

    // Optimistic local update
    this.saveVotes(updatedVotes, false);

    // Atomic transaction on Firebase Realtime Database
    if (rtdb) {
      const voteItemRef = ref(rtdb, `votes/${characterId}`);
      runTransaction(voteItemRef, (current) => {
        return (current || 0) + 1;
      }).catch((err) => {
        console.warn("Firebase vote transaction error:", err.message);
      });
    }

    return updatedVotes;
  },

  subscribeVotes(callback) {
    // 1. Listen to local updates
    const localHandler = (event) => callback(event.detail);
    window.addEventListener("doraemon_votes_updated", localHandler);

    // 2. Start Firebase Realtime Database listener
    let unsubRemote = null;
    if (rtdb && !isVotesListening) {
      isVotesListening = true;
      try {
        const votesRef = ref(rtdb, "votes");
        unsubRemote = onValue(
          votesRef,
          (snapshot) => {
            const data = snapshot.val();
            if (data && typeof data === "object") {
              const merged = { ...this.getVotes(), ...data };
              this.saveVotes(merged, false);
              callback(merged);
            } else {
              // Seed initial votes in database if empty
              const initial = this.getVotes();
              set(votesRef, initial).catch(() => {});
            }
          },
          (error) => {
            console.warn("Firebase votes subscription notice:", error.message);
          }
        );
      } catch (err) {
        console.warn("Could not attach RTDB votes listener:", err);
      }
    }

    return () => {
      window.removeEventListener("doraemon_votes_updated", localHandler);
      if (unsubRemote) {
        unsubRemote();
        isVotesListening = false;
      }
    };
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
      console.warn("Failed to persist leaderboard locally:", e);
    }
  },

  submitScore({ playerName, score, dorayakis }) {
    const currentList = this.getLeaderboard();
    const dateStr = new Date().toISOString().split("T")[0];
    const badge = score >= 1500 ? "Legend" : score >= 1000 ? "Master" : score >= 600 ? "Expert" : "Pilot";

    const newEntry = {
      id: "score-" + Date.now(),
      playerName: (playerName && playerName.trim()) || "Anonymous Pilot",
      score: Math.max(0, score),
      dorayakis: dorayakis || 0,
      date: dateStr,
      badge
    };

    const combined = [...currentList, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 15)
      .map((item, index) => ({
        ...item,
        rank: index + 1
      }));

    // Optimistic local update
    this.saveLeaderboard(combined);

    // Save to Firebase Realtime Database
    if (rtdb) {
      const leaderboardRef = ref(rtdb, "leaderboard");
      push(leaderboardRef, {
        playerName: newEntry.playerName,
        score: newEntry.score,
        dorayakis: newEntry.dorayakis,
        date: newEntry.date,
        badge: newEntry.badge,
        createdAt: Date.now()
      }).catch((err) => {
        console.warn("Firebase score push notice:", err.message);
      });
    }

    return combined;
  },

  subscribeLeaderboard(callback) {
    // 1. Listen to local events
    const localHandler = (event) => callback(event.detail);
    window.addEventListener("doraemon_leaderboard_updated", localHandler);

    // 2. Start Firebase Realtime Database listener
    let unsubRemote = null;
    if (rtdb && !isLeaderboardListening) {
      isLeaderboardListening = true;
      try {
        const leaderboardRef = ref(rtdb, "leaderboard");
        unsubRemote = onValue(
          leaderboardRef,
          (snapshot) => {
            const val = snapshot.val();
            if (val && typeof val === "object") {
              const entries = Object.keys(val).map((k) => ({
                id: k,
                ...val[k]
              }))
              .sort((a, b) => (b.score || 0) - (a.score || 0))
              .slice(0, 15)
              .map((item, index) => ({
                ...item,
                rank: index + 1
              }));

              this.saveLeaderboard(entries);
              callback(entries);
            } else {
              // Seed initial leaderboard if empty
              DEFAULT_LEADERBOARD.forEach((item) => {
                push(leaderboardRef, item).catch(() => {});
              });
            }
          },
          (error) => {
            console.warn("Firebase leaderboard subscription notice:", error.message);
          }
        );
      } catch (err) {
        console.warn("Could not attach RTDB leaderboard listener:", err);
      }
    }

    return () => {
      window.removeEventListener("doraemon_leaderboard_updated", localHandler);
      if (unsubRemote) {
        unsubRemote();
        isLeaderboardListening = false;
      }
    };
  }
};
