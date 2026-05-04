"use client";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Keyboard, Scrollbar } from "swiper/modules";
import BackdropCard from "@/components/ui/card-backdrop";
import useGetTrending from "@/hook/trending";
import { SwiperOptions } from "swiper/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Swiper as SwiperType } from "swiper";
import { Skeleton } from "@/components/ui/skeleton";
import useMovieById from "@/hook/get-movie-by-id";
import { ContinueWatchingItem } from "@/hook/account/progress-save";

export default function BecauseYouWatch({
  random,
  isKids,
}: {
  random: ContinueWatchingItem;
  isKids: boolean;
}) {
  console.log("randon", random);
  const { data, isLoading } = useMovieById({
    id: random.tmdb_id,
    media_type: random.media_type,
  });

  const swiperRef = useRef<SwiperType | null>(null);

  const trending = (data?.recommendations.results || []).slice(0, 10);
  return (
    <div className="lg:space-y-2 space-y-1">
      <div className="flex justify-between lg:pr-4 pr-2">
        <h1 className="font-semibold lg:text-2xl  text-gray-300">
          Because You Watched {random.title}
        </h1>
        <span className="lg:space-x-2 space-x-1">
          <Button
            variant="outline"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <ChevronLeft />
          </Button>

          <Button
            variant="outline"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ChevronRight />
          </Button>
        </span>
      </div>
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        {...swiperConfigBackdrop}
      >
        {isLoading ? (
          Array.from({ length: 10 }).map((_, idx) => (
            <SwiperSlide key={idx} className="p-1 w-auto!">
              <Skeleton className="aspect-video w-2xs" />
              <Skeleton className="h-4 w-40 mx-auto mt-4" />
              <Skeleton className="h-3.5 w-20 mx-auto mt-2" />
            </SwiperSlide>
          ))
        ) : trending.length === 0 ? (
          <>1</>
        ) : (
          trending.map((movie, idx) => (
            <SwiperSlide key={movie.id} className="p-1 w-auto!">
              <BackdropCard
                media_type={movie.media_type}
                data={movie}
                isKids={isKids}
              />
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </div>
  );
}

const swiperConfigBackdrop: SwiperOptions = {
  keyboard: { enabled: true },
  scrollbar: { el: ".swiper-scrollbar", hide: false },
  modules: [Navigation, Pagination, Keyboard, Scrollbar],
  slidesPerView: "auto",
  watchSlidesProgress: true,
};
