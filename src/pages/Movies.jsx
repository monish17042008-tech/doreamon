import React, { useState } from "react";
import { Film, Search, Star, Clapperboard, ExternalLink, X, Compass, Clock, Sparkles } from "lucide-react";
import { moviesData } from "../data/moviesData";
import { sound } from "../services/audioService";

export default function Movies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [decadeFilter, setDecadeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedMovie, setSelectedMovie] = useState(null);

  const decades = ["all", "1980s", "1990s", "2000s", "2010s", "2020s"];
  const categories = ["all", "2D Classic", "3D CGI"];

  const filteredMovies = moviesData.filter((movie) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      movie.title.toLowerCase().includes(q) ||
      movie.director.toLowerCase().includes(q) ||
      movie.themes.some((t) => t.toLowerCase().includes(q));

    const matchesDecade = decadeFilter === "all" || movie.decade === decadeFilter;
    const matchesCategory = categoryFilter === "all" || movie.category === categoryFilter;

    return matchesSearch && matchesDecade && matchesCategory;
  });

  const handleOpenModal = (movie) => {
    sound.playBellChime();
    setSelectedMovie(movie);
  };

  return (
    <div className="min-h-screen bg-[#070f26]">
      {/* Header Hero Banner */}
      <section className="bg-gradient-to-r from-[#040817] via-[#071333] to-[#0b1b44] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#193275]/60 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#070f26]/80 border border-[#193275]/70 backdrop-blur-xs text-sky-300 text-xs font-semibold">
              <Film className="w-3.5 h-3.5 text-amber-300" />
              <span>Toho Theatrical Releases (1980 – 2024)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white">
              Theatrical Movies & Sagas
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-medium">
              Over 40 blockbuster theatrical movies spanning dinosaur epochs, celestial galaxies, and alternate dimensions. Complete with release timelines, official box office statistics, and legal streaming portals.
            </p>
          </div>

          {/* Quick Stats Pill Grid */}
          <div className="flex flex-row md:flex-col gap-3">
            <div className="bg-[#0b1636]/80 backdrop-blur-md rounded-2xl p-4 border border-[#193275]/70 text-center min-w-[130px]">
              <span className="block text-2xl sm:text-3xl font-black font-display text-amber-300">
                43+
              </span>
              <span className="text-xs text-sky-300/80 font-semibold">Theatrical Films</span>
            </div>
            <div className="bg-[#0b1636]/80 backdrop-blur-md rounded-2xl p-4 border border-[#193275]/70 text-center min-w-[130px]">
              <span className="block text-2xl sm:text-3xl font-black font-display text-white">
                ¥130B+
              </span>
              <span className="text-xs text-sky-300/80 font-semibold">Global Box Office</span>
            </div>
          </div>
        </div>
      </section>

      {/* Control Bar: Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movie title, theme, director..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0b1636] border border-[#193275]/80 text-sm font-medium text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 shadow-sm transition-all"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
            {/* Decade Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {decades.map((dec) => (
                <button
                  key={dec}
                  onClick={() => {
                    sound.playClick();
                    setDecadeFilter(dec);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
                    decadeFilter === dec
                      ? "bg-sky-500 text-white shadow-sm"
                      : "bg-[#0b1636] text-slate-300 border border-[#193275]/60 hover:bg-[#0f1f4b]"
                  }`}
                >
                  {dec}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-[#193275]/60">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    sound.playClick();
                    setCategoryFilter(cat);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    categoryFilter === cat
                      ? "bg-sky-500 text-white shadow-sm"
                      : "bg-[#0b1636] text-slate-300 border border-[#193275]/60 hover:bg-[#0f1f4b]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-xs font-bold text-sky-300/80 flex items-center justify-between">
          <span>Showing {filteredMovies.length} of {moviesData.length} theatrical releases</span>
          {(searchQuery || decadeFilter !== "all" || categoryFilter !== "all") && (
            <button
              onClick={() => {
                sound.playClick();
                setSearchQuery("");
                setDecadeFilter("all");
                setCategoryFilter("all");
              }}
              className="text-sky-400 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Movies Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMovies.map((movie) => (
            <article
              key={movie.id}
              className="group bg-[#0b1636] rounded-3xl border border-[#193275]/70 hover:border-sky-400/60 overflow-hidden shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Poster frame */}
              <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/20">
                    {movie.year}
                  </span>
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-bold backdrop-blur-md ${
                    movie.category === "3D CGI"
                      ? "bg-rose-500/90 text-white"
                      : "bg-sky-500/90 text-white"
                  }`}>
                    {movie.category}
                  </span>
                </div>

                {/* Rating badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{movie.rating.toFixed(1)}</span>
                </div>

                {/* Box office tag */}
                {movie.boxOffice && (
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-emerald-500/90 text-white text-[11px] font-bold">
                    {movie.boxOffice}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-display font-bold text-white leading-snug group-hover:text-sky-300 transition-colors">
                      {movie.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                    <span className="inline-flex items-center gap-1">
                      <Clapperboard className="w-3.5 h-3.5 text-sky-400" />
                      {movie.director}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-sky-400" />
                      {movie.runtime}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-normal">
                    {movie.synopsis}
                  </p>

                  {/* Themes */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {movie.themes.map((theme, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-[#070f26] border border-[#193275]/60 text-sky-200 text-[10px] font-medium"
                      >
                        #{theme}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-[#193275]/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenModal(movie)}
                    className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    View Details
                  </button>

                  <div className="flex items-center gap-1">
                    {movie.legalStreaming.slice(0, 2).map((stream, idx) => (
                      <a
                        key={idx}
                        href={stream.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#070f26] border border-[#193275]/60 hover:bg-sky-950/50 text-slate-300 hover:text-sky-300 text-[11px] font-semibold transition-colors"
                        title={`Watch on ${stream.name}`}
                      >
                        <span>{stream.name}</span>
                        <ExternalLink className="w-3 h-3 text-sky-400" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedMovie && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            className="bg-[#070f26] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#193275]/80 overflow-hidden text-left text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Poster Frame */}
            <div className="relative aspect-video w-full bg-slate-950">
              <img
                src={selectedMovie.poster}
                alt={selectedMovie.title}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

              <button
                onClick={() => setSelectedMovie(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors border border-[#193275]/50"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-sky-500 text-white text-xs font-bold font-mono">
                    {selectedMovie.year}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#070f26]/80 text-sky-200 border border-[#193275]/70 text-xs font-semibold backdrop-blur-xs">
                    {selectedMovie.category}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-extrabold leading-tight">
                  {selectedMovie.title}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Metadata Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0b1636] p-4 rounded-2xl border border-[#193275]/60 text-center">
                <div>
                  <span className="block text-[11px] font-bold text-sky-300/70 uppercase">Director</span>
                  <span className="text-xs font-extrabold text-white">{selectedMovie.director}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-sky-300/70 uppercase">Runtime</span>
                  <span className="text-xs font-extrabold text-white">{selectedMovie.runtime}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-sky-300/70 uppercase">Release Date</span>
                  <span className="text-xs font-extrabold text-white">{selectedMovie.releaseDate}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-sky-300/70 uppercase">Box Office</span>
                  <span className="text-xs font-extrabold text-emerald-400">{selectedMovie.boxOffice || "N/A"}</span>
                </div>
              </div>

              {/* Full Synopsis */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-sky-400" />
                  <span>Storyline & Synopsis</span>
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {selectedMovie.synopsis}
                </p>
              </div>

              {/* Themes */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Core Themes & Motifs</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMovie.themes.map((theme, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl bg-[#0b1636] text-sky-300 text-xs font-semibold border border-[#193275]/70"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>

              {/* Legal Streaming Portals */}
              <div className="space-y-3 pt-3 border-t border-[#193275]/60">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Official Legal Streaming Links
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedMovie.legalStreaming.map((stream, idx) => (
                    <a
                      key={idx}
                      href={stream.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between px-4 py-3 rounded-xl border border-[#193275]/70 bg-[#0b1636] hover:border-sky-500 hover:bg-[#0f1f4b] text-white text-xs font-bold transition-all shadow-xs group"
                    >
                      <span className="group-hover:text-sky-300">{stream.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-sky-400 group-hover:text-sky-300" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
