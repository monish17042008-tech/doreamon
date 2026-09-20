import { charactersData } from "../data/charactersData";
import { db } from "./firebase";
import {
  doc,
  setDoc,
  increment,
  onSnapshot,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp
} from "firebase/firestore";

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

let isVotesFirestoreListening = false;
let isLeaderboardFirestoreListening = false;

export const storageService = {
  // Connection state
  isFirestoreActive: Boolean(db),

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

  saveVotes(votes, syncToFirestore = false) {
    try {
      localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(votes));
      window.dispatchEvent(new CustomEvent("doraemon_votes_updated", { detail: votes }));
    } catch (e) {
      console.warn("Failed to persist votes locally:", e);
    }

    if (syncToFirestore && db) {
      const votesDocRef = doc(db, "character_votes", "totals");
      setDoc(votesDocRef, votes, { merge: true }).catch((err) => {
        console.warn("Firebase Firestore vote sync notice (check Firestore rules if offline):", err.message);
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

    // Immediate optimistic local update
    this.saveVotes(updatedVotes, false);

    // Sync incremental update to Firebase Firestore
    if (db) {
      const votesDocRef = doc(db, "character_votes", "totals");
      setDoc(
        votesDocRef,
        { [characterId]: increment(1) },
        { merge: true }
      ).catch((err) => {
        console.warn("Firebase vote increment error:", err.message);
      });
    }

    return updatedVotes;
  },

  subscribeVotes(callback) {
    // 1. Listen to local updates
    const localHandler = (event) => callback(event.detail);
    window.addEventListener("doraemon_votes_updated", localHandler);

    // 2. Start Firebase Firestore real-time listener if not already active
    let unsubFirestore = null;
    if (db && !isVotesFirestoreListening) {
      isVotesFirestoreListening = true;
      try {
        const votesDocRef = doc(db, "character_votes", "totals");
        unsubFirestore = onSnapshot(
          votesDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const remoteVotes = docSnap.data();
              const merged = { ...this.getVotes(), ...remoteVotes };
              this.saveVotes(merged, false);
              callback(merged);
            } else {
              // Pre-seed Firestore if collection is empty
              const initial = this.getVotes();
              setDoc(votesDocRef, initial, { merge: true }).catch(() => {});
            }
          },
          (error) => {
            console.warn("Firebase character votes subscription notice:", error.message);
          }
        );
      } catch (err) {
        console.warn("Could not attach Firestore votes listener:", err);
      }
    }

    return () => {
      window.removeEventListener("doraemon_votes_updated", localHandler);
      if (unsubFirestore) {
        unsubFirestore();
        isVotesFirestoreListening = false;
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

    // Sync score to Firebase Firestore
    if (db) {
      const leaderboardCol = collection(db, "leaderboard");
      addDoc(leaderboardCol, {
        playerName: newEntry.playerName,
        score: newEntry.score,
        dorayakis: newEntry.dorayakis,
        date: newEntry.date,
        badge: newEntry.badge,
        createdAt: serverTimestamp()
      }).catch((err) => {
        console.warn("Firebase score submit notice:", err.message);
      });
    }

    return combined;
  },

  subscribeLeaderboard(callback) {
    // 1. Listen to local events
    const localHandler = (event) => callback(event.detail);
    window.addEventListener("doraemon_leaderboard_updated", localHandler);

    // 2. Start Firebase Firestore real-time listener if not already active
    let unsubFirestore = null;
    if (db && !isLeaderboardFirestoreListening) {
      isLeaderboardFirestoreListening = true;
      try {
        const leaderboardCol = collection(db, "leaderboard");
        const q = query(leaderboardCol, orderBy("score", "desc"), limit(15));

        unsubFirestore = onSnapshot(
          q,
          (snapshot) => {
            if (!snapshot.empty) {
              const remoteList = snapshot.docs.map((docSnap, index) => {
                const data = docSnap.data();
                return {
                  id: docSnap.id,
                  playerName: data.playerName || "Anonymous Pilot",
                  score: data.score || 0,
                  dorayakis: data.dorayakis || 0,
                  date: data.date || "",
                  badge: data.badge || "Pilot",
                  rank: index + 1
                };
              });
              this.saveLeaderboard(remoteList);
              callback(remoteList);
            }
          },
          (error) => {
            console.warn("Firebase leaderboard subscription notice:", error.message);
          }
        );
      } catch (err) {
        console.warn("Could not attach Firestore leaderboard listener:", err);
      }
    }

    return () => {
      window.removeEventListener("doraemon_leaderboard_updated", localHandler);
      if (unsubFirestore) {
        unsubFirestore();
        isLeaderboardFirestoreListening = false;
      }
    };
  }
};
