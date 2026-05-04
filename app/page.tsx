import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Home from "./home";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const isKids = session?.user?.isKids ?? false;
  const hasActiveProfile = !!session?.user?.activeProfileId;
  return <Home isKids={isKids} hasActiveProfile={hasActiveProfile} />;
}
