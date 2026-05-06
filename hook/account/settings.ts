import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export type ProfileSettings = {
  save_history: boolean;
  recommendations: boolean;
  ads: boolean;
  continue_watching: boolean;
};

export function useProfileSettings({ enabled }: { enabled?: boolean }) {
  const queryClient = useQueryClient();

  const query = useQuery<ProfileSettings>({
    queryKey: ["profile-settings"],
    queryFn: async () => {
      const res = await axios.get("/api/profiles/settings");
      return res.data.settings;
    },
    enabled: enabled,
  });

  const update = useMutation({
    mutationFn: async (settings: ProfileSettings) => {
      const res = await axios.patch("/api/profiles/settings", { settings });
      return res.data.settings;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["profile-settings"], updated);
    },
  });

  return {
    settings: query.data ?? {
      save_history: true,
      recommendations: true,
      ads: true,
      continue_watching: true,
    },
    isLoading: query.isLoading,
    updateSettings: update.mutateAsync,
    isUpdating: update.isPending,
  };
}
