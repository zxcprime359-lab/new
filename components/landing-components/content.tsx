import { IMAGE_BASE_URL } from "@/constants/tmdb";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import useMovieById from "@/hook/get-movie-by-id";
import { useSwiperSlide } from "swiper/react";
import { cn } from "@/lib/utils";
import { MovieTypes } from "@/types/movie-by-id";

export default function LandingContent({
  id,
  media_type,
  setActiveData,
}: {
  id: string;
  media_type: string;
  setActiveData: (data: MovieTypes) => void;
}) {
  const { isActive } = useSwiperSlide();
  const [loaded, setLoaded] = useState(false);
  const { data } = useMovieById({
    id,
    media_type,
    enabled: isActive,
  });

  useEffect(() => {
    if (data && isActive) {
      setActiveData(data);
    }
  }, [data, isActive]);

  return (
    <motion.img
      src={`${IMAGE_BASE_URL}/original${data?.backdrop_path}`}
      alt={data?.title || data?.name}
      className={cn(
        "object-cover w-full h-full transition duration-200 brightness-50 md:brightness-100",
        loaded ? "opacity-100" : "opacity-0",
      )}
      onLoad={() => setLoaded(true)}
    />
  );
}
