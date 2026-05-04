// hooks/account/useProfiles.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export type Profile = {
  id: string;
  name: string;
  avatar_type: string;
  is_kids: boolean;
  pin_hash: string | null;
  has_pin: boolean;
  created_at: string;
};

export interface GetProfilesResponse {
  profiles: Profile[];
}

type CreateProfileInput = {
  name: string;
  avatar_type: string;
  is_kids: boolean;
  pin?: string | null;
};

type CreateProfileResponse = {
  profile: Profile;
};

// 🔹 Hook
export function useProfiles() {
  const queryClient = useQueryClient();

  // ✅ GET profiles
  const query = useQuery<Profile[]>({
    queryKey: ["profiles"],
    queryFn: async () => {
      const res = await axios.get<GetProfilesResponse>("/api/profiles");
      return res.data.profiles;
    },
    
  });

  // ✅ CREATE profile
  const createProfile = useMutation({
    mutationFn: async (input: CreateProfileInput) => {
      const res = await axios.post<CreateProfileResponse>(
        "/api/profiles",
        input,
      );
      return res.data.profile;
    },

    // 🔥 instant update cache
    onSuccess: (newProfile) => {
      queryClient.setQueryData<Profile[]>(["profiles"], (old) =>
        old ? [...old, newProfile] : [newProfile],
      );
    },
  });

  const deleteProfile = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/profiles?id=${id}`);
      return id;
    },

    onSuccess: (id) => {
      queryClient.setQueryData<Profile[]>(["profiles"], (old) =>
        old ? old.filter((p) => p.id !== id) : [],
      );
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (input: {
      id: string;
      name: string;
      avatar_type: string;
      is_kids: boolean;
      pin?: string | null;
    }) => {
      const res = await axios.patch("/api/profiles", input);
      return res.data.profile;
    },

    onSuccess: (updated) => {
      queryClient.setQueryData<Profile[]>(["profiles"], (old) =>
        old ? old.map((p) => (p.id === updated.id ? updated : p)) : [updated],
      );
    },
  });

  return {
    // GET
    profiles: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,

    // CREATE
    createProfile: createProfile.mutateAsync,
    isCreating: createProfile.isPending,
    createError: createProfile.error,

    //DELETE
    deleteProfile: deleteProfile.mutateAsync,
    isDeleting: deleteProfile.isPending,

    //UPDATE
    updateProfile: updateProfile.mutateAsync,
    isUpdating: updateProfile.isPending,
  };
}
