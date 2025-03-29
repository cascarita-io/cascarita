import { useMutation, useQueryClient } from "@tanstack/react-query";

import { PlayerRequest } from "../../components/Forms/PlayerForm/types";
import {
  DeleteUserData,
  PlayerSessionRequest,
  UpdateUserData,
} from "../../components/Forms/UserForm/types";
import {
  addUser,
  deleteUser,
  getPlayerSession,
  updatePlayerTeams,
  updateUser,
} from "./service";

export const useAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PlayerRequest) => addUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["players"],
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

export const useUpdatePlayerTeams = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PlayerRequest) => updatePlayerTeams(data, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["players"],
      });
    },
  });
};
