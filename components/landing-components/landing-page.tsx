"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  EffectFade,
  Navigation,
  Keyboard,
  Autoplay,
  Controller,
} from "swiper/modules";
import LandingContent from "./content";
import { useEffect, useState } from "react";
import { IMAGE_BASE_URL } from "@/constants/tmdb";
import { MovieTypes } from "@/types/movie-by-id";
import { Button } from "../ui/button";
import Link from "next/link";
import { Play, PlayIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import WatchlistButton from "../ui/button-watchlist";

import Selector from "./selector";
import { Badge } from "../ui/badge";
export default function LandingPage({
  fullSize,
  isKids,
  setMediaTypeAction,
  media_type_action,
}: {
  fullSize: boolean;
  isKids: boolean;
  setMediaTypeAction: (media_type: "all" | "movie" | "tv") => void;
  media_type_action: "all" | "movie" | "tv";
}) {
  const [activeData, setActiveData] = useState<MovieTypes | null>(null);
  const logo = activeData?.images?.logos.find(
    (f) => f.iso_639_1 === "en",
  )?.file_path;
  const [firstSwiper, setFirstSwiper] = useState<SwiperType | null>(null);
  const [secondSwiper, setSecondSwiper] = useState<SwiperType | null>(null);
  const poster = activeData?.poster_path || null;
  const title = activeData?.title || activeData?.name || "Unknown";
  const [loaded, setLoaded] = useState(false);
  const backdrop =
    activeData?.images?.backdrops.find((f) => f.iso_639_1 === "en")
      ?.file_path ||
    activeData?.backdrop_path ||
    null;
  const dateString = activeData?.release_date || activeData?.first_air_date;
  const year = dateString ? String(new Date(dateString).getFullYear()) : "";
  const genre = activeData?.genres[0].name ?? "N/A";
  //PARALLAX
  const [parallaxY, setParallaxY] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      setParallaxY(window.scrollY * -0.2);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const normal_list = [
    {
      id: "1242898",
      media_type: "movie",
      custom_image: "",
      custom_logo: "",
      poster_path: "/hiD9PSPrZhWDB9ubTuVdq7uLx5s.jpg",
    },
    {
      id: "285838",
      media_type: "tv",
      custom_image: "",
      custom_logo: "",
      poster_path: "/2CfTNVaR8kZQkWtWWE3Cntaiq33.jpg",
    },
    {
      id: "980431",
      media_type: "movie",
      custom_image: "",
      custom_logo: "",
      poster_path: "/fyFOzo65OrdsiAGW012J9l0yCFa.jpg",
    },
    {
      id: "1226863",
      media_type: "movie",
      custom_image: "",
      custom_logo: "",
      poster_path: "/bIMyyqHs9087tvi5dU7RDgzQeWm.jpg",
    },
    {
      id: "1265609",
      media_type: "movie",
      custom_image: "",
      custom_logo: "",
      poster_path: "/rFhKkXhk7ClU03jQ5rHIApJDwev.jpg",
    },
  ];
  const kids_list = [
    {
      id: "823219",
      media_type: "movie",
      custom_image: "",
      custom_logo: "",
      poster_path: "",
    },
    {
      id: "976573",
      media_type: "movie",
      custom_image: "",
      custom_logo: "",
      poster_path: "",
    },
    {
      id: "698687",
      media_type: "movie",
      custom_image: "",
      custom_logo: "",
      poster_path: "",
    },
  ];

  const list = isKids ? kids_list : normal_list;
  const media_type =
    list.find((f) => f.id === String(activeData?.id))?.media_type || "movie";

  return (
    <>
      <Swiper
        spaceBetween={30}
        effect="fade"
        watchSlidesProgress={true}
        keyboard={{ enabled: true }}
        pagination={{ type: "progressbar" }}
        modules={[EffectFade, Navigation, Keyboard, Autoplay]}
        onSwiper={setFirstSwiper} // ← capture instance
        style={{ transform: `translateY(${parallaxY}px)` }} // 👈 add this
        className="fixed! lg:h-screen h-130 inset-0 lg:mask-[linear-gradient(to_left,black_40%,transparent_100%)]
               mask-size-[100%_100%]"
      >
        {list.map((movie) => (
          <SwiperSlide key={movie.id} className="">
            <LandingContent
              id={movie.id}
              media_type={movie.media_type}
              setActiveData={setActiveData}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className={cn(
          "relative  z-10    lg:pl-35  transition-all duration-300 h-screen flex justify-center items-center lg:pointer-events-none overflow-hidden",
          fullSize ? "lg:max-h-screen" : "lg:max-h-190 max-h-120",
        )}
      >
        <Selector
          setMediaTypeAction={setMediaTypeAction}
          media_type_action={media_type_action}
        />
        <div className=" absolute inset-0 bg-linear-to-b  lg:from-transparent from-background/80 via-transparent to-background " />
        {activeData && (
          <div className="hidden lg:left-35 md:left-2 lg:block md:block absolute bottom-25 lg:max-w-[45%] md:max-w-[50%]">
            <div className="lg:mb-8 mb-3 lg:max-w-sm max-w-58   overflow-hidden">
              {activeData?.images.logos.length === 0 ? (
                <h1 className="lg:text-6xl text-4xl  font-bold">
                  {activeData?.title || activeData?.name}
                </h1>
              ) : (
                <img
                  src={`${IMAGE_BASE_URL}/w780${logo}`}
                  alt={activeData?.title || activeData?.name}
                  className={cn(
                    " w-full lg:max-h-40 max-h-30 object-contain object-left transition duration-200",
                    loaded ? "opacity-100" : "opacity-0",
                  )}
                  onLoad={() => setLoaded(true)}
                />
              )}
            </div>
            <div className="flex items-center lg:gap-6 gap-3 lg:mb-8 mb-3">
              <div className="flex items-center gap-2">
                <div className="lg:text-2xl text-lg font-semibold  ">
                  {activeData?.vote_average.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">/ 10</div>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <div className="text-muted-foreground">{year}</div>
              <div className="h-8 w-px bg-white/10"></div>
              <div className="text-muted-foreground">{genre}</div>
            </div>
            <p className="text-muted-foreground leading-relaxed lg:mb-10 mb-5  line-clamp-2 lg:text-lg md:text-base">
              {activeData?.overview}
            </p>

            <div className="flex lg:gap-4 gap-3 items-center">
              <Button
                asChild
                size="xl"
                variant="accent"
                className="active:scale-95 pointer-events-auto"
              >
                <Link
                  href={`/details/${media_type}/${activeData?.id}`}
                  scroll={false}
                  prefetch={false}
                >
                  <Play className=" fill-current" /> Play Now
                </Link>
              </Button>
              {activeData && (
                <WatchlistButton
                  id={activeData.id}
                  media_type={media_type}
                  title={title}
                  released_date={dateString}
                  main_genre={genre}
                  poster_path={activeData.poster_path}
                  backdrop_path={activeData.backdrop_path}
                  type="button"
                />
              )}
            </div>
          </div>
        )}
        <div className="lg:hidden md:hidden">
          <Swiper
            keyboard={{ enabled: true }}
            modules={[Controller, Navigation, Keyboard, Autoplay]}
            onSwiper={setSecondSwiper} // ← capture instance
            controller={{ control: firstSwiper ?? undefined }} // ← control desktop
            effect={"cards"}
            slidesPerView="auto"
            centeredSlides={true}
            spaceBetween={15}
            className="mt-6"
          >
            {list.map((movie) => (
              <SwiperSlide key={movie.id} className="w-auto! drop-shadow-md">
                {({ isActive }) => (
                  <div
                    className={cn(
                      " w-45  transition-all duration-300",
                      isActive
                        ? "scale-100 brightness-100"
                        : "scale-80 brightness-50",
                    )}
                  >
                    <div className="aspect-9/13 relative flex flex-col gap-6">
                      <img
                        className={cn(
                          " h-full w-full object-cover object-center rounded-sm ",
                        )}
                        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                        alt=""
                      />
                    </div>

                    <div
                      className={cn(
                        "flex justify-between transition-all duration-200 delay-300 mt-4",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    >
                      <Badge variant="outline" className="rounded-sm">
                        Movie
                      </Badge>
                      <Badge variant="outline" className="rounded-sm">
                        2026
                      </Badge>
                      <Badge variant="outline" className="rounded-sm">
                        PG
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      asChild
                      className={cn(
                        "w-full h-7.5 transition-all duration-200 delay-300 rounded-sm text-sm mt-2",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    >
                      <Link href={`/details/${media_type}/${activeData?.id}`}>
                        {" "}
                        <PlayIcon />
                        Watch Now
                      </Link>
                    </Button>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
}
