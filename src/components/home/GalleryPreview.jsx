import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Maximize2, X, Download } from "lucide-react";
import { galleryData } from "../../data/galleryData";
import { sound } from "../../services/audioService";

export default function GalleryPreview() {
  const [activeImage, setActiveImage] = useState(null);

  // First 4 images matching the reference image gallery layout
  const previewImages = galleryData.slice(0, 4);

  const handleOpenImage = (img) => {
    sound.playClick();
    setActiveImage(img);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-800 tracking-tight">
          Gallery
        </h2>
        <Link
          to="/gallery"
          onClick={() => sound.playClick()}
          className="inline-flex items-center gap-1 text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors group"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* 4 Gallery Cards Row matching reference */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {previewImages.map((img) => (
          <div
            key={img.id}
            onClick={() => handleOpenImage(img)}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-card cursor-pointer bg-slate-100"
          >
            <img
              src={img.thumbnail}
              alt={img.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-108"
              loading="lazy"
            />
            {/* Dark Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
              <span className="text-white text-xs font-bold line-clamp-1">
                {img.title}
              </span>
              <span className="text-[11px] text-sky-200 mt-0.5">
                {img.category} • {img.resolution}
              </span>
            </div>

            {/* Corner Zoom Pill */}
            <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs text-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-slate-950/90 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 text-white">
              <div>
                <h3 className="text-base sm:text-lg font-bold">{activeImage.title}</h3>
                <p className="text-xs text-slate-400">{activeImage.category} • {activeImage.resolution}</p>
              </div>
              <button
                onClick={() => setActiveImage(null)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High Res Image */}
            <div className="relative max-h-[65vh] flex items-center justify-center bg-black/50 p-2 overflow-hidden">
              <img
                src={activeImage.src}
                alt={activeImage.title}
                className="max-h-[60vh] max-w-full object-contain rounded-lg"
              />
            </div>

            {/* Bottom Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 bg-slate-900/90 border-t border-slate-800 text-slate-300 text-xs">
              <p className="max-w-xl text-slate-300">{activeImage.caption}</p>
              <div className="flex items-center gap-3">
                <a
                  href={activeImage.src}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download High-Res</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
