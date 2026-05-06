
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import SettingsPage from "./settings";

export default async function HistoryHome() {
  const session = await getServerSession(authOptions);
  const hasActiveProfile = !!session?.user?.activeProfileId;

  return <SettingsPage hasActiveProfile={hasActiveProfile} />;
}
