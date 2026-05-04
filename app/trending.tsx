"use client";
import { Swiper, SwiperSlide } from "swiper/react";
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

export default function Trending({
  media_type,
  time_window,

  //
  isKids,
}: {
  media_type: "movie" | "tv" | "all";
  time_window: "day" | "week";

  isKids: boolean;
}) {
  const { data, isLoading, isError } = useGetTrending({
    media_type: media_type,
    time_window: time_window,
    page: 1,
  });
  const swiperRef = useRef<SwiperType | null>(null);

  const trending = (data?.results || []).slice(0, 10);
  return (
    <div className="lg:space-y-2 space-y-1">
      <div className="flex justify-between lg:pr-4 pr-2">
        <h1 className="font-semibold lg:text-2xl  text-gray-300">
          TOP 10{"  "}
          {media_type === "all"
            ? "TODAY"
            : media_type === "movie"
              ? "MOVIES"
              : "SERIES"}
        </h1>
        <span className="lg:space-x-2 space-x-1 ">
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
              <h1 className="absolute left-3 bottom-3 text-8xl font-bold z-20 text-gray-300 drop-shadow-lg [text-shadow:2px_2px_0_black,-2px_2px_0_black,2px_-2px_0_black,-2px_-2px_0_black]">
                {idx + 1}
              </h1>
              <Skeleton className="aspect-video w-2xs" />
              <Skeleton className="h-4 w-40 mx-auto mt-4" />
              <Skeleton className="h-3.5 w-20 mx-auto mt-2" />
            </SwiperSlide>
          ))
        ) : trending.length === 0 ? (
          <></>
        ) : (
          trending.map((movie, idx) => (
            <SwiperSlide key={movie.id} className="p-1 w-auto!">
              <h1 className="absolute left-3 bottom-3 lg:text-8xl text-7xl font-bold z-20 text-gray-300 drop-shadow-lg [text-shadow:2px_2px_0_black,-2px_2px_0_black,2px_-2px_0_black,-2px_-2px_0_black]">
                {idx + 1}
              </h1>
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
