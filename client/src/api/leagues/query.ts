import { useQuery } from "@tanstack/react-query";
import { getLeagueByGroupId } from "./service";

export const useGetLeagueByGroupId = (groupId: number) => {
  return useQuery({
    queryKey: ["leagues", groupId ? groupId : 0],
    queryFn: getLeagueByGroupId,
    enabled: groupId !== 0,
  });
};
