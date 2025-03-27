import { useMutation, useQueryClient } from "@tanstack/react-query";

import { registerUser } from "./service";
import { RegisterUser } from "./types";

export const useRegisterUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterUser) => registerUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};
