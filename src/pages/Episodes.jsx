import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Tv } from "lucide-react";
import { episodesData } from "../data/episodesData";
import EpisodeCard from "../components/episodes/EpisodeCard";
import EpisodeModal from "../components/episodes/EpisodeModal";

export default function Episodes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [eraFilter, setEraFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [sortBy, setSortBy] = useState("number-asc");
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  useEffect(() => {
    const queryParam = searchParams.get("search");
    if (queryParam) setSearchQuery(queryParam);

    const epId = searchParams.get("id");
    if (epId) {
      const match = episodesData.find((e) => e.id === epId);
      if (match) setSelectedEpisode(match);
    }
  }, [searchParams]);

  const filteredEpisodes = episodesData
    .filter((ep) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ep.title.toLowerCase().includes(q) ||
        ep.japaneseTitle.includes(q) ||
        ep.synopsis.toLowerCase().includes(q) ||
        ep.featuredGadgets.some((g) => g.toLowerCase().includes(q));

      const matchesEra = eraFilter === "all" || ep.era === eraFilter;

      const matchesGenre =
        genreFilter === "all" || ep.genre.toLowerCase().includes(genreFilter.toLowerCase());

      return matchesSearch && matchesEra && matchesGenre;
    })
    .sort((a, b) => {
      if (sortBy === "number-asc") return a.episodeNumber - b.episodeNumber;
      if (sortBy === "rating-desc") return b.rating - a.rating;
      if (sortBy === "date-desc") return new Date(b.airDate) - new Date(a.airDate);
      if (sortBy === "date-asc") return new Date(a.airDate) - new Date(b.airDate);
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-b from-sky-500 to-sky-600 text-white py-14 px-4 border-b-4 border-sky-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-sky-100 text-xs font-bold mb-3">
            <Tv className="w-3.5 h-3.5 text-amber-300" />
            <span>Complete Episode Archive</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight">
            Episodes Catalog
          </h1>
          <p className="mt-2 text-sky-100 text-sm sm:text-base max-w-2xl">
            Streamline through classic 1979 Oyama-era episodes, modern 2005 Mizuta-era broadcasts, and memorable specials.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-6 relative z-10">
        {/* Search and Filters Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by episode title, gadget name (e.g. Memory Bread), or keyword..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-400"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-slate-400 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:border-sky-400"
              >
                <option value="number-asc">Episode Number (1 → 999)</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="date-desc">Air Date (Newest First)</option>
                <option value="date-asc">Air Date (Oldest First)</option>
              </select>
            </div>
          </div>

          {/* Era & Genre Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            {/* Era filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 mr-1">Series Era:</span>
              {[
                { id: "all", label: "All Eras" },
                { id: "classic", label: "1979 Classic Series" },
                { id: "modern", label: "2005 Modern Series" },
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setEraFilter(b.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    eraFilter === b.id
                      ? "bg-sky-500 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {/* Genre filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 mr-1">Genre:</span>
              {[
                { id: "all", label: "All" },
                { id: "comedy", label: "Comedy" },
                { id: "adventure", label: "Adventure" },
                { id: "emotional", label: "Heartwarming" },
                { id: "sci-fi", label: "Sci-Fi" },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGenreFilter(g.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    genreFilter === g.id
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between px-2 text-xs font-semibold text-slate-500">
          <span>Showing {filteredEpisodes.length} episodes</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-sky-600 hover:underline font-bold"
            >
              Clear search filter
            </button>
          )}
        </div>

        {/* Episodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEpisodes.map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              onSelect={(ep) => {
                setSelectedEpisode(ep);
                setSearchParams({ id: ep.id });
              }}
            />
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <EpisodeModal
        episode={selectedEpisode}
        isOpen={Boolean(selectedEpisode)}
        onClose={() => {
          setSelectedEpisode(null);
          setSearchParams({});
        }}
      />
    </div>
  );
}
