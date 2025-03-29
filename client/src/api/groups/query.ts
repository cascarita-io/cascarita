import { useQuery } from "@tanstack/react-query";

import { getAllGroups, getGroupById } from "./service";

export const useGetAllGroups = () => {
  return useQuery({
    queryKey: ["groups"],
    queryFn: getAllGroups,
  });
};

export const useGetGroupById = (groupId: number) => {
  return useQuery({
    queryKey: ["groups", groupId],
    queryFn: getGroupById,
    enabled: groupId !== 0,
  });
};
