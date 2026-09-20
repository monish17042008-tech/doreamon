import React, { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/hero.png";
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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#040817] via-[#071333] to-[#0b1b44] pt-8 pb-14 border-b border-[#193275]/60">
      {/* Tokyo Suburban Rooftop Silhouette Backdrop */}
      <div className="absolute inset-x-0 bottom-0 h-40 opacity-15 pointer-events-none bg-repeat-x bg-bottom" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,120 L0,90 L30,90 L30,70 L50,55 L70,70 L70,90 L110,90 L110,60 L140,40 L170,60 L170,90 L220,90 L220,75 L240,60 L260,75 L260,90 L310,90 L310,50 L340,30 L370,50 L370,90 L420,90 L420,65 L450,45 L480,65 L480,90 L530,90 L530,70 L550,55 L570,70 L570,90 L620,90 L620,40 L650,20 L680,40 L680,90 L740,90 L740,65 L770,45 L800,65 L800,90 L860,90 L860,55 L890,35 L920,55 L920,90 L980,90 L980,70 L1010,50 L1040,70 L1040,90 L1100,90 L1100,45 L1130,25 L1160,45 L1160,90 L1200,90 L1200,120 Z' fill='%2338bdf8'/%3E%3C/svg%3E")`,
        backgroundSize: "800px 100px"
      }} />

      {/* Decorative Cloud Accents */}
      <div className="absolute top-12 left-8 w-32 h-12 bg-sky-500/10 rounded-full blur-xl pointer-events-none" />
      <div className="absolute top-28 right-16 w-48 h-16 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 text-center lg:text-left pt-4 sm:pt-6">

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-black text-white tracking-tight leading-[1.05] drop-shadow-md">
              <span className="relative inline-block drop-shadow">
                Doreamon
                {/* Mini Bell Icon over title */}
                <span className="absolute -top-4 -right-7 hidden sm:inline-block">
                  <svg width="32" height="32" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="#facc15" stroke="#b45309" strokeWidth="6" />
                    <line x1="18" y1="48" x2="82" y2="48" stroke="#b45309" strokeWidth="6" />
                    <line x1="22" y1="56" x2="78" y2="56" stroke="#b45309" strokeWidth="6" />
                    <circle cx="50" cy="68" r="8" fill="#1e293b" />
                  </svg>
                </span>
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-4 text-base sm:text-lg text-sky-200/85 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              A world of friendship, fun, and endless adventures! Explore the magical universe of Doraemon, his futuristic 22nd-century gadgets, and beloved friends.
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-7 max-w-md mx-auto lg:mx-0 relative flex items-center bg-[#0b1636]/90 rounded-full shadow-xl shadow-black/30 border-2 border-[#193275] p-1.5 transition-all focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-500/20"
            >
              <Search className="w-5 h-5 text-sky-400 ml-3 flex-shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for episodes, characters, or more..."
                className="w-full px-3 py-2 text-sm sm:text-base text-white placeholder-slate-400 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center shadow-md flex-shrink-0 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Quick Action Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs text-sky-200 font-semibold">
              <span className="text-sky-300/80 text-[11px] uppercase tracking-wider font-bold">Trending:</span>
              <button
                onClick={() => navigate("/episodes?search=Anywhere+Door")}
                className="px-2.5 py-1 rounded-full bg-[#0e1c45] hover:bg-[#152960] text-sky-200 border border-[#1d367a] transition-colors shadow-xs cursor-pointer"
              >
                Anywhere Door
              </button>
              <button
                onClick={() => navigate("/characters?id=nobita")}
                className="px-2.5 py-1 rounded-full bg-[#0e1c45] hover:bg-[#152960] text-sky-200 border border-[#1d367a] transition-colors shadow-xs cursor-pointer"
              >
                Nobita Nobi
              </button>
              <button
                onClick={() => navigate("/movies?id=mov-2014")}
                className="px-2.5 py-1 rounded-full bg-[#0e1c45] hover:bg-[#152960] text-sky-200 border border-[#1d367a] transition-colors shadow-xs cursor-pointer"
              >
                Stand by Me
              </button>
              <button
                onClick={() => navigate("/game")}
                className="px-2.5 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold transition-colors shadow-xs cursor-pointer"
              >
                🎮 Play Game
              </button>
            </div>
          </div>

          {/* Right Hero Transparent Doreamon & Nobita Presentation */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-6 lg:pt-0">
            {/* Ambient Background Aura */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-tr from-amber-300/35 via-sky-300/30 to-sky-400/25 rounded-full blur-3xl pointer-events-none" />

            {/* Interactive Showcase Container */}
            <div className="relative group flex flex-col items-center justify-center">
              {/* Floating Badge (Top-Left) */}
              <div className="absolute -top-3 -left-3 sm:-left-6 z-20 px-3.5 py-1.5 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg border border-sky-100 flex items-center gap-2 animate-float-subtle">
                <span className="text-base">🤠</span>
                <div className="text-left">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 leading-tight">Wild West</p>
                  <p className="text-xs font-bold text-slate-800 leading-tight">Doreamon & Nobita</p>
                </div>
              </div>

              {/* Floating Badge (Bottom-Right) */}
              <div
                className="absolute -bottom-2 -right-3 sm:-right-6 z-20 px-3.5 py-1.5 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg border border-sky-100 flex items-center gap-2 animate-float-subtle"
                style={{ animationDelay: "1.5s" }}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-slate-800">Best Friends</span>
              </div>

              {/* Transparent Hero Image */}
              <div className="relative z-10 transition-transform duration-500 ease-out transform group-hover:scale-105 group-hover:-translate-y-2 animate-float-subtle">
                <img
                  src={heroImage}
                  alt="Doreamon and Nobita in Cowboy Outfits"
                  className="w-auto h-[360px] sm:h-[430px] lg:h-[470px] max-w-full object-contain drop-shadow-[0_20px_35px_rgba(2,132,199,0.25)] select-none filter group-hover:brightness-105 transition-all"
                  loading="eager"
                />
              </div>

              {/* Soft Ground Shadow */}
              <div className="w-48 sm:w-60 h-5 bg-sky-950/15 rounded-full blur-md -mt-3 z-0" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
