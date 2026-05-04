import { useInView } from "react-intersection-observer";
import { useRef } from "react";
import { MovieTypes } from "@/types/movie-by-id";
import useGetDiscoverInfinite from "@/hook/get-discover-infinite";
import {
  ChevronLeft,
  ChevronRight,
  Film,
  SwitchCamera,
  Tv,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconTransfer } from "@tabler/icons-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { SwiperOptions } from "swiper/types";
import BackdropCard from "@/components/ui/card-backdrop";
import { Navigation, Pagination, Keyboard, Scrollbar } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { Skeleton } from "@/components/ui/skeleton";
interface ReusableSwiperTypes {
  endpoint: string;
  params: Record<string, string | number>;
  displayName: string;
  media_type: string;

  //
  isKids: boolean;
}
export default function ReusableSwiper({
  endpoint,
  params,
  displayName,
  media_type,
  //
  isKids,
}: ReusableSwiperTypes) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0,
    rootMargin: "0px 0px -100px 0px",
  });

  const { data, isLoading } = useGetDiscoverInfinite<MovieTypes>({
    endpoint,
    media_type,
    params,
    isVisible: inView,
  });

  const results = data?.pages.flatMap((p) => p.results) ?? [];
  const filtered = results.filter((filter) => filter.vote_average > 3);

  //CUSTOM NAVIGATION
  const swiperRef = useRef<SwiperType | null>(null);
  return (
    <div className="relative space-y-2 " ref={ref}>
      <div className="flex justify-between lg:pr-4 pr-2">
        <h1 className="font-semibold lg:text-2xl  text-gray-300">
          {displayName}
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
      {!inView ? (
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          {...swiperConfigBackdrop}
        >
          {Array.from({ length: 10 }).map((_, idx) => (
            <SwiperSlide key={idx} className="p-1 w-auto!">
              <Skeleton className="aspect-video w-2xs" />
              <Skeleton className="h-4 w-40 mx-auto mt-4" />
              <Skeleton className="h-3.5 w-20 mx-auto mt-2" />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
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
          ) : filtered.length === 0 ? (
            <></>
          ) : (
            filtered.map((movie, idx) => (
              <SwiperSlide key={movie.id} className="p-1 w-auto!">
                <BackdropCard
                  media_type={media_type}
                  data={movie}
                  isKids={isKids}
                />
              </SwiperSlide>
            ))
          )}
        </Swiper>
      )}
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
