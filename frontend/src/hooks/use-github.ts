import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/hooks/config";

import { getStar } from "@/lib/api/github";

export function useGithub() {
  return useQuery({
    queryKey: QUERY_KEYS.GITHUB,
    queryFn: getStar,
    staleTime: 1000 * 60 * 30, // 30 mins
  });
}
