import { useEffect, useState } from "react";
import { FieldError, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { uploadPhotoToS3 } from "../../../api/photo/service";
import FileUpload from "../../FileUpload/FileUpload";
import { FieldProps } from "../types";
import styles from "./Photo.module.css";

export interface UploadPhotoResponse {
  image_url: string;
}

const Photo = ({ field, index }: FieldProps) => {
  const { t } = useTranslation("FormComponents");
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  const [fileUrl, setFileUrl] = useState<File | undefined>(undefined);
  register(`answers.${index}.photo`);

  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const uploadPhoto = async () => {
      if (fileUrl) {
        const uploadUrl = await uploadPhotoToS3(
          fileUrl,
          "registration_images",
          "player_photo",
        );
        setValue(`answers.${index}.photo`, uploadUrl.image_url);
        setPhotoUrl(uploadUrl.image_url);
      } else {
        setValue(`answers.${index}.photo`, "");
      }
    };
    uploadPhoto();
  }, [fileUrl]);

  const fieldError = (
    errors.answers as { [key: number]: { photo?: FieldError } } | undefined
  )?.[index]?.photo;

  return (
    <section className={styles.container}>
      <div className={styles.questionContainer}>
        <h3 className={styles.question}>
          {t("question")}: {field.title}
        </h3>
        {field.validations?.required && (
          <span className={styles.required}>*</span>
        )}
      </div>
      <div className={styles.questionContainer}>
        <p>{field.properties?.description}</p>
      </div>
      {fieldError && (
        <span className={styles.errorMessage}>{fieldError.message}</span>
      )}
      <FileUpload
        imagePreview={photoUrl}
        setFileValue={(url?: File) => {
          setFileUrl(url);
        }}
        className={styles.logoInputContainer}
      />
      <div className={styles.questionContainer} style={{ maxWidth: "550px" }}>
        <input
          type="checkbox"
          {...register(`answers.${index}.liability`, {
            required: `answers.${index}.photo` !== "",
          })}
          className={styles.input}
          id={`ack-photo-${index}`}
        />
        <label htmlFor={`ack-photo-${index}`} className={styles.label}>
          I confirm that I either own the rights to, or have obtained the
          necessary permissions to share, any images I upload.
        </label>
      </div>
    </section>
  );
};

export default Photo;
