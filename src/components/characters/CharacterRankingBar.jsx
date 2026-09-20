import React from "react";
import { Trophy, Award, Medal, Users } from "lucide-react";

export default function CharacterRankingBar({ characters, votes }) {
  // Calculate total votes
  const totalVotes = characters.reduce((sum, c) => sum + (votes[c.id] || 0), 0) || 1;

  // Sort characters by votes descending
  const sortedCharacters = [...characters].sort((a, b) => {
    const voteA = votes[a.id] || 0;
    const voteB = votes[b.id] || 0;
    return voteB - voteA;
  });

  const topThree = sortedCharacters.slice(0, 3);

  const getRankBadge = (index) => {
    if (index === 0) {
      return (
        <span className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          <Trophy className="w-3.5 h-3.5 fill-amber-500" /> #1 Champion
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="flex items-center gap-1 text-slate-500 font-bold text-xs bg-slate-100 px-2 py-0.5 rounded-full border border-slate-300">
          <Medal className="w-3.5 h-3.5" /> #2 Runner-Up
        </span>
      );
    }
    if (index === 2) {
      return (
        <span className="flex items-center gap-1 text-amber-700 font-bold text-xs bg-amber-100/60 px-2 py-0.5 rounded-full border border-amber-300">
          <Award className="w-3.5 h-3.5" /> #3 Bronze
        </span>
      );
    }
    return <span className="text-slate-400 font-bold text-xs">#{index + 1}</span>;
  };

  return (
    <div className="bg-[#0b1636] rounded-3xl p-6 sm:p-8 border border-[#193275]/70 shadow-xl text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#193275]/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-300">
              <Trophy className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
              Character Popularity Ranking
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Live global community votes across all timelines
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#070f26] border border-[#193275]/70 text-sky-300 text-xs font-bold">
          <Users className="w-4 h-4 text-sky-400" />
          <span>{totalVotes.toLocaleString()} Total Votes Cast</span>
        </div>
      </div>

      {/* Top 3 Podium Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        {topThree.map((char, index) => {
          const charVotes = votes[char.id] || 0;
          const percentage = ((charVotes / totalVotes) * 100).toFixed(1);

          return (
            <div
              key={char.id}
              className={`p-4 rounded-2xl border transition-all ${
                index === 0
                  ? "bg-gradient-to-b from-amber-950/30 to-[#070f26] border-amber-500/40 shadow-md"
                  : "bg-[#070f26] border-[#193275]/60"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                {getRankBadge(index)}
                <span className="text-xs font-mono font-bold text-sky-200">
                  {percentage}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-xs text-sm"
                  style={{ backgroundColor: char.color }}
                >
                  {char.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{char.name}</h4>
                  <p className="text-xs text-slate-400">{charVotes.toLocaleString()} votes</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-[#040817] rounded-full h-2 mt-3 overflow-hidden border border-[#193275]/30">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: char.color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Ranking Percentage Bars */}
      <div className="space-y-3 pt-2">
        {sortedCharacters.map((char, index) => {
          const charVotes = votes[char.id] || 0;
          const percentage = ((charVotes / totalVotes) * 100).toFixed(1);

          return (
            <div key={char.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-6 text-sky-400 font-mono text-[11px]">
                    #{index + 1}
                  </span>
                  <span className="text-white font-bold">{char.name}</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-slate-400 text-[11px]">{charVotes.toLocaleString()} votes</span>
                  <span className="font-bold text-sky-200 w-12 text-right">{percentage}%</span>
                </div>
              </div>
              <div className="w-full bg-[#070f26] rounded-full h-2.5 overflow-hidden border border-[#193275]/40">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: char.color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
