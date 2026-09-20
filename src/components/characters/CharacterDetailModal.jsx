import React from "react";
import { X, Heart, Quote, Sparkles, Shield, Award, Calendar, Ruler, Scale, Mic } from "lucide-react";
import confetti from "canvas-confetti";
import { sound } from "../../services/audioService";

export default function CharacterDetailModal({ character, isOpen, onClose, votes, totalVotes, onVote }) {
  if (!isOpen || !character) return null;

  const charVotes = votes[character.id] || 0;
  const percentage = totalVotes > 0 ? ((charVotes / totalVotes) * 100).toFixed(1) : "0.0";

  const handleVoteClick = (e) => {
    sound.playBellChime();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: [character.color, "#facc15", "#ef4444", "#38bdf8"]
    });
    onVote(character.id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div
          className="relative p-6 sm:p-8 text-white flex items-center justify-between"
          style={{ backgroundColor: character.color }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-2xl border border-white/30 shadow-inner">
              {character.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
                  {character.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-white/25 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                  {character.badge}
                </span>
              </div>
              <p className="text-sm opacity-90 font-serif mt-0.5">
                {character.japaneseName} • {character.role}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Quote Banner */}
          {character.memorableQuote && (
            <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100 flex items-start gap-3">
              <Quote className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm italic font-medium text-sky-950">
                &ldquo;{character.memorableQuote}&rdquo;
              </p>
            </div>
          )}

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
              <Calendar className="w-4 h-4 text-sky-500 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Birthday</span>
              <span className="text-xs font-bold text-slate-700">{character.birthDate}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
              <Ruler className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Height</span>
              <span className="text-xs font-bold text-slate-700">{character.height}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
              <Scale className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Weight</span>
              <span className="text-xs font-bold text-slate-700">{character.weight}</span>
            </div>
          </div>

          {/* Full Biography */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Character Lore & Backstory
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {character.bio}
            </p>
          </div>

          {/* Core Attribute Radar / Bars */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Attribute Ratings
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-600">Kindness & Empathy</span>
                  <span className="text-slate-800">{character.stats.kindness}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${character.stats.kindness}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-600">Intelligence & Logic</span>
                  <span className="text-slate-800">{character.stats.intelligence}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: `${character.stats.intelligence}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-600">Bravery in Crisis</span>
                  <span className="text-slate-800">{character.stats.bravery}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${character.stats.bravery}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-600">Gadget Handling</span>
                  <span className="text-slate-800">{character.stats.gadgetSkill}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${character.stats.gadgetSkill}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Voice Actors & Signature Gadgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                <Mic className="w-3.5 h-3.5 text-sky-500" />
                <span>Iconic Voice Actors</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {character.voiceActors}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Signature Gadgets</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {character.signatureGadgets.map((gadget) => (
                  <span key={gadget} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-semibold text-slate-700">
                    {gadget}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Voting Action Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-xs text-slate-400 font-medium">Current Community Standing</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-black text-slate-800 font-mono">
                  {charVotes.toLocaleString()} votes
                </span>
                <span className="text-xs font-bold text-sky-600">({percentage}% of total)</span>
              </div>
            </div>

            <button
              onClick={handleVoteClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-md shadow-rose-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>Cast Your Vote for {character.name}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
