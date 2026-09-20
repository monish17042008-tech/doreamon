import React from "react";
import { Link } from "react-router-dom";
import { Heart, ArrowUp } from "lucide-react";
import { sound } from "../../services/audioService";

export default function Footer() {
  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#060e26] via-[#091538] to-[#040817] text-white overflow-hidden pt-12 pb-8 border-t border-[#193275]/80">
      {/* Doraemon Bell Background Watermark */}
      <div className="absolute right-[-40px] bottom-[-40px] opacity-10 pointer-events-none select-none">
        <svg width="260" height="260" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="45" />
          <line x1="15" y1="48" x2="85" y2="48" stroke="#000" strokeWidth="6" />
          <line x1="20" y1="56" x2="80" y2="56" stroke="#000" strokeWidth="6" />
          <circle cx="50" cy="68" r="10" stroke="#000" strokeWidth="5" />
          <line x1="50" y1="78" x2="50" y2="92" stroke="#000" strokeWidth="6" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#193275]/70">
          {/* Brand Info */}
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-12 h-12 rounded-full bg-white p-1 shadow-md flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="48" fill="#0284c7" />
                <ellipse cx="50" cy="58" rx="40" ry="34" fill="#ffffff" />
                <ellipse cx="40" cy="30" rx="9" ry="13" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
                <ellipse cx="60" cy="30" rx="9" ry="13" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
                <circle cx="42" cy="30" r="3.5" fill="#0f172a" />
                <circle cx="58" cy="30" r="3.5" fill="#0f172a" />
                <circle cx="50" cy="42" r="7" fill="#ef4444" />
                <line x1="50" y1="49" x2="50" y2="70" stroke="#0f172a" strokeWidth="2" />
                <path d="M 25 62 Q 50 86 75 62" fill="none" stroke="#0f172a" strokeWidth="2.5" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-display font-extrabold tracking-tight">
                Doreamon
              </h3>
              <p className="text-xs text-sky-300 font-medium">
                Small gadgets... Big dreams...
              </p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-slate-300">
            <Link to="/" onClick={() => sound.playClick()} className="hover:text-sky-300 transition-colors">
              Home
            </Link>
            <Link to="/characters" onClick={() => sound.playClick()} className="hover:text-sky-300 transition-colors">
              Characters
            </Link>
            <Link to="/episodes" onClick={() => sound.playClick()} className="hover:text-sky-300 transition-colors">
              Episodes
            </Link>
            <Link to="/movies" onClick={() => sound.playClick()} className="hover:text-sky-300 transition-colors">
              Movies
            </Link>
            <Link to="/gallery" onClick={() => sound.playClick()} className="hover:text-sky-300 transition-colors">
              Gallery
            </Link>
            <Link to="/game" onClick={() => sound.playClick()} className="hover:text-sky-300 transition-colors">
              Game
            </Link>
          </div>

          {/* Social Icons & Back to top */}
          <div className="flex items-center gap-3">
            {/* YouTube */}
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Official YouTube"
              className="w-9 h-9 rounded-full bg-[#0b1636] border border-[#193275]/80 text-sky-300 hover:bg-white hover:text-red-600 flex items-center justify-center transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-[#0b1636] border border-[#193275]/80 text-sky-300 hover:bg-white hover:text-pink-600 flex items-center justify-center transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            {/* X / Twitter */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (formerly Twitter)"
              className="w-9 h-9 rounded-full bg-[#0b1636] border border-[#193275]/80 text-sky-300 hover:bg-white hover:text-slate-950 flex items-center justify-center transition-colors shadow-sm"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <button
              onClick={scrollToTop}
              title="Scroll to top"
              className="w-9 h-9 rounded-full bg-[#0b1636] border border-[#193275]/80 text-sky-300 hover:bg-sky-500 hover:text-white flex items-center justify-center transition-colors ml-2 shadow-sm"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center sm:text-left leading-relaxed">
            Doreamon is an unofficial fan portal and educational tribute. All trademarks, characters, and artwork belong to © Fujiko F. Fujio, Shin-Ei Animation, TV Asahi, and Toho Co., Ltd.
          </p>
          <div className="flex items-center gap-1.5 flex-shrink-0 text-slate-300 font-medium">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" />
            <span>for Doreamon fans worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
