"use client";
import {
  ArrowRightLeft,
  ListVideo,
  LogIn,
  LogOut,
  Search,
  Smile,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { HomeIcon } from "@/components/icon/home";
import { TvIcon } from "@/components/icon/tv";
import { MovieActiveIcon, MovieIcon } from "@/components/icon/movie";
import { SettingsActiveIcon, SettingsIcon } from "@/components/icon/settings";
import logo from "@/assets/brand.svg";
import { useSession } from "next-auth/react";
import { Profile1, Profile2, Profile4, Profile5 } from "@/assets/profiles";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { signOut } from "next-auth/react";
import { HistoryActiveIcon, HistoryIcon } from "@/components/icon/history";
import {
  CollectionIcon,
  CollectionOpenIcon,
} from "@/components/icon/collection";
import { BookmarkIcon } from "@/components/icon/bookmark";
import SearchModal from "./search-modal";
const navItems = [
  {
    icon: HomeIcon,
    activeIcon: HomeIcon,
    label: "Home",
    url: "/",
    scroll: true,
  },
  {
    icon: Search,
    activeIcon: Search,
    label: "Search",
    url: "/search",
    lucide: true,
    scroll: false,
  },
  {
    icon: MovieIcon,
    activeIcon: MovieIcon,
    label: "Movies",
    url: "/movie",
    scroll: true,
  },
  {
    icon: TvIcon,
    activeIcon: TvIcon,
    label: "TV Shows",
    url: "/tv",
    scroll: true,
  },
  // {
  //   icon: Smile,
  //   activeIcon: Smile,
  //   label: "Mood",
  //   url: "/mood",
  //   scroll: true,
  // },
  {
    icon: BookmarkIcon,
    activeIcon: BookmarkIcon,
    label: "Watchlist",
    url: "/watchlist",
    scroll: true,
  },
  {
    icon: HistoryIcon,
    activeIcon: HistoryActiveIcon,
    label: "History",
    url: "/history",
    scroll: true,
  },
  {
    icon: SettingsIcon,
    activeIcon: SettingsActiveIcon,
    label: "Settings",
    url: "/settings",
    scroll: true,
  },
];
const AVATAR_MAP: Record<string, React.ReactNode> = {
  svg1: <Profile1 />,
  svg2: <Profile2 />,
  svg3: <Profile5 />,
  svg4: <Profile4 />,
};

export default function Navigation() {
  const { update, data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitchProfile = async () => {
    const res = await fetch("/api/profiles/switch", { method: "POST" });
    if (res.ok) {
      await update();
      router.push("/login/profiles");
    }
  };
  const isLogin = pathname.startsWith("/login/profiles");
  const isLoggedIn = !!session;
  const avatarType = session?.user?.avatarType;

  return (
    !isLogin && (
      <div className="lg:fixed sticky lg:inset-y-0 inset-x-0 lg:inset-x-[unset] bottom-0  left-0 z-40">
        <SearchModal />
        <div className=" h-full  flex lg:flex-col justify-between items-center lg:px-10 px-6 lg:py-8 py-4 bg-background/80 lg:bg-transparent backdrop-blur-lg lg:backdrop-blur-none   ">
          <div className="size-9 hidden lg:block">
            <img
              className="h-full w-full object-contain"
              src={logo.src}
              alt=""
            />
          </div>
          <div className="flex lg:flex-col lg:gap-8  w-full lg:w-auto justify-between ">
            {navItems.map(
              ({ icon: Icon, activeIcon: ActiveIcon, label, url, scroll }) => (
                <Tooltip key={label}>
                  <TooltipTrigger asChild>
                    <Link scroll={scroll} href={url} className="space-y-1.5">
                      <button
                        className={cn(
                          "block hover:text-foreground transition-colors duration-200 cursor-pointer",
                          pathname === url
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {pathname === url ? (
                          <ActiveIcon className="lg:size-7.5" />
                        ) : (
                          <Icon className="lg:size-7.5" />
                        )}
                      </button>
                      <div
                        className={cn(
                          "h-0.5 bg-red-600 transition duration-200",
                          pathname === url ? "opacity-100" : "opacity-0",
                        )}
                      ></div>
                    </Link>
                  </TooltipTrigger>

                  <TooltipContent side="right" className="hidden lg:block">
                    <p>{label}</p>
                  </TooltipContent>
                </Tooltip>
              ),
            )}
          </div>
          {isLoggedIn && avatarType ? (
            <Popover>
              <PopoverTrigger asChild className="hidden lg:block">
                <button className="w-10 h-10 border-2 border-transparent hover:border-white overflow-hidden transition-all duration-200 cursor-pointer">
                  {AVATAR_MAP[avatarType]}
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="right"
                className="w-48 p-2 bg-[#1a1a1a] border-[#333]"
              >
                <div className="flex flex-col gap-1">
                  {/* Profile info */}
                  <div className="flex items-center gap-3 px-2 py-2 border-b border-[#333] mb-1">
                    <div className="w-8 h-8 overflow-hidden shrink-0">
                      {AVATAR_MAP[avatarType]}
                    </div>
                    <span className="text-white text-sm truncate">
                      {session?.user?.profileName}
                    </span>
                  </div>

                  {/* Switch profile */}
                  <button
                    onClick={handleSwitchProfile}
                    className="flex items-center gap-2 px-2 py-2 text-sm text-[#6D6D6D] hover:text-white hover:bg-white/10 transition-colors duration-200 w-full text-left"
                  >
                    <ArrowRightLeft className="size-4" />
                    Switch Profile
                  </button>

                  {/* Sign out */}
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center gap-2 px-2 py-2 text-sm text-[#6D6D6D] hover:text-red-500 hover:bg-white/10 transition-colors duration-200 w-full text-left"
                  >
                    <LogOut className="size-4" />
                    Sign Out
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Link href="/login" className="hidden lg:block">
              <button className="block text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer">
                <LogIn className="size-6.5" />
              </button>
            </Link>
          )}
        </div>
      </div>
    )
  );
}
