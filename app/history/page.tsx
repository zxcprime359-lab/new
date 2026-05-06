import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import History from "./history";

export default async function HistoryHome() {
  const session = await getServerSession(authOptions);
  const hasActiveProfile = !!session?.user?.activeProfileId;

  return <History />;
}
