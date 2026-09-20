import React from "react";
import { X, Play, Clock, Calendar, Star, Sparkles, CheckCircle2, Bookmark } from "lucide-react";
import { sound } from "../../services/audioService";

export default function EpisodeModal({ episode, isOpen, onClose }) {
  if (!isOpen || !episode) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#070f26] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#193275]/80 overflow-hidden text-left text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Frame */}
        <div className="relative aspect-video w-full bg-slate-950">
          <img
            src={episode.thumbnail}
            alt={episode.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors border border-[#193275]/50"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner Meta Overlay */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-sky-500 text-white text-xs font-bold font-mono">
                {episode.season} • Episode {episode.episodeNumber}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#070f26]/80 text-sky-200 border border-[#193275]/70 text-xs font-medium backdrop-blur-xs">
                {episode.era === "classic" ? "1979 Classic" : "2005 Modern"}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-white">
              {episode.title}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Quick Info Badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 pb-4 border-b border-[#193275]/60">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-sky-400" /> Air Date: {episode.airDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-amber-400" /> Duration: {episode.duration}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Fan Rating: {episode.rating} / 5.0
            </span>
            <span className="text-emerald-300 bg-emerald-950/40 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
              {episode.genre}
            </span>
          </div>

          {/* Full Plot Description */}
          <div>
            <h4 className="text-xs font-bold text-sky-300/80 uppercase tracking-wider mb-2">
              Episode Narrative & Plot
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {episode.synopsis}
            </p>
          </div>

          {/* Moral Lesson Highlight */}
          <div className="bg-amber-950/40 rounded-2xl p-4 border border-amber-500/30 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Fujiko F. Fujio&apos;s Life Lesson
              </h5>
              <p className="text-xs text-amber-200 mt-1 font-medium leading-relaxed italic">
                &ldquo;{episode.moral}&rdquo;
              </p>
            </div>
          </div>

          {/* Featured Gadgets */}
          <div>
            <h4 className="text-xs font-bold text-sky-300/80 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Featured 22nd-Century Gadgets
            </h4>
            <div className="flex flex-wrap gap-2">
              {episode.featuredGadgets.map((gadget) => (
                <div
                  key={gadget}
                  className="px-3 py-1.5 rounded-xl bg-[#0b1636] border border-[#193275]/70 text-xs font-bold text-sky-300"
                >
                  {gadget}
                </div>
              ))}
            </div>
          </div>

          {/* Simulated Player / Stream Links */}
          <div className="pt-2 border-t border-[#193275]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              Available via official licensed broadcast archives
            </span>
            <button
              onClick={() => {
                sound.playBellChime();
                alert("Simulated episode preview playback starting for " + episode.title);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch Official Preview</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
