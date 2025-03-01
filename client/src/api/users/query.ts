import { useQuery } from "@tanstack/react-query";
import { getCompleteUserSettings, getUser } from "./service";

export const useGetCompleteUserSettings = (userId: number) => {
  return useQuery({
    queryKey: ["stripe_accounts", userId],
    queryFn: getCompleteUserSettings,
    enabled: userId !== 0,
  });
};

export const useFetchUser = (email: string, token: string) => {
  return useQuery({
    queryKey: ["user", email, token],
    queryFn: getUser,
  });
};
