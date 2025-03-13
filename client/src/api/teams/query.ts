import { useQuery } from "@tanstack/react-query";
import { getTeamsByGroupId, getTeamsBySeasonDivisionId } from "./service";

export const useGetTeamsBySeasonDivisionId = (
  seasonId: number,
  divisionId: number
) => {
  return useQuery({
    queryKey: ["teams", seasonId, divisionId],
    queryFn: getTeamsBySeasonDivisionId,
    enabled: seasonId !== 0 && divisionId !== 0,
  });
};

export const useGetTeamsByGroupId = (groupId: number) => {
  return useQuery({
    queryKey: ["teams", groupId],
    queryFn: getTeamsByGroupId,
    enabled: groupId !== 0,
  });
};
