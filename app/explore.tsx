"use client";
import {
  IconFilter2Bolt,
  IconFilter2X,
  IconLoader,
  IconRefresh,
  IconTransfer,
  IconX,
} from "@tabler/icons-react";
import { Calendar, Check, ChevronsUpDown, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import MovieCard from "@/components/ui/card-poster";
import {
  keywordTopics,
  movieGenres,
  productionCompanies,
  tvGenres,
  tvNetworks,
} from "@/constants/filter";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import useGetDiscoverInfinite from "@/hook/get-discover-infinite";
import { MovieTypes } from "@/types/movie-by-id";
import { useInView } from "react-intersection-observer";
import { useIsMobile } from "@/hook/use-mobile";
import SkeletonCard1 from "@/components/ui/movie-card-skeleton-1";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";
import TitleReusable from "@/components/ui/title";
import { TvIcon } from "@/components/icon/tv";
import { MovieIcon } from "@/components/icon/movie";
export default function ExploreTmdb({
  media_type,
}: {
  media_type: "movie" | "tv";
}) {
  const searchParams = useSearchParams();
  const param = searchParams.get(
    media_type === "movie" ? "company" : "network",
  );
  const company_network = param ? Number(param) : null;
  const isMobile = useIsMobile();
  const { ref, inView } = useInView({
    threshold: 0.1, // triggers when 50% visible
  });
  const [selectedGenres, setSelectedGenres] = useState<Set<number>>(new Set());
  const [selectedNetwork, setSelectedNetwork] = useState<number | null>(
    company_network,
  );
  console.log(company_network);
  const [expandYear, setExpandYear] = useState(false);
  const [expandGenre, setExpandGenre] = useState(false);
  const [expandCompanies, setExpandCompanies] = useState(false);
  const [expandLanguage, setExpandLanguage] = useState(false);
  const [expandKeyword, setExpandKeyword] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [toValue, settoValue] = useState<number | null>(null);
  const [fromValue, setfromValue] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [maxRating, setMaxRating] = useState<number | null>(null);
  const [yearType, setYearType] = useState(false);
  const CURRENT_YEAR = new Date().getFullYear();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(
    new Set(),
  );
  const [selectedSort, setSelectedSort] = useState<string | null>(null);
  const [sort, setSort] = useState<
    "Popular" | "Vote Average" | "Release Date" | null
  >("Popular");
  const [sort2, setSort2] = useState<"Ascending" | "Descending" | null>(
    "Descending",
  );

  const toggleGenre = (id: number) => {
    setSelectedGenres((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleKeywords = (lang: string) => {
    setSelectedKeywords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lang)) newSet.delete(lang);
      else newSet.add(lang);
      return newSet;
    });
  };
  const hasAnyFilter =
    selectedGenres.size > 0 ||
    selectedKeywords.size > 0 ||
    selectedNetwork !== null ||
    selectedLanguage !== null ||
    minRating !== null ||
    maxRating !== null ||
    selectedSort !== null ||
    // sort !== "" ||
    selectedYear !== null ||
    toValue !== null ||
    fromValue !== null;

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetDiscoverInfinite<MovieTypes>({
      endpoint: "discover",
      enable: true,
      media_type: media_type,
      params: {
        // page: 1,
        ...(sort && {
          sort_by: `${sort === "Popular" ? "popularity" : sort === "Vote Average" ? "vote_average" : sort === "Release Date" ? "release_date" : ""}.${sort2 === "Ascending" ? "asc" : sort2 === "Descending" ? "desc" : ""}`,
        }),

        ...(selectedGenres.size > 0 && {
          with_genres: [...selectedGenres].join(","),
        }),

        ...(!yearType &&
          selectedYear != null &&
          (media_type === "tv"
            ? {
                "first_air_date.gte": `${selectedYear}-01-01`,
                "first_air_date.lte": `${selectedYear}-12-31`,
              }
            : {
                "primary_release_date.gte": `${selectedYear}-01-01`,
                "primary_release_date.lte": `${selectedYear}-12-31`,
              })),

        ...(yearType === true &&
          toValue != null &&
          (media_type === "tv"
            ? { "first_air_date.gte": `${toValue}-01-01` }
            : { "primary_release_date.gte": `${toValue}-01-01` })),

        ...(yearType === true &&
          fromValue != null &&
          (media_type === "tv"
            ? { "first_air_date.lte": `${fromValue}-12-31` }
            : { "primary_release_date.lte": `${fromValue}-12-31` })),

        ...(minRating != null && {
          "vote_average.gte": minRating,
        }),

        ...(maxRating != null && {
          "vote_average.lte": maxRating,
        }),

        ...(selectedNetwork &&
          (media_type === "tv"
            ? { with_networks: selectedNetwork }
            : { with_companies: selectedNetwork })),

        ...(sort === "Vote Average" && {
          "vote_count.gte": 300,
        }),
        ...(selectedLanguage && { with_original_language: selectedLanguage }),
        ...(selectedSort && { sort_by: selectedSort }),
        ...(selectedKeywords.size > 0 && {
          with_keywords: [...selectedKeywords].join(","),
        }),
      },
    });
  const total_results = data?.pages[0]?.total_results ?? 0;
  const results = data?.pages.flatMap((p) => p.results) ?? [];
  const resetFilter = () => {
    setSelectedGenres(new Set());
    setSelectedNetwork(null);
    setSelectedKeywords(new Set());
    setSelectedYear(null);
    setMinRating(null);
    setMaxRating(null);
    setSelectedLanguage(null);
    setSelectedSort(null);
    settoValue(null);
    setfromValue(null);
  };

  const years = Array.from(
    { length: CURRENT_YEAR - 1999 + 1 },
    (_, i) => 1999 + i,
  );

  const safeToYear = toValue ? toValue : 1999;
  const safeFromYear = fromValue ? fromValue : 1999;
  const fromYear = Array.from(
    { length: CURRENT_YEAR - safeToYear + 1 },
    (_, i) => safeToYear + i,
  );

  const rating = Array.from({ length: 10 }, (_, i) => i + 1);
  const safeMinRating = minRating ? minRating : 1;
  const safeMaxRating = maxRating ? maxRating : 1;
  const dynamicMaxRating = Array.from(
    { length: 10 - safeMinRating + 1 },
    (_, i) => i + safeMinRating,
  );
  useEffect(() => {
    if (safeFromYear < safeToYear && fromValue !== null) {
      setfromValue(safeToYear);
    }
  }, [toValue]);
  useEffect(() => {
    if (safeMaxRating < safeMinRating && maxRating !== null) {
      setMaxRating(safeMinRating);
    }
  }, [minRating]);

  //FIND
  const selectedLanguageLabel = languages.find(
    (lang) => lang.code === selectedLanguage,
  )?.name;
  const selectedNetworkLabel = (
    media_type === "movie" ? productionCompanies : tvNetworks
  ).find((network) => network.id === selectedNetwork)?.name;
  //FILTERS
  const selectedGenreLabels = (
    media_type === "movie" ? movieGenres : tvGenres
  ).filter((genre) => selectedGenres.has(genre.id));
  const selectedKeywordLabels = keywordTopics.filter((key) =>
    selectedKeywords.has(key.value),
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);
  return (
    <div className="space-y-8 lg:py-8 py-4  w-full lg:pl-35 pl-2 lg:pr-8 pr-2  min-h-screen">
      {/* <div>
        <h1 className="text-2xl font-semibold">
          {selectedMedia === "movie" ? "Movies" : "TV Shows"}
        </h1>
        <p className="text-muted-foreground">Discover your next favorite.</p>
      </div> */}
      {/* <TitleReusable
        title={media_type === "movie" ? "Movies" : "TV Shows"}
        Icon={media_type === "movie" ? MovieIcon : TvIcon}
        description=""
      /> */}

      <div className="space-y-12">
        <div className="flex flex-wrap gap-1.5 ">
          {(media_type === "tv" ? tvGenres : movieGenres)
            .slice(
              0,
              expandGenre
                ? (media_type === "tv" ? tvGenres : movieGenres).length
                : isMobile
                  ? 6
                  : 9,
            )
            .map((genre) => (
              <span
                key={genre.id}
                className={`flex-1 flex items-center gap-3 lg:py-3 py-2 lg:px-6 px-4  bg-card cursor-pointer  rounded-sm ${selectedGenres.has(genre.id) ? "text-red-500" : " text-muted-foreground"}`}
                onClick={() => toggleGenre(genre.id)}
              >
                <genre.icon className="lg:block hidden lg:size-5 size-4.5" />
                <p className="line-clamp-1 font-medium lg:text-base text-sm">
                  {genre.name}
                </p>
              </span>
            ))}
          <span
            className={`flex-1 flex  items-center gap-3 lg:py-3 py-2 lg:px-6 px-4 rounded-sm  min-w-35 border cursor-pointer  `}
            onClick={() => setExpandGenre((prev) => !prev)}
          >
            {expandGenre ? (
              <Minus className=" lg:size-6 size-5" />
            ) : (
              <Plus className=" lg:size-6 size-5" />
            )}

            <p className="line-clamp-1 font-medium lg:text-base text-sm">
              {expandGenre ? "Collapse" : "Expand"}
            </p>
          </span>
          <Drawer
            direction={isMobile ? "bottom" : "left"}
            repositionInputs={false}
          >
            <DrawerTrigger asChild>
              <span
                className={`flex-1 flex items-center gap-3 lg:py-3 py-2 lg:px-6 px-4 rounded-sm  min-w-35 border cursor-pointer bg-red-800 `}
              >
                <IconFilter2Bolt className=" lg:size-6 size-5" />
                <p className="line-clamp-1 font-medium lg:text-base text-sm">
                  More
                </p>
              </span>
            </DrawerTrigger>
            <DrawerContent className="h-[50vh] lg:h-screen">
              <DrawerHeader className="p-2 lg:p-4 hidden lg:flex">
                <DrawerTitle className="text-lg tracking-wide">
                  Advance Filter
                </DrawerTitle>
                <DrawerDescription className="text-left">
                  Customize your exploration using genres, years, networks, and
                  more.
                </DrawerDescription>
              </DrawerHeader>
              <div className="overflow-auto custom-scrollbar space-y-3">
                <div className=" lg:p-4 p-2 lg:space-y-3 space-y-1">
                  <h1 className="font-medium text-sm lg:text-base">Sort</h1>
                  <div className="flex gap-1 items-center">
                    <CommandComponent
                      value={sort}
                      setValue={setSort}
                      options={["Popular", "Vote Average", "Release Date"]}
                      placeholder="Popular"
                      label="sort"
                      reset={false}
                    />
                    <Separator className="w-10! bg-border" />
                    <CommandComponent
                      value={sort2}
                      setValue={setSort2}
                      options={["Descending", "Ascending"]}
                      placeholder="Ascending"
                      label="sort"
                      reset={false}
                    />
                  </div>
                </div>
                <div className="lg:p-4 p-2 lg:space-y-3 space-y-1">
                  <h1 className="font-medium text-sm lg:text-base flex gap-3 items-end justify-between">
                    {yearType ? " Year Range" : "Released Year"}
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => setYearType((prev) => !prev)}
                    >
                      {yearType ? <Calendar /> : <IconTransfer />}
                    </Button>
                  </h1>
                  {yearType ? (
                    <div className="flex gap-1 items-center">
                      <CommandComponent
                        value={toValue}
                        setValue={settoValue}
                        options={years}
                        placeholder="To"
                        label="year"
                      />
                      <Separator className="w-10! bg-border" />
                      <CommandComponent
                        value={fromValue}
                        setValue={setfromValue}
                        options={fromYear}
                        placeholder="From"
                        label="year"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {Array.from(
                        { length: CURRENT_YEAR - 1999 + 1 },
                        (_, i) => 1999 + i,
                      )
                        .slice(expandYear ? 0 : 23)
                        .map((year) => (
                          <Button
                            key={year}
                            size="xl"
                            className="flex-1 tracking-wide"
                            // use selectedYear to determine variant
                            variant={
                              selectedYear === year
                                ? "destructive"
                                : "secondary"
                            }
                            onClick={
                              () =>
                                setSelectedYear((prev) =>
                                  prev === year ? null : year,
                                ) // toggle
                            }
                          >
                            {year}
                          </Button>
                        ))}
                      <Button
                        onClick={() => setExpandYear((prev) => !prev)}
                        size="xl"
                        variant="secondary"
                      >
                        {expandYear ? <Minus /> : <Plus />}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="lg:p-4 p-2 lg:space-y-3 space-y-1">
                  <h1 className="font-medium text-sm lg:text-base flex gap-3 items-end justify-between">
                    Rating Range
                  </h1>
                  <div className="flex gap-1 items-center">
                    <CommandComponent
                      value={minRating}
                      setValue={setMinRating}
                      options={rating}
                      placeholder="Min"
                      label="rating"
                    />
                    <Separator className="w-10! bg-border" />
                    <CommandComponent
                      value={maxRating}
                      setValue={setMaxRating}
                      options={dynamicMaxRating}
                      placeholder="Max"
                      label="rating"
                    />
                  </div>
                </div>
                <div className=" lg:p-4 p-2 lg:space-y-3 space-y-1">
                  <h1 className="font-medium text-sm lg:text-base">
                    Companies{" "}
                    <span className="text-red-500">
                      {!selectedNetwork ? "" : "(1)"}
                    </span>
                  </h1>
                  <div className="flex flex-wrap gap-1">
                    {(media_type === "tv" ? tvNetworks : productionCompanies)
                      .slice(
                        0,
                        expandCompanies
                          ? (media_type === "tv"
                              ? tvNetworks
                              : productionCompanies
                            ).length
                          : 3,
                      )
                      .map((network) => (
                        <Button
                          variant={
                            selectedNetwork === network.id
                              ? "destructive"
                              : "secondary"
                          }
                          className="flex-1"
                          key={network.id}
                          size="xl"
                          onClick={() =>
                            setSelectedNetwork((prev) =>
                              prev === network.id ? null : network.id,
                            )
                          }
                        >
                          {network.name}
                        </Button>
                      ))}
                    <Button
                      onClick={() => setExpandCompanies((prev) => !prev)}
                      size="xl"
                      variant="secondary"
                    >
                      {expandCompanies ? <Minus /> : <Plus />}
                    </Button>
                  </div>
                </div>
                <div className="lg:p-4 p-2 lg:space-y-3 space-y-1">
                  <h1 className="font-medium text-sm lg:text-base">
                    Languages{" "}
                    <span className="text-red-500">
                      {!selectedLanguage ? "" : `(1)`}
                    </span>
                  </h1>
                  <div className="flex flex-wrap gap-1">
                    {languages
                      .slice(0, expandLanguage ? languages.length : 4)
                      .map((lang) => (
                        <Button
                          key={lang.code}
                          size="xl"
                          variant={
                            selectedLanguage === lang.code
                              ? "destructive"
                              : "secondary"
                          }
                          onClick={() =>
                            setSelectedLanguage((prev) =>
                              prev === lang.code ? null : lang.code,
                            )
                          }
                          className="flex-1"
                        >
                          {lang.name}
                        </Button>
                      ))}
                    <Button
                      variant="secondary"
                      size="xl"
                      onClick={() => setExpandLanguage((prev) => !prev)}
                    >
                      {expandLanguage ? <Minus /> : <Plus />}
                    </Button>
                  </div>
                </div>
                <div className=" lg:p-4 p-2 lg:space-y-3 space-y-1">
                  <h1 className="font-medium text-sm lg:text-base">
                    Keywords{" "}
                    <span className="text-red-500">
                      {selectedKeywords.size === 0
                        ? ""
                        : `(${selectedKeywords.size})`}
                    </span>
                  </h1>
                  <div className="flex flex-wrap gap-1">
                    {keywordTopics
                      .slice(0, expandKeyword ? keywordTopics.length : 4)
                      .map((meow) => (
                        <Button
                          variant={
                            selectedKeywords.has(meow.value)
                              ? "destructive"
                              : "secondary"
                          }
                          className="flex-1"
                          key={meow.value}
                          size="xl"
                          onClick={() => toggleKeywords(meow.value)}
                        >
                          {meow.label}
                        </Button>
                      ))}
                    <Button
                      variant="secondary"
                      size="xl"
                      onClick={() => setExpandKeyword((prev) => !prev)}
                    >
                      {expandKeyword ? <Minus /> : <Plus />}
                    </Button>
                  </div>
                </div>
              </div>
              <DrawerFooter className=" grid grid-cols-2">
                <Button className="" onClick={resetFilter}>
                  Reset <IconRefresh />
                </Button>

                <DrawerClose asChild>
                  <Button variant="outline" className="">
                    Close <IconX />
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

        {isLoading ? (
          <div className={`grid  lg:grid-cols-7 grid-cols-2 lg:gap-1 gap-0.5`}>
            {[...Array(20)].map((_, i) => (
              <SkeletonCard1 key={i} />
            ))}
          </div>
        ) : results.filter((f) => f.poster_path).length === 0 ? (
          <div className="flex justify-center items-center min-h-[calc(100vh-300px)]">
            <div className="flex justify-center items-center flex-col">
              <IconFilter2X className="lg:size-10 size-8" />
              <h1 className="lg:text-xl text-base font-medium mt-3">
                No Data Found
              </h1>
              <p className="text-muted-foreground">
                Try another filter combination.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between  gap-6 items-start lg:items-center">
              <div
                className={`flex items-end ${hasAnyFilter ? "justify-between" : "justify-end"}`}
              >
                {hasAnyFilter && (
                  <div className="flex gap-3">
                    <h1 className="text-sm font-medium whitespace-nowrap">
                      Active filter:
                    </h1>
                    <div className="flex flex-wrap gap-1">
                      {selectedGenreLabels.map((genre) => (
                        <Badge
                          className="cursor-pointer"
                          key={genre.id}
                          variant="secondary"
                          onClick={() =>
                            setSelectedGenres((prev) => {
                              const next = new Set(prev);
                              next.delete(genre.id);
                              return next;
                            })
                          }
                        >
                          {genre.name} <IconX />
                        </Badge>
                      ))}
                      {selectedKeywordLabels.map((keyword) => (
                        <Badge
                          className="cursor-pointer"
                          key={keyword.label}
                          variant="secondary"
                          onClick={() =>
                            setSelectedKeywords((prev) => {
                              const next = new Set(prev);
                              next.delete(keyword.value);
                              return next;
                            })
                          }
                        >
                          {keyword.label} <IconX />
                        </Badge>
                      ))}
                      {selectedLanguageLabel && (
                        <Badge
                          className="cursor-pointer"
                          variant="secondary"
                          onClick={() => setSelectedLanguage(null)}
                        >
                          {selectedLanguageLabel} <IconX />
                        </Badge>
                      )}
                      {selectedNetworkLabel && (
                        <Badge
                          className="cursor-pointer"
                          variant="secondary"
                          onClick={() => setSelectedNetwork(null)}
                        >
                          {selectedNetworkLabel} <IconX />
                        </Badge>
                      )}
                      {(minRating || maxRating) && (
                        <div className="flex items-center gap-1">
                          {minRating && (
                            <Badge
                              className="cursor-pointer"
                              variant="secondary"
                              onClick={() => setMinRating(null)}
                            >
                              Min - {minRating}
                              <IconX />
                            </Badge>
                          )}

                          {maxRating && (
                            <Badge
                              className="cursor-pointer"
                              variant="secondary"
                              onClick={() => setMaxRating(null)}
                            >
                              Max - {maxRating}
                              <IconX />
                            </Badge>
                          )}
                        </div>
                      )}
                      {yearType
                        ? (fromValue || toValue) && (
                            <div className="flex items-center gap-1">
                              {fromValue && (
                                <Badge
                                  className="cursor-pointer"
                                  variant="secondary"
                                  onClick={() => setfromValue(null)}
                                >
                                  From - {fromValue}
                                  <IconX />
                                </Badge>
                              )}

                              {toValue && (
                                <Badge
                                  className="cursor-pointer"
                                  variant="secondary"
                                  onClick={() => settoValue(null)}
                                >
                                  To - {toValue}
                                  <IconX />
                                </Badge>
                              )}
                            </div>
                          )
                        : selectedYear && (
                            <Badge
                              className="cursor-pointer"
                              variant="secondary"
                              onClick={() => setSelectedYear(null)}
                            >
                              {selectedYear}
                              <IconX />
                            </Badge>
                          )}
                    </div>
                  </div>
                )}
              </div>
              <span className=" flex gap-3 items-center">
                <h1 className="lg:text-sm text-xs text-muted-foreground whitespace-nowrap">
                  Total results:
                </h1>
                <h1 className="lg:text-lg font-medium">
                  {formatTotalResults(total_results)}
                </h1>
              </span>
            </div>
            <div className="grid lg:grid-cols-7 grid-cols-2 lg:gap-1">
              {results
                .filter((f) => f.poster_path)
                .map((result, idx) => (
                  <MovieCard
                    key={`${idx}=${result.id}`}
                    movie={result}
                    media_type={media_type}
                  />
                ))}

              {isFetchingNextPage &&
                [...Array(20)].map((_, i) => <SkeletonCard1 key={i} />)}
            </div>
          </div>
        )}
      </div>
      <div ref={ref} className="grid place-items-center">
        {isFetchingNextPage && (
          <p className="flex gap-1 animate-pulse text-muted-foreground">
            fetching data...
            <IconLoader className="animate-spin" />
          </p>
        )}
      </div>
      <ScrollToTop />
    </div>
  );
}

function CommandComponent<T extends string | number>({
  value,
  options,
  setValue,
  placeholder,
  disabled,
  label,
  reset = true,
}: {
  value: T | null;
  options: T[];
  setValue: (value: T | null) => void;
  placeholder: string;
  disabled?: boolean;
  label: string;
  reset?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="flex-1">
        <Button
          variant={!value ? "secondary" : "destructive"}
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
          size="xl"
        >
          {value !== null ? value : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${label}...`}
            className="h-9 capitalize"
          />
          <CommandList>
            <CommandEmpty>{`No ${label} found.`}</CommandEmpty>
            <CommandGroup>
              {reset && value !== null && (
                <CommandItem
                  onSelect={() => {
                    setValue(null);
                    setOpen(false);
                  }}
                >
                  Reset...
                </CommandItem>
              )}
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={String(option)}
                  onSelect={() => {
                    setValue(option);
                    setOpen(false);
                  }}
                >
                  {option}

                  <Check
                    className={cn(
                      "ml-auto",
                      value === option ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
const languages = [
  { code: "en", name: "English" },
  { code: "tl", name: "Filipino" },
  { code: "ko", name: "Korean" },
  { code: "ja", name: "Japanese" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "it", name: "Italian" },
  { code: "zh", name: "Chinese" },
  { code: "hi", name: "Hindi" },
  { code: "ru", name: "Russian" },
  { code: "pt", name: "Portuguese" },
  { code: "sv", name: "Swedish" },
  { code: "nl", name: "Dutch" },
  { code: "tr", name: "Turkish" },
  { code: "pl", name: "Polish" },
  { code: "da", name: "Danish" },
  { code: "no", name: "Norwegian" },
  { code: "fi", name: "Finnish" },
  { code: "he", name: "Hebrew" },
  { code: "ar", name: "Arabic" },
];
const formatTotalResults = (total: number) => {
  if (total >= 10000) return "9,999+";
  return total.toLocaleString();
};
