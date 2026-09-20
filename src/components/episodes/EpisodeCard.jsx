import React from "react";
import { Play, Clock, Star, Sparkles, Calendar } from "lucide-react";
import { sound } from "../../services/audioService";

export default function EpisodeCard({ episode, onSelect }) {
  const isClassic = episode.era === "classic";

  return (
    <div
      onClick={() => {
        sound.playBellChime();
        onSelect(episode);
      }}
      className="bg-[#0b1636] rounded-3xl border border-[#193275]/70 hover:border-sky-400/60 shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group cursor-pointer"
    >
      <div>
        {/* Thumbnail Frame */}
        <div className="relative aspect-video w-full overflow-hidden bg-[#070f26]">
          <img
            src={episode.thumbnail}
            alt={episode.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

          {/* Era Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#070f26]/90 border border-[#193275]/70 backdrop-blur-xs text-xs font-bold shadow-xs">
            <span
              className={`w-2 h-2 rounded-full ${isClassic ? "bg-amber-400" : "bg-sky-400"}`}
            />
            <span className={isClassic ? "text-amber-300" : "text-sky-300"}>
              {isClassic ? "1979 Classic" : "2005 Modern"}
            </span>
          </div>

          {/* Rating */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-bold border border-[#193275]/50">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{episode.rating}</span>
          </div>

          {/* Center Play Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[#070f26]/80 border border-[#193275] group-hover:bg-sky-500 text-sky-200 group-hover:text-white shadow-md flex items-center justify-center transition-all transform group-hover:scale-110">
              <Play className="w-5 h-5 ml-0.5 fill-current" />
            </div>
          </div>

          {/* Duration & Ep Number */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90 font-medium">
            <span className="font-mono bg-sky-600/90 px-2 py-0.5 rounded text-[11px] font-bold">
              Ep {episode.episodeNumber}
            </span>
            <span className="flex items-center gap-1 font-mono text-[11px] bg-black/70 px-2 py-0.5 rounded border border-white/10">
              <Clock className="w-3 h-3 text-sky-300" />
              {episode.duration}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <div className="flex items-center justify-between text-xs text-sky-300/80 mb-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {episode.airDate}
            </span>
            <span className="text-sky-400 font-semibold">{episode.genre}</span>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-1">
            {episode.title}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed mt-3 line-clamp-2">
            {episode.synopsis}
          </p>

          {/* Featured Gadgets */}
          <div className="mt-4 pt-3 border-t border-[#193275]/60 flex flex-wrap gap-1.5">
            {episode.featuredGadgets.map((gadget) => (
              <span
                key={gadget}
                className="px-2 py-0.5 rounded-md bg-[#070f26] border border-[#193275]/60 text-sky-300 text-[11px] font-semibold"
              >
                {gadget}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-[#070f26] border-t border-[#193275]/60 flex items-center justify-between text-xs text-slate-400">
        <span className="font-medium text-sky-300/70">Moral Takeaway</span>
        <span className="font-bold text-sky-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
          Inspect Details →
        </span>
      </div>
    </div>
  );
}
