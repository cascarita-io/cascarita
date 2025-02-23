import { UploadPhotoResponse } from "../../components/FormInputComponents/Photo/Photo";

const uploadPhotoToS3 = async (file: File): Promise<UploadPhotoResponse> => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder_name", "registration_images");
    formData.append("image_type", "player_photo");
    const response = await fetch("/api/images/upload", {
      method: "POST",
      body: formData,
    });
    return response.json();
  } catch (error) {
    console.error("Error creating season:", error);
    throw error;
  }
};

export { uploadPhotoToS3 };
