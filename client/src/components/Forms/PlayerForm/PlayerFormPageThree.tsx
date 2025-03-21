import React from "react";
import styles from "../Form.module.css";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { PlayerFormPageProps } from "./types";
import FileUpload from "../../FileUpload/FileUpload";

const PlayerFormPageThree: React.FC<PlayerFormPageProps> = ({
  playerPhoto,
}) => {
  const { t } = useTranslation("Players");
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  return (
    <>
      <div className={styles.inputContainer}>
        <label className={styles.label}>{t("formContent.photo")}</label>
        <FileUpload
          setFileValue={(url?: File) => {
            setValue("picture", url);
          }}
          imagePreview={playerPhoto}
          className={styles.logoInputContainer}
        />
      </div>

      <div className={styles.inputContainer}>
        <label className={styles.label}>
          {t("formContent.photo_liability")}
        </label>
        <div className={styles.radioContainer}>
          <input {...register("liability")} type="checkbox" />
          <p>
            I confirm that I either own the rights to, or have obtained the
            necessary permissions to share, any images I upload.
          </p>
        </div>

        <div className={styles.radioContainer}>
          <input {...register("liability_minor")} type="checkbox" />
          <p>
            I confirm that I have verified the player is either 16 years of age
            or older, or have obtained and documented explicit permission from
            their parent/legal guardian to create this account.
          </p>
        </div>
      </div>
      {errors.liability && (
        <span className={styles.error}>{String(errors.liability.message)}</span>
      )}
    </>
  );
};

export default PlayerFormPageThree;
