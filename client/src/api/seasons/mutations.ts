import { useMutation, useQueryClient } from "@tanstack/react-query";

import { SeasonRequest } from "../../components/Forms/SeasonForm/types";
import { createNewSeason, deleteSeason, updateSeason } from "./services";

export const useCreateSeason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SeasonRequest) => createNewSeason(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seasons"],
      });
    },
  });
};

export const useUpdateSeason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SeasonRequest) => updateSeason(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seasons"],
      });
    },
    onSettled: async (_, error, variables) => {
      if (error) {
        console.error(`Error from Update Season: ${error}`);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["seasons"] });
        await queryClient.invalidateQueries({
          queryKey: ["seasons", { id: variables.id }],
        });
      }
    },
  });
};

export const useDeleteSeason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SeasonRequest) => deleteSeason(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seasons"],
      });
    },
    onSettled: async (_, error) => {
      if (error) {
        console.error(`Error from Delete Season: ${error}`);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["seasons"] });
      }
    },
  });
};
