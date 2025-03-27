import { useQuery } from "@tanstack/react-query";

import { getSeasonsByGroupId } from "./services";

export const useGetSeasonsByGroupId = (groupId: number) => {
  return useQuery({
    queryKey: ["seasons", groupId ? groupId : 0],
    queryFn: getSeasonsByGroupId,
    enabled: groupId !== 0,
  });
};
