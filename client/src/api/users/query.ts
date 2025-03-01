import { useQuery } from "@tanstack/react-query";
import { getCompleteUserSettings, getUser } from "./service";

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
