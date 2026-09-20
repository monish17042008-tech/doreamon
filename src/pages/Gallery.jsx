import React, { useState, useEffect, useCallback } from "react";
import { Image, Heart, Maximize2, Download, X, ChevronLeft, ChevronRight } from "lucide-react";
import { galleryData } from "../data/galleryData";
import { sound } from "../services/audioService";

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [likes, setLikes] = useState(() => {
    const map = {};
    galleryData.forEach((item) => {
      map[item.id] = item.likes;
    });
    return map;
  });
  const [likedMap, setLikedMap] = useState({});
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const categories = ["All", "Wallpapers", "Gadgets", "Characters", "Movies"];

  const filteredItems = galleryData.filter(
    (item) => activeCategory === "All" || item.category === activeCategory
  );

  const handleLike = (id, e) => {
    e.stopPropagation();
    sound.playClick();
    if (likedMap[id]) return;

    setLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setLikedMap((prev) => ({ ...prev, [id]: true }));
  };

  const openLightbox = (index) => {
    sound.playBellChime();
    setLightboxIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const nextImage = useCallback(() => {
    sound.playClick();
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : null));
  }, [filteredItems.length]);

  const prevImage = useCallback(() => {
    sound.playClick();
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null));
  }, [filteredItems.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, closeLightbox, nextImage, prevImage]);

  const currentItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold">
              <Image className="w-3.5 h-3.5 text-amber-300" />
              <span>Visual Archive & 4K Wallpapers</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight">
              Official Media Gallery
            </h1>
            <p className="text-sky-100 text-sm sm:text-base max-w-2xl font-medium">
              Explore high-resolution art, original anime production cells, 22nd-century gadget schematics, and desktop wallpapers celebrating Fujiko F. Fujio’s legendary universe.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center min-w-[140px]">
            <span className="block text-2xl sm:text-3xl font-black font-display text-amber-300">
              {galleryData.length}+
            </span>
            <span className="text-xs text-sky-100 font-semibold">Curated Artworks</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Filter Navigation */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sound.playClick();
                  setActiveCategory(cat);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-xs font-bold text-slate-500">
            Showing {filteredItems.length} items
          </span>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <article
              key={item.id}
              onClick={() => openLightbox(index)}
              className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-card transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Image Frame */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 opacity-80 group-hover:opacity-100 transition-opacity" />

                {/* Top Badge */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white font-mono text-[11px] font-bold border border-white/20">
                    {item.resolution}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-sky-500/90 text-white text-[11px] font-bold backdrop-blur-md">
                    {item.category}
                  </span>
                </div>

                {/* Hover zoom icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md text-slate-800 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-display font-bold text-slate-800 group-hover:text-sky-600 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {item.caption}
                  </p>
                </div>

                {/* Like Button */}
                <button
                  onClick={(e) => handleLike(item.id, e)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    likedMap[item.id]
                      ? "bg-rose-50 text-rose-600"
                      : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600"
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      likedMap[item.id] ? "fill-rose-500 text-rose-500" : ""
                    }`}
                  />
                  <span>{likes[item.id] || 0}</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Lightbox Modal */}
      {currentItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 sm:p-8 animate-fade-in"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-20"
            title="Close (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-20"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-20"
            title="Next (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Container */}
          <div
            className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentItem.src}
              alt={currentItem.title}
              className="max-h-[68vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />

            {/* Lightbox Information Bar */}
            <div className="mt-4 w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-sky-500 text-xs font-bold font-mono">
                    {currentItem.category}
                  </span>
                  <span className="text-xs text-sky-200 font-mono">
                    {currentItem.resolution}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display">{currentItem.title}</h3>
                <p className="text-xs text-slate-300 max-w-xl">{currentItem.caption}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => handleLike(currentItem.id, e)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all"
                >
                  <Heart className={`w-4 h-4 ${likedMap[currentItem.id] ? "fill-rose-500 text-rose-500" : ""}`} />
                  <span>{likes[currentItem.id] || 0}</span>
                </button>

                <a
                  href={currentItem.src}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/30"
                >
                  <Download className="w-4 h-4" />
                  <span>Full View</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
