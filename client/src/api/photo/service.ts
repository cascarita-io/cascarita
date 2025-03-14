import { UploadPhotoResponse } from "../../components/FormInputComponents/Photo/Photo";

const uploadPhotoToS3 = async (
  file: File,
  folder_name: string,
  image_type: string
): Promise<UploadPhotoResponse> => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder_name", folder_name);
    formData.append("image_type", image_type);
    const response = await fetch("/api/images/upload", {
      method: "POST",
      body: formData,
    });

    return response.json();
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
};

export { uploadPhotoToS3 };
