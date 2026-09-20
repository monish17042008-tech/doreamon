import React, { useState } from "react";
import { Sparkles, RefreshCw, Volume2, Zap } from "lucide-react";
import { gadgetsData } from "../../data/gadgetsData";
import { sound } from "../../services/audioService";

export default function DailyGadgetCard() {
  const [gadgetIndex, setGadgetIndex] = useState(0);
  const gadget = gadgetsData[gadgetIndex];

  const handleNextGadget = () => {
    sound.playBellChime();
    setGadgetIndex((prev) => (prev + 1) % gadgetsData.length);
  };

  const handlePlayGadgetSound = () => {
    if (gadget.id === "anywhere-door") {
      sound.playDoorWarp();
    } else if (gadget.id === "take-copter") {
      sound.playCopterHum();
    } else {
      sound.playDorayakiCatch();
    }
  };

  return (
    <div className="bg-gradient-to-r from-sky-50 via-white to-amber-50/50 rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex-1 text-left space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Gadget Spotlight
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Cat. #{gadgetIndex + 1} of {gadgetsData.length}
          </span>
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
            {gadget.name}
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-sky-600 mt-0.5">
            {gadget.category}
          </p>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
          {gadget.description}
        </p>

        <div className="bg-white/90 rounded-2xl p-3.5 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">
              22nd-Century Specs
            </span>
            <span className="font-semibold text-slate-700">{gadget.specs}</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">
              Catalog Price
            </span>
            <span className="font-semibold text-amber-700 font-mono">
              {gadget.priceIn22ndCentury}
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={handlePlayGadgetSound}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Volume2 className="w-4 h-4" />
            <span>Test Sound Effect</span>
          </button>
          <button
            onClick={handleNextGadget}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Cycle Next Gadget</span>
          </button>
        </div>
      </div>

      {/* Gadget Visual Frame */}
      <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-3xl bg-white border border-slate-200 shadow-md p-5 flex flex-col items-center justify-center text-center relative overflow-hidden flex-shrink-0">
        <div className="w-20 h-20 rounded-2xl bg-sky-100 flex items-center justify-center mb-3 shadow-inner">
          {gadget.id === "anywhere-door" ? (
            <div className="w-12 h-16 bg-pink-500 rounded-sm border-2 border-pink-700 relative shadow-md">
              <div className="absolute right-1.5 top-8 w-2 h-2 rounded-full bg-yellow-300 border border-yellow-600" />
            </div>
          ) : gadget.id === "take-copter" ? (
            <div className="flex flex-col items-center">
              <div className="w-14 h-2 bg-yellow-400 rounded-full shadow-sm animate-spin-slow" />
              <div className="w-1 h-5 bg-slate-400" />
              <div className="w-4 h-2 bg-yellow-500 rounded-t-sm" />
            </div>
          ) : gadget.id === "memory-bread" ? (
            <div className="w-12 h-14 bg-amber-200 border-2 border-amber-500 rounded-t-lg shadow-sm flex items-center justify-center font-mono text-[9px] font-bold text-amber-800">
              E=mc²
            </div>
          ) : (
            <Zap className="w-10 h-10 text-sky-600" />
          )}
        </div>
        <span className="text-xs font-bold text-slate-800 line-clamp-1">{gadget.name}</span>
        <span className="text-[11px] text-slate-500 mt-1 line-clamp-2 italic px-2">
          &ldquo;{gadget.quirk}&rdquo;
        </span>
      </div>
    </div>
  );
}
