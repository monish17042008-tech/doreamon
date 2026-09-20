import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Heart } from "lucide-react";
import { sound } from "../../services/audioService";

export default function AboutSection() {
  return (
    <div className="bg-sky-50/70 rounded-3xl border border-sky-100 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-card hover:shadow-soft transition-all">
      <div className="flex-1 text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/80 text-sky-800 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>22nd-Century Legend</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-800 tracking-tight">
          About Doraemon
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
          Doraemon is a robotic cat from the 22nd century, sent back in time to help Nobita, a kind and clumsy boy, with his daily life. With his magical gadgets and big heart, Doraemon teaches us the value of friendship, courage, and never giving up!
        </p>
        <div className="mt-6 flex items-center gap-4">
          <Link
            to="/characters?id=doraemon"
            onClick={() => sound.playClick()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold shadow-md shadow-sky-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Created by Fujiko F. Fujio (1969)
          </span>
        </div>
      </div>

      {/* Cute Sitting Doraemon Illustration SVG */}
      <div className="w-44 h-44 sm:w-52 sm:h-52 flex-shrink-0 relative flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
          {/* Blue Body / Head */}
          <circle cx="100" cy="85" r="60" fill="#0284c7" />
          {/* White Face */}
          <ellipse cx="100" cy="95" rx="50" ry="42" fill="#ffffff" />
          {/* Eyes */}
          <ellipse cx="88" cy="62" rx="11" ry="16" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
          <ellipse cx="112" cy="62" rx="11" ry="16" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
          <circle cx="91" cy="62" r="4.5" fill="#0f172a" />
          <circle cx="109" cy="62" r="4.5" fill="#0f172a" />
          {/* Red Nose */}
          <circle cx="100" cy="76" r="9" fill="#ef4444" stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="97" cy="73" r="2.5" fill="#ffffff" />
          {/* Mouth Seam */}
          <line x1="100" y1="85" x2="100" y2="108" stroke="#0f172a" strokeWidth="2.5" />
          {/* Big Open Happy Mouth */}
          <path d="M 68 98 Q 100 135 132 98 Z" fill="#dc2626" stroke="#0f172a" strokeWidth="3" strokeLinejoin="round" />
          <path d="M 82 114 Q 100 102 118 114" fill="#fb7185" />
          {/* Whiskers */}
          <line x1="60" y1="88" x2="82" y2="92" stroke="#0f172a" strokeWidth="2.2" />
          <line x1="58" y1="96" x2="80" y2="97" stroke="#0f172a" strokeWidth="2.2" />
          <line x1="62" y1="104" x2="82" y2="102" stroke="#0f172a" strokeWidth="2.2" />
          <line x1="140" y1="88" x2="118" y2="92" stroke="#0f172a" strokeWidth="2.2" />
          <line x1="142" y1="96" x2="120" y2="97" stroke="#0f172a" strokeWidth="2.2" />
          <line x1="138" y1="104" x2="118" y2="102" stroke="#0f172a" strokeWidth="2.2" />
          {/* Red Collar */}
          <rect x="62" y="132" width="76" height="11" rx="5" fill="#dc2626" stroke="#0f172a" strokeWidth="2.5" />
          {/* Golden Bell */}
          <circle cx="100" cy="148" r="12" fill="#facc15" stroke="#b45309" strokeWidth="2.5" />
          <line x1="90" y1="145" x2="110" y2="145" stroke="#b45309" strokeWidth="2" />
          <circle cx="100" cy="151" r="3" fill="#1e293b" />
          {/* Body and White Belly */}
          <path d="M 66 142 Q 45 170 65 185 L 135 185 Q 155 170 134 142" fill="#0284c7" />
          <ellipse cx="100" cy="164" rx="28" ry="20" fill="#ffffff" />
          {/* 4D Pocket */}
          <path d="M 82 160 Q 100 160 118 160 Q 118 176 100 176 Q 82 176 82 160 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
          {/* Paws */}
          <circle cx="56" cy="172" r="14" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
          <circle cx="144" cy="172" r="14" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
