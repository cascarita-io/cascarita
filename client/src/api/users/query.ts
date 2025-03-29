import { useQuery } from "@tanstack/react-query";

import {
  getCompleteUserSettings,
  getPlayersByGroupId,
  getUser,
  getUsersByGroupId,
} from "./service";

export const useFetchUser = (email: string, token: string) => {
  return useQuery({
    queryKey: ["user", email, token],
    queryFn: getUser,
  });
};

export const useGetCompleteUserSettings = (userId: number) => {
  return useQuery({
    queryKey: ["user_settings", userId ? userId : 0],
    queryFn: getCompleteUserSettings,
    enabled: userId !== 0,
  });
};

export const useGetPlayersByGroupId = (groupId: number) => {
  return useQuery({
    queryKey: ["players", groupId],
    queryFn: getPlayersByGroupId,
    enabled: groupId !== 0,
  });
};

export const useGetUsersByGroupId = (groupId: number) => {
  return useQuery({
    queryKey: ["users", groupId],
    queryFn: getUsersByGroupId,
    enabled: groupId !== 0,
  });
};
