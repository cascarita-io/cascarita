import { useQuery } from "@tanstack/react-query";
import { getStripeAccounts } from "./service";

export const useGetAllStripeAccounts = (groupId: number) => {
  return useQuery({
    queryKey: ["stripe_accounts", groupId ? groupId : 0],
    queryFn: getStripeAccounts,
    enabled: groupId !== 0,
  });
};
