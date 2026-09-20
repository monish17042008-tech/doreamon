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
      className="bg-white rounded-3xl border border-slate-200/80 shadow-soft hover:shadow-card transition-all duration-200 flex flex-col justify-between overflow-hidden group cursor-pointer"
    >
      <div>
        {/* Thumbnail Frame */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
          <img
            src={episode.thumbnail}
            alt={episode.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

          {/* Era Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-xs font-bold shadow-xs">
            <span
              className={`w-2 h-2 rounded-full ${isClassic ? "bg-amber-500" : "bg-sky-500"}`}
            />
            <span className={isClassic ? "text-amber-800" : "text-sky-800"}>
              {isClassic ? "1979 Classic" : "2005 Modern"}
            </span>
          </div>

          {/* Rating */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-bold">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{episode.rating}</span>
          </div>

          {/* Center Play Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/90 group-hover:bg-sky-500 text-slate-800 group-hover:text-white shadow-md flex items-center justify-center transition-all transform group-hover:scale-110">
              <Play className="w-5 h-5 ml-0.5 fill-current" />
            </div>
          </div>

          {/* Duration & Ep Number */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90 font-medium">
            <span className="font-mono bg-sky-600/90 px-2 py-0.5 rounded text-[11px] font-bold">
              Ep {episode.episodeNumber}
            </span>
            <span className="flex items-center gap-1 font-mono text-[11px] bg-black/60 px-2 py-0.5 rounded">
              <Clock className="w-3 h-3 text-sky-300" />
              {episode.duration}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {episode.airDate}
            </span>
            <span className="text-sky-600 font-semibold">{episode.genre}</span>
          </div>

          <h3 className="text-base font-bold text-slate-800 group-hover:text-sky-600 transition-colors line-clamp-1">
            {episode.title}
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed mt-3 line-clamp-2">
            {episode.synopsis}
          </p>

          {/* Featured Gadgets */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
            {episode.featuredGadgets.map((gadget) => (
              <span
                key={gadget}
                className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 text-[11px] font-semibold"
              >
                {gadget}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium text-slate-400">Moral Takeaway</span>
        <span className="font-bold text-sky-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
          Inspect Details →
        </span>
      </div>
    </div>
  );
}
