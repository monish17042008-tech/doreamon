import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Volume2, VolumeX, Menu, X, Gamepad2 } from "lucide-react";
import { sound } from "../../services/audioService";
import GlobalSearchModal from "../common/GlobalSearchModal";

export default function Navbar() {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.isMuted());

  const toggleAudio = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.playBellChime();
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Characters", path: "/characters" },
    { name: "Episodes", path: "/episodes" },
    { name: "Movies", path: "/movies" },
    { name: "Gallery", path: "/gallery" },
    { name: "Game", path: "/game" },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={() => sound.playClick()}
            className="flex items-center gap-3 group focus:outline-none"
          >
            {/* Doraemon Face Icon Badge */}
            <div className="relative w-11 h-11 rounded-full bg-sky-500 flex items-center justify-center shadow-md shadow-sky-500/20 border-2 border-white overflow-hidden transform transition-transform group-hover:scale-105">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Blue head background */}
                <circle cx="50" cy="50" r="48" fill="#0284c7" />
                {/* White face */}
                <ellipse cx="50" cy="58" rx="40" ry="34" fill="#ffffff" />
                {/* Eyes */}
                <ellipse cx="40" cy="30" rx="9" ry="13" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
                <ellipse cx="60" cy="30" rx="9" ry="13" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
                <circle cx="42" cy="30" r="3.5" fill="#0f172a" />
                <circle cx="58" cy="30" r="3.5" fill="#0f172a" />
                {/* Red Nose */}
                <circle cx="50" cy="42" r="7" fill="#ef4444" stroke="#0f172a" strokeWidth="2" />
                <circle cx="48" cy="40" r="2" fill="#ffffff" />
                {/* Seam line */}
                <line x1="50" y1="49" x2="50" y2="70" stroke="#0f172a" strokeWidth="2.2" />
                {/* Happy Mouth */}
                <path d="M 25 62 Q 50 86 75 62" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                {/* Whiskers */}
                <line x1="20" y1="52" x2="36" y2="54" stroke="#0f172a" strokeWidth="1.8" />
                <line x1="18" y1="58" x2="35" y2="59" stroke="#0f172a" strokeWidth="1.8" />
                <line x1="20" y1="65" x2="36" y2="63" stroke="#0f172a" strokeWidth="1.8" />
                <line x1="80" y1="52" x2="64" y2="54" stroke="#0f172a" strokeWidth="1.8" />
                <line x1="82" y1="58" x2="65" y2="59" stroke="#0f172a" strokeWidth="1.8" />
                <line x1="80" y1="65" x2="64" y2="63" stroke="#0f172a" strokeWidth="1.8" />
                {/* Red Collar sliver */}
                <path d="M 18 90 Q 50 100 82 90" fill="none" stroke="#dc2626" strokeWidth="5" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-slate-800 leading-none">
                Doreamon
              </span>
              <span className="text-[10px] text-sky-600 font-semibold tracking-wider uppercase mt-0.5">
                Official Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => sound.playClick()}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "text-sky-600 bg-sky-50 shadow-sm"
                      : "text-slate-600 hover:text-sky-600 hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Button */}
          <div className="flex items-center gap-2.5">
            {/* Audio SFX Toggle */}
            <button
              onClick={toggleAudio}
              title={isMuted ? "Unmute Audio Effects" : "Mute Audio Effects"}
              className="p-2 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-sky-500" />}
            </button>

            {/* Search Trigger Button */}
            <button
              onClick={() => {
                sound.playClick();
                setIsSearchOpen(true);
              }}
              className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors"
              title="Search (Ctrl + K)"
            >
              <Search className="w-5 h-5" />
              <span className="hidden lg:inline text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                ⌘K
              </span>
            </button>

            {/* Play Game CTA Button */}
            <Link
              to="/game"
              onClick={() => {
                sound.playBellChime();
              }}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white text-sm font-bold shadow-md shadow-sky-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Let&apos;s Go!</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden rounded-xl text-slate-600 hover:text-sky-600 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1 shadow-lg animate-fade-in">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => {
                    sound.playClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? "text-sky-600 bg-sky-50 font-bold"
                      : "text-slate-600 hover:text-sky-600 hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-2">
              <Link
                to="/game"
                onClick={() => {
                  sound.playBellChime();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 text-white font-bold text-sm shadow-md"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Play Dorayaki Sky Catch</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
