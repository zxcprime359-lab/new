import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Watchlist from "./watchlist";

export default async function HistoryHome() {
  const session = await getServerSession(authOptions);
  const hasActiveProfile = !!session?.user?.activeProfileId;

  return !hasActiveProfile ? (
    <div className="h-screen flex justify-center items-center lg:pl-35 pl-2 lg:pr-8 pr-2">
      <div className="text-center ">
        <h2 className="text-white lg:text-2xl text-lg font-medium tracking-tight">
          Sign in to access this feature
        </h2>
        <p className="text-muted-foreground mt-1 lg:text-base text-sm">
          Your watchlist and download feature are waiting for you.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block lg:px-10 px-5 lg:py-3 py-1.5 bg-red-600 hover:bg-red-500 text-sm uppercase tracking-widest transition-colors duration-200"
        >
          Sign In
        </Link>
      </div>
    </div>
  ) : (
    <Watchlist />
  );
}
