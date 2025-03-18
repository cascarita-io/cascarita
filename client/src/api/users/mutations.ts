import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  DeleteUserData,
  UpdateUserData,
  AddUserData,
  PlayerSessionRequest,
} from "../../components/Forms/UserForm/types";
import {
  deleteUser,
  updateUser,
  addUser,
  getPlayerSession,
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

export const useGetPlayerSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PlayerSessionRequest) => getPlayerSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["players"],
      });
    },
  });
};

//TODO: UNCOMMENT ONCE API IS READY

// export const useCreatePlayerTeams = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (data: PlayerRequest) => create(data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["players"],
//       });
//     },
//   });
// };

export const useUpdatePlayerTeams = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PlayerRequest) => updatePlayerTeams(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["players"],
      });
    },
  });
};
