import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewLeague, updateLeague, deleteLeague } from "./service";
import { LeagueRequest } from "../../components/Forms/LeagueForm/types";

export const useCreateLeague = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LeagueRequest) => createNewLeague(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leagues"],
      });
    },
  });
};

export const useUpdateLeague = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LeagueRequest) => updateLeague(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leagues"],
      });
    },
    onSettled: async (_, error, variables) => {
      if (error) {
        console.log(`Error from Update: ${error}`);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["leagues"] });
        await queryClient.invalidateQueries({
          queryKey: ["seasons", { id: variables.id }],
        });
      }
    },
  });
};

export const useDeleteLeague = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LeagueRequest) => deleteLeague(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leagues"],
      });
    },
    onSettled: async (_, error) => {
      if (error) {
        console.log(`Error from Delete: ${error}`);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["leagues"] });
      }
    },
  });
};
