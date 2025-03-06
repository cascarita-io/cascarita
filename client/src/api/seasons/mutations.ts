import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewSeason, updateSeason, deleteSeason } from "./services";
import {
  SeasonFormData,
  UpdateSeasonData,
  DeleteSeasonData,
} from "../../components/Forms/SeasonForm/types";

export const useCreateSeason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SeasonFormData) => createNewSeason(data),
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
    mutationFn: (data: UpdateSeasonData) => updateSeason(data),
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
    mutationFn: (data: DeleteSeasonData) => deleteSeason(data),
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
