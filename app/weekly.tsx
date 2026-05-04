"use client";
import useGetTrending from "@/hook/trending";
import { SwiperOptions } from "swiper/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Swiper as SwiperType } from "swiper";

import MovieCard from "@/components/ui/card-poster";

export default function Weekly() {
  const { data, isLoading, isError } = useGetTrending({
    media_type: "all",
    time_window: "week",
    page: 1,
  });
  const swiperRef = useRef<SwiperType | null>(null);

  const trending = (data?.results || []).slice(0, 16);
  return (
    <div className="space-y-3">
      <h1 className="font-medium lg:text-2xl text-base  text-gray-300">
        Weekly Favorites
      </h1>

      <div className="grid lg:grid-cols-8 md:grid-cols-5 grid-cols-2 gap-1">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, idx) => <div key={idx}>1</div>)
        ) : trending.length === 0 ? (
          <div>1</div>
        ) : (
          trending.map((movie, idx) => (
            <MovieCard
              key={movie.id}
              media_type={movie.media_type}
              movie={movie}
            />
          ))
        )}
      </div>
    </div>
  );
}
