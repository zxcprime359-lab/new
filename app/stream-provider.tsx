import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { motion } from "motion/react";
import { Navigation, Pagination, Keyboard, Scrollbar } from "swiper/modules";
import Link from "next/link";
import { SwiperOptions } from "swiper/types";

import netflix from "@/assets/netflix.svg";
import amazon from "@/assets/amazon-mgm.webp";
import disney from "@/assets/disney.svg";
import hbo from "@/assets/hbo.svg";
import apple from "@/assets/apple.svg";
import vivamax from "@/assets/vivamax.png";
import marvell from "@/assets/marvell.png";
import a24 from "@/assets/a24.svg";
import blumhouse from "@/assets/blumhouse.svg";
import shudder from "@/assets/shudder.svg";
import { cn } from "@/lib/utils";
export default function StreamProviders() {
  return (
    <div className="space-y-3">
      <h1 className="lg:text-2xl font-medium">Streaming Providers</h1>
      <Swiper {...swiperConfigBackdrop}>
        {COMPANIES.map((company, i) => (
          <SwiperSlide key={company.id} className="lg:p-1 p-0.5 w-auto!">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: {
                  delay: i * 0.03,
                  duration: 0.3,
                  ease: "easeInOut",
                },
              }}
              className="relative"
            >
              <Link
                href={`/${company.type}?${company.type === "movie" ? "company" : "network"}=${company.id}`}
              >
                <div className="relative   ">
                  <div className="aspect-square lg:size-40 md:size-35 size-30  transition cursor-pointer relative   overflow-hidden flex justify-center items-center bg-linear-to-b to-card from-card/50 rounded-full p-4">
                    <img
                      src={company.logo.src}
                      alt={company.displayName}
                      className={cn(
                        "w-full h-full object-contain transition-opacity duration-300",

                        company.invert ? "filter invert" : "",
                      )}
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          </SwiperSlide>
        ))}
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
  spaceBetween: 10,
};
export const COMPANIES = [
  {
    id: "213",
    displayName: "Netflix",
    logo: netflix,
    type: "tv",
    invert: false,
    endpoint: "discover",
    params: {
      with_networks: 213,
      sort_by: "popularity.desc",
    },
  },
  {
    id: "210099",
    displayName: "Amazon MGM Studios",
    logo: amazon,
    type: "movie",
    invert: true,
    endpoint: "discover",
    params: {
      with_companies: 210099,
      sort_by: "popularity.desc",
    },
  },
  {
    id: "142877",
    displayName: "Shudder",
    logo: shudder,
    type: "movie",
    invert: false,
    endpoint: "discover",
    params: {
      with_companies: 142877,
      sort_by: "popularity.desc",
    },
  },
  {
    id: "2739",
    displayName: "Disney+",
    logo: disney,
    type: "tv",
    invert: false,
    endpoint: "discover",
    params: {
      with_networks: 2739,
      sort_by: "popularity.desc",
    },
  },
  {
    id: "2552",
    displayName: "Apple TV+",
    logo: apple,
    type: "tv",
    invert: true,
    endpoint: "discover",
    params: {
      with_networks: 2552,
      sort_by: "popularity.desc",
    },
  },
  {
    id: "3172",
    displayName: "Blumhouse",
    logo: blumhouse,
    type: "movie",
    invert: true,
    endpoint: "discover",
    params: {
      with_companies: 3172,
      sort_by: "popularity.desc",
    },
  },

  {
    id: "149142",
    displayName: "Vivamax",
    logo: vivamax,
    type: "movie",
    invert: false,
    endpoint: "discover",
    params: {
      with_companies: 149142,
      sort_by: "popularity.desc",
    },
  },
  {
    id: "49",
    displayName: "HBO",
    logo: hbo,
    type: "tv",
    invert: true,
    endpoint: "discover",
    params: {
      with_networks: 49,
      sort_by: "popularity.desc",
    },
  },

  {
    id: "420",
    displayName: "Marvel Studios",
    logo: marvell,
    type: "movie",
    invert: true,
    endpoint: "discover",
    params: {
      with_companies: 420,
      sort_by: "popularity.desc",
    },
  },
  {
    id: "41077",
    displayName: "A24",
    logo: a24,
    type: "movie",
    invert: true,
    endpoint: "discover",
    params: {
      with_companies: 41077,
      sort_by: "popularity.desc",
    },
  },
];
