import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Users, Filter } from "lucide-react";
import { charactersData } from "../data/charactersData";
import { storageService } from "../services/storageService";
import CharacterRankingBar from "../components/characters/CharacterRankingBar";
import CharacterCard from "../components/characters/CharacterCard";
import CharacterDetailModal from "../components/characters/CharacterDetailModal";

export default function Characters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [votes, setVotes] = useState(storageService.getVotes());
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    // Subscribe to live vote updates
    const unsubscribe = storageService.subscribeVotes((newVotes) => {
      setVotes(newVotes);
    });
    return unsubscribe;
  }, []);

  // Handle URL query param for direct character inspection (e.g. ?id=doraemon)
  useEffect(() => {
    const charId = searchParams.get("id");
    if (charId) {
      const match = charactersData.find((c) => c.id === charId);
      if (match) setSelectedCharacter(match);
    }
  }, [searchParams]);

  const handleVote = (characterId) => {
    const updated = storageService.castVote(characterId);
    setVotes(updated);
  };

  const totalVotes = charactersData.reduce((sum, c) => sum + (votes[c.id] || 0), 0);

  // Filtered characters
  const filteredCharacters = charactersData.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.bio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      filterRole === "all" ||
      (filterRole === "protagonist" && (c.id === "doraemon" || c.id === "nobita")) ||
      (filterRole === "friends" && (c.id === "shizuka" || c.id === "gian" || c.id === "suneo" || c.id === "dekisugi")) ||
      (filterRole === "future" && (c.id === "dorami" || c.id === "sewashi"));

    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-[#070f26] pb-20">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-b from-[#040817] via-[#071333] to-[#0b1b44] text-white py-14 px-4 border-b border-[#193275]/60 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#070f26]/80 border border-[#193275]/70 backdrop-blur-md text-sky-300 text-xs font-bold mb-3">
            <Users className="w-3.5 h-3.5 text-amber-300" />
            <span>Official Character Roster & Voting</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white">
            Beloved Characters
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-2xl">
            Explore deep biographies, voice actor credits, attribute charts, and vote for your favorite companion from the Doraemon universe!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-10 relative z-10">
        {/* Character Popularity Ranking Leaderboard */}
        <CharacterRankingBar characters={charactersData} votes={votes} />

        {/* Filter & Search Bar */}
        <div className="bg-[#0b1636] rounded-2xl p-4 border border-[#193275]/70 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-sky-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Filter characters by name or quote..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#070f26] border border-[#193275]/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
            />
          </div>

          {/* Role Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-sky-300/80 hidden sm:inline flex items-center gap-1">
              <Filter className="w-3 h-3" /> Category:
            </span>
            {[
              { id: "all", label: "All Members" },
              { id: "protagonist", label: "Protagonists" },
              { id: "friends", label: "Classmates & Friends" },
              { id: "future", label: "22nd Century" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilterRole(btn.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterRole === btn.id
                    ? "bg-sky-500 text-white shadow-xs"
                    : "bg-[#070f26] text-slate-300 border border-[#193275]/60 hover:bg-[#0f1f4b]"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              votes={votes}
              totalVotes={totalVotes}
              onVote={handleVote}
              onSelect={(c) => {
                setSelectedCharacter(c);
                setSearchParams({ id: c.id });
              }}
            />
          ))}
        </div>
      </div>

      {/* Character Detail Modal */}
      <CharacterDetailModal
        character={selectedCharacter}
        isOpen={Boolean(selectedCharacter)}
        onClose={() => {
          setSelectedCharacter(null);
          setSearchParams({});
        }}
        votes={votes}
        totalVotes={totalVotes}
        onVote={handleVote}
      />
    </div>
  );
}
