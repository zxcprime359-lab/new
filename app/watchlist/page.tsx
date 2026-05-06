import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Watchlist from "./watchlist";

export default async function HistoryHome() {
  const session = await getServerSession(authOptions);
  const hasActiveProfile = !!session?.user?.activeProfileId;

  if (!hasActiveProfile) {
    redirect("/login");
  }

  return <Watchlist />;
}
