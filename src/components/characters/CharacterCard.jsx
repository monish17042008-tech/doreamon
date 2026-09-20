import React from "react";
import { Heart, Sparkles, ChevronRight, Utensils, AlertTriangle } from "lucide-react";
import confetti from "canvas-confetti";
import { sound } from "../../services/audioService";

export default function CharacterCard({ character, votes, totalVotes, onVote, onSelect }) {
  const charVotes = votes[character.id] || 0;
  const percentage = totalVotes > 0 ? ((charVotes / totalVotes) * 100).toFixed(1) : "0.0";

  const handleVoteClick = (e) => {
    e.stopPropagation();
    sound.playBellChime();

    // Trigger celebratory confetti burst from the button location
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { x, y },
      colors: [character.color, "#facc15", "#ef4444", "#38bdf8"]
    });

    onVote(character.id);
  };

  return (
    <div
      onClick={() => {
        sound.playClick();
        onSelect(character);
      }}
      className="bg-[#0b1636] rounded-3xl border border-[#193275]/70 hover:border-sky-400/60 shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group cursor-pointer"
    >
      <div>
        {/* Top Header Card Color Bar */}
        <div
          className="h-3 w-full transition-colors"
          style={{ backgroundColor: character.color }}
        />

        <div className="p-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white text-xl shadow-md transition-transform group-hover:scale-105"
                style={{ backgroundColor: character.color }}
              >
                {character.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                  {character.name}
                </h3>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#070f26] border border-[#193275]/60 text-sky-300 text-[10px] font-bold uppercase tracking-wider">
                  {character.badge}
                </span>
              </div>
            </div>

            {/* Vote percentage pill */}
            <div className="text-right">
              <span className="text-base font-extrabold text-sky-300 font-mono">
                {percentage}%
              </span>
              <p className="text-[10px] text-sky-300/70 font-medium">share of votes</p>
            </div>
          </div>

          {/* Bio Snippet */}
          <p className="text-xs text-slate-300 leading-relaxed mt-4 line-clamp-3">
            {character.bio}
          </p>

          {/* Quick Facts */}
          <div className="mt-4 pt-3 border-t border-[#193275]/60 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Utensils className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="text-sky-300/70 font-medium">Favorite:</span>
              <span className="font-semibold truncate text-white">{character.favoriteFood}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
              <span className="text-sky-300/70 font-medium">Weakness:</span>
              <span className="font-semibold truncate text-white">{character.weakness}</span>
            </div>
          </div>

          {/* Stats Preview Bar */}
          <div className="mt-4 pt-3 border-t border-[#193275]/60 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-sky-300/70">Kindness</span>
              <div className="w-full bg-[#070f26] border border-[#193275]/30 rounded-full h-1.5 mt-1 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${character.stats.kindness}%` }}
                />
              </div>
            </div>
            <div>
              <span className="text-sky-300/70">Bravery</span>
              <div className="w-full bg-[#070f26] border border-[#193275]/30 rounded-full h-1.5 mt-1 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${character.stats.bravery}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-6 py-4 bg-[#070f26] border-t border-[#193275]/60 flex items-center justify-between gap-3">
        <button
          onClick={handleVoteClick}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#0b1636] hover:bg-rose-950/40 border border-[#193275]/80 hover:border-rose-500/50 text-slate-200 hover:text-rose-300 text-xs font-bold shadow-xs transition-all active:scale-95 group/btn"
        >
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400 transition-transform group-hover/btn:scale-125" />
          <span>Vote ({charVotes.toLocaleString()})</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onSelect(character);
          }}
          className="p-2 rounded-xl text-sky-400 hover:text-white hover:bg-[#0f1f4b] transition-colors"
          title="View Character Dossier"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
