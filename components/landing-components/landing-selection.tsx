"use client";
import { motion } from "framer-motion";
import {
  Award,
  CalendarDays,
  Clapperboard,
  Flame,
  Telescope,
  TrendingUp,
} from "lucide-react";

import Link from "next/link";

export default function LandingSelection({
  media_type,
}: {
  media_type: string;
}) {
  return (
    <section className="lg:py-15 py-5 min-h-screen flex items-center justify-center">
      <div className=" w-full lg:pl-30">
        <div className="mb-2"></div>
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:gap-4 gap-2 lg:auto-rows-[280px] auto-rows-[200px]">
          {/* 5. Security - Wide (3x1) */}
          <motion.div
            className="group relative md:col-span-3 bg-zinc-900  lg:rounded-xl rounded-md overflow-hidden cursor-pointer hover:border-zinc-700 transition-colors"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 0.98 }}
          >
            <Link href={`/${media_type}/popular`}>
              {/* Image Container */}
              <div className="w-full h-full relative">
                <img
                  src={
                    media_type === "movie"
                      ? "https://image.tmdb.org/t/p/w1280/ebyxeBh56QNXxSJgTnmz7fXAlwk.jpg"
                      : "https://image.tmdb.org/t/p/w1280/sMxT4e8FaQNnabCG7FwsklHae14.jpg"
                  }
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center brightness-50 group-hover:brightness-80 transition duration-400"
                />
              </div>

              {/* Bottom Overlay */}
              <div className="absolute bottom-0 left-0 right-0 lg:p-6 p-4 bg-linear-to-t from-black/70 to-transparent">
                <h3 className="lg:text-3xl text-white flex items-center gap-2 font-medium">
                  <Flame className="w-5 h-5" />
                  Popular {media_type === "movie" ? "Movies" : "TV Shows"}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Watch the latest hits and blockbusters from top studios
                  worldwide.
                </p>
              </div>
            </Link>
          </motion.div>

          {/* 6. Mobile Responsive - Wide (3x1) - Expanded to fill gap */}
          <motion.div
            className="group relative md:col-span-3 bg-zinc-900  lg:rounded-xl rounded-md overflow-hidden cursor-pointer hover:border-zinc-700 transition-colors"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 0.98 }}
          >
            <Link href={`/${media_type}/explore`}>
              {/* Image Container */}
              <div className="w-full h-full relative">
                <img
                  src={
                    media_type === "movie"
                      ? "https://image.tmdb.org/t/p/w1280/ll1msvrkLWWl3g20bgN7g2ua3JA.jpg"
                      : "https://image.tmdb.org/t/p/w1280/yINoXRn6xsWu9HTbvoW81uQI8QQ.jpg"
                  }
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center brightness-50 group-hover:brightness-80 transition duration-400"
                />
              </div>

              {/* Bottom Overlay */}
              <div className="absolute bottom-0 left-0 right-0 lg:p-6 p-4 bg-linear-to-t from-black/70 to-transparent">
                <h3 className="lg:text-3xl text-white flex items-center gap-2 font-medium">
                  <Telescope className="w-5 h-5" />
                  Explore
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Browse and filter movies, shows, and series to find your next
                  watch.
                </p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            className="group relative md:col-span-2 md:row-span-2  bg-zinc-900  lg:rounded-xl rounded-md overflow-hidden cursor-pointer hover:border-zinc-700 transition-colors"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 0.98 }}
          >
            <Link href={`/${media_type}/trending`}>
              {/* Image Container */}
              <div className="w-full h-full relative">
                <img
                  src={
                    media_type === "movie"
                      ? "https://image.tmdb.org/t/p/w1280/6WqqEjiycNvDLjbEClM1zCwIbDD.jpg"
                      : "https://image.tmdb.org/t/p/w1280/5cvnxEHT3e39DvT6ARw4GNCFrB0.jpg"
                  }
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center brightness-50 group-hover:brightness-80 transition duration-400"
                />
              </div>

              {/* Bottom Overlay */}
              <div className="absolute bottom-0 left-0 right-0 lg:p-6 p-4 bg-linear-to-t from-black/70 to-transparent">
                <h3 className="lg:text-2xl text-white flex items-center gap-2 font-medium">
                  <TrendingUp className="w-5 h-5" />
                  Trending
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  See what everyone is watching and discover what's trending
                  today.
                </p>
              </div>
            </Link>
          </motion.div>

          {/* 2. Layouts - Standard (2x1) - Swapped with Global Network */}
          <motion.div
            className="group relative md:col-span-2 bg-zinc-900  lg:rounded-xl rounded-md overflow-hidden cursor-pointer hover:border-zinc-700 transition-colors"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 0.98 }}
          >
            {/* Image Container */}
            <Link href={`${media_type}/new_release`}>
              <div className="w-full h-full relative">
                <img
                  src={
                    media_type === "movie"
                      ? "https://image.tmdb.org/t/p/w1280/7nfpkR9XsQ1lBNCXSSHxGV7Dkxe.jpg"
                      : "https://image.tmdb.org/t/p/w1280/75HgaphatW0PDI3XIHQWZUpbhn6.jpg"
                  }
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center brightness-50 group-hover:brightness-80 transition duration-400"
                />
              </div>

              {/* Bottom Overlay */}
              <div className="absolute bottom-0 left-0 right-0 lg:p-6 p-4 bg-linear-to-t from-black/70 to-transparent">
                <h3 className="lg:text-3xl text-white flex items-center gap-2 font-medium">
                  <CalendarDays className="w-5 h-5" />
                  New Release
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Discover the latest movies and shows freshly released this
                  week.
                </p>
              </div>
            </Link>
          </motion.div>

          {/* 3. Global Network - Tall (2x2) - Swapped with Layouts */}

          <motion.div
            className="group relative md:col-span-2 md:row-span-2  bg-zinc-900  lg:rounded-xl rounded-md overflow-hidden cursor-pointer hover:border-zinc-700 transition-colors"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 0.98 }}
          >
            <Link href={`/${media_type}/top_rated`}>
              {/* Image Container */}
              <div className="w-full h-full relative">
                <img
                  src={
                    media_type === "movie"
                      ? "https://image.tmdb.org/t/p/w1280/5XNQBqnBwPA9yT0jZ0p3s8bbLh0.jpg"
                      : "https://image.tmdb.org/t/p/w1280/9faGSFi5jam6pDWGNd0p8JcJgXQ.jpg"
                  }
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center brightness-50 group-hover:brightness-80 transition duration-400"
                />
              </div>

              {/* Bottom Overlay */}
              <div className="absolute bottom-0 left-0 right-0 lg:p-6 p-4 bg-linear-to-t from-black/70 to-transparent">
                <h3 className="lg:text-2xl text-white flex items-center gap-2 font-medium">
                  <Award className="w-5 h-5" />
                  Top Rated
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  See what everyone is watching and discover what's trending
                  today.
                </p>
              </div>
            </Link>
          </motion.div>

          {/* 4. Speed - Standard (2x1) */}
          <motion.div
            className="group relative md:col-span-2 bg-zinc-900  lg:rounded-xl rounded-md overflow-hidden cursor-pointer hover:border-zinc-700 transition-colors"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 0.98 }}
          >
            <Link href={`${media_type}/now_playing`}>
              {/* Image Container */}
              <div className="w-full h-full relative">
                <img
                  src={
                    media_type === "movie"
                      ? "https://image.tmdb.org/t/p/w1280/zvZBNNDWd5LcsIBpDhJyCB2MDT7.jpg"
                      : "https://image.tmdb.org/t/p/w1280/ibtWY4Ywc0QUbK5joQ7h4ulOPlU.jpg"
                  }
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center brightness-50 group-hover:brightness-80 transition duration-400"
                />
              </div>

              {/* Bottom Overlay */}
              <div className="absolute bottom-0 left-0 right-0 lg:p-6 p-4 bg-linear-to-t from-black/70 to-transparent">
                <h3 className="lg:text-3xl text-white flex items-center gap-2 font-medium">
                  <Clapperboard className="w-5 h-5" />
                  Now Playing
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Watch the latest movies currently playing in theaters and
                  online.
                </p>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
