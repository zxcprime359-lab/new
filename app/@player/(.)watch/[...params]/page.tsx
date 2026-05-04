import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import Link from "next/link";
import WatchPage from "./watch";

export default async function WatchHome() {
  const session = await getServerSession(authOptions);
  const hasActiveProfile = !!session?.user?.activeProfileId;

  return <WatchPage hasActiveProfile={hasActiveProfile} />;
}
