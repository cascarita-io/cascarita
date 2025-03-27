import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteForm } from "./service";

export const useDeleteForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formId: string) => deleteForm(formId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["forms"],
      });
    },
    onSettled: async (_, error) => {
      if (error) {
        console.log(`Error from Delete: ${error}`);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["forms"] });
      }
    },
  });
};
