import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Navigation, Pagination, Keyboard, Scrollbar } from "swiper/modules";
import { IMAGE_BASE_URL } from "@/constants/tmdb";
import { Season } from "@/types/movie-by-id";

import { useSeasonStore } from "@/store/season";
import { motion } from "framer-motion";
import TitleReusable from "@/components/ui/title";
import { swiperConfig, swiperModalConfig } from "@/lib/swiper-config";
export default function SeasonSelectorPoster({
  seasons,
  id,
}: {
  seasons: Season[];
  id: string;
}) {

  const { setSeasonSelect, getSeasonSelect } = useSeasonStore();
  const savedSeason = getSeasonSelect(id);
  const initialIndex = savedSeason
    ? seasons.findIndex((s) => s.season_number === savedSeason.number)
    : seasons.length - 1; // fallback to last season
  return (
    <div className="space-y-3">
      <TitleReusable
        title="Seasons"
        description={`${seasons.length} seasons`}
      />

      <Swiper data-vaul-no-drag {...swiperModalConfig}>
        {seasons.map((season) => {
          const isSelected = savedSeason?.number === season.season_number;
          return (
            <SwiperSlide key={season.id} className="p-1">
              <div
                onClick={() =>
                  setSeasonSelect(id, {
                    name: season.name,
                    number: season.season_number,
                  })
                }
              >
                <div
                  className={`group p-px rounded-sm bg-linear-to-b hover:to-red-800 from-transparent active:scale-98 active:from-red-800 ${
                    isSelected ? "to-red-800 from-transparent" : ""
                  }`}
                >
                  <div
                    className="aspect-2/3 rounded-sm  transition cursor-pointer overflow-hidden relative "
                   
                  >
                    {season.poster_path ? (
                      <img
                        src={`${IMAGE_BASE_URL}/w780${season.poster_path}`}
                        alt={season.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl font-bold text-neutral-800">
                          {season.season_number}
                        </span>
                      </div>
                    )}
                    {!isSelected && (
                      <div className="absolute inset-0 bg-background/50 "></div>
                    )}
                    {isSelected && (
                      <div className="absolute inset-0 bg-linear-to-b to-red-800/40 via-transparent from-transparent rounded-md animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
