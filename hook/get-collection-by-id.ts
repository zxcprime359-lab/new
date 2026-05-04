"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface MovieInCollection {
  id: string;
  title: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
}

interface CollectionTypes {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: MovieInCollection[];
}

export default function useCollectionById({ id }: { id: number }) {
  const query = useQuery<CollectionTypes>({
    queryKey: ["get-collection", id],
    enabled: !!id,
    queryFn: async () => {
      const url = `/api/collection/${encodeURIComponent(id)}`;
      try {
        const res = await axios.get<CollectionTypes>(url);
        return res.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
}
