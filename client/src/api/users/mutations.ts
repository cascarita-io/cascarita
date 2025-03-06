import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  DeleteUserData,
  UpdateUserData,
  AddUserData,
  GetSessionData,
} from "../../components/Forms/UserForm/types";
import {
  deleteUser,
  updateUser,
  addUser,
  getSession,
  updatePlayerTeams,
} from "./service";
import { PlayerRequest } from "../../components/Forms/PlayerForm/types";

export const useAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddUserData) => addUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserData) => updateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteUserData) => deleteUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

export const useGetSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GetSessionData) => getSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

export const useUpdatePlayerTeams = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PlayerRequest) => updatePlayerTeams(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};
