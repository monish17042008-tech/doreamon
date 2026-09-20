import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Play, ArrowRight, Clock, Star, X } from "lucide-react";
import { episodesData } from "../../data/episodesData";
import { sound } from "../../services/audioService";

export default function PopularEpisodesRow() {
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  // Curate popular classic episodes as seen in the reference image
  const popularEpisodes = episodesData.filter(
    (e) => e.episodeNumber === 2 || e.episodeNumber === 12 || e.episodeNumber === 25
  );

  const handleOpenEpisode = (ep) => {
    sound.playBellChime();
    setSelectedEpisode(ep);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
          Popular Episodes
        </h2>
        <Link
          to="/episodes"
          onClick={() => sound.playClick()}
          className="inline-flex items-center gap-1 text-sm font-bold text-sky-400 hover:text-sky-300 transition-colors group"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Episode Cards Grid matching reference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {popularEpisodes.map((ep) => (
          <div
            key={ep.id}
            onClick={() => handleOpenEpisode(ep)}
            className="group bg-[#0b1636] rounded-2xl border border-[#193275]/70 hover:border-sky-400/60 overflow-hidden shadow-lg transition-all duration-200 cursor-pointer flex flex-col"
          >
            {/* Thumbnail with overlay & badge */}
            <div className="relative aspect-video w-full overflow-hidden bg-[#070f26]">
              <img
                src={ep.thumbnail}
                alt={ep.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

              {/* Play Button Indicator */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#070f26]/80 border border-[#193275] group-hover:bg-sky-500 text-sky-200 group-hover:text-white shadow-lg flex items-center justify-center transition-all transform group-hover:scale-110">
                  <Play className="w-5 h-5 ml-0.5 fill-current" />
                </div>
              </div>

              {/* Era Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-[#070f26]/90 backdrop-blur-sm border border-[#193275]/70 text-sky-300 text-[11px] font-bold shadow-xs">
                Classic
              </div>

              {/* Duration */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950/90 text-white text-[11px] font-mono border border-[#193275]/40">
                <Clock className="w-3 h-3 text-sky-300" />
                <span>{ep.duration}</span>
              </div>
            </div>

            {/* Info Body */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                  {ep.title}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-300">
                  <span className="flex items-center gap-1 text-sky-400 font-semibold">
                    <Play className="w-3 h-3 fill-sky-400" /> Episode {ep.episodeNumber}
                  </span>
                  <span>•</span>
                  <span>{ep.airDate}</span>
                </div>
              </div>

              {/* Featured Gadget Tags */}
              <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-[#193275]/60">
                {ep.featuredGadgets.map((gadget) => (
                  <span
                    key={gadget}
                    className="px-2 py-0.5 rounded-md bg-[#070f26] border border-[#193275]/60 text-sky-300 text-[11px] font-medium"
                  >
                    {gadget}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Episode Quick Detail Modal */}
      {selectedEpisode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#070f26] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#193275]/80 text-white">
            <div className="relative aspect-video w-full bg-slate-950">
              <img
                src={selectedEpisode.thumbnail}
                alt={selectedEpisode.title}
                className="w-full h-full object-cover opacity-80"
              />
              <button
                onClick={() => setSelectedEpisode(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center border border-[#193275]/60"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-4 right-4">
                <span className="px-2 py-0.5 rounded bg-sky-500 text-white text-xs font-bold">
                  Episode {selectedEpisode.episodeNumber}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedEpisode.title}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4 text-left">
              <div>
                <h4 className="text-xs font-bold text-sky-300/80 uppercase tracking-wider">Synopsis</h4>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                  {selectedEpisode.synopsis}
                </p>
              </div>

              <div className="bg-amber-950/40 rounded-xl p-3 border border-amber-500/30">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Moral Lesson
                </h4>
                <p className="text-xs text-amber-200 mt-1 font-medium italic">
                  &ldquo;{selectedEpisode.moral}&rdquo;
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-sky-300/80 uppercase tracking-wider mb-1.5">
                  Featured 22nd-Century Gadgets
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEpisode.featuredGadgets.map((g) => (
                    <span
                      key={g}
                      className="px-2.5 py-1 rounded-lg bg-[#0b1636] border border-[#193275]/70 text-sky-300 text-xs font-bold"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  to={`/episodes?id=${selectedEpisode.id}`}
                  onClick={() => setSelectedEpisode(null)}
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold shadow-md"
                >
                  View Full Episode Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
