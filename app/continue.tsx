"use client";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Keyboard, Scrollbar } from "swiper/modules";
import { SwiperOptions } from "swiper/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Library, Trash, X } from "lucide-react";

import { Swiper as SwiperType } from "swiper";
import { useRef, useState } from "react";
import {
  ContinueWatchingItem,
  useContinueWatching,
} from "@/hook/account/progress-save";
import DatabaseCard from "./card-database";
import { Skeleton } from "@/components/ui/skeleton";
export default function ContinueWatching({
  data,
  isLoading,
}: {
  isLoading: boolean;
  data: ContinueWatchingItem[];
}) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [trash, setTrash] = useState(false);
  return (
    <div className="space-y-2">
      <div className="flex justify-between lg:pr-4 pr-2">
        <h1 className="font-semibold lg:text-2xl  text-gray-300">
          Continue Watching
        </h1>
        {data?.length !== 0 && (
          <span className="lg:space-x-2 space-x-1">
            <Button variant="outline" onClick={() => setTrash((prev) => !prev)}>
              {trash ? <X /> : <Trash />}
            </Button>
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
        )}
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
        ) : data?.length === 0 ? (
          <SwiperSlide className="p-1 border-dashed border-2">
            <div className="flex gap-6 items-center px-4 py-6">
              <Library className="size-10" />
              <div>
                <h1 className="text-xl font-medium">No recently played</h1>
                <p className="text-muted-foreground">
                  Start by watching your favorite movies and tv shows.
                </p>
              </div>
            </div>
          </SwiperSlide>
        ) : (
          data?.slice(0, 10).map((movie, idx) => (
            <SwiperSlide key={movie.id} className="p-1 w-auto!">
              <DatabaseCard data={movie} trash={trash} />
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
  spaceBetween: 5,
  watchSlidesProgress: true,
};
