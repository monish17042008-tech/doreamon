import React from "react";
import HeroSection from "../components/home/HeroSection";
import FeatureHighlights from "../components/home/FeatureHighlights";
import DailyGadgetCard from "../components/home/DailyGadgetCard";
import PopularEpisodesRow from "../components/home/PopularEpisodesRow";
import GalleryPreview from "../components/home/GalleryPreview";
import AboutSection from "../components/home/AboutSection";

export default function Home({ onOpenSearch }) {
  return (
    <div className="min-h-screen bg-[#070f26] flex flex-col">
      {/* 3D Interactive Hero Banner */}
      <HeroSection onOpenSearch={onOpenSearch} />

      {/* Main Home Content Flow */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 sm:space-y-16 w-full">
        {/* 4 Feature Cards */}
        <section>
          <FeatureHighlights />
        </section>

        {/* Popular Episodes & Daily Gadget Spotlight */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <PopularEpisodesRow />
          </div>
          <div className="lg:col-span-4 space-y-4">
            <DailyGadgetCard />
          </div>
        </section>

        {/* Media Gallery Spotlight */}
        <section>
          <GalleryPreview />
        </section>

        {/* 22nd-Century Origin Lore & Fujiko F. Fujio Tribute */}
        <section>
          <AboutSection />
        </section>
      </main>
    </div>
  );
}
