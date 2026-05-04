"use client";
import { Input } from "@/components/ui/input";
import { Check, ChevronRight, Search } from "lucide-react";
import { Tailspin } from "ldrs/react";
import "ldrs/react/Tailspin.css";
import { ChangeEvent, useMemo, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SpotlightBorderWrapper from "@/components/ui/border";
import { Button } from "@/components/ui/button";
import { IconCaretUpDown } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import useSearch from "@/hook/get-search";
import { MovieTypes } from "@/types/movie-by-id";
import Link from "next/link";
import { movieGenres } from "@/constants/filter";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [value, setValue] = useState("movie");
  const [text, setText] = useState("");
  const isSearching = text !== "";
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  const handleTypeChange = (newType: string) => {
    setValue(newType);
    setOpen(false);
  };

  const { data, isLoading, isSuccess } = useSearch<MovieTypes>({
    query: text,
    media_type: value,
    enable: isSearching,
  });

  const results = useMemo(
    () => data?.pages.flatMap((p) => p.results) ?? [],
    [data],
  );
  const isLogin = pathname.startsWith("/login/profiles");

  return (
    !isLogin && (
      <div className="fixed lg:top-8 top-0 lg:right-8 lg:inset-x-[unset] inset-x-0 z-30 p-2 lg:p-0">
        <div className="relative flex items-center bg-background/30 rounded-md backdrop-blur-md">
          <span className="absolute left-2 flex items-center border-r pl-1 pr-2">
            <Search className="size-4 opacity-50" />
          </span>
          <SpotlightBorderWrapper className="w-full">
            <Input
              value={text}
              type="search"
              placeholder={
                value === "keyword"
                  ? `Search topic.. e.g. "Time Loop"`
                  : value === "movie"
                    ? "Search Movie..."
                    : "Search TV Shows..."
              }
              onChange={handleTextChange}
              className={cn(
                "lg:w-md w-full  pl-12 lg:text-base text-sm border-0",
                value === "movie" ? "pr-23" : "pr-28",
              )}
            />
          </SpotlightBorderWrapper>
          <div className="absolute top-0.5 right-0.5">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  role="combobox"
                  aria-expanded={open}
                  variant="outline"
                  className="border-0 h-9 bg-transparent"
                >
                  {media_type.find((m) => m.value === value)?.label}
                  <IconCaretUpDown />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-37.5 p-0">
                <Command>
                  <CommandList>
                    <CommandEmpty>No type found.</CommandEmpty>
                    <CommandGroup>
                      {media_type.map((type) => (
                        <CommandItem
                          key={type.value}
                          value={type.value}
                          onSelect={handleTypeChange}
                        >
                          {type.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              value === type.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <AnimatePresence>
          {isSearching && (
            <motion.div
              key="search-popup"
              initial={{ maxHeight: 0 }}
              animate={{ maxHeight: "80vh" }}
              exit={{ maxHeight: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute bg-background/80 backdrop-blur-md w-full lg:mt-0.5 z-10 overflow-auto p-2 custom-scrollbar rounded-sm top-full  space-y-3"
            >
              <div className="flex flex-col gap-3">
                {isLoading ? (
                  <div className="flex justify-center items-center h-30">
                    <Tailspin size="40" stroke="6" speed="0.9" color="white" />
                  </div>
                ) : results.length === 0 && isSuccess ? (
                  <div className="flex justify-center items-center h-30">
                    <h1>No result found</h1>
                  </div>
                ) : (
                  results
                    .filter((f) => f.backdrop_path)
                    .map((m) => {
                      const year = String(
                        new Date(
                          m.release_date || m.first_air_date,
                        ).getFullYear(),
                      );
                      const title = m.title || m.name || "";
                      const genre = movieGenres.find(
                        (g) => g.id === m.genre_ids[0],
                      );

                      return (
                        <Link
                          key={m.id}
                          href={`/details/${value}/${m.id}`}
                          prefetch={false}
                        >
                          <div className="group relative overflow-hidden rounded-sm hover:shadow-lg transition-all duration-300">
                            <div className="flex gap-3">
                              <div className="relative w-24 sm:w-20 aspect-2/3 shrink-0 overflow-hidden rounded-xs">
                                <img
                                  src={`https://image.tmdb.org/t/p/w780${m.poster_path}`}
                                  alt={title}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </div>

                              <div className="flex flex-col justify-center flex-1 min-w-0">
                                <h3 className="font-semibold line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                                  {title}
                                </h3>
                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                  {genre?.name && <p>{genre.name}</p>} |
                                  <p className="">{year}</p> |
                                  {m.vote_average !== 0 ? (
                                    <div className="flex items-center gap-1 ">
                                      <svg
                                        className="w-4 h-4 text-yellow-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                      <span className=" font-medium">
                                        {m.vote_average.toFixed(1)}
                                      </span>
                                    </div>
                                  ) : (
                                    <p>N/A</p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight />
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  );
}

const media_type = [
  { value: "movie", label: "Movie" },
  { value: "tv", label: "TV Show" },
  // { value: "keyword", label: "Keyword" },
];
