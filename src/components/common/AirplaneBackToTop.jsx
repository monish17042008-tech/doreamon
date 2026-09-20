import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plane } from "lucide-react";
import { sound } from "../../services/audioService";

export default function AirplaneBackToTop() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isFlying, setIsFlying] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      // Show when the user reaches or approaches the bottom of the page
      const reachedBottom = scrollPos >= docHeight - 500 || window.scrollY > 600;
      setIsVisible(reachedBottom);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleFlyBack = () => {
    if (isFlying) return;
    setIsFlying(true);
    sound.playCopterHum();

    // Smoothly scroll back to the very top
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    // Take user straight back to the first page (Home)
    if (location.pathname !== "/") {
      navigate("/");
    }

    setTimeout(() => {
      setIsFlying(false);
    }, 900);
  };

  return (
    <div
      className={`fixed right-5 sm:right-7 bottom-6 sm:bottom-8 z-50 transition-all duration-500 ease-out transform ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-12 scale-75 pointer-events-none"
      }`}
    >
      <div className="relative group">
        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-[#070f26] text-sky-200 text-xs font-semibold whitespace-nowrap shadow-xl border border-sky-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none select-none flex items-center gap-1.5">
          <span>Fly to Top & First Page</span>
          <span className="text-[10px] text-amber-300">✈</span>
          {/* Tooltip arrow */}
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-[#070f26]" />
        </div>

        {/* Midnight Blue Airplane Button */}
        <button
          onClick={handleFlyBack}
          aria-label="Back to top and first page"
          className="relative w-14 h-14 sm:w-15 sm:h-15 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 active:scale-95 group-hover:scale-105 cursor-pointer overflow-hidden border border-sky-400/30 ring-2 ring-sky-500/20 group-hover:ring-sky-400/50"
          style={{
            backgroundColor: "#070f26", // Midnight Blue base
            backgroundImage: "radial-gradient(circle at 30% 30%, #172a5a 0%, #0b1736 55%, #050b1d 100%)",
            boxShadow: "0 10px 25px -5px rgba(5, 11, 29, 0.7), 0 0 18px 2px rgba(56, 189, 248, 0.2)"
          }}
        >
          {/* Subtle star shimmer in midnight blue sky */}
          <span className="absolute top-2 right-3 w-1 h-1 bg-sky-200 rounded-full opacity-60 animate-pulse" />
          <span className="absolute bottom-3 left-3 w-1 h-1 bg-amber-200 rounded-full opacity-50" />
          <span className="absolute top-4 left-3 w-0.5 h-0.5 bg-white rounded-full opacity-75" />

          {/* Airplane Icon with dynamic tilt and takeoff flight */}
          <div
            className={`transition-transform duration-300 ${
              isFlying
                ? "animate-airplane-fly"
                : "group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            }`}
          >
            <Plane
              className="w-6 h-6 sm:w-7 sm:h-7 text-sky-100 group-hover:text-amber-300 transition-colors drop-shadow-[0_2px_8px_rgba(255,255,255,0.35)] -rotate-45"
            />
          </div>

          {/* Jet / Vapor trail on hover */}
          <span className="absolute bottom-2.5 left-2.5 w-2 h-2 rounded-full bg-sky-400/30 blur-[1px] group-hover:opacity-100 opacity-0 transition-opacity" />
        </button>
      </div>
    </div>
  );
}
