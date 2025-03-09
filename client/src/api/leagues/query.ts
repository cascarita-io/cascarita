import { useQuery } from "@tanstack/react-query";
import { getLeagueByGroupId } from "./service";

export const useGetLeaguesByGroupId = (groupId: number) => {
  return useQuery({
    queryKey: ["leagues", groupId],
    queryFn: getLeagueByGroupId,
    enabled: groupId !== 0,
  });
};
