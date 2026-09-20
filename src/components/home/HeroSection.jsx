import React, { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Hero3DScene from "../3d/Hero3DScene";
import { sound } from "../../services/audioService";

export default function HeroSection({ onOpenSearch }) {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    sound.playClick();
    if (searchInput.trim()) {
      navigate(`/episodes?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      onOpenSearch();
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100 pt-8 pb-14 border-b border-sky-200">
      {/* Tokyo Suburban Rooftop Silhouette Backdrop */}
      <div className="absolute inset-x-0 bottom-0 h-40 opacity-20 pointer-events-none bg-repeat-x bg-bottom" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,120 L0,90 L30,90 L30,70 L50,55 L70,70 L70,90 L110,90 L110,60 L140,40 L170,60 L170,90 L220,90 L220,75 L240,60 L260,75 L260,90 L310,90 L310,50 L340,30 L370,50 L370,90 L420,90 L420,65 L450,45 L480,65 L480,90 L530,90 L530,70 L550,55 L570,70 L570,90 L620,90 L620,40 L650,20 L680,40 L680,90 L740,90 L740,65 L770,45 L800,65 L800,90 L860,90 L860,55 L890,35 L920,55 L920,90 L980,90 L980,70 L1010,50 L1040,70 L1040,90 L1100,90 L1100,45 L1130,25 L1160,45 L1160,90 L1200,90 L1200,120 Z' fill='%230369a1'/%3E%3C/svg%3E")`,
        backgroundSize: "800px 100px"
      }} />

      {/* Decorative Cloud Accents */}
      <div className="absolute top-12 left-8 w-32 h-12 bg-white/40 rounded-full blur-sm pointer-events-none" />
      <div className="absolute top-28 right-16 w-48 h-16 bg-white/30 rounded-full blur-md pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 text-center lg:text-left pt-4 sm:pt-6">

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white tracking-tight leading-[1.1] drop-shadow-md">
              Welcome to <br className="hidden sm:inline" />
              <span className="relative inline-block text-sky-950 drop-shadow">
                Doreamon
                {/* Mini Bell Icon over title */}
                <span className="absolute -top-3 -right-6 hidden sm:inline-block">
                  <svg width="28" height="28" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="#facc15" stroke="#b45309" strokeWidth="6" />
                    <line x1="18" y1="48" x2="82" y2="48" stroke="#b45309" strokeWidth="6" />
                    <line x1="22" y1="56" x2="78" y2="56" stroke="#b45309" strokeWidth="6" />
                    <circle cx="50" cy="68" r="8" fill="#1e293b" />
                  </svg>
                </span>
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-4 text-base sm:text-lg text-sky-950/80 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              A world of friendship, fun, and endless adventures! Explore the magical universe of Doraemon, his futuristic 22nd-century gadgets, and beloved friends.
            </p>

            {/* Search Bar matching reference image */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-7 max-w-md mx-auto lg:mx-0 relative flex items-center bg-white rounded-full shadow-lg shadow-sky-900/10 border-2 border-white/80 p-1.5 transition-all focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-200/50"
            >
              <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for episodes, characters, or more..."
                className="w-full px-3 py-2 text-sm sm:text-base text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center shadow-md flex-shrink-0 transition-transform hover:scale-105 active:scale-95"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Quick Action Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs text-sky-900 font-semibold">
              <span className="text-sky-800/70 text-[11px] uppercase tracking-wider font-bold">Trending:</span>
              <button
                onClick={() => navigate("/episodes?search=Anywhere+Door")}
                className="px-2.5 py-1 rounded-full bg-white/70 hover:bg-white border border-sky-200 transition-colors shadow-xs"
              >
                Anywhere Door
              </button>
              <button
                onClick={() => navigate("/characters?id=nobita")}
                className="px-2.5 py-1 rounded-full bg-white/70 hover:bg-white border border-sky-200 transition-colors shadow-xs"
              >
                Nobita Nobi
              </button>
              <button
                onClick={() => navigate("/movies?id=mov-2014")}
                className="px-2.5 py-1 rounded-full bg-white/70 hover:bg-white border border-sky-200 transition-colors shadow-xs"
              >
                Stand by Me
              </button>
              <button
                onClick={() => navigate("/game")}
                className="px-2.5 py-1 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold transition-colors shadow-xs"
              >
                🎮 Play Game
              </button>
            </div>
          </div>

          {/* Right Hero 3D Flying Doraemon Experience */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full max-w-[480px] bg-sky-200/30 backdrop-blur-xs rounded-3xl p-2 border border-white/50 shadow-xl">
              <Hero3DScene />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
