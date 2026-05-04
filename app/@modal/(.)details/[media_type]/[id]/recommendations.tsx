import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { MovieTypes } from "@/types/movie-by-id";
import { swiperModalConfig } from "@/lib/swiper-config";
import MovieCard from "@/components/ui/card-poster";
export default function Recommendations({
  recommendations,
}: {
  recommendations: MovieTypes[];
}) {
  return (
    <div className="space-y-3">
      <h1 className="text-lg">You may also like</h1>
      <Swiper data-vaul-no-drag {...swiperModalConfig}>
        {recommendations.map((movie) => (
          <SwiperSlide key={movie.id} className="p-1">
            <MovieCard movie={movie} media_type={movie.media_type} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
