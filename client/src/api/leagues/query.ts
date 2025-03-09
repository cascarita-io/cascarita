import { useQuery } from "@tanstack/react-query";
import { getLeaguesByGroupId } from "./service";

export const useGetLeaguesByGroupId = (groupId: number) => {
  return useQuery({
    queryKey: ["leagues", groupId ? groupId : 0],
    queryFn: getLeaguesByGroupId,
    enabled: groupId !== 0,
  });
};
