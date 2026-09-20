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
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 overflow-hidden text-left"
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
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner Meta Overlay */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-sky-500 text-white text-xs font-bold font-mono">
                {episode.season} • Episode {episode.episodeNumber}
              </span>
              <span className="px-2 py-0.5 rounded bg-white/20 text-white text-xs font-medium backdrop-blur-xs">
                {episode.era === "classic" ? "1979 Classic" : "2005 Modern"}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-white">
              {episode.title}
            </h2>
            <p className="text-xs text-sky-200 font-serif">
              {episode.japaneseTitle}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Quick Info Badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 pb-4 border-b border-slate-100">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-sky-500" /> Air Date: {episode.airDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-amber-500" /> Duration: {episode.duration}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Fan Rating: {episode.rating} / 5.0
            </span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {episode.genre}
            </span>
          </div>

          {/* Full Plot Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Episode Narrative & Plot
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed font-sans">
              {episode.synopsis}
            </p>
          </div>

          {/* Moral Lesson Highlight */}
          <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/80 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Fujiko F. Fujio&apos;s Life Lesson
              </h5>
              <p className="text-xs text-amber-900/90 mt-1 font-medium leading-relaxed italic">
                &ldquo;{episode.moral}&rdquo;
              </p>
            </div>
          </div>

          {/* Featured Gadgets */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" /> Featured 22nd-Century Gadgets
            </h4>
            <div className="flex flex-wrap gap-2">
              {episode.featuredGadgets.map((gadget) => (
                <div
                  key={gadget}
                  className="px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-xs font-bold text-sky-800"
                >
                  {gadget}
                </div>
              ))}
            </div>
          </div>

          {/* Simulated Player / Stream Links */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              Available via official licensed broadcast archives
            </span>
            <button
              onClick={() => {
                sound.playBellChime();
                alert("Simulated episode preview playback starting for " + episode.title);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md transition-all"
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
