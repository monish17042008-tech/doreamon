import React, { useState, useEffect, useRef } from "react";
import { Search, X, Film, Tv, Users, Box, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { charactersData } from "../../data/charactersData";
import { episodesData } from "../../data/episodesData";
import { moviesData } from "../../data/moviesData";
import { gadgetsData } from "../../data/gadgetsData";
import { sound } from "../../services/audioService";

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          sound.playClick();
          // dispatch open
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingCharacters = q
    ? charactersData.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.role.toLowerCase().includes(q)
      )
    : [];

  const matchingEpisodes = q
    ? episodesData.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.synopsis.toLowerCase().includes(q) ||
          e.featuredGadgets.some((g) => g.toLowerCase().includes(q))
      )
    : [];

  const matchingMovies = q
    ? moviesData.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.year.toString().includes(q) ||
          m.synopsis.toLowerCase().includes(q)
      )
    : [];

  const matchingGadgets = q
    ? gadgetsData.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q)
      )
    : [];

  const hasResults =
    matchingCharacters.length > 0 ||
    matchingEpisodes.length > 0 ||
    matchingMovies.length > 0 ||
    matchingGadgets.length > 0;

  const handleSelect = (path) => {
    sound.playClick();
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-sky-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search characters, episodes, movies, gadgets..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-slate-400 bg-slate-100 rounded border border-slate-200 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query ? (
            <div className="py-8 text-center text-slate-400">
              <Search className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium">Type anything to explore the 22nd century</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {["Doraemon", "Anywhere Door", "Stand by Me", "Nobita's Dinosaur", "Memory Bread"].map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setQuery(suggestion)}
                      className="px-2.5 py-1 text-xs rounded-full bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : !hasResults ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for &quot;Nobita&quot;, &quot;Door&quot;, or &quot;1980&quot;</p>
            </div>
          ) : (
            <>
              {/* Characters */}
              {matchingCharacters.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    <Users className="w-3.5 h-3.5 text-sky-500" /> Characters
                  </h4>
                  <div className="space-y-1">
                    {matchingCharacters.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => handleSelect(`/characters?id=${c.id}`)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center font-bold text-sky-700 text-xs">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-slate-800 group-hover:text-sky-600">
                              {c.name}
                            </span>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{c.role}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-500 transition-transform group-hover:translate-x-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Episodes */}
              {matchingEpisodes.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    <Tv className="w-3.5 h-3.5 text-emerald-500" /> Episodes
                  </h4>
                  <div className="space-y-1">
                    {matchingEpisodes.map((e) => (
                      <div
                        key={e.id}
                        onClick={() => handleSelect(`/episodes?id=${e.id}`)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 cursor-pointer transition-colors group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                              Ep {e.episodeNumber}
                            </span>
                            <span className="font-semibold text-sm text-slate-800 group-hover:text-emerald-700">
                              {e.title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {e.synopsis}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-transform group-hover:translate-x-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Movies */}
              {matchingMovies.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    <Film className="w-3.5 h-3.5 text-amber-500" /> Theatrical Movies
                  </h4>
                  <div className="space-y-1">
                    {matchingMovies.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => handleSelect(`/movies?id=${m.id}`)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-50 cursor-pointer transition-colors group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                              {m.year}
                            </span>
                            <span className="font-semibold text-sm text-slate-800 group-hover:text-amber-700">
                              {m.title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {m.synopsis}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 transition-transform group-hover:translate-x-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gadgets */}
              {matchingGadgets.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    <Box className="w-3.5 h-3.5 text-pink-500" /> 22nd-Century Gadgets
                  </h4>
                  <div className="space-y-1">
                    {matchingGadgets.map((g) => (
                      <div
                        key={g.id}
                        onClick={() => handleSelect(`/?gadget=${g.id}`)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-pink-50 cursor-pointer transition-colors group"
                      >
                        <div>
                          <span className="font-semibold text-sm text-slate-800 group-hover:text-pink-600">
                            {g.name}
                          </span>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {g.description}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-pink-500 transition-transform group-hover:translate-x-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
