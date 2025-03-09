import { useQuery } from "@tanstack/react-query";
import { getSeasonsByGroupId } from "./services";

export const useGetSeasonsByGroupId = (groupId: number) => {
  return useQuery({
    queryKey: ["seasons", groupId],
    queryFn: getSeasonsByGroupId,
    enabled: groupId !== 0,
  });
};
