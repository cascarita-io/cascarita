import { useQuery } from "@tanstack/react-query";

import { getDivisionsByGroupId, getDivisionsBySeasonId } from "./service";

export const useGetDivisionsBySeasonId = (seasonId: number) => {
  return useQuery({
    queryKey: ["divisions", seasonId],
    queryFn: getDivisionsBySeasonId,
    enabled: seasonId !== 0,
  });
};

export const useGetDivisionsByGroupId = (groupId: number) => {
  return useQuery({
    queryKey: ["divisions", groupId],
    queryFn: getDivisionsByGroupId,
    enabled: groupId !== 0,
  });
};
