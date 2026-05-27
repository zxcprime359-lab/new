"use client";

import useGetTrending from "@/hook/trending";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard } from "swiper/modules";
import "swiper/css";
import Slides from "./slides";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";

export default function Reels() {
  const { data, isLoading } = useGetTrending({
    media_type: "all",
    time_window: "week",
    page: 1,
  });
  const [muted, setMuted] = useState(true);
  return (
    <div className="h-screen relative w-full bg-black overflow-hidden lg:pl-35">
      <Swiper
        direction="vertical"
        slidesPerView={1}
        modules={[Mousewheel, Keyboard]}
        mousewheel
        keyboard
        watchSlidesProgress={true}
        className="h-full w-full"
      >
        {isLoading
          ? null
          : data?.results.map((movie) => (
              <SwiperSlide key={movie.id} className="">
                <Slides muted={muted} movie={movie} setMuted={setMuted} />
              </SwiperSlide>
            ))}
      </Swiper>
      {/* Right action buttons */}
      <div className="absolute z-10 inset-y-0 right-3 lg:flex flex-col items-center justify-center gap-5 p-4 hidden">
        <Button variant="outline">
          <ArrowUp />
        </Button>
        <Button variant="outline">
          <ArrowDown />
        </Button>
      </div>
    </div>
  );
}
