import { useMutation, useQueryClient } from "@tanstack/react-query";

import { uploadPhotoToS3 } from "./service";
import { UploadPhotoRequest } from "./types";

export const useUploadPhotoS3 = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UploadPhotoRequest) =>
      uploadPhotoToS3(data.file_url, data.folder_name, data.image_type),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["uploadPhotostoS3"],
      });
    },
    onError: (error) => {
      console.error("S3 Upload Error:", error);
    },
  });
};
