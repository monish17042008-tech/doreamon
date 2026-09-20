import React from "react";
import { Link } from "react-router-dom";
import { Users, Tv, Star, DoorOpen } from "lucide-react";
import { sound } from "../../services/audioService";

export default function FeatureHighlights() {
  const features = [
    {
      id: "gadgets",
      title: "Amazing Gadgets",
      subtitle: "From Anywhere Door to Take-copter!",
      link: "/gallery?category=Gadgets",
      icon: DoorOpen,
      bg: "bg-[#0b1636] hover:bg-[#0f1f4b] border-[#193275]/70 hover:border-amber-400/60 shadow-lg",
      iconColor: "text-amber-300 bg-amber-500/15 ring-1 ring-amber-400/30",
      accent: "text-amber-300"
    },
    {
      id: "characters",
      title: "Beloved Characters",
      subtitle: "Nobita, Shizuka, Gian, Suneo and Doraemon!",
      link: "/characters",
      icon: Users,
      bg: "bg-[#0b1636] hover:bg-[#0f1f4b] border-[#193275]/70 hover:border-sky-400/60 shadow-lg",
      iconColor: "text-sky-300 bg-sky-500/15 ring-1 ring-sky-400/30",
      accent: "text-sky-300"
    },
    {
      id: "episodes",
      title: "Classic Episodes",
      subtitle: "Timeless stories that never get old.",
      link: "/episodes",
      icon: Tv,
      bg: "bg-[#0b1636] hover:bg-[#0f1f4b] border-[#193275]/70 hover:border-emerald-400/60 shadow-lg",
      iconColor: "text-emerald-300 bg-emerald-500/15 ring-1 ring-emerald-400/30",
      accent: "text-emerald-300"
    },
    {
      id: "friendship",
      title: "Fun & Friendship",
      subtitle: "Because friends make life better!",
      link: "/game",
      icon: Star,
      bg: "bg-[#0b1636] hover:bg-[#0f1f4b] border-[#193275]/70 hover:border-purple-400/60 shadow-lg",
      iconColor: "text-purple-300 bg-purple-500/15 ring-1 ring-purple-400/30",
      accent: "text-purple-300"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
          Key Features
        </h2>
        <span className="text-xs text-sky-300/80 font-semibold uppercase tracking-wider">
          Explore the Cosmos
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.link}
              onClick={() => sound.playClick()}
              className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col items-center text-center group cursor-pointer ${item.bg}`}
            >
              <div className={`w-13 h-13 rounded-2xl flex items-center justify-center mb-3.5 transition-transform group-hover:scale-110 shadow-xs ${item.iconColor}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className={`text-base font-bold tracking-tight mb-1 ${item.accent}`}>
                {item.title}
              </h3>
              <p className="text-xs text-slate-300/90 line-clamp-2 leading-relaxed">
                {item.subtitle}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
