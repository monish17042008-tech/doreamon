import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AirplaneBackToTop from "./components/common/AirplaneBackToTop";
import Home from "./pages/Home";
import Characters from "./pages/Characters";
import Episodes from "./pages/Episodes";
import Movies from "./pages/Movies";
import Gallery from "./pages/Gallery";
import Game from "./pages/Game";

// Scroll restoration component
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#070f26] text-slate-100 font-sans selection:bg-sky-500 selection:text-white">
      <ScrollToTop />
      {/* Navigation Header */}
      <Navbar />

      {/* Routed Pages */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/episodes" element={<Episodes />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/game" element={<Game />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Floating Midnight Blue Airplane Back to Top */}
      <AirplaneBackToTop />

      {/* Footer */}
      <Footer />
    </div>
  );
}
