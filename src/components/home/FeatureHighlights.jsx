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
      bg: "bg-amber-50/80 hover:bg-amber-100/60 border-amber-200/70",
      iconColor: "text-amber-600 bg-amber-100",
      accent: "text-amber-800"
    },
    {
      id: "characters",
      title: "Beloved Characters",
      subtitle: "Nobita, Shizuka, Gian, Suneo and Doraemon!",
      link: "/characters",
      icon: Users,
      bg: "bg-sky-50/80 hover:bg-sky-100/60 border-sky-200/70",
      iconColor: "text-sky-600 bg-sky-100",
      accent: "text-sky-800"
    },
    {
      id: "episodes",
      title: "Classic Episodes",
      subtitle: "Timeless stories that never get old.",
      link: "/episodes",
      icon: Tv,
      bg: "bg-emerald-50/80 hover:bg-emerald-100/60 border-emerald-200/70",
      iconColor: "text-emerald-600 bg-emerald-100",
      accent: "text-emerald-800"
    },
    {
      id: "friendship",
      title: "Fun & Friendship",
      subtitle: "Because friends make life better!",
      link: "/game",
      icon: Star,
      bg: "bg-purple-50/80 hover:bg-purple-100/60 border-purple-200/70",
      iconColor: "text-purple-600 bg-purple-100",
      accent: "text-purple-800"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-800 tracking-tight">
          Key Features
        </h2>
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
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
              className={`p-5 rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-card flex flex-col items-center text-center group cursor-pointer ${item.bg}`}
            >
              <div className={`w-13 h-13 rounded-2xl flex items-center justify-center mb-3.5 transition-transform group-hover:scale-110 shadow-xs ${item.iconColor}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className={`text-base font-bold tracking-tight mb-1 ${item.accent}`}>
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {item.subtitle}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
